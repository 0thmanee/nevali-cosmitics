# nevaliCosmetics — integration status

This document tracks **what is connected** to PostgreSQL / Prisma / server actions, **what is only partially connected** or inconsistent, and **remaining work** suggested by the codebase and internal docs.

**Latest maintenance:** The duplicate **`src/app/producer`** app and **`src/features/producer`** module were **removed**. Legacy URLs **`/producer/*`** still **308 redirect** to **`/artisan/*`** in `next.config.js`. Public **`/contact`** reads optional **`CONTACT_PUBLIC_EMAIL`** and optional **`LEGAL_POLICY_EFFECTIVE_DATE`** (display-only operator label). Env catalogue: **`src/env.js`** and **`.env.example`**.

---

## 1. Linked end-to-end (backend + UI)

These areas use Server Actions (or route handlers) that read/write Prisma models, and the UI calls them (often via TanStack Query on admin or directly on partner views).

| Domain | Data | Typical entry points |
|--------|------|----------------------|
| **Auth & session** | Better Auth models (`User`, `Session`, `Account`, …), custom fields `role` (`partner` \| `superadmin` \| `buyer`), `status`, `profileCompleted`, optional `signupSource` | `/api/auth/*`, `getSession` / `requireSession`, middleware for `/artisan`, `/admin`, `/buyer`, onboarding, pending approval |
| **Buyer portal** | `User` role `buyer`; `Rfq.buyerUserId`; `SavedList` / `SavedListProduct`; `RfqMessage`; `Rfq.negotiationTurn`; `UserNotification` | **`/auth/register-buyer`**, **`/buyer`**, **`/buyer/rfqs`**, **`/buyer/saved`**, **`/buyer/notifications`**; `postRegisterKind`, `listMyBuyerRfqs`, `submitProductInquiry`, **saved lists**, **RFQ quote thread** (buyer + partner), **turn-based negotiation** when status is **NEGOTIATING**, **alerts inbox** |
| **Onboarding / profile** | `Profile`, org slug for public pages | `/onboarding`, profile under **`/artisan`**, `getPublicProducerBySlug` for `/artisans/[slug]` |
| **Organizations & approval** | `Organization`, `Member`, user `status` | Admin “Artisans” flows: pending list, `approveUser` creates org + membership |
| **Products** | `Product`, `ProductImage` | Partner product CRUD under **`/artisan`**; admin list/detail/approve/reject; public **`/products`** and **`/products/[id]`** |
| **Certifications** | `Certification` (global or `productId`) | Partner upload; admin approve/reject; separate from product approval |
| **Training** | `TrainingProgram`, `TrainingModule`, `TrainingProgramMedia`, `TrainingEnrollment` | Admin program editor; partner programs and module views |
| **Support** | `SupportTicket`, `SupportTicketStatusEvent` | Partner tickets; admin list/detail/status/notes |
| **RFQs & contracts** | `Rfq` (optional `buyerUserId`, `negotiationTurn`), `RfqMessage`, `Contract` | Partner **Contracts & RFQs**: quote, edit quote, negotiation, **thread messages**, decline/cancel, **record contract**; buyers mirror on **`/buyer/rfqs`**. **Admin `/admin/analytics`**: pipeline charts + **PDF summary** (`/api/admin/reports/sales-summary`). **Admin contracts**: **CSV export** for RFQs and contracts. Buyer email when `buyerUserId` + Resend. Public inquiry → `Rfq`. |
| **Partners / artisans (public)** | Organizations / profiles | **`/partners`**, **`/artisans`** (directory), **`/artisans/[slug]`** |
| **Media uploads** | Supabase Storage URLs persisted on models | `POST /api/media/upload` → `processUpload` |
| **PDF certificate** | Generated document | `/api/certificate` for product certificate rendering |
| **Marketing pages** | Mostly static + env | **`/training`**, **`/contact`** (mailto uses `CONTACT_PUBLIC_EMAIL` when set) |
| **Transactional email (Resend)** | `sendTransactionalEmail` (optional **`cc`**) + `src/lib/notifications.ts` | Partner **approved** / **suspended** / **re-enabled**; **product** & **certification** admin approve/reject → org members; **new RFQ** → org members + **buyer receipt** (friendly copy; signed-in buyers get link to **`/buyer/rfqs`**). **Each `RfqMessage`** emails the counterparty (and optional **`RFQ_THREAD_CC_EMAIL`**). Buyer lifecycle mail can CC **`BUYER_ENTERPRISE_INQUIRY_CC_EMAIL`**. Requires **`RESEND_API_KEY`** (no-op in dev without it). Production: set **`RESEND_FROM_EMAIL`** on a verified domain. |

