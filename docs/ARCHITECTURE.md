# OrigineMaroc — Architecture & Best Practices

> **Reality check (CraftHouse repo):** This file kept the historical **OrigineMaroc** title as generic guidance. The shipping app is **CraftHouse** (`/artisan`, `/buyer`, `/admin`). Prefer searching `src/app/api/**` and `*.repo.ts` over treating the directory tree below as exact.

This document describes the recommended structure and practices for the Next.js app: project layout, resource organization (repo, API, schemas, hooks), Prisma + PostgreSQL, multi-tenancy, and Better Auth.

---

## 1. Next.js project structure (high level)

Use a **feature-driven** layout so each domain (auth, products, certification, support, etc.) owns its API, data access, schemas, and hooks. Keep shared code in `lib/` and `components/`.

### Recommended root layout

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/               # Public routes
│   ├── (dashboard)/               # Protected layout(s): partner, superadmin, buyer
│   │   ├── producer/
│   │   ├── admin/
│   │   └── buyer/
│   ├── api/                       # API route handlers (can delegate to features)
│   │   └── auth/[...all]/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── features/                     # Feature modules (see §2)
│   ├── auth/
│   ├── products/
│   ├── certification/
│   ├── support/
│   └── ...
├── lib/                          # Shared infra & utilities
│   ├── auth.ts                   # Better Auth instance
│   ├── auth-client.ts            # Better Auth client
│   ├── db.ts                     # Prisma singleton
│   ├── dal/                      # Optional: shared DAL helpers
│   └── utils.ts
├── components/                   # Shared UI only
│   ├── ui/
│   └── layout/
├── types/                        # Global types (if not per-feature)
└── styles/
```

- **`app/`**: Routes and layouts only; avoid business logic here.
- **`features/`**: One folder per resource/domain; each has its own repo (DAL), api, schemas, hooks (§2).
- **`lib/`**: Auth, DB client, and cross-cutting helpers.

---

## 2. Resource organization (per feature)

Each **resource** (e.g. products, certification, support tickets) should be self-contained: repository (data layer), API, schemas (types + validation), and hooks.

### 2.1 Per-resource folder layout

```
features/
└── products/
    ├── api/                    # Route handlers or server actions entry
    │   ├── route.ts            # GET/POST for /api/products (if used)
    │   └── actions.ts          # Server Actions for forms/mutations
    ├── repo/                   # Data access (repository layer)
    │   └── products.repo.ts     # All Prisma queries for this resource
    ├── schemas/                # Validation + types
    │   ├── product.schema.ts   # Zod schemas
    │   └── product.types.ts    # TS types (or infer from Zod)
    ├── hooks/                  # Client hooks (data fetching, mutations)
    │   ├── use-products.ts
    │   └── use-product-mutation.ts
    ├── components/             # Feature-specific UI (optional)
    └── index.ts                # Public API: what other features can import
