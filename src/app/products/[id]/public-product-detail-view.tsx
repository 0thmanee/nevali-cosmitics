"use client";

import { useEffect, useMemo, useState } from "react";
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
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { PLATFORM_OWNED_ORG_SLUG, SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import {
  cosmeticsCategoryLabel,
  parseIngredientList,
  parseSkinTypeCodes,
  skinTypeDisplayLabel,
} from "~/lib/public-product-pdp-helpers";
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
  return dedup.slice(0, 6);
}

const jumpLinks = [
  { href: "#order", label: "Shop" },
  { href: "#trust", label: "Trust" },
  { href: "#gallery", label: "Gallery" },
  { href: "#formula", label: "Formula" },
  { href: "#certs", label: "Certificates" },
  { href: "#story", label: "Story" },
  { href: "#packaging", label: "Formats" },
  { href: "#reviews", label: "Reviews" },
] as const;

function VariantFormatChips({
  variants,
  selectedId,
  setSelectedId,
}: {
  variants: PublicProductDetail["variants"];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  if (variants.length <= 1) return null;
  return (
    <>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
        Choose format
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSel = selectedId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              disabled={!v.inStock}
              onClick={() => setSelectedId(v.id)}
              className={`border px-4 py-2.5 font-sans text-sm transition-colors ${
                !v.inStock
                  ? "cursor-not-allowed border-cream-dark/50 text-text-muted/50 line-through"
                  : isSel
                    ? "border-text-dark bg-text-dark text-cream"
                    : "border-cream-dark bg-paper text-text-dark hover:border-text-dark/50"
              }`}
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
  imgIndex: number;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
  galleryImages: { id: string; url: string; sortOrder: number; variantId: string | null }[];
  lead: string | null;
}) {
  return (
    <section
      id="order"
      className="flex flex-col justify-center border-t border-cream-dark bg-paper px-5 py-10 sm:px-8 sm:py-12 lg:border-t-0 lg:border-l lg:px-10 lg:py-14 xl:px-14"
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
        {product.category}
        {product.capacity ? ` · ${product.capacity}` : null}
      </p>
      <h1
        className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-text-dark"
      >
        {product.name}
      </h1>

      <div className="mt-5 flex flex-col gap-4 border-b border-cream-dark pb-5 sm:flex-row sm:items-start sm:justify-between">
        <ProductPdpReviewTeaser productId={product.id} />
        <SaveProductControl productId={product.id} />
      </div>

      {lead ? (
        <p className="mt-6 font-sans text-base leading-relaxed text-text-dark/85">{lead}</p>
      ) : (
        <p className="mt-6 font-sans text-sm leading-relaxed text-text-muted">
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <>
              Listed by {product.organizationName}.
              {product.variants.length > 1
                ? " Choose a format above for price and minimum order."
                : " Guest checkout is available where enabled."}
            </>
          ) : (
            <>
              From {NEVALI_HOUSE_BRAND.legalName}.
              {product.variants.length > 1
                ? " Choose a format above for price and minimum order."
                : " Guest checkout is available where enabled."}
            </>
          )}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {paymentCopy ? (
          <span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-text-dark">
            {paymentCopy}
          </span>
        ) : null}
        <span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-text-dark">
          Verified listing
        </span>
        <span className="border border-cream-dark bg-cream/40 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-text-dark">
          Secure checkout
        </span>
      </div>

      <div className="mt-8 border-t border-cream-dark pt-8">
        {selected ? (
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-3xl font-semibold sm:text-4xl">{formatPriceMad(selected.price)}</span>
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

        {canBuy ? (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
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
            {selected?.unit ? <span className="font-sans text-sm text-text-muted">{selected.unit}</span> : null}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!!canBuy && justAdded}
            className={`flex-1 px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wide transition-colors ${
              justAdded && canBuy
                ? "border border-cream-dark bg-cream text-text-dark"
                : "bg-text-dark text-cream hover:opacity-90"
            }`}
          >
            {justAdded && canBuy ? "Added to cart" : anyInStock ? "Add to cart" : "Request availability"}
          </button>
          <button
            type="button"
            onClick={() => setModal("b2b")}
            className="border border-cream-dark bg-paper px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-text-dark transition hover:bg-cream sm:min-w-[200px]"
          >
            Wholesale inquiry
          </button>
        </div>

        <p className="mt-5 max-w-md font-sans text-xs leading-relaxed text-text-muted">
          Bulk terms, certificates, and lead times: use wholesale inquiry.{" "}
          {SHOW_MULTI_PRODUCER_EXPERIENCE
            ? "The studio is notified by email."
            : NEVALI_HOUSE_BRAND.wholesaleNotify}
        </p>
      </div>

      {galleryImages.length > 1 ? (
        <div className="mt-10 lg:hidden">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">Photos</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product photos">
            {galleryImages.map((img, i) => (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={i === imgIndex}
                onClick={() => setImgIndex(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${
                  i === imgIndex ? "border-text-dark" : "border-cream-dark opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PublicProductDetailView({ product }: Props) {
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

  const validVariantIds = useMemo(() => new Set(product.variants.map((v) => v.id)), [product.variants]);

  const galleryImages = useMemo(
    () => orderedImagesForPublicVariant(product.images, selectedId, { validVariantIds }),
    [product.images, selectedId, validVariantIds],
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
    [product.id, product.category],
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
  const skinCodes = useMemo(() => parseSkinTypeCodes(product.skinTypes), [product.skinTypes]);
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

  const paymentCopy = product.paymentOption ? paymentOptionLabel(product.paymentOption) : null;
  const mosaicImages = product.images;
  const hasMultipleFormats = product.variants.length > 1;

  const filteredJumpLinks = useMemo(() => {
    let links = [...jumpLinks];
    if (mosaicImages.length === 0) links = links.filter((l) => l.href !== "#gallery");
    if (product.certifications.length === 0) links = links.filter((l) => l.href !== "#certs");
    if (!hasMultipleFormats) links = links.filter((l) => l.href !== "#packaging");
    return links;
  }, [mosaicImages.length, product.certifications.length, hasMultipleFormats]);

  return (
    <>
      <article className="bg-cream pb-28 text-text-dark">
        <nav
          className="sticky top-14 z-30 border-b border-cream-dark bg-paper/95 backdrop-blur-sm"
          aria-label="On this page"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2.5 sm:gap-3 sm:px-6">
            {filteredJumpLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="shrink-0 whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-dark"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <header className="border-b border-cream-dark bg-paper">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <nav className="font-sans text-[11px] text-text-muted" aria-label="Breadcrumb">
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                <>
                  <Link href="/artisans" className="hover:text-text-dark">
                    Artisans
                  </Link>
                  <span className="mx-1.5 text-cream-dark">/</span>
                  <Link href={`/artisans/${product.organizationSlug}`} className="hover:text-text-dark">
                    {product.organizationName}
                  </Link>
                  <span className="mx-1.5 text-cream-dark">/</span>
                  <span className="text-text-dark">{product.name}</span>
                </>
              ) : (
                <>
                  <Link href="/products" className="hover:text-text-dark">
                    Shop
                  </Link>
                  <span className="mx-1.5 text-cream-dark">/</span>
                  <Link href={`/artisans/${PLATFORM_OWNED_ORG_SLUG}`} className="hover:text-text-dark">
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
        <div className="border-b border-cream-dark bg-paper">
          {hasMultipleFormats ? (
            <div className="border-b border-cream-dark bg-paper px-4 py-5 sm:px-8 lg:px-10">
              <div className="mx-auto max-w-[1600px]">
                <VariantFormatChips
                  variants={product.variants}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              </div>
            </div>
          ) : null}
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2 lg:min-h-[min(88vh,920px)]">
            <div className="relative min-h-[min(52vh,520px)] w-full overflow-hidden bg-cream lg:min-h-0">
              {selected ? (
                <p className="absolute left-4 top-4 z-10 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
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
                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
                  >
                    <span className="sr-only">Previous</span>
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
                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-cream-dark bg-paper/90 text-text-dark transition hover:bg-paper"
                  >
                    <span className="sr-only">Next</span>
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
              <Image
                src={heroImageSrc}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {mainImage?.variantId ? (
                <p className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 font-sans text-[10px] font-semibold uppercase tracking-wider text-text-dark">
                  <span className="border border-cream-dark bg-paper/95 px-3 py-1">
                    Format · {variantNameById.get(mainImage.variantId) ?? "Variant"}
                  </span>
                </p>
              ) : null}
              {galleryImages.length > 1 ? (
                <div className="absolute bottom-0 left-0 right-0 hidden border-t border-cream-dark/80 bg-paper/90 px-3 py-3 lg:block">
                  <div className="mx-auto flex max-w-xl justify-center gap-2 overflow-x-auto">
                    {galleryImages.map((img, i) => (
                      <button
                        key={img.id}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        aria-current={i === imgIndex}
                        onClick={() => setImgIndex(i)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                          i === imgIndex ? "border-text-dark" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-14 lg:max-h-screen lg:overflow-y-auto">
              <BuyBlock
                product={product}
                selected={selected}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                qty={qty}
                setQty={setQty}
                canBuy={!!canBuy}
                minQty={minQty}
                maxQty={maxQty}
                totalPrice={totalPrice}
                anyInStock={anyInStock}
                justAdded={justAdded}
                handleAddToCart={handleAddToCart}
                setModal={setModal}
                paymentCopy={paymentCopy}
                imgIndex={imgIndex}
                setImgIndex={setImgIndex}
                galleryImages={galleryImages}
                lead={lead}
              />
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <section id="trust" className="scroll-mt-32 border-b border-cream-dark bg-cream">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-14">
            <div>
              <p className="font-serif text-lg font-semibold text-text-dark">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Verified partner" : NEVALI_HOUSE_BRAND.verifiedHeadline}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-text-muted">
                {SHOW_MULTI_PRODUCER_EXPERIENCE
                  ? "Listing approved on nevali. Producer profile, formats, and checkout rules are transparent."
                  : NEVALI_HOUSE_BRAND.verifiedBody}
              </p>
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-text-dark">Secure payment</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-text-muted">
                {paymentCopy ?? "Payment options are set when the listing is approved."} Totals confirmed before
                you pay.
              </p>
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-text-dark">Real photography</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-text-muted">
                Gallery reflects uploaded pack and lifestyle shots for this SKU where provided.
              </p>
            </div>
            <div>
              <p className="font-serif text-lg font-semibold text-text-dark">Certificates on file</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-text-muted">
                {product.certifications.length > 0
                  ? `${product.certifications.length} approved document${product.certifications.length === 1 ? "" : "s"} in the certificates section.`
                  : SHOW_MULTI_PRODUCER_EXPERIENCE
                    ? "Ask the producer for COA, MSDS, or audit documentation via wholesale inquiry."
                    : `Ask ${NEVALI_HOUSE_BRAND.legalName} for COA, MSDS, or audit documentation via wholesale inquiry.`}
              </p>
            </div>
          </div>
        </section>

        {/* Full-width visual gallery */}
        {mosaicImages.length > 0 ? (
          <section id="gallery" className="scroll-mt-32 border-b border-cream-dark bg-paper">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
              <h2 className="font-serif text-2xl font-semibold text-text-dark sm:text-3xl">Visual reference</h2>
              <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-text-muted">
                {SHOW_MULTI_PRODUCER_EXPERIENCE
                  ? "Scroll the grid—texture, packaging, and shade context as supplied by the producer."
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
                    key={img.id}
                    className="relative aspect-3/4 overflow-hidden border border-cream-dark bg-cream sm:aspect-square"
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} — photo ${i + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Formula & facts */}
        <section id="formula" className="scroll-mt-32 border-b border-cream-dark bg-cream">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="font-serif text-2xl font-semibold text-text-dark sm:text-3xl">Formula &amp; fit</h2>
            <p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
              What goes on skin—and how this line is positioned in the catalog.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-cream-dark bg-paper p-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Category
                </p>
                <p className="mt-2 font-serif text-lg text-text-dark">{product.category}</p>
                {cosmeticsLabel ? (
                  <p className="mt-1 font-sans text-sm text-text-muted">{cosmeticsLabel}</p>
                ) : null}
              </div>
              <div className="border border-cream-dark bg-paper p-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Capacity
                </p>
                <p className="mt-2 font-serif text-lg text-text-dark">
                  {product.capacity?.trim() ? product.capacity : "On request"}
                </p>
              </div>
              <div className="border border-cream-dark bg-paper p-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Minimum order
                </p>
                <p className="mt-2 font-serif text-lg text-text-dark">
                  {product.moq?.trim()
                    ? product.moq
                    : selected
                      ? publicVariantOrderHint(selected)
                      : hasMultipleFormats
                        ? "See formats section"
                        : "—"}
                </p>
              </div>
              <div className="border border-cream-dark bg-paper p-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Payment
                </p>
                <p className="mt-2 font-serif text-lg text-text-dark">{paymentCopy ?? "As set at approval"}</p>
              </div>
            </div>

            {skinCodes.length > 0 ? (
              <div className="mt-12">
                <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                  Skin types
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skinCodes.map((code) => (
                    <span
                      key={code}
                      className="border border-cream-dark bg-paper px-3 py-1.5 font-sans text-xs font-medium text-text-dark"
                    >
                      {skinTypeDisplayLabel(code)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {ingredientList.length > 0 ? (
              <div className="mt-12">
                <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                  Key ingredients
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ingredientList.map((ing) => (
                    <span
                      key={ing}
                      className="border border-cream-dark bg-paper px-2.5 py-1 font-sans text-[11px] leading-snug text-text-dark"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <p className="mt-4 max-w-2xl font-sans text-xs leading-relaxed text-text-muted">
                  {SHOW_MULTI_PRODUCER_EXPERIENCE
                    ? "INCI-style lists are provided by the producer. Always patch-test new formulas."
                    : NEVALI_HOUSE_BRAND.ingredientsNote}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Certificates — only when approved docs exist */}
        {product.certifications.length > 0 ? (
          <section id="certs" className="scroll-mt-32 border-b border-cream-dark bg-paper">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
              <h2 className="font-serif text-2xl font-semibold text-text-dark sm:text-3xl">Certificates &amp; docs</h2>
              <p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
                {SHOW_MULTI_PRODUCER_EXPERIENCE
                  ? "Approved PDFs from the partner—product-specific or studio-wide quality systems."
                  : NEVALI_HOUSE_BRAND.certsIntro}
              </p>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product.certifications.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col border border-cream-dark bg-cream/30 p-5 transition hover:bg-cream/50"
                  >
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                      {c.kind === "product" ? "This product" : SHOW_MULTI_PRODUCER_EXPERIENCE ? "Partner" : NEVALI_HOUSE_BRAND.certStudioBadge}
                    </p>
                    <p className="mt-2 font-serif text-lg font-semibold leading-snug text-text-dark">{c.name}</p>
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-fit font-sans text-xs font-semibold uppercase tracking-wide text-text-dark underline underline-offset-4"
                    >
                      Open document
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* Story + highlights */}
        <section id="story" className="scroll-mt-32 border-b border-cream-dark bg-cream">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="font-serif text-2xl font-semibold text-text-dark">Why this formula</h2>
                {storyBullets.length > 0 ? (
                  <ul className="mt-8 space-y-4 font-sans text-sm leading-relaxed text-text-dark/90">
                    {storyBullets.map((b) => (
                      <li key={b} className="border-l-2 border-text-dark pl-4">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-8 space-y-4 font-sans text-sm leading-relaxed text-text-dark/90">
                    {[
                      "Transparent formats and MOQ per line.",
                      SHOW_MULTI_PRODUCER_EXPERIENCE
                        ? "Producer profile linked from this page."
                        : NEVALI_HOUSE_BRAND.profileBullet,
                      "Checkout respects payment options set for this listing.",
                    ].map((b) => (
                      <li key={b} className="border-l-2 border-text-dark pl-4">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="lg:col-span-8">
                <h2 className="font-serif text-2xl font-semibold text-text-dark">Full description</h2>
                {storyParagraphs.length > 0 ? (
                  <div className="mt-8 space-y-6 font-sans text-base leading-[1.75] text-text-dark/90">
                    {storyParagraphs.map((p, i) => (
                      <p key={i} className="whitespace-pre-wrap">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 font-sans text-sm leading-relaxed text-text-muted">
                    {SHOW_MULTI_PRODUCER_EXPERIENCE
                      ? "The producer has not yet published long-form copy. Use visuals, ingredients, and wholesale inquiry for deeper questions."
                      : NEVALI_HOUSE_BRAND.emptyLongDescription}
                  </p>
                )}

                <div className="mt-12 grid gap-6 border border-cream-dark bg-paper p-8 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex gap-4">
                    {product.organizationLogo ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-cream-dark bg-cream">
                        <Image
                          src={product.organizationLogo}
                          alt=""
                          fill
                          className="object-contain object-center p-1"
                          sizes="64px"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                        {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Crafted by" : "Made by"}
                      </p>
                      <p className="mt-1 font-serif text-xl font-semibold text-text-dark">
                        {SHOW_MULTI_PRODUCER_EXPERIENCE ? product.organizationName : NEVALI_HOUSE_BRAND.legalName}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/artisans/${product.organizationSlug}`}
                    className="inline-flex w-fit items-center justify-center border border-cream-dark bg-cream px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-text-dark transition hover:bg-paper"
                  >
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? "View studio" : NEVALI_HOUSE_BRAND.viewBrandCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formats & pricing table — only when more than one variant */}
        {hasMultipleFormats ? (
          <section id="packaging" className="scroll-mt-32 bg-paper">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
              <h2 className="font-serif text-2xl font-semibold text-text-dark">Formats &amp; pricing</h2>
              <p className="mt-2 max-w-2xl font-sans text-sm text-text-muted">
                Every live SKU on this listing. Match the format at the top before adding to cart.
              </p>
              <div className="mt-10 overflow-x-auto border border-cream-dark">
                <table className="w-full min-w-[560px] text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-cream-dark bg-cream text-[10px] font-semibold uppercase tracking-wider text-text-muted">
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
                        <td className="max-w-[220px] px-4 py-3.5 text-xs text-text-muted">
                          {publicVariantOrderHint(v)}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-text-muted">
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
                      Payment details
                      <span className="text-text-muted transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                    {paymentCopy ? <p>{paymentCopy}.</p> : <p>Methods are assigned when the listing is approved.</p>}
                    <p className="mt-2">Totals are confirmed before you pay.</p>
                  </div>
                </details>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-sans text-sm font-medium text-text-dark [&::-webkit-details-marker]:hidden">
                    <span className="flex justify-between gap-4">
                      Shipping
                      <span className="text-text-muted transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                    <p>Shipping cost and carrier appear at checkout from your delivery address.</p>
                  </div>
                </details>
              </div>
            </div>
          </section>
        ) : null}

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-32 border-t border-cream-dark bg-cream">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="font-serif text-2xl font-semibold text-text-dark">Reviews</h2>
            <p className="mt-2 max-w-lg font-sans text-sm text-text-muted">
              Ratings from verified purchases where applicable.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-2">
                <ProductReviewsList key={reviewRefreshKey} productId={product.id} />
              </div>
              <div className="border border-cream-dark bg-paper p-6">
                <h3 className="font-serif text-lg font-semibold text-text-dark">Submit a review</h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-text-muted">
                  Optional email for moderation only.
                </p>
                <div className="mt-5">
                  <ProductReviewForm productId={product.id} onSuccess={() => setReviewRefreshKey((k) => k + 1)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-cream-dark bg-paper">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })}
              className="w-fit font-sans text-xs font-semibold uppercase tracking-wide text-text-muted hover:text-text-dark"
            >
              Back to shop block
            </button>
            <Link
              href="/products"
              className="w-fit font-sans text-xs font-semibold uppercase tracking-wide text-text-muted hover:text-text-dark"
            >
              All products
            </Link>
          </div>
        </div>
      </article>

      {/* Always-visible order bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-dark bg-paper pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2"
        role="region"
        aria-label="Order"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {product.name}
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {product.variants.length > 1 ? (
                <select
                  aria-label="Format"
                  className="max-w-[140px] truncate border border-cream-dark bg-paper py-1 pl-2 pr-6 font-sans text-[11px] text-text-dark sm:max-w-[200px]"
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(e.target.value || null)}
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id} disabled={!v.inStock}>
                      {v.name}
                    </option>
                  ))}
                </select>
              ) : null}
              {selected ? (
                <span className="font-serif text-base font-semibold sm:text-lg">{formatPriceMad(selected.price)}</span>
              ) : (
                <span className="font-sans text-xs text-text-muted">Select format</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="shrink-0 bg-text-dark px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-cream sm:px-6 sm:text-xs"
          >
            {anyInStock ? "Add to cart" : "Inquire"}
          </button>
          <button
            type="button"
            onClick={() => setModal("b2b")}
            className="hidden shrink-0 border border-cream-dark bg-paper px-3 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-text-dark sm:inline-block sm:text-xs"
          >
            Wholesale
          </button>
        </div>
      </div>

      {modal ? <ProductInquiryModal product={modalProduct} mode={modal} onClose={() => setModal(null)} /> : null}
    </>
  );
}
