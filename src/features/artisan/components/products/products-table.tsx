"use client";

import React from "react";
import Link from "next/link";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { formatProductUpdatedAt } from "../../utils/format";
import type { ProductListRow } from "~/app/api/products/schemas/products.schema";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";

export type ProductsTableProps = {
  products: ProductListRow[];
};

function ProductThumb({ firstImageUrl, seed }: { firstImageUrl: string | null; seed: string }) {
  const src = firstImageUrl ?? productPlaceholderImageUrl(seed, 144);
  return (
    <img src={src} alt="" className="w-9 h-9 rounded-sm object-cover shrink-0 bg-cream" />
  );
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div
        className="rounded-sm overflow-hidden flex flex-col items-center justify-center py-16 gap-4"
        style={{ background: "white", border: "1px solid #d8d0c4" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect
            x="8"
            y="6"
            width="24"
            height="28"
            rx="4"
            stroke="#d4c4a0"
            strokeWidth="2"
          />
          <line
            x1="14"
            y1="15"
            x2="26"
            y2="15"
            stroke="#d4c4a0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="21"
            x2="22"
            y2="21"
            stroke="#d4c4a0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-sans text-sm text-[#727272]">No products found</p>
        <Link
          href="/artisan/products/new"
          className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors"
          style={{ background: "#000000", color: "white" }}
        >
          Add a new product
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: "white", border: "1px solid #d8d0c4" }}
    >
      <div
        className="grid px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#727272] uppercase"
        style={{
          gridTemplateColumns: "auto 2fr 1fr 1fr 1fr auto",
          borderBottom: "1px solid #d8d0c4",
          background: "#ffffff",
        }}
      >
        <span className="w-9">Image</span>
        <span>Product</span>
        <span>Variants</span>
        <span>From price</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {products.map((p, i) => {
        const statusStyle = PRODUCT_STATUS_STYLES[p.status] ?? PRODUCT_STATUS_STYLES.PENDING;
        return (
          <div
            key={p.id}
            className="grid items-center px-5 py-3.5"
            style={{
              gridTemplateColumns: "auto 2fr 1fr 1fr 1fr auto",
              borderTop: i > 0 ? "1px solid #d8d0c4" : "none",
            }}
          >
            <div className="px-4 py-3">
              <ProductThumb firstImageUrl={p.firstImageUrl} seed={`${p.id}:${p.category}`} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <p className="font-sans font-semibold text-sm text-[#000000] leading-tight truncate">
                  {p.name}
                </p>
                <p className="font-sans text-[11px] text-[#727272] mt-0.5">
                  {p.category} · {formatProductUpdatedAt(p.updatedAt)}
                </p>
              </div>
            </div>
            <span className="font-sans text-sm text-[#000000]">
              {p.variantCount}
            </span>
            <span className="font-sans text-sm text-[#000000]">
              {p.fromPrice ? formatPriceMad(p.fromPrice) : "—"}
            </span>
            <div className="flex flex-col gap-0.5">
              <span
                className="font-sans text-[10px] font-bold tracking-wide rounded-full px-3 py-1 uppercase w-fit"
                style={statusStyle}
              >
                {p.status}
              </span>
              {p.status === "REJECTED" && p.rejectionReason?.trim() && (
                <span className="font-sans text-[11px] text-[#f87171]/80 max-w-[180px] truncate" title={p.rejectionReason}>
                  {p.rejectionReason}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/artisan/products/${p.id}/edit`}
                className="font-sans text-[12px] font-medium rounded-sm px-3 py-1.5 transition-colors inline-block"
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  border: "1px solid #d8d0c4",
                }}
              >
                Edit
              </Link>
              <Link
                href={`/artisan/products/${p.id}`}
                className="font-sans text-[12px] font-medium rounded-sm px-3 py-1.5 transition-colors inline-block"
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  border: "1px solid #d8d0c4",
                }}
              >
                View
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