```

Apply the same pattern to other resources: `certification/`, `support/`, `contracts/`, etc.

### 2.2 Repository (repo) — best practices

- **Single place for DB access**: All Prisma calls for a resource live in `features/<resource>/repo/*.repo.ts`. No raw `prisma.*` in Route Handlers, Server Components, or Server Actions outside this layer.
- **Accept tenant context**: Every function that reads/writes tenant-scoped data should receive `tenantId` (or `organizationId`) and pass it into `where` clauses (§5).
- **Use React `cache()` for read deduplication**: Wrap pure read functions with `cache()` so the same request doesn’t hit the DB twice.

Example:

```ts
// features/products/repo/products.repo.ts
import { cache } from "react";
import { prisma } from "@/lib/db";

export const getProductsByTenant = cache(async (tenantId: string) => {
  return prisma.product.findMany({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
  });
});

export async function createProduct(tenantId: string, data: CreateProductInput) {
  return prisma.product.create({
    data: { ...data, tenantId },
  });
}
```

### 2.3 API — best practices

- **Route Handlers**: Use `app/api/<resource>/route.ts` (or under a version/segment) and keep them thin: parse input, validate with Zod, call repo, return response.
- **Server Actions**: Prefer Server Actions for mutations from forms; call repo and optionally revalidate. Use `"use server"` in `features/<resource>/api/actions.ts`.
- **Auth & tenant**: In every protected route/action, get session (Better Auth) and resolve tenant/organization; pass `tenantId` into repo.

Example:

```ts
// features/products/api/actions.ts
"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createProduct } from "../repo/products.repo";
import { createProductSchema } from "../schemas/product.schema";

export async function createProductAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  const tenantId = session.session.activeOrganizationId; // or your tenant resolution
  const parsed = createProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);
  return createProduct(tenantId, parsed.data);
}
```

### 2.4 Schemas — best practices

- **Zod for validation**: Define one (or more) Zod schema per resource in `features/<resource>/schemas/<resource>.schema.ts`. Use for API body, query, form data, and env.
- **Types from Zod**: Export types with `z.infer<typeof mySchema>` so API and frontend stay in sync. Optionally re-export in `index.ts`.

Example:

```ts
// features/products/schemas/product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  moq: z.number().positive(),
  tenantId: z.string().optional(), // set server-side, not from client
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

### 2.5 Hooks — best practices

- **Client-only**: Hooks live in `features/<resource>/hooks/` and run in the browser. Use for SWR/React Query, or fetch to your API/Server Actions.
- **Thin hooks**: Prefer hooks that call Server Actions or `fetch("/api/...")` and expose loading/error state; keep business logic in repo/actions.

Example:

```ts
// features/products/hooks/use-products.ts
"use client";
import { useCallback, useState } from "react";

export function useProducts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);
  return { data, loading, reload: load };
}
```

### 2.6 Public API (index.ts)

Each feature should expose a minimal public API so other features don’t depend on internal paths:

```ts
// features/products/index.ts
export { createProductAction, updateProductAction } from "./api/actions";
export { getProductsByTenant } from "./repo/products.repo";
export { createProductSchema } from "./schemas/product.schema";
export type { CreateProductInput } from "./schemas/product.schema";
export { useProducts } from "./hooks/use-products";
```

---

## 3. Prisma + PostgreSQL best practices

### 3.1 Single Prisma client (singleton)

Use one shared client to avoid connection pool exhaustion (especially with hot reload):

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Use `prisma` from `@/lib/db` everywhere (repos, auth adapter).

### 3.2 Connection and URL

- Use PostgreSQL connection string with pooling parameters, e.g. `?connection_limit=5&pool_timeout=20`.
- For serverless (Vercel), keep connection limit low (e.g. 1-5); consider Prisma Accelerate for HTTP pooling if needed.

### 3.3 Migrations

- **Development**: `pnpm prisma migrate dev`
- **Production**: `pnpm prisma migrate deploy`
- Do not change the database manually; always use migrations.

### 3.4 Schema generation with Better Auth

- Let Better Auth generate its tables: `npx auth@latest generate` (or migrate). Merge the generated block into your `schema.prisma` if needed.
- Use `provider: "postgresql"` in the Prisma adapter for Better Auth.

---

## 4. Better Auth — implementation

### 4.1 Install and config

- Install: `better-auth`, `@better-auth/prisma-adapter`.
- Create a single auth instance and API route; use the same instance in RSC and Server Actions.

**Auth instance (lib/auth.ts):**

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    organization(),   // multi-tenant: orgs + roles
    nextCookies(),    // required for Server Actions that set cookies (must be last)
  ],
  // optional: trustedOrigins, basePath: "/api/auth", etc.
});
```

**API route (app/api/auth/[...all]/route.ts):**

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Client (lib/auth-client.ts):**

```ts
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
```

### 4.2 Session and tenant in server code

- **RSC / Server Actions**: Use `auth.api.getSession({ headers: await headers() })`. Then read the active organization (tenant) from the session (e.g. `session.session.activeOrganizationId` with the organization plugin).
- **Protected routes**: Prefer checking session inside the page/route (or in a layout) with `auth.api.getSession` and redirect if missing. Middleware can do a fast cookie check for redirects, but always validate the session on the server for sensitive operations.

### 4.3 Organization plugin (multi-tenant)

- Organizations are the tenant boundary: each Partner/Cooperative (or Buyer org) is an organization. Use `organization()` and `organizationClient()` as above.
- Create organizations when a partner registers or a buyer is onboarded; set `activeOrganizationId` in the session when they switch context.
- Use Better Auth’s roles (Owner, Admin, Member) or custom roles for permissions inside an org; map your app roles (e.g. SuperAdmin, Partner, Buyer) to user metadata or to organization membership.

### 4.4 Schema generation

- Run `npx auth@latest generate` to add Better Auth (and organization) tables to your Prisma schema, then run `prisma migrate dev` to apply.

---

## 5. Multi-tenancy — data separation and filtering

### 5.1 Strategy: shared DB + tenant column

- **Single database**, one schema; all tenant-scoped tables have a `tenantId` (or `organizationId`) column.
- **Application-level enforcement**: Resolve `tenantId` from the session (e.g. `session.session.activeOrganizationId`) and pass it into every repo call. Repos always include `where: { tenantId }` (or equivalent) for tenant-scoped models.

### 5.2 Prisma schema

- Add `tenantId String` (or `organizationId`) to every tenant-scoped model; add `@@index([tenantId])` for performance.
- Relate to your tenant table (e.g. `Organization` from Better Auth):

```prisma
model Product {
  id        String   @id @default(cuid())
  tenantId  String   // or organizationId
  tenant    Organization @relation(fields: [tenantId], references: [id])
  name      String
  // ...
  @@index([tenantId])
}
```

### 5.3 Enforcing tenant in repos

- **Explicit parameter**: Every repo function that touches tenant data takes `tenantId` as the first (or second) argument and uses it in `where`/`data`.
- **No global tenant in Prisma**: Prisma has no built-in “global filter”; so don’t rely on a global variable that might be missing. Always pass tenant explicitly from the request/session into the repo.

### 5.4 Optional: Row-Level Security (RLS)

- For an extra safety net, you can enable PostgreSQL RLS on tenant-scoped tables and set `app.current_tenant` (or similar) at the start of each request, then use it in policies. This requires setting the session variable in a single place (e.g. middleware or a DB wrapper) and is optional if you strictly use repo-only access with explicit `tenantId`.

---

## 6. Checklist summary

| Area | Practice |
|------|----------|
| **Structure** | Feature-based `features/<resource>/` with api, repo, schemas, hooks; shared `lib/`, `app/` for routes only. |
| **Repo** | One place per resource for Prisma; always pass `tenantId`; use `cache()` for reads where appropriate. |
| **API** | Thin Route Handlers / Server Actions; validate with Zod; get session + tenant, then call repo. |
| **Schemas** | Zod in `schemas/`; export types with `z.infer<>`. |
| **Hooks** | Client-only; call API or Server Actions; keep logic in server. |
| **Prisma** | Singleton client in `lib/db.ts`; migrations for all changes; PostgreSQL with pooling params. |
| **Auth** | Better Auth + Prisma adapter + nextCookies + organization plugin; session via `auth.api.getSession`; tenant = activeOrganizationId. |
| **Multi-tenant** | `tenantId` on all tenant-scoped tables; resolve from session; enforce in repo only; optional RLS. |

---

## 7. Optional: monorepo

If you later split frontend and API or share code across apps, consider a monorepo (e.g. Turborepo) with:

- `apps/web` — Next.js app (this structure).
- `packages/database` — Prisma schema and client, shared types.
- `packages/auth` — Better Auth config and shared auth types.

For a single Next.js app, the structure in §1-2 is enough; introduce packages when you have multiple apps or need strict shared boundaries.

---

*References: Next.js App Router, Prisma docs, Better Auth (Next.js integration, Prisma adapter, Organization plugin), multi-tenant RLS and Prisma patterns.*

---

## 8. Auth & DB setup (done)

- **Prisma**: `prisma/schema.prisma` — Better Auth (User, Session, Account, Verification), Organization plugin (Organization, Member, Invitation), app model (Product). Use `pnpm db:generate`, `pnpm db:migrate` when PostgreSQL is running.
- **Env**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` in `.env` (see `.env.example`). Generate secret: `npx @better-auth/cli@latest secret`.
- **Auth**: `~/lib/auth.ts` (Better Auth + Prisma adapter + organization + nextCookies), `~/lib/auth-client.ts` (client + organizationClient), `~/app/api/auth/[...all]/route.ts` (handler).
- **DB client**: `~/lib/db.ts` (Prisma singleton with pg adapter for Prisma 7).
