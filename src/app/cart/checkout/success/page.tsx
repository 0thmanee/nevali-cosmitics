import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CheckoutSuccessStripeSync } from "./checkout-success-stripe-sync";
import { CheckoutSuccessSummary } from "./checkout-success-summary";

export const metadata = {
  title: "Order confirmed — nevali",
  description: "Thank you for your order.",
};

export default async function CartCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const { orderId, session_id: sessionId } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <section className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-[88px]">
        <div className="flex w-full max-w-lg flex-col items-center gap-6 pb-8 text-center">
          <div
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ background: "var(--color-ink)" }}
          >
            <svg fill="none" height="28" viewBox="0 0 24 24" width="28">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-text-dark">Order placed successfully</h1>
          <p
            aria-live="polite"
            className="rounded-sm border border-text-muted/40 bg-cream px-4 py-2 font-sans text-sm font-semibold text-text-dark"
            role="status"
          >
            Success: your order has been confirmed.
          </p>
          <p className="font-sans leading-relaxed text-stone-600">
            Your order has been received. Brands will follow up by email with payment or delivery
            details as needed.
          </p>
          {orderId ? (
            <p className="font-sans text-sm text-text-dark">
              Reference:{" "}
              <span className="break-all font-mono font-medium">{orderId}</span>
            </p>
          ) : null}
          <p className="max-w-md font-sans text-xs text-stone-500">
            You completed this as a guest—no login was required. Keep this reference in your email;
            register as a buyer with the same address if you would like future orders listed under My
            orders.
          </p>
          <CheckoutSuccessStripeSync orderId={orderId} sessionId={sessionId} />
          <CheckoutSuccessSummary orderId={orderId} />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-sm bg-ink px-6 py-3 text-center font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
              href="/products"
            >
              Continue shopping
            </Link>
            <Link
              className="rounded-sm border border-cream-dark bg-white px-6 py-3 text-center font-sans text-sm font-semibold text-text-dark transition-colors hover:bg-cream"
              href="/"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
