import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CheckoutPageClient } from "./checkout-page-client";

export const metadata = {
  title: "Checkout — CraftHouse",
  description: "Complete your catalog order: contact, shipping address, and payment preference.",
};

export default async function CartCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <section className="flex-1 px-4 pb-16 pt-[72px]">
        <div className="mx-auto w-full max-w-7xl">
          <nav className="mb-6 font-sans text-sm text-stone-500">
            <Link className="hover:text-text-dark" href="/">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link className="hover:text-text-dark" href="/cart">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-text-dark">Checkout</span>
          </nav>
          <h1 className="mb-2 font-serif text-3xl font-bold text-text-dark">Checkout</h1>
          <p className="mb-8 max-w-2xl font-sans text-sm text-stone-600">
            Enter your details and shipping address. Pay securely by card (Stripe) or choose cash on
            delivery—producers will coordinate fulfillment with you.
          </p>
          <CheckoutPageClient
            cancelled={cancelled === "1" || cancelled === "true"}
            initialEmail=""
            initialName=""
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
