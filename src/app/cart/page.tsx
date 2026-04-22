import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CartPageClient } from "./cart-page-client";

export const metadata = {
  title: "Cart — nevali",
  description:
    "Review your cosmetics selection before checkout. No account required—pay as a guest when you proceed.",
};

export default function CartPage() {
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
            <span className="font-medium text-text-dark">Cart</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-text-dark">Your cart</h1>
          <p className="mb-8 mt-2 max-w-2xl font-sans text-sm text-stone-600">
            Checkout is open to everyone—you do not need to create an account. Use the same email as
            your buyer profile if you want orders to show up under My orders.
          </p>
          <CartPageClient />
        </div>
      </section>
      <Footer />
    </main>
  );
}
