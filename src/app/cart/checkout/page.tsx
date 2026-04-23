import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CheckoutPageClient } from "./checkout-page-client";

export const metadata = {
  title: "Checkout — nevali",
  description:
    "Guest-friendly checkout: contact, shipping, and payment—no sign-in required.",
};

export default async function CartCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;
  const session = await getSession();
  const u = session?.user;
  const role = (u as { role?: string } | undefined)?.role;
  const prefillName =
    role === "buyer" && u?.name?.trim() ? u.name.trim() : "";
  const prefillEmail =
    role === "buyer" && u?.email?.trim() ? u.email.trim() : "";

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
          <p className="mb-3 max-w-2xl font-sans text-sm text-stone-600">
            Enter your details and shipping address. Pay by card (Stripe) when enabled, or choose cash
            on delivery. Sellers ship your cosmetics directly.
          </p>
          <p className="mb-8 max-w-2xl rounded-sm border border-cream-dark bg-white px-4 py-3 font-sans text-sm text-stone-600">
            <span className="font-semibold text-text-dark">No account required.</span> This is guest
            checkout—you are not asked to sign in. Creating a buyer account is optional if you want
            order history in the app.
          </p>
          <CheckoutPageClient
            cancelled={cancelled === "1" || cancelled === "true"}
            initialEmail={prefillEmail}
            initialName={prefillName}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
