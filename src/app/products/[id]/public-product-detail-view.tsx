"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PublicProductDetail } from "~/app/api/products/schemas/products.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { ProductInquiryModal } from "~/components/product-inquiry-modal";
import { ProductPdpReviewTeaser } from "~/components/product-pdp-review-teaser";
import { ProductReviewForm } from "~/components/product-review-form";
import { ProductReviewsList } from "~/components/product-reviews-list";
import { SaveProductControl } from "~/components/save-product-control";
import { useCart } from "~/features/cart/cart-context";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { interpolate } from "~/lib/i18n/interpolate";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import {
	PLATFORM_OWNED_ORG_SLUG,
	SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";
import {
	getCategoryGradient,
	orderedImagesForPublicVariant,
	pickDefaultPublicVariant,
	publicVariantOrderHint,
} from "~/lib/public-product-helpers";
import {
	cosmeticsCategoryLabel,
	parseIngredientList,
	parseSkinTypeCodes,
	skinTypeDisplayLabel,
} from "~/lib/public-product-pdp-helpers";

type Props = { product: PublicProductDetail };

function descriptionLead(description: string | null): string | null {
	if (!description?.trim()) return null;
	const t = description.trim();
	const firstLine =
		t
			.split(/\r?\n/)
			.find((l) => l.trim().length > 0)
			?.trim() ?? t;
	const oneSentence = firstLine.split(/(?<=[.!?])\s+/)[0]?.trim() ?? firstLine;
	if (oneSentence.length > 240) return `${oneSentence.slice(0, 237)}…`;
	return oneSentence;
}

function descriptionBodyParagraphs(description: string | null): string[] {
	if (!description?.trim()) return [];
	return description
		.trim()
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
}

function descriptionBulletCandidates(description: string | null): string[] {
	const paras = descriptionBodyParagraphs(description);
	if (paras.length === 0) return [];
	const rest = paras.slice(1);
	const bullets: string[] = [];
	for (const p of rest) {
		const lines = p
			.split(/\n/)
			.map((l) => l.replace(/^[-•*]\s*/, "").trim())
			.filter((l) => l.length > 8 && l.length < 200);
		bullets.push(...lines);
	}
	const dedup = [...new Set(bullets)];
	return dedup.slice(0, 6);
}

/** A small check glyph used in the reassurance row. */
function CheckIcon() {
	return (
		<svg
			aria-hidden="true"
			className="mt-0.5 shrink-0 text-forest-mid"
			fill="none"
			height="14"
			viewBox="0 0 16 16"
			width="14"
		>
			<path
				d="M3.5 8.5l3 3 6-7"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

/** Vertical, collapsible content section (Baymard: beats horizontal tabs). */
function Accordion({
	title,
	defaultOpen = false,
	children,
}: {
	title: React.ReactNode;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	return (
		<details className="group border-cream-dark/70 border-b" open={defaultOpen}>
			<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-sans font-semibold text-sm text-text-dark [&::-webkit-details-marker]:hidden">
				{title}
				<span
					aria-hidden="true"
					className="text-lg text-text-muted leading-none transition-transform group-open:rotate-45"
				>
					+
				</span>
			</summary>
			<div className="pb-5 font-sans text-sm text-text-muted leading-relaxed">
				{children}
			</div>
		</details>
	);
}

/** Size / format selector shown as pills above price (and in the order box). */
function VariantFormatChips({
	variants,
	selectedId,
	setSelectedId,
}: {
	variants: PublicProductDetail["variants"];
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
}) {
	const { t } = useI18n();
	if (variants.length <= 1) return null;
	return (
		<div>
			<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
				{t("pdp.chooseFormat")}
			</p>
			<div className="mt-3 flex flex-wrap gap-2">
				{variants.map((v) => {
					const isSel = selectedId === v.id;
					return (
						<button
							className={`rounded-full border px-4 py-2 font-medium font-sans text-sm transition-colors ${
								!v.inStock
									? "cursor-not-allowed border-cream-dark/50 text-text-muted/50 line-through"
									: isSel
										? "border-text-dark bg-text-dark text-cream"
										: "border-cream-dark bg-paper text-text-dark hover:border-text-dark/60"
							}`}
							disabled={!v.inStock}
							key={v.id}
							onClick={() => setSelectedId(v.id)}
							type="button"
						>
							{v.name}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export function PublicProductDetailView({ product }: Props) {
	const { t } = useI18n();
	const { formatMad, paymentLabel } = useFormatPrice();
	const gradient = getCategoryGradient(product.category);
	const { addLine } = useCart();
	const [selectedId, setSelectedId] = useState<string | null>(
		() => pickDefaultPublicVariant(product.variants)?.id ?? null,
	);
	const [qty, setQty] = useState(1);
	const [imgIndex, setImgIndex] = useState(0);
	const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
	const [justAdded, setJustAdded] = useState(false);
	const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

	const defaultV = useMemo(
		() => pickDefaultPublicVariant(product.variants),
		[product.variants],
	);

	useEffect(() => {
		setSelectedId(defaultV?.id ?? null);
	}, [defaultV?.id]);

	const selected = useMemo(() => {
		if (!selectedId) return null;
		return product.variants.find((v) => v.id === selectedId) ?? null;
	}, [product.variants, selectedId]);

	useEffect(() => {
		if (!selected) return;
		setQty((q) => Math.max(selected.minOrderQuantity, q));
	}, [selected]);

	useEffect(() => {
		if (!justAdded) return;
		const id = window.setTimeout(() => setJustAdded(false), 2600);
		return () => window.clearTimeout(id);
	}, [justAdded]);

	const variantNameById = useMemo(() => {
		const m = new Map<string, string>();
		for (const v of product.variants) m.set(v.id, v.name);
		return m;
	}, [product.variants]);

	const validVariantIds = useMemo(
		() => new Set(product.variants.map((v) => v.id)),
		[product.variants],
	);

	const galleryImages = useMemo(
		() =>
			orderedImagesForPublicVariant(product.images, selectedId, {
				validVariantIds,
			}),
		[product.images, selectedId, validVariantIds],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset the gallery to the first photo whenever the variant changes.
	useEffect(() => {
		setImgIndex(0);
	}, [selectedId]);

	useEffect(() => {
		setImgIndex((i) =>
			galleryImages.length === 0 ? 0 : Math.min(i, galleryImages.length - 1),
		);
	}, [galleryImages.length]);

	const mainImage = galleryImages[imgIndex] ?? galleryImages[0];
	const placeholderHero = useMemo(
		() => productPlaceholderImageUrl(`${product.id}:${product.category}`, 1400),
		[product.id, product.category],
	);
	const heroImageSrc = mainImage?.url ?? placeholderHero;
	const canBuy = !!selected?.inStock;
	const maxQty =
		selected && selected.quantityOnHand > 0
			? Math.min(999, selected.quantityOnHand)
			: 999;
	const minQty = selected ? Math.max(1, selected.minOrderQuantity) : 1;
	const anyInStock = product.variants.some((v) => v.inStock);

	const totalPrice = useMemo(() => {
		if (!selected || !qty) return null;
		const priceNum = Number(selected.price.replace(",", "."));
		if (!Number.isFinite(priceNum) || priceNum === 0) return null;
		return formatMad((priceNum * qty).toFixed(2));
	}, [selected, qty, formatMad]);

	const lead = useMemo(
		() => descriptionLead(product.description),
		[product.description],
	);
	const storyParagraphs = useMemo(
		() => descriptionBodyParagraphs(product.description),
		[product.description],
	);
	const storyBullets = useMemo(
		() => descriptionBulletCandidates(product.description),
		[product.description],
	);

	const ingredientList = useMemo(
		() => parseIngredientList(product.ingredients),
		[product.ingredients],
	);
	const skinCodes = useMemo(
		() => parseSkinTypeCodes(product.skinTypes),
		[product.skinTypes],
	);
	const cosmeticsLabel = useMemo(
		() => cosmeticsCategoryLabel(product.cosmeticsCategory),
		[product.cosmeticsCategory],
	);

	const paymentCopy = product.paymentOption
		? paymentLabel(product.paymentOption)
		: null;
	const hasMultipleFormats = product.variants.length > 1;
	const brandName = SHOW_MULTI_PRODUCER_EXPERIENCE
		? product.organizationName
		: NEVALI_HOUSE_BRAND.legalName;

	const modalProduct = {
		id: product.id,
		name: product.name,
		category: product.category,
		organizationName: product.organizationName,
		organizationId: product.organizationId,
		firstImageUrl: heroImageSrc,
		gradient,
		orderHint: selected
			? publicVariantOrderHint(selected)
			: defaultV
				? publicVariantOrderHint(defaultV)
				: null,
	};

	function handleAddToCart() {
		if (!selected || !canBuy) {
			setModal("cart");
			return;
		}
		const q = Math.min(maxQty, Math.max(minQty, qty));
		addLine({
			productId: product.id,
			productVariantId: selected.id,
			variantName: selected.name,
			organizationId: product.organizationId,
			organizationName: product.organizationName,
			name: product.name,
			category: product.category,
			price: selected.price,
			unit: selected.unit,
			minOrderQuantity: selected.minOrderQuantity,
			minOrderNote: selected.minOrderNote,
			firstImageUrl: heroImageSrc,
			paymentOption: product.paymentOption,
			quantity: q,
		});
		setJustAdded(true);
	}

	return (
		<>
			<article className="bg-paper pb-28 text-text-dark lg:pb-20">
				{/* Breadcrumb */}
				<div className="border-cream-dark/70 border-b">
					<div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
						<nav
							aria-label={t("pdp.ariaBreadcrumb")}
							className="flex flex-wrap items-center gap-1.5 font-sans text-[11px] text-text-muted"
						>
							{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
								<>
									<Link className="hover:text-text-dark" href="/artisans">
										{t("pdp.breadArtisans")}
									</Link>
									<span className="text-cream-dark">/</span>
									<Link
										className="hover:text-text-dark"
										href={`/artisans/${product.organizationSlug}`}
									>
										{product.organizationName}
									</Link>
								</>
							) : (
								<>
									<Link className="hover:text-text-dark" href="/products">
										{t("pdp.breadShop")}
									</Link>
									<span className="text-cream-dark">/</span>
									<Link
										className="hover:text-text-dark"
										href={`/artisans/${PLATFORM_OWNED_ORG_SLUG}`}
									>
										{NEVALI_HOUSE_BRAND.legalName}
									</Link>
								</>
							)}
							<span className="text-cream-dark">/</span>
							<span className="text-text-dark">{product.name}</span>
						</nav>
					</div>
				</div>

				{/* Hero — gallery + sticky order column */}
				<div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
						{/* Gallery */}
						<div id="gallery">
							<div className="flex flex-col-reverse gap-3 lg:flex-row">
								{galleryImages.length > 1 ? (
									<div
										aria-label={t("pdp.ariaProductPhotos")}
										className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0"
										role="tablist"
									>
										{galleryImages.map((img, i) => (
											<button
												aria-label={interpolate(t("pdp.photoN"), { n: i + 1 })}
												aria-selected={i === imgIndex}
												className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors lg:h-20 lg:w-20 ${
													i === imgIndex
														? "border-text-dark"
														: "border-cream-dark/60 opacity-70 hover:opacity-100"
												}`}
												key={img.id}
												onClick={() => setImgIndex(i)}
												role="tab"
												type="button"
											>
												<Image
													alt=""
													className="object-cover"
													fill
													sizes="80px"
													src={img.url}
												/>
											</button>
										))}
									</div>
								) : null}

								<div className="relative aspect-square w-full flex-1 overflow-hidden rounded-sm border border-cream-dark/60 bg-cream">
									{selected ? (
										<span
											className={`absolute top-4 z-10 rounded-full px-2.5 py-1 font-sans font-semibold text-[10px] uppercase tracking-wider ${
												selected.inStock
													? "bg-forest-mid/10 text-forest-mid"
													: "bg-cream-dark/40 text-text-muted"
											}`}
											style={{ insetInlineStart: "1rem" }}
										>
											{selected.inStock
												? t("pdp.inStock")
												: t("pdp.unavailable")}
										</span>
									) : null}

									<Image
										alt={product.name}
										className="object-cover object-center"
										fill
										priority
										sizes="(max-width: 1024px) 100vw, 45vw"
										src={heroImageSrc}
									/>

									{mainImage?.variantId ? (
										<span
											className="absolute bottom-4 z-10 rounded-full border border-cream-dark bg-paper/95 px-3 py-1 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider"
											style={{ insetInlineStart: "1rem" }}
										>
											{interpolate(t("pdp.formatChip"), {
												name:
													variantNameById.get(mainImage.variantId) ??
													t("pdp.variantFallback"),
											})}
										</span>
									) : null}

									{galleryImages.length > 1 ? (
										<>
											<button
												aria-label={t("pdp.prevImage")}
												className="absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
												onClick={() =>
													setImgIndex(
														(i) =>
															(i - 1 + galleryImages.length) %
															galleryImages.length,
													)
												}
												style={{ insetInlineStart: "0.75rem" }}
												type="button"
											>
												<svg
													aria-hidden="true"
													className="rtl:-scale-x-100"
													fill="none"
													height="16"
													viewBox="0 0 14 14"
													width="16"
												>
													<path
														d="M9 3L5 7l4 4"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="1.5"
													/>
												</svg>
											</button>
											<button
												aria-label={t("pdp.nextImage")}
												className="absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
												onClick={() =>
													setImgIndex((i) => (i + 1) % galleryImages.length)
												}
												style={{ insetInlineEnd: "0.75rem" }}
												type="button"
											>
												<svg
													aria-hidden="true"
													className="rtl:-scale-x-100"
													fill="none"
													height="16"
													viewBox="0 0 14 14"
													width="16"
												>
													<path
														d="M5 3l4 4-4 4"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="1.5"
													/>
												</svg>
											</button>
										</>
									) : null}
								</div>
							</div>
						</div>

						{/* Order column */}
						<div className="lg:sticky lg:top-[84px] lg:self-start" id="order">
							<Link
								className="font-sans font-semibold text-[11px] text-text-muted uppercase tracking-[0.22em] transition hover:text-text-dark"
								href={`/artisans/${product.organizationSlug}`}
							>
								{brandName}
							</Link>

							<h1 className="mt-2 font-semibold font-serif text-[clamp(1.75rem,3.5vw,2.6rem)] text-text-dark leading-[1.1] tracking-tight">
								{product.name}
							</h1>

							{cosmeticsLabel || product.capacity ? (
								<p className="mt-2 font-sans text-sm text-text-muted">
									{[cosmeticsLabel, product.capacity?.trim()]
										.filter(Boolean)
										.join(" · ")}
								</p>
							) : null}

							<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-cream-dark/70 border-b pb-5">
								<ProductPdpReviewTeaser productId={product.id} />
								<SaveProductControl productId={product.id} />
							</div>

							{lead ? (
								<p className="mt-5 font-sans text-base text-text-dark/85 leading-relaxed">
									{lead}
								</p>
							) : null}

							{/* Price */}
							{selected ? (
								<div className="mt-6">
									<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
										<span className="font-semibold font-serif text-3xl text-text-dark sm:text-4xl">
											{formatMad(selected.price)}
										</span>
										<span className="font-sans text-sm text-text-muted">
											{interpolate(t("pdp.pricePerMin"), {
												unit: selected.unit,
												min: selected.minOrderQuantity,
											})}
										</span>
									</div>
									{selected.minOrderNote ? (
										<p className="mt-1.5 font-sans text-text-muted text-xs">
											{selected.minOrderNote}
										</p>
									) : null}
								</div>
							) : null}

							{/* Size selector */}
							{hasMultipleFormats ? (
								<div className="mt-6">
									<VariantFormatChips
										selectedId={selectedId}
										setSelectedId={setSelectedId}
										variants={product.variants}
									/>
								</div>
							) : null}

							{/* Quantity */}
							{canBuy ? (
								<div className="mt-6 flex flex-wrap items-center gap-4">
									<span className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
										{t("pdp.quantity")}
									</span>
									<div className="flex items-center rounded-sm border border-cream-dark bg-paper">
										<button
											className="flex h-11 w-11 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
											disabled={qty <= minQty}
											onClick={() => setQty((q) => Math.max(minQty, q - 1))}
											type="button"
										>
											−
										</button>
										<input
											className="h-11 w-14 border-cream-dark border-x bg-transparent text-center font-sans text-sm focus:outline-none"
											max={maxQty}
											min={minQty}
											onChange={(e) => {
												const n = Number(e.target.value);
												if (!Number.isFinite(n)) return;
												setQty(
													Math.min(maxQty, Math.max(minQty, Math.floor(n))),
												);
											}}
											type="number"
											value={qty}
										/>
										<button
											className="flex h-11 w-11 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
											disabled={qty >= maxQty}
											onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
											type="button"
										>
											+
										</button>
									</div>
									{totalPrice && qty > 1 ? (
										<span className="font-sans text-sm text-text-muted">
											{interpolate(t("pdp.subtotalLine"), { qty })}
											<span className="font-semibold text-text-dark">
												{totalPrice}
											</span>
										</span>
									) : null}
								</div>
							) : null}

							{/* CTAs */}
							<div className="mt-7 flex flex-col gap-3 sm:flex-row">
								<button
									className={`flex-1 rounded-sm px-6 py-4 font-sans font-semibold text-sm uppercase tracking-wide transition-colors ${
										justAdded && canBuy
											? "border border-cream-dark bg-cream text-text-dark"
											: "bg-text-dark text-cream hover:opacity-90"
									}`}
									disabled={canBuy && justAdded}
									onClick={handleAddToCart}
									type="button"
								>
									{justAdded && canBuy
										? t("pdp.addedToCart")
										: anyInStock
											? t("pdp.addToCart")
											: t("pdp.requestAvailability")}
								</button>
								<button
									className="rounded-sm border border-cream-dark bg-paper px-6 py-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-wide transition hover:bg-cream sm:min-w-[180px]"
									onClick={() => setModal("b2b")}
									type="button"
								>
									{t("pdp.wholesaleInquiry")}
								</button>
							</div>

							{/* Reassurance */}
							<ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
								{[
									paymentCopy ?? t("pdp.securePaymentTitle"),
									t("pdp.verifiedListing"),
									t("pdp.secureCheckout"),
									t("pdp.realPhotoTitle"),
								].map((item) => (
									<li
										className="flex items-start gap-2 font-sans text-text-muted text-xs leading-snug"
										key={item}
									>
										<CheckIcon />
										<span>{item}</span>
									</li>
								))}
							</ul>

							{/* Accordions */}
							<div className="mt-8 border-cream-dark/70 border-t">
								{ingredientList.length > 0 || skinCodes.length > 0 ? (
									<Accordion defaultOpen title={t("pdp.keyIngredients")}>
										{skinCodes.length > 0 ? (
											<div className="mb-4">
												<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
													{t("pdp.skinTypes")}
												</p>
												<div className="mt-2 flex flex-wrap gap-2">
													{skinCodes.map((code) => (
														<span
															className="rounded-full border border-cream-dark bg-paper px-3 py-1 font-medium font-sans text-text-dark text-xs"
															key={code}
														>
															{skinTypeDisplayLabel(code)}
														</span>
													))}
												</div>
											</div>
										) : null}
										{ingredientList.length > 0 ? (
											<>
												<div className="flex flex-wrap gap-2">
													{ingredientList.map((ing) => (
														<span
															className="rounded-full border border-cream-dark bg-paper px-2.5 py-1 font-sans text-[11px] text-text-dark leading-snug"
															key={ing}
														>
															{ing}
														</span>
													))}
												</div>
												<p className="mt-3 text-text-muted text-xs leading-relaxed">
													{SHOW_MULTI_PRODUCER_EXPERIENCE
														? t("pdp.ingredientsNoteMulti")
														: NEVALI_HOUSE_BRAND.ingredientsNote}
												</p>
											</>
										) : null}
									</Accordion>
								) : null}

								<Accordion title={t("pdp.formulaTitle")}>
									<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
										<div>
											<dt className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
												{t("pdp.category")}
											</dt>
											<dd className="mt-1 font-serif text-text-dark">
												{cosmeticsLabel ?? product.category}
											</dd>
										</div>
										<div>
											<dt className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
												{t("pdp.capacity")}
											</dt>
											<dd className="mt-1 font-serif text-text-dark">
												{product.capacity?.trim()
													? product.capacity
													: t("pdp.onRequest")}
											</dd>
										</div>
										<div>
											<dt className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
												{t("pdp.minimumOrder")}
											</dt>
											<dd className="mt-1 font-serif text-text-dark">
												{product.moq?.trim()
													? product.moq
													: selected
														? publicVariantOrderHint(selected)
														: t("pdp.dash")}
											</dd>
										</div>
										<div>
											<dt className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
												{t("pdp.payment")}
											</dt>
											<dd className="mt-1 font-serif text-text-dark">
												{paymentCopy ?? t("pdp.asSetAtApproval")}
											</dd>
										</div>
									</dl>
								</Accordion>

								{product.certifications.length > 0 ? (
									<Accordion title={t("pdp.certsSectionTitle")}>
										<ul className="space-y-3">
											{product.certifications.map((c) => (
												<li
													className="flex items-center justify-between gap-3"
													key={c.id}
												>
													<div>
														<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.16em]">
															{c.kind === "product"
																? t("pdp.certThisProduct")
																: SHOW_MULTI_PRODUCER_EXPERIENCE
																	? t("pdp.certPartnerScope")
																	: NEVALI_HOUSE_BRAND.certStudioBadge}
														</p>
														<p className="mt-0.5 font-serif text-sm text-text-dark">
															{c.name}
														</p>
													</div>
													<a
														className="shrink-0 font-sans font-semibold text-text-dark text-xs uppercase tracking-wide underline underline-offset-4"
														href={c.fileUrl}
														rel="noopener noreferrer"
														target="_blank"
													>
														{t("pdp.openDocument")}
													</a>
												</li>
											))}
										</ul>
									</Accordion>
								) : null}

								<Accordion title={t("pdp.paymentDetails")}>
									{paymentCopy ? <p>{paymentCopy}.</p> : null}
									<p className={paymentCopy ? "mt-2" : undefined}>
										{t("pdp.totalsConfirmedLine")}
									</p>
								</Accordion>

								<Accordion title={t("pdp.shipping")}>
									<p>{t("pdp.shippingBody")}</p>
								</Accordion>
							</div>

							<p className="mt-6 font-sans text-text-muted text-xs leading-relaxed">
								{t("pdp.wholesaleFooterLead")}{" "}
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? "The studio is notified by email."
									: NEVALI_HOUSE_BRAND.wholesaleNotify}
							</p>
						</div>
					</div>
				</div>

				{/* Benefits band */}
				<section
					className="mt-16 scroll-mt-24 border-cream-dark/70 border-y bg-cream lg:mt-24"
					id="trust"
				>
					<div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8 lg:py-16">
						<div>
							<p className="font-semibold font-serif text-lg text-text-dark">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("pdp.trustVerifiedPartner")
									: NEVALI_HOUSE_BRAND.verifiedHeadline}
							</p>
							<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("pdp.trustListingApprovedMulti")
									: NEVALI_HOUSE_BRAND.verifiedBody}
							</p>
						</div>
						<div>
							<p className="font-semibold font-serif text-lg text-text-dark">
								{t("pdp.securePaymentTitle")}
							</p>
							<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
								{paymentCopy ?? t("pdp.paymentWhenApproved")}
								{t("pdp.paymentTotalsSuffix")}
							</p>
						</div>
						<div>
							<p className="font-semibold font-serif text-lg text-text-dark">
								{t("pdp.realPhotoTitle")}
							</p>
							<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
								{t("pdp.realPhotoBody")}
							</p>
						</div>
						<div>
							<p className="font-semibold font-serif text-lg text-text-dark">
								{t("pdp.certsOnFileTitle")}
							</p>
							<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
								{product.certifications.length > 0
									? product.certifications.length === 1
										? interpolate(t("pdp.certsCount"), {
												count: product.certifications.length,
											})
										: interpolate(t("pdp.certsCountPlural"), {
												count: product.certifications.length,
											})
									: SHOW_MULTI_PRODUCER_EXPERIENCE
										? t("pdp.certsAskProducer")
										: interpolate(t("pdp.certsAskBrand"), {
												brand: NEVALI_HOUSE_BRAND.legalName,
											})}
							</p>
						</div>
					</div>
				</section>

				{/* Story + brand */}
				<section
					className="scroll-mt-24 border-cream-dark/70 border-b bg-paper"
					id="story"
				>
					<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<h2 className="font-semibold font-serif text-2xl text-text-dark">
									{t("pdp.whyFormula")}
								</h2>
								<ul className="mt-8 space-y-4 font-sans text-sm text-text-dark/90 leading-relaxed">
									{(storyBullets.length > 0
										? storyBullets
										: [
												t("pdp.bulletFormatsMoq"),
												SHOW_MULTI_PRODUCER_EXPERIENCE
													? t("pdp.bulletProducerLinked")
													: NEVALI_HOUSE_BRAND.profileBullet,
												t("pdp.bulletCheckout"),
											]
									).map((b) => (
										<li className="border-text-dark border-s-2 ps-4" key={b}>
											{b}
										</li>
									))}
								</ul>
							</div>

							<div className="lg:col-span-8">
								<h2 className="font-semibold font-serif text-2xl text-text-dark">
									{t("pdp.fullDescription")}
								</h2>
								{storyParagraphs.length > 0 ? (
									<div className="mt-8 space-y-6 font-sans text-base text-text-dark/90 leading-[1.75]">
										{storyParagraphs.map((p, i) => (
											<p className="whitespace-pre-wrap" key={i}>
												{p}
											</p>
										))}
									</div>
								) : (
									<p className="mt-8 font-sans text-sm text-text-muted leading-relaxed">
										{SHOW_MULTI_PRODUCER_EXPERIENCE
											? t("pdp.emptyLongFormMulti")
											: NEVALI_HOUSE_BRAND.emptyLongDescription}
									</p>
								)}

								<div className="mt-12 grid gap-6 rounded-sm border border-cream-dark bg-cream/40 p-8 sm:grid-cols-[1fr_auto] sm:items-center">
									<div className="flex gap-4">
										{product.organizationLogo ? (
											<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-cream-dark bg-paper">
												<Image
													alt=""
													className="object-contain object-center p-1"
													fill
													sizes="64px"
													src={product.organizationLogo}
												/>
											</div>
										) : null}
										<div>
											<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
												{SHOW_MULTI_PRODUCER_EXPERIENCE
													? t("pdp.craftedBy")
													: t("pdp.madeBy")}
											</p>
											<p className="mt-1 font-semibold font-serif text-text-dark text-xl">
												{brandName}
											</p>
										</div>
									</div>
									<Link
										className="inline-flex w-fit items-center justify-center rounded-sm border border-cream-dark bg-paper px-5 py-2.5 font-sans font-semibold text-text-dark text-xs uppercase tracking-wide transition hover:bg-cream"
										href={`/artisans/${product.organizationSlug}`}
									>
										{SHOW_MULTI_PRODUCER_EXPERIENCE
											? "View studio"
											: NEVALI_HOUSE_BRAND.viewBrandCta}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Formats & pricing */}
				{hasMultipleFormats ? (
					<section
						className="scroll-mt-24 border-cream-dark/70 border-b bg-cream"
						id="packaging"
					>
						<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
							<h2 className="font-semibold font-serif text-2xl text-text-dark">
								{t("pdp.formatsPricingTitle")}
							</h2>
							<p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
								{t("pdp.formatsPricingIntro")}
							</p>
							<div className="mt-10 overflow-x-auto rounded-sm border border-cream-dark bg-paper">
								<table className="w-full min-w-[560px] text-start font-sans text-sm">
									<thead>
										<tr className="border-cream-dark border-b bg-cream/60 font-semibold text-[10px] text-text-muted uppercase tracking-wider">
											<th className="px-4 py-3 text-start font-medium">
												{t("pdp.tablePackaging")}
											</th>
											<th className="px-4 py-3 text-start font-medium">
												{t("pdp.tableUnit")}
											</th>
											<th className="px-4 py-3 text-start font-medium">
												{t("pdp.tablePrice")}
											</th>
											<th className="px-4 py-3 text-start font-medium">
												{t("pdp.tableMinimum")}
											</th>
											<th className="px-4 py-3 text-start font-medium">
												{t("pdp.tableStock")}
											</th>
										</tr>
									</thead>
									<tbody>
										{product.variants.map((v) => (
											<tr
												className="border-cream-dark border-b last:border-0"
												key={v.id}
											>
												<td className="px-4 py-3.5 font-medium text-text-dark">
													{v.name}
												</td>
												<td className="px-4 py-3.5 text-text-muted">
													{v.unit}
												</td>
												<td className="px-4 py-3.5 text-text-dark">
													{formatMad(v.price)}
												</td>
												<td className="max-w-[220px] px-4 py-3.5 text-text-muted text-xs">
													{publicVariantOrderHint(v)}
												</td>
												<td className="px-4 py-3.5 text-text-muted text-xs">
													{!v.inStock
														? t("pdp.stockOut")
														: v.quantityOnHand > 0
															? interpolate(t("pdp.stockUnits"), {
																	count: v.quantityOnHand,
																})
															: t("pdp.stockAvailable")}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				) : null}

				{/* Reviews */}
				<section
					className="scroll-mt-24 border-cream-dark/70 border-b bg-paper"
					id="reviews"
				>
					<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
						<h2 className="font-semibold font-serif text-2xl text-text-dark">
							{t("pdp.reviewsTitle")}
						</h2>
						<p className="mt-2 max-w-lg font-sans text-sm text-text-muted">
							{t("pdp.reviewsSubtitle")}
						</p>
						<div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
							<div className="lg:col-span-2">
								<ProductReviewsList
									key={reviewRefreshKey}
									productId={product.id}
								/>
							</div>
							<div className="rounded-sm border border-cream-dark bg-cream/40 p-6">
								<h3 className="font-semibold font-serif text-lg text-text-dark">
									{t("pdp.submitReview")}
								</h3>
								<p className="mt-2 font-sans text-text-muted text-xs leading-relaxed">
									{t("pdp.submitReviewEmailNote")}
								</p>
								<div className="mt-5">
									<ProductReviewForm
										onSuccess={() => setReviewRefreshKey((k) => k + 1)}
										productId={product.id}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
					<button
						className="w-fit font-sans font-semibold text-text-muted text-xs uppercase tracking-wide hover:text-text-dark"
						onClick={() =>
							document
								.getElementById("order")
								?.scrollIntoView({ behavior: "smooth" })
						}
						type="button"
					>
						{t("pdp.backToShopBlock")}
					</button>
					<Link
						className="w-fit font-sans font-semibold text-text-muted text-xs uppercase tracking-wide hover:text-text-dark"
						href="/products"
					>
						{t("pdp.allProducts")}
					</Link>
				</div>
			</article>

			{/* Mobile sticky order bar */}
			<div
				aria-label={t("pdp.stickyOrderRegion")}
				className="fixed inset-x-0 bottom-0 z-40 border-cream-dark border-t bg-paper/95 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden"
				role="region"
			>
				<div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
					<div className="min-w-0 flex-1">
						<p className="truncate font-sans font-semibold text-[10px] text-text-muted uppercase tracking-wider">
							{product.name}
						</p>
						<div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
							{hasMultipleFormats ? (
								<select
									aria-label={t("pdp.formatAria")}
									className="max-w-[140px] truncate rounded-sm border border-cream-dark bg-paper py-1 ps-2 pe-6 font-sans text-[11px] text-text-dark sm:max-w-[200px]"
									onChange={(e) => setSelectedId(e.target.value || null)}
									value={selectedId ?? ""}
								>
									{product.variants.map((v) => (
										<option disabled={!v.inStock} key={v.id} value={v.id}>
											{v.name}
										</option>
									))}
								</select>
							) : null}
							{selected ? (
								<span className="font-semibold font-serif text-base sm:text-lg">
									{formatMad(selected.price)}
								</span>
							) : (
								<span className="font-sans text-text-muted text-xs">
									{t("pdp.selectFormat")}
								</span>
							)}
						</div>
					</div>
					<button
						className="shrink-0 rounded-sm bg-text-dark px-5 py-3 font-sans font-semibold text-[11px] text-cream uppercase tracking-wider sm:text-xs"
						onClick={handleAddToCart}
						type="button"
					>
						{anyInStock ? t("pdp.addToCart") : t("pdp.inquire")}
					</button>
				</div>
			</div>

			{modal ? (
				<ProductInquiryModal
					mode={modal}
					onClose={() => setModal(null)}
					product={modalProduct}
				/>
			) : null}
		</>
	);
}
