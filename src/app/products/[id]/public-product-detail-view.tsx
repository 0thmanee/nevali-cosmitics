"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductInquiryModal } from "~/components/product-inquiry-modal";
import { SaveProductControl } from "~/components/save-product-control";
import { ProductReviewForm } from "~/components/product-review-form";
import { ProductReviewsList } from "~/components/product-reviews-list";
import type { PublicProductDetail } from "~/app/api/products/schemas/products.schema";
import { useCart } from "~/features/cart/cart-context";
import { formatPriceMad, paymentOptionLabel } from "~/lib/format-price";
import {
  getCategoryGradient,
  orderedImagesForPublicVariant,
  pickDefaultPublicVariant,
  publicVariantOrderHint,
} from "~/lib/public-product-helpers";

type Props = { product: PublicProductDetail };

function ProductIconLarge() {
  return (
    <svg width="64" height="64" viewBox="0 0 36 36" fill="none" className="text-white/60">
      <rect x="3" y="14" width="30" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 14v-3a6 6 0 0 1 12 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="18" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function PublicProductDetailView({ product }: Props) {
  const gradient = getCategoryGradient(product.category);
  const { addLine } = useCart();
  const [selectedId, setSelectedId] = useState<string | null>(
    () => pickDefaultPublicVariant(product.variants)?.id ?? null
  );
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  const defaultV = useMemo(() => pickDefaultPublicVariant(product.variants), [product.variants]);

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
    [product.variants]
  );

  const galleryImages = useMemo(
    () => orderedImagesForPublicVariant(product.images, selectedId, { validVariantIds }),
    [product.images, selectedId, validVariantIds]
  );

  useEffect(() => {
    setImgIndex(0);
  }, [selectedId]);

  useEffect(() => {
    setImgIndex((i) => (galleryImages.length === 0 ? 0 : Math.min(i, galleryImages.length - 1)));
  }, [galleryImages.length]);

  const mainImage = galleryImages[imgIndex] ?? galleryImages[0];
  const canBuy = selected && selected.inStock;
  const maxQty =
    selected && selected.quantityOnHand > 0 ? Math.min(999, selected.quantityOnHand) : 999;
  const minQty = selected ? Math.max(1, selected.minOrderQuantity) : 1;

  const totalPrice = useMemo(() => {
    if (!selected || !qty) return null;
    const priceNum = Number(selected.price.replace(",", "."));
    if (!Number.isFinite(priceNum) || priceNum === 0) return null;
    return formatPriceMad((priceNum * qty).toFixed(2));
  }, [selected, qty]);

  const modalProduct = {
    id: product.id,
    name: product.name,
    category: product.category,
    organizationName: product.organizationName,
    organizationId: product.organizationId,
    firstImageUrl: mainImage?.url ?? null,
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
      firstImageUrl: mainImage?.url ?? null,
      paymentOption: product.paymentOption,
      quantity: q,
    });
    setJustAdded(true);
  }

  return (
    <>
      <div className="bg-cream min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="font-sans text-sm text-text-muted mb-8 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href="/artisans" className="hover:text-text-dark transition-colors">
              Artisans
            </Link>
            <span aria-hidden>/</span>
            <Link
              href={`/artisans/${product.organizationSlug}`}
              className="hover:text-text-dark transition-colors"
            >
              {product.organizationName}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-text-dark font-medium truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Image column */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div
                className="relative w-full overflow-hidden rounded-sm"
                style={{ aspectRatio: "1 / 1.05" }}
              >
                {/* Stock badge */}
                {selected ? (
                  <div className="absolute top-3 left-3 z-10">
                    {selected.inStock ? (
                      <span
                        className="font-sans text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                        style={{ background: "#7B1F0A", color: "#faf5ee" }}
                      >
                        In Stock
                      </span>
                    ) : (
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </div>
                ) : null}

                {/* Gallery prev/next */}
                {galleryImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() =>
                        setImgIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
                      }
                      className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 border border-cream-dark text-text-dark shadow-sm hover:bg-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
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
                      aria-label="Next image"
                      onClick={() => setImgIndex((i) => (i + 1) % galleryImages.length)}
                      className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 border border-cream-dark text-text-dark shadow-sm hover:bg-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path
                          d="M5 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                ) : null}

                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-contain bg-[#FAFAF8]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundImage: gradient }}
                  >
                    <ProductIconLarge />
                  </div>
                )}

                {mainImage?.variantId ? (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                    <span
                      className="font-sans text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(10,40,20,0.85)",
                        color: "#bbf7d0",
                        border: "1px solid rgba(74,222,128,0.3)",
                      }}
                    >
                      {variantNameById.get(mainImage.variantId) ?? "Variant image"}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 ? (
                <div
                  className="flex gap-2 overflow-x-auto pb-1"
                  role="tablist"
                  aria-label="Product photos"
                >
                  {galleryImages.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      role="tab"
                      aria-selected={i === imgIndex}
                      onClick={() => setImgIndex(i)}
                      className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === imgIndex
                          ? "border-forest-dark ring-2 ring-forest-dark/20"
                          : "border-cream-dark opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Product info */}
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-28 flex flex-col gap-5">
                {/* Category · title · producer */}
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase">
                    {product.category}
                    {product.capacity ? (
                      <>
                        {" "}
                        · <span className="font-normal">{product.capacity}</span>
                      </>
                    ) : null}
                  </p>
                  <h1 className="font-serif text-4xl font-bold text-text-dark leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-7 h-7 rounded-full bg-forest-dark flex items-center justify-center text-xs font-bold text-cream shrink-0">
                      {product.organizationName.charAt(0).toUpperCase()}
                    </span>
                    <Link
                      href={`/artisans/${product.organizationSlug}`}
                      className="font-sans text-sm text-text-dark font-medium hover:text-forest-mid transition-colors"
                    >
                      {product.organizationName}
                    </Link>
                    <span className="font-sans text-[10px] font-semibold tracking-wide text-forest-mid border border-forest-mid/40 rounded-full px-2 py-0.5">
                      Verified Partner
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <SaveProductControl productId={product.id} />
                </div>

                <div className="border-t border-cream-dark" />

                {/* Description */}
                {product.description?.trim() ? (
                  <p className="font-sans text-[15px] text-text-dark/80 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                ) : null}

                {/* Price */}
                {selected ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="font-serif text-[32px] font-bold text-text-dark leading-none">
                        {formatPriceMad(selected.price)}
                      </span>
                      <span className="font-sans text-sm text-text-muted">
                        per {selected.unit} · Min. order {selected.minOrderQuantity}{" "}
                        {selected.unit}
                      </span>
                    </div>
                    {selected.minOrderNote && /[a-zA-Z]/.test(selected.minOrderNote) ? (
                      <p className="font-sans text-xs text-forest-mid">{selected.minOrderNote}</p>
                    ) : null}
                  </div>
                ) : null}

                {/* Packaging tabs */}
                {product.variants.length > 1 ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-sans text-[10px] font-bold tracking-[0.14em] text-text-muted uppercase">
                      Packaging
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const isSel = selectedId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={!v.inStock}
                            onClick={() => setSelectedId(v.id)}
                            className={`font-sans text-sm font-medium rounded-xl px-4 py-1.5 border transition-all ${
                              !v.inStock
                                ? "border-cream-dark text-text-muted/40 cursor-not-allowed line-through"
                                : isSel
                                  ? "bg-forest-dark border-forest-dark text-cream"
                                  : "border-cream-dark text-text-dark hover:border-forest-mid/60 bg-white"
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Qty stepper */}
                {canBuy ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      disabled={qty <= minQty}
                      onClick={() => setQty((q) => Math.max(minQty, q - 1))}
                      className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border border-cream-dark bg-white text-text-dark font-bold text-lg hover:bg-cream transition-colors disabled:opacity-40"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={minQty}
                      max={maxQty}
                      value={qty}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (!Number.isFinite(n)) return;
                        setQty(Math.min(maxQty, Math.max(minQty, Math.floor(n))));
                      }}
                      className="w-16 h-10 text-center rounded-xl border border-cream-dark bg-white font-sans font-bold text-text-dark text-base focus:outline-none focus:ring-1 focus:ring-forest-mid"
                    />
                    <button
                      type="button"
                      disabled={qty >= maxQty}
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                      className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border border-cream-dark bg-white text-text-dark font-bold text-lg hover:bg-cream transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                    {selected?.unit ? (
                      <span className="font-sans text-sm text-text-muted">{selected.unit}</span>
                    ) : null}
                    {totalPrice ? (
                      <>
                        <span className="font-sans text-sm text-text-muted">=</span>
                        <span className="font-serif font-bold text-text-dark text-xl">
                          {totalPrice}
                        </span>
                      </>
                    ) : null}
                  </div>
                ) : null}

                {/* CTA buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!!canBuy && justAdded}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-sans font-semibold text-sm transition-all ${
                      justAdded && canBuy
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-white hover:opacity-90"
                    }`}
                    style={justAdded && canBuy ? undefined : { background: "#7B1F0A" }}
                  >
                    {justAdded && canBuy ? (
                      <>Added to cart ✓</>
                    ) : product.variants.some((v) => v.inStock) ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="3"
                            y1="6"
                            x2="21"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16 10a4 4 0 01-8 0"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Add to Cart
                      </>
                    ) : (
                      <>Request availability</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal("b2b")}
                    className="flex items-center justify-center px-5 py-3.5 rounded-xl border border-cream-dark bg-white font-sans font-semibold text-sm text-text-dark hover:border-forest-mid/60 hover:bg-cream transition-all"
                  >
                    Request Quote
                  </button>
                </div>

                {/* Payment info */}
                {product.paymentOption ? (
                  <p className="font-sans text-xs text-text-muted">
                    Payment: {paymentOptionLabel(product.paymentOption)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* White details section */}
      <div className="bg-white border-t border-cream-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-xl font-bold text-text-dark mb-4">
                About this product
              </h2>
              {product.description?.trim() ? (
                <div className="font-sans text-[15px] text-text-dark/90 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              ) : (
                <p className="font-sans text-text-muted text-sm leading-relaxed">
                  This listing is offered by {product.organizationName}. Choose a packaging option
                  above for price and minimum order details, or request a B2B quote for volume and
                  specifications.
                </p>
              )}
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-serif text-xl font-bold text-text-dark mb-4">
                All packaging &amp; pricing
              </h2>
              <div className="overflow-hidden rounded-sm border border-cream-dark">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm min-w-[520px]">
                    <thead>
                      <tr className="bg-cream/60 border-b border-cream-dark text-[11px] uppercase tracking-wide text-text-muted">
                        <th className="px-4 py-3 font-bold">Packaging</th>
                        <th className="px-4 py-3 font-bold">Unit</th>
                        <th className="px-4 py-3 font-bold">Price</th>
                        <th className="px-4 py-3 font-bold">Minimum order</th>
                        <th className="px-4 py-3 font-bold">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-cream-dark/80 last:border-0 hover:bg-cream/20"
                        >
                          <td className="px-4 py-3.5 font-medium text-text-dark">{v.name}</td>
                          <td className="px-4 py-3.5 text-text-muted">{v.unit}</td>
                          <td className="px-4 py-3.5 font-semibold text-text-dark">
                            {formatPriceMad(v.price)}
                          </td>
                          <td className="px-4 py-3.5 text-text-muted text-xs max-w-[200px]">
                            {publicVariantOrderHint(v)}
                          </td>
                          <td className="px-4 py-3.5">
                            {!v.inStock ? (
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200/80 rounded-full px-2 py-0.5">
                                Out of stock
                              </span>
                            ) : v.quantityOnHand > 0 ? (
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-full px-2 py-0.5">
                                {v.quantityOnHand} in stock
                              </span>
                            ) : (
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-forest-mid bg-cream border border-cream-dark rounded-full px-2 py-0.5">
                                Available
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 py-12 border-t border-cream-dark">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2">
                <ProductReviewsList key={reviewRefreshKey} productId={product.id} />
              </div>
              <div>
                <ProductReviewForm
                  productId={product.id}
                  onSuccess={() => setReviewRefreshKey((k) => k + 1)}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="font-sans text-sm font-semibold text-forest-mid hover:text-text-dark inline-flex items-center gap-2"
            >
              ← Back to all products
            </Link>
          </div>
        </div>
      </div>

      {modal ? (
        <ProductInquiryModal product={modalProduct} mode={modal} onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}
