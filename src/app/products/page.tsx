import React from "react";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { PublicProductCard } from "~/components/public-product-card";
import {
  listApprovedProductsForPublicPaginatedRepo,
  listApprovedProductCategoriesRepo,
} from "~/app/api/products/repo/products.repo";

export const metadata = {
  title: "Products — nevali",
  description:
    "Browse certified Moroccan artisanal crafts — ceramics, leather, textiles, jewelry and more — sourced directly from verified artisans.",
};

// ── Pagination ────────────────────────────────────────────────────────────────

function buildHref(page: number, category?: string) {
  const p = new URLSearchParams();
  if (category) p.set("category", category);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

function Pagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  const range: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) range.push(i);
  } else {
    range.push(1);
    if (currentPage > 3) range.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      range.push(i);
    }
    if (currentPage < totalPages - 2) range.push("…");
    range.push(totalPages);
  }

  const btnBase =
    "h-9 min-w-[36px] flex items-center justify-center font-sans text-sm font-medium transition-colors border px-3";

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1, category)} className={`${btnBase} bg-white text-stone-700 border-stone-200 hover:bg-stone-50 gap-1.5`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Prev
        </Link>
      ) : (
        <span className={`${btnBase} bg-white text-stone-300 border-stone-200 cursor-not-allowed gap-1.5`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Prev
        </span>
      )}

      {range.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="h-9 w-8 flex items-center justify-center font-sans text-sm text-stone-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p, category)}
            className={`${btnBase} ${
              p === currentPage
                ? "text-white border-transparent"
                : "text-stone-700 bg-white border-stone-200 hover:bg-stone-50"
            }`}
            style={p === currentPage ? { background: "#7B1F0A" } : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1, category)} className={`${btnBase} bg-white text-stone-700 border-stone-200 hover:bg-stone-50 gap-1.5`}>
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} bg-white text-stone-300 border-stone-200 cursor-not-allowed gap-1.5`}>
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page ?? 1));
  const currentCategory = params.category ?? undefined;

  const [{ products, total, totalPages }, categories] = await Promise.all([
    listApprovedProductsForPublicPaginatedRepo({
      page: currentPage,
      pageSize: PAGE_SIZE,
      category: currentCategory,
    }),
    listApprovedProductCategoriesRepo(),
  ]);

  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <main className="flex flex-col w-full min-h-screen bg-cream pt-[56px]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb */}
          <div className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Products</span>
          </div>

          {/* Headline row */}
          <div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <AnimateOnScroll direction="up" delay={0}>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
                Certified Marketplace — {total} Products
              </p>
              <h1
                className="font-serif font-bold uppercase text-white leading-[1.0]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                Moroccan crafts,<br />certified<br />&amp; traceable
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={150} className="md:max-w-xs shrink-0">
              <p className="font-sans text-white/60 leading-relaxed text-sm mb-8">
                Every piece is sourced from a verified Moroccan artisan and carries
                a full traceability record. Inquire directly or request a B2B quote.
              </p>
              <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10">
                {[
                  { value: String(total), label: "Products" },
                  { value: String(categories.length), label: "Categories" },
                  { value: "100%", label: "Verified" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1 py-4 px-3">
                    <span className="font-serif font-bold text-secondary text-2xl leading-none">{stat.value}</span>
                    <span className="font-sans text-xs tracking-[0.15em] uppercase text-white/40 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Category filter tabs */}
          {categories.length > 0 && (
            <div className="flex items-center flex-wrap gap-0 border-t border-white/10">
              <Link
                href="/products"
                className={`px-5 py-3 font-sans text-xs font-semibold tracking-[0.05em] uppercase transition-colors border-b-2 ${
                  !currentCategory ? "text-secondary border-secondary" : "text-white/40 border-transparent hover:text-white/70"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildHref(1, cat)}
                  className={`px-5 py-3 font-sans text-xs font-semibold tracking-[0.05em] uppercase transition-colors border-b-2 ${
                    currentCategory === cat ? "text-secondary border-secondary" : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Catalogue ── */}
      <section className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          {/* Results count */}
          {total > 0 && (
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm text-stone-400">
                Showing{" "}
                <span className="font-semibold text-stone-700">{start}–{end}</span> of{" "}
                <span className="font-semibold text-stone-700">{total}</span> crafts
                {currentCategory && (
                  <>
                    {" "}in <span className="font-semibold text-stone-700">{currentCategory}</span>
                  </>
                )}
              </p>
              {currentCategory && (
                <Link
                  href="/products"
                  className="font-sans text-sm font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
                  style={{ color: "#7B1F0A" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Clear filter
                </Link>
              )}
            </div>
          )}

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{ background: "#7B1F0A" }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="3" y="10" width="20" height="13" rx="1.5" stroke="white" strokeWidth="1.4" />
                  <path d="M9 10V7a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-serif font-bold text-stone-800 text-2xl">No crafts found</p>
              <p className="font-sans text-stone-400 text-base max-w-xs">
                {currentCategory
                  ? `No certified crafts in "${currentCategory}" yet.`
                  : "Our certified artisans are preparing their catalogs. Check back soon."}
              </p>
              {currentCategory && (
                <Link
                  href="/products"
                  className="font-sans font-semibold text-sm text-white px-6 py-3 transition-opacity hover:opacity-90"
                  style={{ background: "#7B1F0A" }}
                >
                  Browse All Crafts
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} category={currentCategory} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
