"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductInquiryModal } from "~/components/product-inquiry-modal";
import { formatPriceMad } from "~/lib/format-price";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import {
	getCategoryGradient,
	orderedImagesForPublicVariant,
	pickDefaultPublicVariant,
	publicVariantOrderHint,
} from "~/lib/public-product-helpers";
import { useCart } from "~/features/cart/cart-context";
import type { PublicProductImage } from "~/app/api/products/schemas/products.schema";
import type { PublicProduct } from "~/components/public-product-types";

export type { PublicProduct } from "~/components/public-product-types";

export function PublicProductCard({ product }: { product: PublicProduct }) {
	const gradient = getCategoryGradient(product.category);
	const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
	const [justAdded, setJustAdded] = useState(false);
	const [qty, setQty] = useState(1);
	const [slide, setSlide] = useState(0);
	const { addLine } = useCart();

	const defaultV = useMemo(() => pickDefaultPublicVariant(product.variants), [product.variants]);
	const [selectedId, setSelectedId] = useState<string | null>(defaultV?.id ?? null);

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
		setSlide((s) => (gallery.length === 0 ? 0 : Math.min(s, gallery.length - 1)));
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
		return selected.quantityOnHand > 0 ? Math.min(999, selected.quantityOnHand) : 999;
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
		const t = window.setTimeout(() => setJustAdded(false), 2600);
		return () => window.clearTimeout(t);
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
				<div className="relative shrink-0 overflow-hidden rounded-t-sm" style={{ height: 200 }}>
					<Link
						href={`/products/${product.id}`}
						className="absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/45 focus-visible:ring-inset"
						aria-label={`View details: ${product.name}`}
					/>
					<div className="pointer-events-none relative z-[1] flex h-full items-center justify-center overflow-hidden bg-cream">
						<Image
							src={resolvedImageUrl}
							alt=""
							fill
							className="pointer-events-none object-cover"
							sizes="(max-width:768px) 100vw, 400px"
						/>
					</div>

					{gallery.length > 1 ? (
						<>
							<button
								type="button"
								aria-label="Previous photo"
								onClick={() => setSlide((s) => (s - 1 + gallery.length) % gallery.length)}
								className="absolute top-1/2 left-1.5 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-white/95 text-text-dark shadow-sm transition-colors hover:border-[#000000]/40 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/35"
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
									<path
										d="M9 3L5 7l4 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<button
								type="button"
								aria-label="Next photo"
								onClick={() => setSlide((s) => (s + 1) % gallery.length)}
								className="absolute top-1/2 right-1.5 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cream-dark bg-white/95 text-text-dark shadow-sm transition-colors hover:border-[#000000]/40 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/35"
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
									<path
										d="M5 3l4 4-4 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<div className="pointer-events-auto absolute right-0 bottom-2 left-0 z-10 flex justify-center gap-1">
								{gallery.map((img, i) => (
									<button
										key={img.id}
										type="button"
										aria-label={`Photo ${i + 1} of ${gallery.length}`}
										aria-current={i === slide ? "true" : undefined}
										onClick={() => setSlide(i)}
										className={`h-1.5 rounded-full transition-all ${
											i === slide ? "w-4 bg-[#000000] shadow-sm" : "w-1.5 bg-white/55 hover:bg-white/80"
										}`}
									/>
								))}
							</div>
						</>
					) : null}

					<div
						className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[9px] font-bold tracking-widest"
						style={{
							background: "rgba(0,0,0,0.82)",
							color: "#727272",
							border: "1px solid rgba(114,114,114,0.35)",
						}}
					>
						<span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#727272" }} />
						CERTIFIED
					</div>
					<div
						className="pointer-events-none absolute top-3 right-3 z-10 max-w-[120px] truncate rounded-full px-2.5 py-1 font-sans text-[9px] font-bold tracking-widest"
						style={{
							background: "rgba(255,255,255,0.75)",
							color: "rgba(20,30,22,0.80)",
							border: "1px solid rgba(0,0,0,0.08)",
						}}
					>
						{product.category.toUpperCase()}
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-3 p-4">
					<Link
						href={`/products/${product.id}`}
						className="-mx-1 flex flex-col gap-0.5 rounded-sm px-1 py-0.5 transition-colors hover:bg-cream/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/35 focus-visible:ring-offset-2"
					>
						<h3 className="line-clamp-2 font-serif font-bold text-[15px] leading-snug text-text-dark transition-colors group-hover:text-forest-mid">
							{product.name}
						</h3>
						<p className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-text-muted">
							<svg width="10" height="10" viewBox="0 0 11 11" fill="none" className="shrink-0">
								<circle cx="5.5" cy="3.8" r="2" stroke="currentColor" strokeWidth="1.2" />
								<path
									d="M1.5 9.5c0-2.21 1.79-4 4-4s4 1.79 4 4"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>
							</svg>
							<span className="truncate">{product.organizationName}</span>
						</p>
					</Link>

					{hasAnyVariant ? (
						<div className="relative z-10 flex flex-col gap-2">
							{product.variants.length > 1 ? (
								<select
									value={selectedId ?? ""}
									onChange={(e) => setSelectedId(e.target.value || null)}
									className="w-full rounded-sm border border-cream-dark bg-cream/40 px-2.5 py-2 text-[12px] font-medium text-text-dark focus:border-[#000000]/50 focus:outline-none focus:ring-2 focus:ring-[#000000]/25"
								>
									{product.variants.map((v) => (
										<option key={v.id} value={v.id} disabled={!v.inStock}>
											{v.name} {!v.inStock ? "(out of stock)" : ""} — {formatPriceMad(v.price)}
										</option>
									))}
								</select>
							) : null}

							<div className="flex items-center justify-between">
								{selected ? (
									<span className="font-serif font-bold text-[15px] text-text-dark">
										{formatPriceMad(selected.price)}
										{product.variants.length === 1 && (
											<span className="ml-1.5 font-sans font-normal text-[11px] text-text-muted">
												· {selected.name}
											</span>
										)}
									</span>
								) : fromPrice ? (
									<span className="font-serif font-bold text-[15px] text-text-dark">
										From {formatPriceMad(fromPrice)}
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
						<span className="font-sans text-[11px] text-text-muted">Contact for pricing</span>
					)}

					<div className="relative z-10 mt-auto flex flex-col gap-2">
						{showBuyCta && selected?.inStock ? (
							<div className="flex items-center gap-1.5">
								<button
									type="button"
									aria-label="Decrease quantity"
									disabled={qty <= minQty}
									onClick={() => setQty((q) => Math.max(minQty, q - 1))}
									className="h-8 w-8 shrink-0 rounded-sm border border-cream-dark bg-white font-sans text-base font-semibold text-text-dark transition-colors hover:border-[#000000]/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/30 disabled:cursor-not-allowed disabled:opacity-40"
								>
									−
								</button>
								<input
									id={`card-qty-${product.id}`}
									type="number"
									inputMode="numeric"
									min={minQty}
									max={maxQty}
									value={qty}
									onChange={(e) => {
										const n = Number(e.target.value);
										if (!Number.isFinite(n)) return;
										setQty(Math.min(maxQty, Math.max(minQty, Math.floor(n))));
									}}
									className="h-8 w-10 shrink-0 rounded-sm border border-cream-dark bg-cream/40 px-1 text-center font-sans text-sm font-semibold text-text-dark [appearance:textfield] focus:border-[#000000]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
								<button
									type="button"
									aria-label="Increase quantity"
									disabled={qty >= maxQty}
									onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
									className="h-8 w-8 shrink-0 rounded-sm border border-cream-dark bg-white font-sans text-base font-semibold text-text-dark transition-colors hover:border-[#000000]/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/30 disabled:cursor-not-allowed disabled:opacity-40"
								>
									+
								</button>
								<button
									type="button"
									onClick={handleAddToCart}
									disabled={justAdded}
									className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-sm font-sans text-[13px] font-semibold shadow-sm transition-opacity disabled:cursor-default ${
										justAdded
											? "border border-[#000000]/35 bg-cream text-[#000000]"
											: "text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/55 focus-visible:ring-offset-2"
									}`}
									style={justAdded ? undefined : { background: "#000000" }}
								>
									{justAdded ? (
										<>
											<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
												<path
													d="M3 7l3 3 5-6"
													stroke="currentColor"
													strokeWidth="1.6"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
											Added
										</>
									) : (
										<>
											<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
												<path
													d="M1 1h2l1.5 7h6l1.5-4.5H4"
													stroke="currentColor"
													strokeWidth="1.4"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<circle cx="6" cy="12" r="0.8" fill="currentColor" />
												<circle cx="11" cy="12" r="0.8" fill="currentColor" />
											</svg>
											Add to cart
										</>
									)}
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={handleAddToCart}
								className="flex w-full items-center justify-center gap-2 rounded-sm py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/50 focus-visible:ring-offset-2"
								style={{ background: "#000000" }}
							>
								Request pricing
							</button>
						)}
						<span className="sr-only" aria-live="polite">
							{justAdded && showBuyCta ? "Added to cart" : ""}
						</span>
						<button
							type="button"
							onClick={() => setModal("b2b")}
							className="rounded-sm py-1 text-center font-sans text-[11px] font-medium text-text-muted transition-colors hover:text-[#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/30"
						>
							Wholesale inquiry →
						</button>
					</div>
				</div>
			</article>

			{modal && (
				<ProductInquiryModal mode={modal} onClose={() => setModal(null)} product={modalProduct} />
			)}
		</>
	);
}
