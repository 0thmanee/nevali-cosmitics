"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PublicProductImage } from "~/app/api/products/schemas/products.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { ProductInquiryModal } from "~/components/product-inquiry-modal";
import type { PublicProduct } from "~/components/public-product-types";
import { useCart } from "~/features/cart/cart-context";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { interpolate } from "~/lib/i18n/interpolate";
import {
	getCategoryGradient,
	orderedImagesForPublicVariant,
	pickDefaultPublicVariant,
	publicVariantOrderHint,
} from "~/lib/public-product-helpers";

export type { PublicProduct } from "~/components/public-product-types";

export function PublicProductCard({ product }: { product: PublicProduct }) {
	const { t } = useI18n();
	const { formatMad } = useFormatPrice();
	const gradient = getCategoryGradient(product.category);
	const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
	const [justAdded, setJustAdded] = useState(false);
	const [qty, setQty] = useState(1);
	const [slide, setSlide] = useState(0);
	const { addLine } = useCart();

	const defaultV = useMemo(
		() => pickDefaultPublicVariant(product.variants),
		[product.variants],
	);
	const [selectedId, setSelectedId] = useState<string | null>(
		defaultV?.id ?? null,
	);

	useEffect(() => {
		setSelectedId(defaultV?.id ?? null);
	}, [defaultV?.id, product.id]);

	const selected = useMemo(() => {
		if (!selectedId) return null;
		return product.variants.find((v) => v.id === selectedId) ?? null;
	}, [product.variants, selectedId]);

	const normalizedImages = useMemo((): PublicProductImage[] => {
		if (product.images?.length) return product.images;
		if (product.firstImageUrl) {
			return [
				{
					id: `legacy-${product.id}`,
					url: product.firstImageUrl,
					sortOrder: 0,
					variantId: null,
				},
			];
		}
		return [];
	}, [product.images, product.firstImageUrl, product.id]);

	const validVariantIds = useMemo(
		() => new Set(product.variants.map((v) => v.id)),
		[product.variants],
	);

	const gallery = useMemo(
		() =>
			orderedImagesForPublicVariant(normalizedImages, selectedId, {
				validVariantIds,
			}),
		[normalizedImages, selectedId, validVariantIds],
	);

	useEffect(() => {
		setSlide(0);
	}, [selectedId]);

	useEffect(() => {
		setSlide((s) =>
			gallery.length === 0 ? 0 : Math.min(s, gallery.length - 1),
		);
	}, [gallery.length]);

	const activeImage = gallery[slide] ?? gallery[0];
	const displayImageUrl = activeImage?.url ?? null;
	const fallbackImageUrl = useMemo(
		() => productPlaceholderImageUrl(`${product.id}:${product.category}`, 900),
		[product.id, product.category],
	);
	const resolvedImageUrl = displayImageUrl ?? fallbackImageUrl;

	const minQty = useMemo(
		() => (selected ? Math.max(1, selected.minOrderQuantity) : 1),
		[selected],
	);
	const maxQty = useMemo(() => {
		if (!selected) return 999;
		return selected.quantityOnHand > 0
			? Math.min(999, selected.quantityOnHand)
			: 999;
	}, [selected]);

	useEffect(() => {
		if (!selected?.inStock) return;
		setQty((q) => Math.min(maxQty, Math.max(minQty, q)));
	}, [selected, minQty, maxQty]);

	const canAddVariant = selected && selected.inStock;
	const hasAnyVariant = product.variants.length > 0;
	const fromPrice = useMemo(() => {
		if (product.variants.length === 0) return null;
		const nums = product.variants
			.map((v) => Number(v.price.replace(",", ".")))
			.filter((n) => Number.isFinite(n));
		if (nums.length === 0) return null;
		return Math.min(...nums).toFixed(2);
	}, [product.variants]);

	useEffect(() => {
		if (!justAdded) return;
		const id = window.setTimeout(() => setJustAdded(false), 2600);
		return () => window.clearTimeout(id);
	}, [justAdded]);

	const modalProduct = {
		id: product.id,
		name: product.name,
		category: product.category,
		organizationName: product.organizationName,
		organizationId: product.organizationId,
		firstImageUrl: resolvedImageUrl,
		gradient,
		orderHint: selected
			? publicVariantOrderHint(selected)
			: defaultV
				? publicVariantOrderHint(defaultV)
				: null,
	};

	function handleAddToCart() {
		if (!selected || !canAddVariant) {
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
			firstImageUrl: resolvedImageUrl,
			paymentOption: product.paymentOption,
			quantity: q,
		});
		setJustAdded(true);
	}

	const showBuyCta = hasAnyVariant && product.variants.some((v) => v.inStock);

	return (
		<>
			<article className="group flex flex-col overflow-hidden rounded-sm border border-cream-dark bg-white">
				<div
					className="relative shrink-0 overflow-hidden rounded-t-sm"
					style={{ height: 200 }}
				>
					<Link
						aria-label={interpolate(t("publicProductCard.viewDetailsAria"), {
							name: product.name,
						})}
						className="absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-inset"
						href={`/products/${product.id}`}
					/>
					<div className="pointer-events-none relative z-1 flex h-full items-center justify-center overflow-hidden bg-cream">
						<Image
							alt=""
							className="pointer-events-none object-cover"
							fill
							sizes="(max-width:768px) 100vw, 400px"
							src={resolvedImageUrl}
						/>
					</div>

					{gallery.length > 1 ? (
						<>
							<button
								aria-label={t("publicProductCard.prevPhoto")}
								className="absolute top-1/2 left-1.5 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-white/95 text-text-dark shadow-sm transition-colors hover:border-primary/40 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
								onClick={() =>
									setSlide((s) => (s - 1 + gallery.length) % gallery.length)
								}
								type="button"
							>
								<svg
									aria-hidden
									fill="none"
									height="14"
									viewBox="0 0 14 14"
									width="14"
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
								aria-label={t("publicProductCard.nextPhoto")}
								className="absolute top-1/2 right-1.5 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-white/95 text-text-dark shadow-sm transition-colors hover:border-primary/40 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
								onClick={() => setSlide((s) => (s + 1) % gallery.length)}
								type="button"
							>
								<svg
									aria-hidden
									fill="none"
									height="14"
									viewBox="0 0 14 14"
									width="14"
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
							<div className="pointer-events-auto absolute right-0 bottom-2 left-0 z-10 flex justify-center gap-1">
								{gallery.map((img, i) => (
									<button
										aria-current={i === slide ? "true" : undefined}
										aria-label={interpolate(
											t("publicProductCard.photoIndexAria"),
											{
												index: i + 1,
												total: gallery.length,
											},
										)}
										className={`h-1.5 rounded-full transition-all ${
											i === slide
												? "w-4 bg-primary shadow-sm"
												: "w-1.5 bg-white/55 hover:bg-white/80"
										}`}
										key={img.id}
										onClick={() => setSlide(i)}
										type="button"
									/>
								))}
							</div>
						</>
					) : null}

					<div
						className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold font-sans text-[9px] tracking-widest"
						style={{
							background:
								"color-mix(in srgb, var(--color-primary) 17%, transparent)",
							color: "var(--color-primary-dark)",
							border:
								"1px solid color-mix(in srgb, var(--color-primary) 35%, transparent)",
						}}
					>
						<span
							className="inline-block h-1.5 w-1.5 rounded-full"
							style={{ background: "var(--color-primary-dark)" }}
						/>
						{t("publicProductCard.certifiedBadge")}
					</div>
					<div
						className="pointer-events-none absolute top-3 right-3 z-10 max-w-[120px] truncate rounded-full px-2.5 py-1 font-bold font-sans text-[9px] tracking-widest"
						style={{
							background:
								"color-mix(in srgb, var(--color-paper) 75%, transparent)",
							color: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-ink) 8%, transparent)",
						}}
					>
						{product.category.toUpperCase()}
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-3 p-4">
					<Link
						className="-mx-1 flex flex-col gap-0.5 rounded-sm px-1 py-0.5 transition-colors hover:bg-cream/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2"
						href={`/products/${product.id}`}
					>
						<h3 className="line-clamp-2 font-bold font-serif text-[15px] text-text-dark leading-snug transition-colors group-hover:text-forest-mid">
							{product.name}
						</h3>
						<p className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-text-muted">
							<svg
								className="shrink-0"
								fill="none"
								height="10"
								viewBox="0 0 11 11"
								width="10"
							>
								<circle
									cx="5.5"
									cy="3.8"
									r="2"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
								<path
									d="M1.5 9.5c0-2.21 1.79-4 4-4s4 1.79 4 4"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth="1.2"
								/>
							</svg>
							<span className="truncate">{product.organizationName}</span>
						</p>
					</Link>

					{hasAnyVariant ? (
						<div className="relative z-10 flex flex-col gap-2">
							{product.variants.length > 1 ? (
								<select
									className="w-full rounded-sm border border-cream-dark bg-cream/40 px-2.5 py-2 font-medium text-[12px] text-text-dark focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25"
									onChange={(e) => setSelectedId(e.target.value || null)}
									value={selectedId ?? ""}
								>
									{product.variants.map((v) => (
										<option disabled={!v.inStock} key={v.id} value={v.id}>
											{v.name}
											{!v.inStock ? ` ${t("common.outOfStockParen")}` : ""} —{" "}
											{formatMad(v.price)}
										</option>
									))}
								</select>
							) : null}

							<div className="flex items-center justify-between">
								{selected ? (
									<span className="font-bold font-serif text-[15px] text-text-dark">
										{formatMad(selected.price)}
										{product.variants.length === 1 && (
											<span className="ml-1.5 font-normal font-sans text-[11px] text-text-muted">
												· {selected.name}
											</span>
										)}
									</span>
								) : fromPrice ? (
									<span className="font-bold font-serif text-[15px] text-text-dark">
										{interpolate(t("publicProductCard.fromPrice"), {
											price: formatMad(fromPrice),
										})}
									</span>
								) : null}
								{selected ? (
									<span className="font-sans text-[10px] text-text-muted">
										{publicVariantOrderHint(selected)}
									</span>
								) : null}
							</div>
						</div>
					) : (
						<span className="font-sans text-[11px] text-text-muted">
							{t("common.contactForPricing")}
						</span>
					)}

					<div className="relative z-10 mt-auto flex flex-col gap-2">
						{showBuyCta && selected?.inStock ? (
							<div className="flex items-center gap-1.5">
								<button
									aria-label={t("publicProductCard.decreaseQty")}
									className="h-8 w-8 shrink-0 rounded-sm border border-cream-dark bg-white font-sans font-semibold text-base text-text-dark transition-colors hover:border-primary/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
									disabled={qty <= minQty}
									onClick={() => setQty((q) => Math.max(minQty, q - 1))}
									type="button"
								>
									−
								</button>
								<input
									className="h-8 w-10 shrink-0 rounded-sm border border-cream-dark bg-cream/40 px-1 text-center font-sans font-semibold text-sm text-text-dark [appearance:textfield] focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									id={`card-qty-${product.id}`}
									inputMode="numeric"
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
									aria-label={t("publicProductCard.increaseQty")}
									className="h-8 w-8 shrink-0 rounded-sm border border-cream-dark bg-white font-sans font-semibold text-base text-text-dark transition-colors hover:border-primary/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
									disabled={qty >= maxQty}
									onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
									type="button"
								>
									+
								</button>
								<button
									className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-sm font-sans font-semibold text-[13px] shadow-sm transition-opacity disabled:cursor-default ${
										justAdded
											? "border border-primary/35 bg-cream text-primary-dark"
											: "text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2"
									}`}
									disabled={justAdded}
									onClick={handleAddToCart}
									style={
										justAdded
											? undefined
											: { background: "var(--color-primary)" }
									}
									type="button"
								>
									{justAdded ? (
										<>
											<svg
												aria-hidden
												fill="none"
												height="13"
												viewBox="0 0 14 14"
												width="13"
											>
												<path
													d="M3 7l3 3 5-6"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="1.6"
												/>
											</svg>
											{t("publicProductCard.added")}
										</>
									) : (
										<>
											<svg
												aria-hidden
												fill="none"
												height="13"
												viewBox="0 0 14 14"
												width="13"
											>
												<path
													d="M1 1h2l1.5 7h6l1.5-4.5H4"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="1.4"
												/>
												<circle cx="6" cy="12" fill="currentColor" r="0.8" />
												<circle cx="11" cy="12" fill="currentColor" r="0.8" />
											</svg>
											{t("publicProductCard.addToCart")}
										</>
									)}
								</button>
							</div>
						) : (
							<button
								className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 font-sans font-semibold text-sm text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
								onClick={handleAddToCart}
								type="button"
							>
								{t("publicProductCard.requestPricing")}
							</button>
						)}
						<span aria-live="polite" className="sr-only">
							{justAdded && showBuyCta
								? t("publicProductCard.addedToCartLive")
								: ""}
						</span>
						<button
							className="rounded-sm py-1 text-center font-medium font-sans text-[11px] text-text-muted transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
							onClick={() => setModal("b2b")}
							type="button"
						>
							{t("publicProductCard.wholesaleInquiryCta")}
						</button>
					</div>
				</div>
			</article>

			{modal && (
				<ProductInquiryModal
					mode={modal}
					onClose={() => setModal(null)}
					product={modalProduct}
				/>
			)}
		</>
	);
}
