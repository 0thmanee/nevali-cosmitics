/**
 * Single source of truth for whether card payments are live.
 *
 * The store ships **cash-on-delivery only, by design** (the right default for the
 * Moroccan market). The Stripe stack — `src/lib/stripe-server.ts`,
 * `src/lib/stripe-shop-order.ts`, `src/lib/complete-shop-order-payment.ts`, and the
 * `/api/webhooks/stripe` route — is fully wired and intentionally PARKED, not deleted,
 * so card can be switched on later without rebuilding it.
 *
 * To enable card payments in the future:
 *   1. Flip this to `true` (or derive it from the Stripe env keys).
 *   2. Surface a card option in the checkout UI (`checkout-page-client.tsx`) and the
 *      per-product payment options (currently COD-only via `checkout-payment.ts`).
 *   3. Configure STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and
 *      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and register the webhook endpoint.
 *
 * Keep this as the only gate — do not re-introduce hardcoded "COD only" checks elsewhere.
 */
export const cardPaymentsEnabled: boolean = false;
