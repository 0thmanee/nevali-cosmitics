"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useProduct,
  useSetHomepageHeroProduct,
  useClearHomepageHeroProduct,
} from "../../hooks/use-products";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { formatProductUpdatedAt } from "../../utils/format";
import { ProductGallery } from "./product-gallery";
import { ProductCertificationsSection } from "./product-certifications-section";

const cardStyle = {
  background: "white",
  border: "1px solid var(--color-cream-dark)",
} as const;

type Props = { productId: string };

export function ProductDetailView({ productId }: Props) {
  const { data: product, isLoading, isError, error } = useProduct(productId);
  const setHero = useSetHomepageHeroProduct();
  const clearHero = useClearHomepageHeroProduct();
  const [heroError, setHeroError] = useState<string | null>(null);
  const heroBusy = setHero.isPending || clearHero.isPending;

  if (isLoading) {
    return (
      <div
        className="rounded-sm overflow-hidden flex items-center justify-center py-20"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-text-muted">Loading product…</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        className="rounded-sm overflow-hidden px-6 py-12 text-center"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-[var(--color-danger)]">
          {error instanceof Error ? error.message : "Product not found."}
        </p>
        <Link
          href="/artisan/products"
          className="mt-4 inline-block font-sans text-sm font-medium text-text-dark underline"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  const statusStyle = PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div
        className="rounded-sm overflow-hidden shadow-sm"
        style={cardStyle}
      >
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-text-dark leading-tight">
              {product.name}
            </h1>
            <p className="font-sans text-[13px] text-text-muted mt-1">
              {product.category}
            </p>
            <p className="font-sans text-[12px] text-text-muted/80 mt-1">
              Updated {formatProductUpdatedAt(product.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="font-sans text-[11px] font-bold tracking-wide rounded-full px-4 py-1.5 uppercase"
              style={statusStyle}
            >
              {product.status}
            </span>
            <Link
              href={`/artisan/products/${productId}/edit`}
              className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors"
              style={{
                background: "var(--color-ink)",
                color: "white",
              }}
            >
              Edit
            </Link>
          </div>
        </div>
        {product.status === "APPROVED" ? (
          <div className="border-t border-cream-dark px-6 py-4">
            {heroError ? (
              <p className="mb-2 font-sans text-xs text-[var(--color-danger)]">{heroError}</p>
            ) : null}
            {product.featuredOnHome ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-sm text-text-dark">
                  This listing is the <span className="font-semibold">public homepage hero</span>.
                </p>
                <button
                  type="button"
                  disabled={heroBusy}
                  className="w-fit font-sans text-xs font-medium text-text-muted underline-offset-2 hover:underline disabled:opacity-50"
                  onClick={() => {
                    setHeroError(null);
                    clearHero.mutate(undefined, {
                      onError: (e) =>
                        setHeroError(e instanceof Error ? e.message : "Could not update homepage."),
                    });
                  }}
                >
                  Remove from homepage
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-sm text-text-muted">
                  Choose whether this SKU appears as the large featured product on the public homepage.
                </p>
                <button
                  type="button"
                  disabled={heroBusy}
                  className="w-fit font-sans text-xs font-semibold uppercase tracking-wide text-text-dark underline-offset-2 hover:underline disabled:opacity-50"
                  onClick={() => {
                    setHeroError(null);
                    setHero.mutate(productId, {
                      onError: (e) =>
                        setHeroError(e instanceof Error ? e.message : "Could not update homepage."),
                    });
                  }}
                >
                  Show on homepage
                </button>
              </div>
            )}
            <p className="mt-2 font-sans text-[11px] text-text-muted">
              <Link href={`/artisan/products/${productId}/edit#homepage-hero-spotlight`} className="underline">
                Advanced: toggle in product edit
              </Link>
            </p>
          </div>
        ) : null}
      </div>

      {/* Gallery */}
      <ProductGallery images={product.images ?? []} alt={product.name} />

      {/* Certifications */}
      <ProductCertificationsSection
        productId={productId}
        productName={product.name}
        certifications={product.certifications ?? []}
      />

      {/* Details card */}
      <div
        className="rounded-sm overflow-hidden shadow-sm"
        style={cardStyle}
      >
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">
            Details
          </h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-sm p-4" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                Minimum order quantity
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">
                {product.moq ?? "—"}
              </p>
            </div>
            <div className="rounded-sm p-4" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                Capacity
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">
                {product.capacity ?? "—"}
              </p>
            </div>
          </div>
          {product.status === "REJECTED" && product.rejectionReason?.trim() && (
            <div
              className="rounded-sm px-4 py-3 flex flex-col gap-1"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
              }}
            >
              <p className="font-sans text-[11px] font-bold tracking-wide text-[var(--color-danger)] uppercase">
                Rejection reason
              </p>
              <p className="font-sans text-sm text-text-dark">
                {product.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
