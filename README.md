# CraftHouse

B2B-style marketplace for Moroccan crafts: verified **partners** (artisans / cooperatives) manage products, certifications, training, support, and RFQs; **buyers** can register, browse, and track product inquiries; **superadmins** review and operate the platform. Public visitors browse approved products and partner profiles.

The codebase evolved from a [Create T3 App](https://create.t3.gg/) scaffold but **does not use tRPC**; data flows through **Next.js Server Actions**, **Prisma**, and **TanStack Query** where noted in the admin app.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL + [Prisma 7](https://www.prisma.io/) |
| Auth | [Better Auth](https://www.better-auth.com/) (email/password, organization plugin) |
| Media | [Supabase](https://supabase.com/) Storage (optional until env is set) |
| Email | [Resend](https://resend.com/) (optional; verification flows no-op without key) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/) (product certificate route) |

## Prerequisites

- Node.js 20+ (recommended)
- [pnpm](https://pnpm.io/) 10+
- PostgreSQL instance

## Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables and fill in real values:

   ```bash
   cp .env.example .env
   ```

   Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.  
   Optional: `RESEND_*`, `REQUIRE_EMAIL_VERIFICATION`, `RFQ_THREAD_CC_EMAIL`, `BUYER_ENTERPRISE_INQUIRY_CC_EMAIL`, `SUPABASE_*`, `NEXT_PUBLIC_*`, `CONTACT_PUBLIC_EMAIL`, `LEGAL_POLICY_EFFECTIVE_DATE`, placeholder `STRIPE_*` / digest keys — see [`.env.example`](./.env.example) and [`src/env.js`](./src/env.js). With **`RESEND_API_KEY`** set, the server sends transactional mail (including **RFQ thread messages** to the counterparty when configured). Use **`RESEND_FROM_EMAIL`** on a verified domain in production.

3. Apply migrations and (optionally) seed demo data:

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

4. Start the dev server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm check` | [Biome](https://biomejs.dev/) lint/format |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:migrate:deploy` | `prisma migrate deploy` |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Prisma Studio |

## Roles & routes (summary)

- **Partner (artisan)** — after admin approval: dashboard under **`/artisan`** (middleware-enforced: onboarding → pending approval → app). Legacy **`/producer/*`** URLs **redirect (308)** to the matching **`/artisan/*`** route.
- **Buyer** — self-serve sign-up at **`/auth/register-buyer`** → **`/buyer`** (enabled by default). Product inquiries sent while signed in appear under **`/buyer/rfqs`** (RFQ rows store optional `buyerUserId`).
- **Superadmin** — **`/admin`** (first registered user is bootstrapped as superadmin in `src/lib/auth.ts`).
- **Public** — `/`, `/products`, `/products/[id]`, `/partners`, `/artisans`, `/artisans/[slug]`, `/training`, `/contact`, product inquiry → RFQ.

## CI

GitHub Actions runs **`pnpm typecheck`** on pushes and pull requests to `main` / `master` (see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

## Documentation

| Doc | Contents |
|-----|----------|
| [`docs/INTEGRATION_STATUS.md`](./docs/INTEGRATION_STATUS.md) | What is wired to the backend vs UI-only; known gaps; suggested next tasks |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Target patterns (feature layout, repos, Better Auth, multi-tenant notes) |
| [`docs/WORKFLOW.md`](./docs/WORKFLOW.md) | Product / role workflows (narrative + Mermaid) |

## Deployment

Configure production `DATABASE_URL`, auth URL/secret, and optional Supabase/Resend, `CONTACT_PUBLIC_EMAIL`. Run `pnpm db:migrate:deploy` before or as part of your release process. For containerized deploys you can set `SKIP_ENV_VALIDATION` during image build if needed (see `src/env.js`).
