import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import {
	listApprovedProductCategoriesRepo,
	listApprovedProductsForPublicPaginatedRepo,
} from "~/app/api/products/repo/products.repo";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { PublicProductCard } from "~/components/public-product-card";
import type { Translator } from "~/lib/i18n/create-translator";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	const brand = NEVALI_HOUSE_BRAND.legalName;
	return {
		title: SHOW_MULTI_PRODUCER_EXPERIENCE
			? t("productsPage.metaTitleMulti")
			: t("productsPage.metaTitleSingle", { brand }),
		description: SHOW_MULTI_PRODUCER_EXPERIENCE
			? t("productsPage.metaDescMulti")
			: t("productsPage.metaDescSingle", { brand }),
	};
}

function buildHref(page: number, category?: string, search?: string) {
	const p = new URLSearchParams();
	if (category) p.set("category", category);
	if (search) p.set("q", search);
	if (page > 1) p.set("page", String(page));
	const qs = p.toString();
	return `/products${qs ? `?${qs}` : ""}`;
}

function Pagination({
	currentPage,
	totalPages,
	category,
	search,
	t,
}: {
	currentPage: number;
	totalPages: number;
	category?: string;
	search?: string;
	t: Translator;
}) {
	if (totalPages <= 1) return null;

	const range: (number | "…")[] = [];
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) range.push(i);
	} else {
		range.push(1);
		if (currentPage > 3) range.push("…");
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
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
					className={`${btnBase} gap-1.5 border-stone-200 bg-white text-stone-700 hover:bg-stone-50`}
					href={buildHref(currentPage - 1, category, search)}
				>
					<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
						<path
							d="M9 3L5 7l4 4"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
					{t("productsPage.paginationPrev")}
				</Link>
			) : (
				<span
					className={`${btnBase} cursor-not-allowed gap-1.5 border-stone-200 bg-white text-stone-300`}
				>
					<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
						<path
							d="M9 3L5 7l4 4"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
					{t("productsPage.paginationPrev")}
				</span>
			)}

			{range.map((p, i) =>
				p === "…" ? (
					<span
						className="flex h-9 w-8 items-center justify-center font-sans text-sm text-stone-400"
						key={`ellipsis-${i}`}
					>
						…
					</span>
				) : (
					<Link
						className={`${btnBase} ${
							p === currentPage
								? "border-transparent text-white"
								: "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
						}`}
						href={buildHref(p, category, search)}
						key={p}
						style={
							p === currentPage
								? { background: "var(--color-primary)" }
								: undefined
						}
					>
						{p}
					</Link>
				),
			)}

			{currentPage < totalPages ? (
				<Link
					className={`${btnBase} gap-1.5 border-stone-200 bg-white text-stone-700 hover:bg-stone-50`}
					href={buildHref(currentPage + 1, category, search)}
				>
					{t("productsPage.paginationNext")}
					<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
						<path
							d="M5 3l4 4-4 4"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
				</Link>
			) : (
				<span
					className={`${btnBase} cursor-not-allowed gap-1.5 border-stone-200 bg-white text-stone-300`}
				>
					{t("productsPage.paginationNext")}
					<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
						<path
							d="M5 3l4 4-4 4"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
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
	searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
	const t = await getTranslator();
	const brand = NEVALI_HOUSE_BRAND.legalName;
	const params = await searchParams;
	const currentPage = Math.max(1, Number(params.page ?? 1));
	const currentCategory = params.category ?? undefined;
	const currentSearch = params.q?.trim() || undefined;

	const [{ products, total, totalPages }, categories] = await Promise.all([
		listApprovedProductsForPublicPaginatedRepo({
			page: currentPage,
			pageSize: PAGE_SIZE,
			category: currentCategory,
			search: currentSearch,
		}),
		listApprovedProductCategoriesRepo(),
	]);

	const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
	const end = Math.min(currentPage * PAGE_SIZE, total);

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
			<Navbar />

			<section className="border-cream-dark border-b bg-linear-to-b from-cream to-cream-dark/40">
				<div className="mx-auto max-w-7xl px-6">
					<AnimateOnScroll
						className="flex items-center gap-2 border-cream-dark border-b py-4 font-sans text-primary/70 text-xs uppercase tracking-[0.08em]"
						direction="down"
					>
						<Link className="transition-colors hover:text-primary" href="/">
							{t("productsPage.breadcrumbHome")}
						</Link>
						<span>/</span>
						<span className="text-primary">
							{t("productsPage.breadcrumbProducts")}
						</span>
					</AnimateOnScroll>

					<div className="flex flex-col justify-between gap-10 py-20 md:flex-row md:items-end">
						<AnimateOnScroll delay={0} direction="up">
							<p className="mb-5 font-sans text-primary/80 text-xs uppercase tracking-[0.2em]">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? interpolate(t("productsPage.eyebrowMulti"), {
											total: String(total),
										})
									: interpolate(t("productsPage.eyebrowSingle"), {
											brand,
											total: String(total),
										})}
							</p>
							<h1
								className="font-bold font-display text-text-dark uppercase leading-none"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								{t("productsPage.titleLine1")}
								<br />
								{t("productsPage.titleLine2")}
								<br />
								{t("productsPage.titleLine3")}
							</h1>
						</AnimateOnScroll>

						<AnimateOnScroll
							className="shrink-0 md:max-w-xs"
							delay={150}
							direction="up"
						>
							<p className="mb-8 font-sans text-sm text-text-muted leading-relaxed">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("productsPage.introMulti")
									: t("productsPage.introSingle", { brand })}
							</p>
							<div className="grid grid-cols-3 divide-x divide-cream-dark border border-cream-dark bg-white/60">
								{[
									{
										value: String(total),
										label: t("productsPage.statProducts"),
									},
									{
										value: String(categories.length),
										label: t("productsPage.statCategories"),
									},
									{ value: "100%", label: t("productsPage.statVerified") },
								].map((stat) => (
									<div
										className="flex flex-col items-center gap-1 px-3 py-4"
										key={stat.label}
									>
										<span className="font-bold font-serif text-2xl text-primary-dark leading-none">
											{stat.value}
										</span>
										<span className="mt-1 font-sans text-text-muted text-xs uppercase tracking-[0.15em]">
											{stat.label}
										</span>
									</div>
								))}
							</div>
						</AnimateOnScroll>
					</div>

					<AnimateOnScroll
						className="flex flex-wrap items-center justify-between gap-4 border-cream-dark border-t py-4"
						direction="down"
					>
						<form
							action="/products"
							className="flex w-full items-center gap-2 sm:max-w-sm"
							method="get"
						>
							{currentCategory ? (
								<input name="category" type="hidden" value={currentCategory} />
							) : null}
							<input
								aria-label={t("productsPage.searchSubmit")}
								className="h-10 w-full border border-cream-dark bg-white px-3 font-sans text-sm text-text-dark placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
								defaultValue={currentSearch ?? ""}
								name="q"
								placeholder={t("productsPage.searchPlaceholder")}
								type="search"
							/>
							<button
								className="h-10 shrink-0 bg-primary px-4 font-sans font-semibold text-white text-xs uppercase tracking-[0.05em] transition-opacity hover:opacity-90"
								type="submit"
							>
								{t("productsPage.searchSubmit")}
							</button>
						</form>
					</AnimateOnScroll>

					{categories.length > 0 && (
						<AnimateOnScroll
							className="flex flex-wrap items-center gap-0 border-cream-dark border-t"
							direction="down"
						>
							<Link
								className={`border-b-2 px-5 py-3 font-sans font-semibold text-xs uppercase tracking-[0.05em] transition-colors ${
									!currentCategory
										? "border-primary text-primary"
										: "border-transparent text-text-muted hover:text-primary"
								}`}
								href={buildHref(1, undefined, currentSearch)}
							>
								{t("productsPage.filterAll")}
							</Link>
							{categories.map((cat) => (
								<Link
									className={`border-b-2 px-5 py-3 font-sans font-semibold text-xs uppercase tracking-[0.05em] transition-colors ${
										currentCategory === cat
											? "border-primary text-primary"
											: "border-transparent text-text-muted hover:text-primary"
									}`}
									href={buildHref(1, cat, currentSearch)}
									key={cat}
								>
									{cat}
								</Link>
							))}
						</AnimateOnScroll>
					)}
				</div>
			</section>

			<section className="flex-1 px-6 py-12">
				<AnimateOnScroll
					className="mx-auto flex max-w-7xl flex-col gap-6"
					delay={50}
					direction="up"
					scale
				>
					{total > 0 && (
						<div className="flex items-center justify-between">
							<p className="font-sans text-sm text-stone-400">
								{t("productsPage.resultsShowing")}{" "}
								<span className="font-semibold text-stone-700">
									{start}–{end}
								</span>{" "}
								{t("productsPage.resultsOf")}{" "}
								<span className="font-semibold text-stone-700">{total}</span>{" "}
								{t("productsPage.resultsProducts")}
								{currentCategory ? (
									<>
										{" "}
										{t("productsPage.resultsIn")}{" "}
										<span className="font-semibold text-stone-700">
											{currentCategory}
										</span>
									</>
								) : null}
							</p>
							{currentCategory ? (
								<Link
									className="flex items-center gap-1 font-medium font-sans text-primary text-sm transition-opacity hover:opacity-70"
									href="/products"
								>
									<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
										<path
											d="M2 2l8 8M10 2l-8 8"
											stroke="currentColor"
											strokeLinecap="round"
											strokeWidth="1.4"
										/>
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
								<svg fill="none" height="26" viewBox="0 0 26 26" width="26">
									<rect
										height="13"
										rx="1.5"
										stroke="white"
										strokeWidth="1.4"
										width="20"
										x="3"
										y="10"
									/>
									<path
										d="M9 10V7a4 4 0 0 1 8 0v3"
										stroke="white"
										strokeLinecap="round"
										strokeWidth="1.4"
									/>
								</svg>
							</div>
							<p className="font-bold font-serif text-2xl text-stone-800">
								{t("productsPage.emptyTitle")}
							</p>
							<p className="max-w-xs font-sans text-base text-stone-400">
								{currentCategory
									? interpolate(t("productsPage.emptyCategory"), {
											category: currentCategory,
										})
									: SHOW_MULTI_PRODUCER_EXPERIENCE
										? t("productsPage.emptyBodyMulti")
										: t("productsPage.emptyBodySingle", { brand })}
							</p>
							{currentCategory ? (
								<Link
									className="rounded-full bg-primary px-6 py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
									href="/products"
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

					<Pagination
						category={currentCategory}
						currentPage={currentPage}
						search={currentSearch}
						t={t}
						totalPages={totalPages}
					/>
				</AnimateOnScroll>
			</section>

			<Footer />
		</main>
	);
}
