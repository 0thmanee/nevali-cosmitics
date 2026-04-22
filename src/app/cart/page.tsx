import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CartPageClient } from "./cart-page-client";

export const metadata = {
  title: "Cart — CraftHouse",
  description:
    "Review products you are sourcing before sending quote requests to artisans.",
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
          <h1 className="mb-8 font-serif text-3xl font-bold text-text-dark">Sourcing cart</h1>
          <CartPageClient />
        </div>
      </section>
      <Footer />
    </main>
  );
}
