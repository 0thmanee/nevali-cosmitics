"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductInquiryModal } from "~/components/product-inquiry-modal";
import { SaveProductControl } from "~/components/save-product-control";
import { ProductReviewForm } from "~/components/product-review-form";
import { ProductReviewsList } from "~/components/product-reviews-list";
import { ProductPdpReviewTeaser } from "~/components/product-pdp-review-teaser";
import type { PublicProductDetail } from "~/app/api/products/schemas/products.schema";
import { useCart } from "~/features/cart/cart-context";
import { formatPriceMad, paymentOptionLabel } from "~/lib/format-price";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import {
  getCategoryGradient,
  orderedImagesForPublicVariant,
  pickDefaultPublicVariant,
  publicVariantOrderHint,
} from "~/lib/public-product-helpers";

type Props = { product: PublicProductDetail };

function descriptionLead(description: string | null): string | null {
  if (!description?.trim()) return null;
  const t = description.trim();
  const firstLine = t.split(/\r?\n/).find((l) => l.trim().length > 0)?.trim() ?? t;
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
  return dedup.slice(0, 5);
}

export function PublicProductDetailView({ product }: Props) {
  const gradient = getCategoryGradient(product.category);
  const { addLine } = useCart();
  const buyBlockRef = useRef<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => pickDefaultPublicVariant(product.variants)?.id ?? null
  );
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [showStickyBuy, setShowStickyBuy] = useState(false);

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

  useEffect(() => {
    const el = buyBlockRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        setShowStickyBuy(!e.isIntersecting);
      },
      { root: null, rootMargin: "-64px 0px 0px 0px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
  const placeholderHero = useMemo(
    () => productPlaceholderImageUrl(`${product.id}:${product.category}`, 1400),
    [product.id, product.category]
  );
  const heroImageSrc = mainImage?.url ?? placeholderHero;
  const canBuy = selected && selected.inStock;
  const maxQty =
    selected && selected.quantityOnHand > 0 ? Math.min(999, selected.quantityOnHand) : 999;
  const minQty = selected ? Math.max(1, selected.minOrderQuantity) : 1;
  const anyInStock = product.variants.some((v) => v.inStock);

  const totalPrice = useMemo(() => {
    if (!selected || !qty) return null;
    const priceNum = Number(selected.price.replace(",", "."));
    if (!Number.isFinite(priceNum) || priceNum === 0) return null;
    return formatPriceMad((priceNum * qty).toFixed(2));
  }, [selected, qty]);

  const lead = useMemo(() => descriptionLead(product.description), [product.description]);
  const storyParagraphs = useMemo(
    () => descriptionBodyParagraphs(product.description),
    [product.description]
  );
  const storyBullets = useMemo(
    () => descriptionBulletCandidates(product.description),
    [product.description]
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

  const paymentCopy = product.paymentOption ? paymentOptionLabel(product.paymentOption) : null;

  const trustLine = [
    "Verified partner listing",
    paymentCopy ?? null,
    "Shipping quoted at checkout",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <article className="bg-cream pb-24 text-text-dark sm:pb-0">
        <header className="border-b border-cream-dark bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <nav
              className="font-sans text-xs text-text-muted"
              aria-label="Breadcrumb"
            >
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                <Link href="/artisans" className="hover:text-text-dark">
                  Artisans
                </Link>
              ) : (
                <Link href="/products" className="hover:text-text-dark">
                  Shop
                </Link>
              )}
              <span className="mx-1.5 text-cream-dark">/</span>
              <Link
                href={`/artisans/${product.organizationSlug}`}
                className="hover:text-text-dark"
              >
                {product.organizationName}
              </Link>
              <span className="mx-1.5 text-cream-dark">/</span>
              <span className="text-text-dark">{product.name}</span>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl border-b border-cream-dark bg-paper px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div
                className="relative aspect-square w-full max-w-xl border border-cream-dark bg-[#FAFAF8] lg:max-w-none"
              >
                {selected ? (
                  <p className="absolute left-4 top-4 z-10 font-sans text-[10px] font-medium uppercase tracking-widest text-text-muted">
                    {selected.inStock ? "In stock" : "Unavailable"}
                  </p>
                ) : null}

                {galleryImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() =>
                        setImgIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
                      }
                      className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper text-text-dark transition hover:bg-cream"
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
                      aria-label="Next image"
                      onClick={() => setImgIndex((i) => (i + 1) % galleryImages.length)}
                      className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper text-text-dark transition hover:bg-cream"
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
                  </>
                ) : null}

                <Image
                  src={heroImageSrc}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {mainImage?.variantId ? (
                  <p className="absolute bottom-4 left-4 right-4 text-center font-sans text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    {variantNameById.get(mainImage.variantId) ?? "Variant"}
                  </p>
                ) : null}
              </div>

              {galleryImages.length > 1 ? (
                <div
                  className="mt-3 flex gap-2 overflow-x-auto border-t border-cream-dark pt-3"
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
                      className={`relative h-16 w-16 shrink-0 overflow-hidden border transition-colors ${
                        i === imgIndex
                          ? "border-text-dark"
                          : "border-cream-dark opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <section ref={buyBlockRef} id="buy" className="lg:col-span-6 flex flex-col">
              <p className="font-sans text-xs uppercase tracking-widest text-text-muted">
                {product.category}
                {product.capacity ? ` · ${product.capacity}` : null}
              </p>

              <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-col gap-4 border-b border-cream-dark pb-5 sm:flex-row sm:items-start sm:justify-between">
                <ProductPdpReviewTeaser productId={product.id} />
                <SaveProductControl productId={product.id} />
              </div>

              {lead ? (
                <p className="mt-6 font-sans text-sm leading-relaxed text-text-dark/80 sm:text-[15px]">
                  {lead}
                </p>
              ) : (
                <p className="mt-6 font-sans text-sm leading-relaxed text-text-muted">
                  Listed by {product.organizationName}. Select a format for current price and minimum
                  order. Guest checkout is available where enabled.
                </p>
              )}

              <p className="mt-5 font-sans text-[11px] leading-relaxed text-text-muted">{trustLine}</p>

              <div className="mt-8 border-t border-cream-dark pt-8">
                {selected ? (
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-serif text-3xl font-semibold sm:text-4xl">
                        {formatPriceMad(selected.price)}
                      </span>
                      <span className="font-sans text-sm text-text-muted">
                        per {selected.unit} · minimum {selected.minOrderQuantity} {selected.unit}
                      </span>
                    </div>
                    {selected.minOrderNote && /[a-zA-Z]/.test(selected.minOrderNote) ? (
                      <p className="mt-2 font-sans text-xs text-text-muted">{selected.minOrderNote}</p>
                    ) : null}
                    {totalPrice && qty > 1 ? (
                      <p className="mt-2 font-sans text-sm text-text-muted">
                        {qty} × subtotal <span className="text-text-dark">{totalPrice}</span>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {product.variants.length > 1 ? (
                  <div className="mt-8">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-muted">
                      Format
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const isSel = selectedId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={!v.inStock}
                            onClick={() => setSelectedId(v.id)}
                            className={`border px-4 py-2 font-sans text-sm transition-colors ${
                              !v.inStock
                                ? "cursor-not-allowed border-cream-dark/50 text-text-muted/50 line-through"
                                : isSel
                                  ? "border-text-dark bg-text-dark text-cream"
                                  : "border-cream-dark bg-paper text-text-dark hover:border-text-dark/40"
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {canBuy ? (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <span className="font-sans text-xs uppercase tracking-widest text-text-muted">
                      Quantity
                    </span>
                    <div className="flex items-center border border-cream-dark bg-paper">
                      <button
                        type="button"
                        disabled={qty <= minQty}
                        onClick={() => setQty((q) => Math.max(minQty, q - 1))}
                        className="flex h-10 w-10 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
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
                        className="h-10 w-14 border-x border-cream-dark bg-transparent text-center font-sans text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={qty >= maxQty}
                        onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                        className="flex h-10 w-10 items-center justify-center font-sans text-lg transition hover:bg-cream disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    {selected?.unit ? (
                      <span className="font-sans text-sm text-text-muted">{selected.unit}</span>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!!canBuy && justAdded}
                    className={`flex-1 px-6 py-3.5 font-sans text-sm font-medium transition-colors ${
                      justAdded && canBuy
                        ? "border border-cream-dark bg-cream text-text-dark"
                        : "bg-text-dark text-cream hover:opacity-90"
                    }`}
                  >
                    {justAdded && canBuy
                      ? "Added to cart"
                      : anyInStock
                        ? "Add to cart"
                        : "Request availability"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal("b2b")}
                    className="border border-cream-dark bg-paper px-6 py-3.5 font-sans text-sm font-medium text-text-dark transition hover:bg-cream sm:min-w-[180px]"
                  >
                    Wholesale inquiry
                  </button>
                </div>

                <p className="mt-6 max-w-md font-sans text-xs leading-relaxed text-text-muted">
                  For bulk terms, lead times, or certificates, use wholesale inquiry. The producer is
                  notified by email.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div id="story" className="scroll-mt-28 border-b border-cream-dark">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-4">
                <h2 className="font-serif text-xl font-semibold text-text-dark sm:text-2xl">
                  Highlights
                </h2>
                {storyBullets.length > 0 ? (
                  <ul className="mt-6 space-y-3 font-sans text-sm leading-relaxed text-text-dark/85">
                    {storyBullets.map((b) => (
                      <li key={b} className="border-l-2 border-cream-dark pl-4">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-6 space-y-3 font-sans text-sm leading-relaxed text-text-dark/85">
                    {[
                      "Transparent packaging and MOQ per line.",
                      "Producer profile linked from this page.",
                      "Checkout respects the payment options set for this listing.",
                    ].map((b) => (
                      <li key={b} className="border-l-2 border-cream-dark pl-4">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="lg:col-span-8">
                <h2 className="font-serif text-xl font-semibold text-text-dark sm:text-2xl">
                  Description
                </h2>
                {storyParagraphs.length > 0 ? (
                  <div className="mt-6 space-y-5 font-sans text-sm leading-[1.7] text-text-dark/85 sm:text-[15px]">
                    {storyParagraphs.map((p, i) => (
                      <p key={i} className="whitespace-pre-wrap">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 font-sans text-sm leading-relaxed text-text-muted">
                    Full copy will appear here when the producer has supplied a description. Until
                    then, refer to packaging and pricing below, or contact the studio via wholesale
                    inquiry.
                  </p>
                )}

                <div className="mt-10 border border-cream-dark bg-cream/30 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-text-muted">
                      Producer
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-text-dark">
                      {product.organizationName}
                    </p>
                  </div>
                  <Link
                    href={`/artisans/${product.organizationSlug}`}
                    className="mt-4 inline-block font-sans text-xs font-medium uppercase tracking-wider text-text-dark underline-offset-4 hover:underline sm:mt-0"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="packaging" className="scroll-mt-28 bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="font-serif text-xl font-semibold text-text-dark sm:text-2xl">
              Packaging and price
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm text-text-muted">
              All SKUs for this listing. Select the matching format above to add it to your cart.
            </p>

            <div className="mt-8 overflow-x-auto border border-cream-dark">
              <table className="w-full min-w-[520px] text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-cream-dark bg-cream/50 text-xs uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 font-medium">Packaging</th>
                    <th className="px-4 py-3 font-medium">Unit</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Minimum</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className="border-b border-cream-dark last:border-0">
                      <td className="px-4 py-3.5 font-medium text-text-dark">{v.name}</td>
                      <td className="px-4 py-3.5 text-text-muted">{v.unit}</td>
                      <td className="px-4 py-3.5 text-text-dark">{formatPriceMad(v.price)}</td>
                      <td className="max-w-[200px] px-4 py-3.5 text-xs text-text-muted">
                        {publicVariantOrderHint(v)}
                      </td>
                      <td className="px-4 py-3.5 font-sans text-xs text-text-muted">
                        {!v.inStock
                          ? "Out of stock"
                          : v.quantityOnHand > 0
                            ? `${v.quantityOnHand} units`
                            : "Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mx-auto mt-12 max-w-xl border-t border-cream-dark pt-8">
              <details className="group border-b border-cream-dark py-4">
                <summary className="cursor-pointer list-none font-sans text-sm font-medium text-text-dark [&::-webkit-details-marker]:hidden">
                  <span className="flex justify-between gap-4">
                    Payment
                    <span className="text-text-muted group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </span>
                </summary>
                <div className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                  {paymentCopy ? (
                    <p>{paymentCopy}.</p>
                  ) : (
                    <p>Methods are assigned when the listing is approved.</p>
                  )}
                  <p className="mt-2">Totals are confirmed before you pay.</p>
                </div>
              </details>
              <details className="group py-4">
                <summary className="cursor-pointer list-none font-sans text-sm font-medium text-text-dark [&::-webkit-details-marker]:hidden">
                  <span className="flex justify-between gap-4">
                    Shipping
                    <span className="text-text-muted group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </span>
                </summary>
                <div className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                  <p>Shipping cost and carrier appear at checkout from your delivery address.</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div id="reviews" className="scroll-mt-28 border-t border-cream-dark bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="font-serif text-xl font-semibold text-text-dark sm:text-2xl">Reviews</h2>
            <p className="mt-2 max-w-lg font-sans text-sm text-text-muted">
              Ratings from verified purchases where applicable.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-2">
                <ProductReviewsList key={reviewRefreshKey} productId={product.id} />
              </div>
              <div className="lg:col-span-1 border border-cream-dark bg-paper p-6">
                <h3 className="font-serif text-base font-semibold text-text-dark">Submit a review</h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-text-muted">
                  Optional email for moderation only.
                </p>
                <div className="mt-5">
                  <ProductReviewForm
                    productId={product.id}
                    onSuccess={() => setReviewRefreshKey((k) => k + 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-cream-dark bg-cream">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={() => document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" })}
              className="font-sans text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-dark"
            >
              Back to purchase
            </button>
            <Link
              href="/products"
              className="font-sans text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-dark"
            >
              All products
            </Link>
          </div>
        </footer>
      </article>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream-dark bg-paper px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden ${
          showStickyBuy ? "translate-y-0" : "translate-y-full pointer-events-none"
        } transition-transform duration-200`}
        aria-hidden={!showStickyBuy}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div className="min-w-0">
            {selected ? (
              <>
                <p className="truncate font-sans text-[11px] text-text-muted">{product.name}</p>
                <p className="font-serif text-base font-semibold">{formatPriceMad(selected.price)}</p>
              </>
            ) : (
              <p className="font-sans text-xs text-text-muted">Select a format</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="shrink-0 bg-text-dark px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-cream"
          >
            {anyInStock ? "Add to cart" : "Inquire"}
          </button>
        </div>
      </div>

      {modal ? (
        <ProductInquiryModal product={modalProduct} mode={modal} onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}
