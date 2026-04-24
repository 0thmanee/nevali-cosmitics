import type { Metadata } from "next";
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
import type { Translator } from "~/lib/i18n/create-translator";
import { interpolate } from "~/lib/i18n/interpolate";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { getTranslator } from "~/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const brand = NEVALI_HOUSE_BRAND.legalName;
  return {
    title: SHOW_MULTI_PRODUCER_EXPERIENCE ? t("productsPage.metaTitleMulti") : t("productsPage.metaTitleSingle", { brand }),
    description: SHOW_MULTI_PRODUCER_EXPERIENCE
      ? t("productsPage.metaDescMulti")
      : t("productsPage.metaDescSingle", { brand }),
  };
}

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
  t,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
  t: Translator;
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
        <Link
          href={buildHref(currentPage - 1, category)}
          className={`${btnBase} gap-1.5 border-stone-200 bg-white text-stone-700 hover:bg-stone-50`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("productsPage.paginationPrev")}
        </Link>
      ) : (
        <span className={`${btnBase} cursor-not-allowed gap-1.5 border-stone-200 bg-white text-stone-300`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("productsPage.paginationPrev")}
        </span>
      )}

      {range.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-8 items-center justify-center font-sans text-sm text-stone-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p, category)}
            className={`${btnBase} ${
              p === currentPage
                ? "border-transparent text-white"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
            }`}
            style={p === currentPage ? { background: "var(--color-primary)" } : undefined}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1, category)}
          className={`${btnBase} gap-1.5 border-stone-200 bg-white text-stone-700 hover:bg-stone-50`}
        >
          {t("productsPage.paginationNext")}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : (
        <span className={`${btnBase} cursor-not-allowed gap-1.5 border-stone-200 bg-white text-stone-300`}>
          {t("productsPage.paginationNext")}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </div>
  );
}

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const t = await getTranslator();
  const brand = NEVALI_HOUSE_BRAND.legalName;
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
    <main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
      <Navbar />

      <section className="border-b border-cream-dark bg-linear-to-b from-cream to-cream-dark/40">
        <div className="mx-auto max-w-7xl px-6">
          <AnimateOnScroll
            className="flex items-center gap-2 border-b border-cream-dark py-4 font-sans text-xs uppercase tracking-[0.08em] text-primary/70"
            direction="down"
          >
            <Link className="transition-colors hover:text-primary" href="/">
              {t("productsPage.breadcrumbHome")}
            </Link>
            <span>/</span>
            <span className="text-primary">{t("productsPage.breadcrumbProducts")}</span>
          </AnimateOnScroll>

          <div className="flex flex-col justify-between gap-10 py-20 md:flex-row md:items-end">
            <AnimateOnScroll delay={0} direction="up">
              <p className="mb-5 font-sans text-xs uppercase tracking-[0.2em] text-primary/80">
                {SHOW_MULTI_PRODUCER_EXPERIENCE
                  ? interpolate(t("productsPage.eyebrowMulti"), { total: String(total) })
                  : interpolate(t("productsPage.eyebrowSingle"), { brand, total: String(total) })}
              </p>
              <h1
                className="font-bold font-display uppercase leading-none text-text-dark"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                {t("productsPage.titleLine1")}
                <br />
                {t("productsPage.titleLine2")}
                <br />
                {t("productsPage.titleLine3")}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll className="shrink-0 md:max-w-xs" delay={150} direction="up">
              <p className="mb-8 font-sans text-sm leading-relaxed text-text-muted">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("productsPage.introMulti") : t("productsPage.introSingle", { brand })}
              </p>
              <div className="grid grid-cols-3 divide-x divide-cream-dark border border-cream-dark bg-white/60">
                {[
                  { value: String(total), label: t("productsPage.statProducts") },
                  { value: String(categories.length), label: t("productsPage.statCategories") },
                  { value: "100%", label: t("productsPage.statVerified") },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1 px-3 py-4">
                    <span className="font-serif text-2xl font-bold leading-none text-primary-dark">{stat.value}</span>
                    <span className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {categories.length > 0 && (
            <AnimateOnScroll className="flex flex-wrap items-center gap-0 border-t border-cream-dark" direction="down">
              <Link
                href="/products"
                className={`px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.05em] transition-colors border-b-2 ${
                  !currentCategory ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-primary"
                }`}
              >
                {t("productsPage.filterAll")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildHref(1, cat)}
                  className={`px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.05em] transition-colors border-b-2 ${
                    currentCategory === cat ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-primary"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </AnimateOnScroll>
          )}
        </div>
      </section>

      <section className="flex-1 px-6 py-12">
        <AnimateOnScroll className="mx-auto flex max-w-7xl flex-col gap-6" delay={50} direction="up" scale>
          {total > 0 && (
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm text-stone-400">
                {t("productsPage.resultsShowing")}{" "}
                <span className="font-semibold text-stone-700">
                  {start}–{end}
                </span>{" "}
                {t("productsPage.resultsOf")}{" "}
                <span className="font-semibold text-stone-700">{total}</span> {t("productsPage.resultsProducts")}
                {currentCategory ? (
                  <>
                    {" "}
                    {t("productsPage.resultsIn")}{" "}
                    <span className="font-semibold text-stone-700">{currentCategory}</span>
                  </>
                ) : null}
              </p>
              {currentCategory ? (
                <Link
                  href="/products"
                  className="flex items-center gap-1 font-sans text-sm font-medium text-primary transition-opacity hover:opacity-70"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {t("productsPage.clearFilter")}
                </Link>
              ) : null}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center"
                style={{ background: "var(--color-primary)" }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="3" y="10" width="20" height="13" rx="1.5" stroke="white" strokeWidth="1.4" />
                  <path d="M9 10V7a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-serif text-2xl font-bold text-stone-800">{t("productsPage.emptyTitle")}</p>
              <p className="max-w-xs font-sans text-base text-stone-400">
                {currentCategory
                  ? interpolate(t("productsPage.emptyCategory"), { category: currentCategory })
                  : SHOW_MULTI_PRODUCER_EXPERIENCE
                    ? t("productsPage.emptyBodyMulti")
                    : t("productsPage.emptyBodySingle", { brand })}
              </p>
              {currentCategory ? (
                <Link
                  href="/products"
                  className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t("productsPage.browseAllProducts")}
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} category={currentCategory} t={t} />
        </AnimateOnScroll>
      </section>

      <Footer />
    </main>
  );
}
