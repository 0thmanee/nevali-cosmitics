"use client";

import React from "react";
import Link from "next/link";
import { useProduct } from "../../hooks/use-products";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { formatProductUpdatedAt } from "../../utils/format";
import { ProductGallery } from "./product-gallery";
import { ProductCertificationsSection } from "./product-certifications-section";

const cardStyle = {
  background: "white",
  border: "1px solid #d8d0c4",
} as const;

type Props = { productId: string };

export function ProductDetailView({ productId }: Props) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center py-20"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-[#727272]">Loading product…</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        className="rounded-2xl overflow-hidden px-6 py-12 text-center"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-[#f87171]">
          {error instanceof Error ? error.message : "Product not found."}
        </p>
        <Link
          href="/artisan/products"
          className="mt-4 inline-block font-sans text-sm font-medium text-[#000000] underline"
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
        className="rounded-2xl overflow-hidden shadow-sm"
        style={cardStyle}
      >
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-[#000000] leading-tight">
              {product.name}
            </h1>
            <p className="font-sans text-[13px] text-[#727272] mt-1">
              {product.category}
            </p>
            <p className="font-sans text-[12px] text-[#727272]/80 mt-1">
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
              className="font-sans text-sm font-semibold rounded-xl px-4 py-2 transition-colors"
              style={{
                background: "#000000",
                color: "white",
              }}
            >
              Edit
            </Link>
          </div>
        </div>
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
        className="rounded-2xl overflow-hidden shadow-sm"
        style={cardStyle}
      >
        <div className="px-6 py-4 border-b border-[#d8d0c4]">
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">
            Details
          </h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase mb-1">
                Minimum order quantity
              </p>
              <p className="font-sans text-[15px] font-semibold text-[#000000]">
                {product.moq ?? "—"}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase mb-1">
                Capacity
              </p>
              <p className="font-sans text-[15px] font-semibold text-[#000000]">
                {product.capacity ?? "—"}
              </p>
            </div>
          </div>
          {product.status === "REJECTED" && product.rejectionReason?.trim() && (
            <div
              className="rounded-xl px-4 py-3 flex flex-col gap-1"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
              }}
            >
              <p className="font-sans text-[11px] font-bold tracking-wide text-[#f87171] uppercase">
                Rejection reason
              </p>
              <p className="font-sans text-sm text-[#000000]">
                {product.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
