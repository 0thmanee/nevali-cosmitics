"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "../../hooks/use-products";
import { PRODUCT_STATUS_STYLES, STATUS_DOT_COLORS } from "../../constants";
import type { ProductRow } from "~/app/api/products/schemas/products.schema";

function formatUpdatedAt(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;
  if (days < 14) return "Updated 1 week ago";
  return `Updated ${Math.floor(days / 7)} weeks ago`;
}

function ProductRowItem({ p }: { p: ProductRow }) {
  const statusStyle = PRODUCT_STATUS_STYLES[p.status] ?? PRODUCT_STATUS_STYLES.PENDING;
  const dotColor = STATUS_DOT_COLORS[p.status] ?? "#E8B84B";
  return (
    <div
      className="flex items-center gap-4 px-5 py-3 border-t border-[#d8d0c4] first:border-t-0"
    >
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-sm text-[#000000] leading-tight truncate">
          {p.name}
        </p>
        <p className="font-sans text-[12px] text-[#727272] mt-0.5">
          {p.category} · {formatUpdatedAt(p.updatedAt)}
        </p>
      </div>
      <span
        className="font-sans text-[10px] font-bold tracking-wide rounded-full px-3 py-1 uppercase shrink-0"
        style={statusStyle}
      >
        {p.status}
      </span>
    </div>
  );
}

export function DashboardProductList() {
  const { data: products = [], isLoading, isError } = useProducts();
  const approvedCount = products.filter((p) => p.status === "APPROVED").length;
  const rejected = products.find((p) => p.status === "REJECTED");

  return (
    <div className="flex flex-col gap-0">
      <div
        className="rounded-t-xl px-5 py-4 flex items-center justify-between border-b border-[#d8d0c4]"
        style={{ background: "white" }}
      >
        <div>
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">
            My Products
          </h2>
          <p className="font-sans text-[12px] text-[#727272] mt-0.5">
            {products.length} listings · {approvedCount} approved
          </p>
        </div>
        <Link
          href="/artisan/products"
          className="font-sans text-sm font-medium rounded-sm px-4 py-2 transition-colors"
          style={{
            background: "#ffffff",
            color: "#000000",
            border: "1px solid #d8d0c4",
          }}
        >
          View all
        </Link>
      </div>
      <div className="rounded-b-xl overflow-hidden" style={{ background: "white" }}>
        {isLoading ? (
          <div className="px-5 py-8 font-sans text-sm text-[#727272]">
            Loading products…
          </div>
        ) : isError ? (
          <div className="px-5 py-8 font-sans text-sm text-[#f87171]">
            Failed to load products.
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-8 font-sans text-sm text-[#727272]">
            No products yet. Add products from the Products page.
          </div>
        ) : (
          products.slice(0, 5).map((p) => <ProductRowItem key={p.id} p={p} />)
        )}
        {rejected && (
          <div
            className="mx-4 mb-3 mt-1 rounded-sm px-4 py-2.5 flex items-start gap-3"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0 mt-0.5"
            >
              <path
                d="M8 2L1.5 13h13L8 2z"
                stroke="#f87171"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <line
                x1="8"
                y1="7"
                x2="8"
                y2="10"
                stroke="#f87171"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <circle cx="8" cy="12" r="0.6" fill="#f87171" />
            </svg>
            <div>
              <p className="font-sans text-sm font-semibold text-[#f87171] leading-tight">
                Action required — {rejected.name}
              </p>
              <p className="font-sans text-[12px] text-[#f87171]/70 mt-0.5">
                Your listing was rejected. Review feedback and resubmit if needed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