---

## 2. Partially linked, inconsistent, or “soft” integration

| Item | What works | Gap |
|------|------------|-----|
| **Resend / email verification** | `src/lib/email.ts` + **`emailVerification.sendVerificationEmail`** in `src/lib/auth.ts`; login UI supports “resend verification”. | Set **`REQUIRE_EMAIL_VERIFICATION=true`** when you want enforced verification; without **`RESEND_API_KEY`**, sends are skipped (dev). First user bootstrap still sets **`emailVerified: true`** for the initial superadmin. |
| **Supabase** | Upload pipeline is implemented. | If Supabase env vars are missing, uploads return **503** with a short hint to set env vars (see README). |
| **Homepage “Our Products”** | Loads up to 12 **approved** products from the DB when data exists. | If none, placeholder cards **link to `/products`** (catalog), not to individual SKUs. |
| **Admin / partner analytics** | Dashboard + **`/admin/analytics`** (RFQ/contract breakdown, top orgs by value) + **CSV** exports on contracts admin + **PDF** sales summary. | Deeper BI from `docs/WORKFLOW.md` and scheduled digests remain backlog (**`NOTIFICATION_DIGEST_CRON_SECRET`** is a placeholder env). |
| **RFQ “pending reply”** | `pendingReplyCount` = RFQs in **`NEW`**; full quote **thread** on **QUOTED** / **NEGOTIATING**; **negotiationTurn** alternates buyer/partner in **NEGOTIATING**; **email + `UserNotification`** on new thread posts. | No digest bundles, no attachments, no read receipts; buyer “teams” remain **saved lists + thread + optional enterprise CC**, not shared SSO orgs. |
| **Seed data** | `prisma/seed.ts` creates sample rows. | Certification `fileUrl` values can be **placeholders** (`example.com`), not real files. |
| **Legal copy on /contact** | **`/contact#privacy`** / **`#terms`**: structured **informational** summaries + counsel disclaimer. | Replace with **jurisdiction-specific binding** instruments before relying on them for compliance. |

---

## 3. Not linked (schema gaps or product scope)

| Topic | Notes |
|-------|--------|
| **Payments / checkout** | Guest catalog checkout is **cash-on-delivery (COD) only — by design** for the Moroccan market. The single gate is **`cardPaymentsEnabled`** in `src/lib/payments-config.ts` (currently `false`). The Stripe stack (`src/lib/stripe-*.ts`, `/api/webhooks/stripe`) is **fully wired but parked** — set the `STRIPE_*` keys + flip the flag + surface a card option in the checkout UI to enable. Until then no card option is shown and `submitShopOrder` rejects non-COD. |
| **Notification product** | **`UserNotification`** rows + **`/buyer/notifications`** and **`/artisan/notifications`** list/mark-read. | No push, per-user preferences table, or scheduled digest runner yet. |
| **tRPC / NextAuth** | Not used; the app uses **Server Actions + Better Auth**. |

---

## 4. Remaining jobs (prioritized suggestions)

1. **Email verification** — Toggle **`REQUIRE_EMAIL_VERIFICATION`** + Resend in production; keep **`RESEND_FROM_EMAIL`** on a verified domain.
2. **RFQ lifecycle** — Thread + turn + per-message email + in-app **`UserNotification`** are live; optional: read receipts, attachments, digests.
3. **Notifications** — Add digest/cron, richer preferences, and deeper buyer-team routing beyond CC envs.
4. **Buyer portal (next iterations)** — **Shared buyer orgs / SSO / approvals** (today: **saved lists**, **threads**, enterprise **CC** + **mailto** on **`/buyer`**).
5. **Ongoing hygiene** — **`pnpm typecheck`** runs on push/PR via [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). Add Biome to CI after clearing or scoping existing diagnostics.

---

## 5. Doc drift

- **`docs/ARCHITECTURE.md`** and **`docs/WORKFLOW.md`** still carry the **OrigineMaroc** title for historical reasons; each file now starts with a **“Reality check (nevaliCosmetics repo)”** note. Implemented code uses **`src/app/api/*/actions.ts`** and **`*.repo.ts`**. Treat both docs as **guidance**, not a literal file map.

For “is X wired?” search the Prisma model under `src/app/api/` and the matching hook under `src/features/`.
