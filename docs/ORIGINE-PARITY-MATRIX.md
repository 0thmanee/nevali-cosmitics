# Origine Maroc ↔ CraftHouse parity matrix

This document maps **Origine Maroc–style marketplace behavior** to **CraftHouse** implementation status. Use it to track intentional differences (branding, extra features) versus gaps to close.

**Reference note:** The `origine-maroc/` snapshot is not always present in this repo (and may be excluded from TypeScript builds). When it is missing, this matrix is maintained from **CraftHouse `src/`** plus prior Origine audits. Re-validate against a fresh Origine checkout when needed.

**Legend**

| Status | Meaning |
|--------|---------|
| **Aligned** | Same behavior for the same user story (implementation path may differ). |
| **Partial** | Core parity with a documented gap or UX difference. |
| **CraftHouse-only** | Not part of the minimal Origine reference; product choice. |
| **Gap** | Known missing parity vs typical Origine Maroc scope. |

---

## 1. Routing & product surface

| Origine (typical) | CraftHouse | Status | Notes |
|-------------------|------------|--------|--------|
| `/producer/*` partner app | `/artisan/*` | **Aligned** (renamed) | Legacy `/producer/*` may redirect via `next.config` (see `INTEGRATION_STATUS.md`). |
| Public `/products`, `/products/[id]` | Same | **Aligned** | CraftHouse branding, terracotta theme. |
| Producer “dashboard” entry | `/artisan` | **Aligned** | Same role, different IA/copy. |

---

## 2. Catalog & product depth

| Capability | CraftHouse location | Status | Notes |
|------------|---------------------|--------|--------|
| `Product` + `ProductVariant` (price, stock, MOQ, sort) | Prisma + `products.repo` sync | **Aligned** | |
| Producer variant editor (add/remove/SKUs) | `product-variants-form-block.tsx`, create/edit forms | **Aligned** | |
| `ProductImage.variantId` + gallery “show for variant” | `product-gallery-editor.tsx`, `setProductImageVariant` | **Aligned** | |
| Product `description` | Forms + public PDP | **Aligned** | |
| Public list row (variants, gallery, `paymentOption`) | `buildPublicProductListRow`, partners mapping | **Aligned** | |
| **Public catalog text search (`?q=`)** | — | **Gap** | `listApprovedProductsForPublicPaginatedRepo` / `/products` use **category + pagination** only; Origine’s reference repo used **multi-token search** on name/description/category/org/variant names. **Add `q` to repo + `products/page.tsx` UI to close.** |
| Variant-aware “hero” image on cards (Origine helper) | `firstImageUrl` = first gallery image by sort | **Partial** | Origine could prefer an image linked to a default/selected variant; CraftHouse uses ordered gallery + mapper. Optional refinement. |

---

## 3. Admin & commerce rules

| Capability | CraftHouse | Status | Notes |
|------------|------------|--------|--------|
| Approve/reject product | Admin product detail + list | **Aligned** | |
| **Payment option on approve** (CARD / COD / BOTH) | `approve-product-modal.tsx`, `setProductStatus` | **Aligned** | |
| Shop orders from public cart | `ShopOrder` / `ShopOrderLine` | **Aligned** | |
| Producer/admin order visibility | `/artisan/orders`, `/admin/orders` | **Aligned** | |
| **Card payments (Stripe)** | Checkout Session, webhook, `PENDING_PAYMENT` → `CONFIRMED` | **CraftHouse-only** | Origine reference was **record order + method**, not PSP capture. |

---

## 4. Checkout & cart

| Capability | CraftHouse | Status | Notes |
|------------|------------|--------|--------|
| Cart lines with `paymentOption` enforcement | `checkout-payment.ts`, cart types | **Aligned** | |
| COD: confirm + emails immediately | `submitShopOrder` | **Aligned** | |
| Card: Stripe redirect, emails after payment | `stripe-shop-order.ts`, webhook, success sync | **CraftHouse-only** | Stronger than Origine snapshot. |
| Cancel return from Stripe | `/cart/checkout?cancelled=1` | **Aligned** | Cart preserved. |

---

## 5. Ops & notifications

| Capability | CraftHouse | Status | Notes |
|------------|------------|--------|--------|
| Order emails (buyer + per-org lines) | `notifications.ts`, COD + post-Stripe confirm | **Aligned** | |
| Product/cert approval emails | Existing flows | **Aligned** | |
| RFQ/thread email matrix | Broader than minimal Origine | **CraftHouse-only** | Not required for “catalog parity.” |

---

## 6. Domains CraftHouse has beyond minimal Origine

These are **not gaps**; they are **extra** product scope:

- Buyer portal (`/buyer/*`), RFQs, contracts, negotiation threads, saved lists.
- Training programs, support tickets, admin analytics/exports.
- Partner onboarding, pending approval, multi-role auth.

---

## 7. Recommended next steps to tighten “Origine catalog parity”

1. **Public search (`q`)** — Wire `parsePublicProductSearchQuery`–style filtering into `listApprovedProductsForPublicPaginatedRepo` and add a search field + query string on `/products`.
2. **Optional:** Card listing image heuristic — pick first image matching default variant or lowest-price variant when `variantId` is set (match Origine card UX if needed).
3. **Re-sync** — When `origine-maroc/` is available, diff `origine-maroc/src/app/products` and `origine-maroc/src/features/producer` against `src/app/products` and `src/features/artisan` for stragglers.

---

## 8. Single-line summary

**CraftHouse matches Origine on partner catalog depth, admin payment rules, guest checkout, and order notifications.** The main **catalog parity gap** vs the Origine reference is **public full-text search (`q`)** on `/products`. **Stripe** and **RFQ/buyer/training** are **CraftHouse extensions**, not Origine clones.
