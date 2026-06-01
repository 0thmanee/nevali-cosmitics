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
	if (oneSentence.length > 220) return `${oneSentence.slice(0, 217)}…`;
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
		<>
			<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
				{t("pdp.chooseFormat")}
			</p>
			<div className="mt-3 flex flex-wrap gap-2">
				{variants.map((v) => {
					const isSel = selectedId === v.id;
					return (
						<button
							className={`border px-4 py-2.5 font-sans text-sm transition-colors ${
								!v.inStock
									? "cursor-not-allowed border-cream-dark/50 text-text-muted/50 line-through"
									: isSel
										? "border-text-dark bg-text-dark text-cream"
										: "border-cream-dark bg-paper text-text-dark hover:border-text-dark/50"
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
		</>
	);
}

function BuyBlock({
	product,
	selected,
	selectedId,
	setSelectedId,
	qty,
	setQty,
	canBuy,
	minQty,
	maxQty,
	totalPrice,
	anyInStock,
	justAdded,
	handleAddToCart,
	setModal,
	paymentCopy,
	formatMad,
	imgIndex,
	setImgIndex,
	galleryImages,
	lead,
}: {
	product: PublicProductDetail;
	selected: ReturnType<typeof pickDefaultPublicVariant>;
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
	qty: number;
	setQty: React.Dispatch<React.SetStateAction<number>>;
	canBuy: boolean;
	minQty: number;
	maxQty: number;
	totalPrice: string | null;
	anyInStock: boolean;
	justAdded: boolean;
	handleAddToCart: () => void;
	setModal: (m: "cart" | "b2b" | null) => void;
	paymentCopy: string | null;
	formatMad: (amount: string | null | undefined) => string;
	imgIndex: number;
	setImgIndex: React.Dispatch<React.SetStateAction<number>>;
	galleryImages: {
		id: string;
		url: string;
		sortOrder: number;
		variantId: string | null;
	}[];
	lead: string | null;
}) {
	const { t } = useI18n();
	return (
		<section
			className="flex flex-col justify-center border-cream-dark border-t bg-paper px-5 py-10 sm:px-8 sm:py-12 lg:border-t-0 lg:border-l lg:px-10 lg:py-14 xl:px-14"
			id="order"
		>
			<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.28em]">
				{product.category}
				{product.capacity ? ` · ${product.capacity}` : null}
			</p>
			<h1 className="mt-3 font-semibold font-serif text-[clamp(1.75rem,4vw,2.75rem)] text-text-dark leading-[1.08] tracking-tight">
				{product.name}
			</h1>

			<div className="mt-5 flex flex-col gap-4 border-cream-dark border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
				<ProductPdpReviewTeaser productId={product.id} />
				<SaveProductControl productId={product.id} />
			</div>

			{lead ? (
				<p className="mt-6 font-sans text-base text-text-dark/85 leading-relaxed">
					{lead}
				</p>
			) : (
				<p className="mt-6 font-sans text-sm text-text-muted leading-relaxed">
					{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
						<>
							{interpolate(t("pdp.fallbackListedBy"), {
								organizationName: product.organizationName,
							})}
							{product.variants.length > 1
								? t("pdp.fallbackChooseFormat")
								: t("pdp.fallbackGuestCheckout")}
						</>
					) : (
						<>
							{interpolate(t("pdp.fallbackFromBrand"), {
								brand: NEVALI_HOUSE_BRAND.legalName,
							})}
							{product.variants.length > 1
								? t("pdp.fallbackChooseFormat")
								: t("pdp.fallbackGuestCheckout")}
						</>
					)}
				</p>
			)}

			<div className="mt-6 flex flex-wrap gap-2">
				{paymentCopy ? (
					<span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider">
						{paymentCopy}
					</span>
				) : null}
				<span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider">
					{t("pdp.verifiedListing")}
				</span>
				<span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider">
					{t("pdp.secureCheckout")}
				</span>
			</div>

			<div className="mt-8 border-cream-dark border-t pt-8">
				{selected ? (
					<div>
						<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span className="font-semibold font-serif text-3xl sm:text-4xl">
								{formatMad(selected.price)}
							</span>
							<span className="font-sans text-sm text-text-muted">
								{interpolate(t("pdp.pricePerMin"), {
									unit: selected.unit,
									min: selected.minOrderQuantity,
								})}
							</span>
						</div>
						{selected.minOrderNote && /[a-zA-Z]/.test(selected.minOrderNote) ? (
							<p className="mt-2 font-sans text-text-muted text-xs">
								{selected.minOrderNote}
							</p>
						) : null}
						{totalPrice && qty > 1 ? (
							<p className="mt-2 font-sans text-sm text-text-muted">
								{interpolate(t("pdp.subtotalLine"), { qty })}
								<span className="text-text-dark">{totalPrice}</span>
							</p>
						) : null}
					</div>
				) : null}

				{canBuy ? (
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<span className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
							{t("pdp.quantity")}
						</span>
						<div className="flex items-center border border-cream-dark bg-paper">
							<button
								className="flex h-10 w-10 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
								disabled={qty <= minQty}
								onClick={() => setQty((q) => Math.max(minQty, q - 1))}
								type="button"
							>
								−
							</button>
							<input
								className="h-10 w-14 border-cream-dark border-x bg-transparent text-center font-sans text-sm focus:outline-none"
								max={maxQty}
								min={minQty}
								onChange={(e) => {
									const n = Number(e.target.value);
									if (!Number.isFinite(n)) return;
									setQty(Math.min(maxQty, Math.max(minQty, Math.floor(n))));
								}}
								type="number"
								value={qty}
							/>
							<button
								className="flex h-10 w-10 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
								disabled={qty >= maxQty}
								onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
								type="button"
							>
								+
							</button>
						</div>
						{selected?.unit ? (
							<span className="font-sans text-sm text-text-muted">
								{selected.unit}
							</span>
						) : null}
					</div>
				) : null}

				<div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
					<button
						className={`flex-1 px-6 py-4 font-sans font-semibold text-sm uppercase tracking-wide transition-colors ${
							justAdded && canBuy
								? "border border-cream-dark bg-cream text-text-dark"
								: "bg-text-dark text-cream hover:opacity-90"
						}`}
						disabled={!!canBuy && justAdded}
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
						className="border border-cream-dark bg-paper px-6 py-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-wide transition hover:bg-cream sm:min-w-[200px]"
						onClick={() => setModal("b2b")}
						type="button"
					>
						{t("pdp.wholesaleInquiry")}
					</button>
				</div>

				<p className="mt-5 max-w-md font-sans text-text-muted text-xs leading-relaxed">
					{t("pdp.wholesaleFooterLead")}{" "}
					{SHOW_MULTI_PRODUCER_EXPERIENCE
						? "The studio is notified by email."
						: NEVALI_HOUSE_BRAND.wholesaleNotify}
				</p>
			</div>

			{galleryImages.length > 1 ? (
				<div className="mt-10 lg:hidden">
					<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
						{t("pdp.photos")}
					</p>
					<div
						aria-label={t("pdp.ariaProductPhotos")}
						className="mt-3 flex gap-2 overflow-x-auto pb-1"
						role="tablist"
					>
						{galleryImages.map((img, i) => (
							<button
								aria-selected={i === imgIndex}
								className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${
									i === imgIndex
										? "border-text-dark"
										: "border-cream-dark opacity-70 hover:opacity-100"
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
				</div>
			) : null}
		</section>
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
		const id = defaultV?.id ?? null;
		setSelectedId(id);
	}, [defaultV?.id, product.id]);

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
		const t = window.setTimeout(() => setJustAdded(false), 2600);
		return () => window.clearTimeout(t);
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
	const canBuy = selected && selected.inStock;
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

	const paymentCopy = product.paymentOption
		? paymentLabel(product.paymentOption)
		: null;
	const mosaicImages = product.images;
	const hasMultipleFormats = product.variants.length > 1;

	const filteredJumpLinks = useMemo(() => {
		const links = [
			{ href: "#order" as const, label: t("pdp.jumpShop") },
			{ href: "#trust" as const, label: t("pdp.jumpTrust") },
			{ href: "#gallery" as const, label: t("pdp.jumpGallery") },
			{ href: "#formula" as const, label: t("pdp.jumpFormula") },
			{ href: "#certs" as const, label: t("pdp.jumpCerts") },
			{ href: "#story" as const, label: t("pdp.jumpStory") },
			{ href: "#packaging" as const, label: t("pdp.jumpPackaging") },
			{ href: "#reviews" as const, label: t("pdp.jumpReviews") },
		];
		let out = [...links];
		if (mosaicImages.length === 0)
			out = out.filter((l) => l.href !== "#gallery");
		if (product.certifications.length === 0)
			out = out.filter((l) => l.href !== "#certs");
		if (!hasMultipleFormats) out = out.filter((l) => l.href !== "#packaging");
		return out;
	}, [
		mosaicImages.length,
		product.certifications.length,
		hasMultipleFormats,
		t,
	]);

	return (
		<>
			<article className="bg-cream pb-28 text-text-dark">
				<nav
					aria-label={t("pdp.ariaJumpNav")}
					className="sticky top-14 z-30 border-cream-dark border-b bg-paper/95 backdrop-blur-sm"
				>
					<div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2.5 sm:gap-3 sm:px-6">
						{filteredJumpLinks.map((l) => (
							<a
								className="shrink-0 whitespace-nowrap font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.18em] transition hover:text-text-dark"
								href={l.href}
								key={l.href}
							>
								{l.label}
							</a>
						))}
					</div>
				</nav>

				<header className="border-cream-dark border-b bg-paper">
					<div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
						<nav
							aria-label={t("pdp.ariaBreadcrumb")}
							className="font-sans text-[11px] text-text-muted"
						>
							{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
								<>
									<Link className="hover:text-text-dark" href="/artisans">
										{t("pdp.breadArtisans")}
									</Link>
									<span className="mx-1.5 text-cream-dark">/</span>
									<Link
										className="hover:text-text-dark"
										href={`/artisans/${product.organizationSlug}`}
									>
										{product.organizationName}
									</Link>
									<span className="mx-1.5 text-cream-dark">/</span>
									<span className="text-text-dark">{product.name}</span>
								</>
							) : (
								<>
									<Link className="hover:text-text-dark" href="/products">
										{t("pdp.breadShop")}
									</Link>
									<span className="mx-1.5 text-cream-dark">/</span>
									<Link
										className="hover:text-text-dark"
										href={`/artisans/${PLATFORM_OWNED_ORG_SLUG}`}
									>
										{NEVALI_HOUSE_BRAND.legalName}
									</Link>
									<span className="mx-1.5 text-cream-dark">/</span>
									<span className="text-text-dark">{product.name}</span>
								</>
							)}
						</nav>
					</div>
				</header>

				{/* Landing hero — media + commerce */}
				<div className="border-cream-dark border-b bg-paper">
					{hasMultipleFormats ? (
						<div className="border-cream-dark border-b bg-paper px-4 py-5 sm:px-8 lg:px-10">
							<div className="mx-auto max-w-[1600px]">
								<VariantFormatChips
									selectedId={selectedId}
									setSelectedId={setSelectedId}
									variants={product.variants}
								/>
							</div>
						</div>
					) : null}
					<div className="mx-auto grid max-w-[1600px] lg:min-h-[min(88vh,920px)] lg:grid-cols-2">
						<div className="relative min-h-[min(52vh,520px)] w-full overflow-hidden bg-cream lg:min-h-0">
							{selected ? (
								<p className="absolute top-4 left-4 z-10 font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
									{selected.inStock ? t("pdp.inStock") : t("pdp.unavailable")}
								</p>
							) : null}
							{galleryImages.length > 1 ? (
								<>
									<button
										aria-label={t("pdp.prevImage")}
										className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
										onClick={() =>
											setImgIndex(
												(i) =>
													(i - 1 + galleryImages.length) % galleryImages.length,
											)
										}
										type="button"
									>
										<span className="sr-only">{t("pdp.prev")}</span>
										<svg
											aria-hidden
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
										className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
										onClick={() =>
											setImgIndex((i) => (i + 1) % galleryImages.length)
										}
										type="button"
									>
										<span className="sr-only">{t("pdp.next")}</span>
										<svg
											aria-hidden
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
							<Image
								alt={product.name}
								className="object-cover object-center"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 50vw"
								src={heroImageSrc}
							/>
							{mainImage?.variantId ? (
								<p className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider">
									<span className="border border-cream-dark bg-paper/95 px-3 py-1">
										{interpolate(t("pdp.formatChip"), {
											name:
												variantNameById.get(mainImage.variantId) ??
												t("pdp.variantFallback"),
										})}
									</span>
								</p>
							) : null}
							{galleryImages.length > 1 ? (
								<div className="absolute right-0 bottom-0 left-0 hidden border-cream-dark/80 border-t bg-paper/90 px-3 py-3 lg:block">
									<div className="mx-auto flex max-w-xl justify-center gap-2 overflow-x-auto">
										{galleryImages.map((img, i) => (
											<button
												aria-current={i === imgIndex}
												aria-label={interpolate(t("pdp.photoN"), { n: i + 1 })}
												className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
													i === imgIndex
														? "border-text-dark"
														: "border-transparent opacity-75 hover:opacity-100"
												}`}
												key={img.id}
												onClick={() => setImgIndex(i)}
												type="button"
											>
												<Image
													alt=""
													className="object-cover"
													fill
													sizes="64px"
													src={img.url}
												/>
											</button>
										))}
									</div>
								</div>
							) : null}
						</div>

						<div className="lg:sticky lg:top-14 lg:max-h-screen lg:overflow-y-auto">
							<BuyBlock
								anyInStock={anyInStock}
								canBuy={!!canBuy}
								formatMad={formatMad}
								galleryImages={galleryImages}
								handleAddToCart={handleAddToCart}
								imgIndex={imgIndex}
								justAdded={justAdded}
								lead={lead}
								maxQty={maxQty}
								minQty={minQty}
								paymentCopy={paymentCopy}
								product={product}
								qty={qty}
								selected={selected}
								selectedId={selectedId}
								setImgIndex={setImgIndex}
								setModal={setModal}
								setQty={setQty}
								setSelectedId={setSelectedId}
								totalPrice={totalPrice}
							/>
						</div>
					</div>
				</div>

				{/* Trust strip */}
				<section
					className="scroll-mt-32 border-cream-dark border-b bg-cream"
					id="trust"
				>
					<div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-14">
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

				{/* Full-width visual gallery */}
				{mosaicImages.length > 0 ? (
					<section
						className="scroll-mt-32 border-cream-dark border-b bg-paper"
						id="gallery"
					>
						<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
							<h2 className="font-semibold font-serif text-2xl text-text-dark sm:text-3xl">
								{t("pdp.visualReference")}
							</h2>
							<p className="mt-2 max-w-2xl font-sans text-sm text-text-muted leading-relaxed">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("pdp.galleryIntroMulti")
									: NEVALI_HOUSE_BRAND.galleryCredit}
							</p>
							<div
								className={`mt-10 grid gap-2 sm:gap-3 ${
									mosaicImages.length >= 4
										? "grid-cols-2 md:grid-cols-4"
										: mosaicImages.length === 3
											? "grid-cols-2 md:grid-cols-3"
											: mosaicImages.length === 2
												? "grid-cols-2"
												: "grid-cols-1"
								}`}
							>
								{mosaicImages.map((img, i) => (
									<div
										className="relative aspect-3/4 overflow-hidden border border-cream-dark bg-cream sm:aspect-square"
										key={img.id}
									>
										<Image
											alt={interpolate(t("pdp.imageAltPhoto"), {
												name: product.name,
												n: i + 1,
											})}
											className="object-cover object-center"
											fill
											sizes="(max-width: 768px) 50vw, 25vw"
											src={img.url}
										/>
									</div>
								))}
							</div>
						</div>
					</section>
				) : null}

				{/* Formula & facts */}
				<section
					className="scroll-mt-32 border-cream-dark border-b bg-cream"
					id="formula"
				>
					<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
						<h2 className="font-semibold font-serif text-2xl text-text-dark sm:text-3xl">
							{t("pdp.formulaTitle")}
						</h2>
						<p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
							{t("pdp.formulaIntro")}
						</p>

						<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="border border-cream-dark bg-paper p-5">
								<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
									{t("pdp.category")}
								</p>
								<p className="mt-2 font-serif text-lg text-text-dark">
									{product.category}
								</p>
								{cosmeticsLabel ? (
									<p className="mt-1 font-sans text-sm text-text-muted">
										{cosmeticsLabel}
									</p>
								) : null}
							</div>
							<div className="border border-cream-dark bg-paper p-5">
								<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
									{t("pdp.capacity")}
								</p>
								<p className="mt-2 font-serif text-lg text-text-dark">
									{product.capacity?.trim()
										? product.capacity
										: t("pdp.onRequest")}
								</p>
							</div>
							<div className="border border-cream-dark bg-paper p-5">
								<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
									{t("pdp.minimumOrder")}
								</p>
								<p className="mt-2 font-serif text-lg text-text-dark">
									{product.moq?.trim()
										? product.moq
										: selected
											? publicVariantOrderHint(selected)
											: hasMultipleFormats
												? t("pdp.seeFormatsSection")
												: t("pdp.dash")}
								</p>
							</div>
							<div className="border border-cream-dark bg-paper p-5">
								<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.2em]">
									{t("pdp.payment")}
								</p>
								<p className="mt-2 font-serif text-lg text-text-dark">
									{paymentCopy ?? t("pdp.asSetAtApproval")}
								</p>
							</div>
						</div>

						{skinCodes.length > 0 ? (
							<div className="mt-12">
								<h3 className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
									{t("pdp.skinTypes")}
								</h3>
								<div className="mt-4 flex flex-wrap gap-2">
									{skinCodes.map((code) => (
										<span
											className="border border-cream-dark bg-paper px-3 py-1.5 font-medium font-sans text-text-dark text-xs"
											key={code}
										>
											{skinTypeDisplayLabel(code)}
										</span>
									))}
								</div>
							</div>
						) : null}

						{ingredientList.length > 0 ? (
							<div className="mt-12">
								<h3 className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.22em]">
									{t("pdp.keyIngredients")}
								</h3>
								<div className="mt-4 flex flex-wrap gap-2">
									{ingredientList.map((ing) => (
										<span
											className="border border-cream-dark bg-paper px-2.5 py-1 font-sans text-[11px] text-text-dark leading-snug"
											key={ing}
										>
											{ing}
										</span>
									))}
								</div>
								<p className="mt-4 max-w-2xl font-sans text-text-muted text-xs leading-relaxed">
									{SHOW_MULTI_PRODUCER_EXPERIENCE
										? t("pdp.ingredientsNoteMulti")
										: NEVALI_HOUSE_BRAND.ingredientsNote}
								</p>
							</div>
						) : null}
					</div>
				</section>

				{/* Certificates — only when approved docs exist */}
				{product.certifications.length > 0 ? (
					<section
						className="scroll-mt-32 border-cream-dark border-b bg-paper"
						id="certs"
					>
						<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
							<h2 className="font-semibold font-serif text-2xl text-text-dark sm:text-3xl">
								{t("pdp.certsSectionTitle")}
							</h2>
							<p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("pdp.certsSectionIntroMulti")
									: NEVALI_HOUSE_BRAND.certsIntro}
							</p>
							<ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{product.certifications.map((c) => (
									<li
										className="flex flex-col border border-cream-dark bg-cream/30 p-5 transition hover:bg-cream/50"
										key={c.id}
									>
										<p className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-[0.18em]">
											{c.kind === "product"
												? t("pdp.certThisProduct")
												: SHOW_MULTI_PRODUCER_EXPERIENCE
													? t("pdp.certPartnerScope")
													: NEVALI_HOUSE_BRAND.certStudioBadge}
										</p>
										<p className="mt-2 font-semibold font-serif text-lg text-text-dark leading-snug">
											{c.name}
										</p>
										<a
											className="mt-4 inline-flex w-fit font-sans font-semibold text-text-dark text-xs uppercase tracking-wide underline underline-offset-4"
											href={c.fileUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											{t("pdp.openDocument")}
										</a>
									</li>
								))}
							</ul>
						</div>
					</section>
				) : null}

				{/* Story + highlights */}
				<section
					className="scroll-mt-32 border-cream-dark border-b bg-cream"
					id="story"
				>
					<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<h2 className="font-semibold font-serif text-2xl text-text-dark">
									{t("pdp.whyFormula")}
								</h2>
								{storyBullets.length > 0 ? (
									<ul className="mt-8 space-y-4 font-sans text-sm text-text-dark/90 leading-relaxed">
										{storyBullets.map((b) => (
											<li className="border-text-dark border-l-2 pl-4" key={b}>
												{b}
											</li>
										))}
									</ul>
								) : (
									<ul className="mt-8 space-y-4 font-sans text-sm text-text-dark/90 leading-relaxed">
										{[
											t("pdp.bulletFormatsMoq"),
											SHOW_MULTI_PRODUCER_EXPERIENCE
												? t("pdp.bulletProducerLinked")
												: NEVALI_HOUSE_BRAND.profileBullet,
											t("pdp.bulletCheckout"),
										].map((b) => (
											<li className="border-text-dark border-l-2 pl-4" key={b}>
												{b}
											</li>
										))}
									</ul>
								)}
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

								<div className="mt-12 grid gap-6 border border-cream-dark bg-paper p-8 sm:grid-cols-[1fr_auto] sm:items-center">
									<div className="flex gap-4">
										{product.organizationLogo ? (
											<div className="relative h-16 w-16 shrink-0 overflow-hidden border border-cream-dark bg-cream">
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
												{SHOW_MULTI_PRODUCER_EXPERIENCE
													? product.organizationName
													: NEVALI_HOUSE_BRAND.legalName}
											</p>
										</div>
									</div>
									<Link
										className="inline-flex w-fit items-center justify-center border border-cream-dark bg-cream px-5 py-2.5 font-sans font-semibold text-text-dark text-xs uppercase tracking-wide transition hover:bg-paper"
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

				{/* Formats & pricing table — only when more than one variant */}
				{hasMultipleFormats ? (
					<section className="scroll-mt-32 bg-paper" id="packaging">
						<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
							<h2 className="font-semibold font-serif text-2xl text-text-dark">
								{t("pdp.formatsPricingTitle")}
							</h2>
							<p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
								{t("pdp.formatsPricingIntro")}
							</p>
							<div className="mt-10 overflow-x-auto border border-cream-dark">
								<table className="w-full min-w-[560px] text-left font-sans text-sm">
									<thead>
										<tr className="border-cream-dark border-b bg-cream font-semibold text-[10px] text-text-muted uppercase tracking-wider">
											<th className="px-4 py-3 font-medium">
												{t("pdp.tablePackaging")}
											</th>
											<th className="px-4 py-3 font-medium">
												{t("pdp.tableUnit")}
											</th>
											<th className="px-4 py-3 font-medium">
												{t("pdp.tablePrice")}
											</th>
											<th className="px-4 py-3 font-medium">
												{t("pdp.tableMinimum")}
											</th>
											<th className="px-4 py-3 font-medium">
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

							<div className="mx-auto mt-12 max-w-xl border-cream-dark border-t pt-8">
								<details className="group border-cream-dark border-b py-4">
									<summary className="cursor-pointer list-none font-medium font-sans text-sm text-text-dark [&::-webkit-details-marker]:hidden">
										<span className="flex justify-between gap-4">
											{t("pdp.paymentDetails")}
											<span className="text-text-muted transition-transform group-open:rotate-45">
												+
											</span>
										</span>
									</summary>
									<div className="mt-3 font-sans text-sm text-text-muted leading-relaxed">
										{paymentCopy ? (
											<p>{paymentCopy}.</p>
										) : (
											<p>{t("pdp.paymentDetailsBody")}</p>
										)}
										<p className="mt-2">{t("pdp.totalsConfirmedLine")}</p>
									</div>
								</details>
								<details className="group py-4">
									<summary className="cursor-pointer list-none font-medium font-sans text-sm text-text-dark [&::-webkit-details-marker]:hidden">
										<span className="flex justify-between gap-4">
											{t("pdp.shipping")}
											<span className="text-text-muted transition-transform group-open:rotate-45">
												+
											</span>
										</span>
									</summary>
									<div className="mt-3 font-sans text-sm text-text-muted leading-relaxed">
										<p>{t("pdp.shippingBody")}</p>
									</div>
								</details>
							</div>
						</div>
					</section>
				) : null}

				{/* Reviews */}
				<section
					className="scroll-mt-32 border-cream-dark border-t bg-cream"
					id="reviews"
				>
					<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
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
							<div className="border border-cream-dark bg-paper p-6">
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

				<div className="border-cream-dark border-t bg-paper">
					<div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
				</div>
			</article>

			{/* Always-visible order bar */}
			<div
				aria-label={t("pdp.stickyOrderRegion")}
				className="fixed inset-x-0 bottom-0 z-40 border-cream-dark border-t bg-paper pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]"
				role="region"
			>
				<div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
					<div className="min-w-0 flex-1">
						<p className="truncate font-sans font-semibold text-[10px] text-text-muted uppercase tracking-wider">
							{product.name}
						</p>
						<div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
							{product.variants.length > 1 ? (
								<select
									aria-label={t("pdp.formatAria")}
									className="max-w-[140px] truncate border border-cream-dark bg-paper py-1 pr-6 pl-2 font-sans text-[11px] text-text-dark sm:max-w-[200px]"
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
						className="shrink-0 bg-text-dark px-4 py-2.5 font-sans font-semibold text-[11px] text-cream uppercase tracking-wider sm:px-6 sm:text-xs"
						onClick={handleAddToCart}
						type="button"
					>
						{anyInStock ? t("pdp.addToCart") : t("pdp.inquire")}
					</button>
					<button
						className="hidden shrink-0 border border-cream-dark bg-paper px-3 py-2.5 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-wider sm:inline-block sm:text-xs"
						onClick={() => setModal("b2b")}
						type="button"
					>
						{t("pdp.wholesaleShort")}
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
