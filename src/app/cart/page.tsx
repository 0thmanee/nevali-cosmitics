import type { Metadata } from "next";
import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getTranslator } from "~/lib/i18n/server";
import { CartPageClient } from "./cart-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("cart.metaTitle"),
    description: t("cart.metaDescription"),
  };
}

export default async function CartPage() {
  const t = await getTranslator();
  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <section className="flex-1 px-4 pb-16 pt-[72px]">
        <div className="mx-auto w-full max-w-7xl">
          <nav className="mb-6 font-sans text-sm text-stone-500">
            <Link className="hover:text-text-dark" href="/">
              {t("cart.breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-text-dark">{t("cart.breadcrumbCart")}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-text-dark">{t("cart.title")}</h1>
          <p className="mb-8 mt-2 max-w-2xl font-sans text-sm text-stone-600">{t("cart.intro")}</p>
          <CartPageClient />
        </div>
      </section>
      <Footer />
    </main>
  );
}
