"use client";

import React from "react";
import type { ProductRow } from "~/app/api/products/schemas/products.schema";

export type RejectedWarningProps = {
  count: number;
  /** Rejected products to show first rejection reason */
  rejectedProducts?: ProductRow[];
};

export function RejectedWarning({ count, rejectedProducts = [] }: RejectedWarningProps) {
  if (count <= 0) return null;

  const firstWithReason = rejectedProducts.find((p) => p.status === "REJECTED" && p.rejectionReason?.trim());

  return (
    <div
      className="rounded-sm px-5 py-4 flex items-start gap-3"
      style={{
        background: "color-mix(in srgb, var(--color-danger) 6%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-danger) 18%, transparent)",
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
          stroke="var(--color-danger)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <line
          x1="8"
          y1="7"
          x2="8"
          y2="10"
          stroke="var(--color-danger)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="8" cy="12" r="0.6" fill="var(--color-danger)" />
      </svg>
      <div>
        <p className="font-sans font-semibold text-sm text-[var(--color-danger)]">
          {count} product{count > 1 ? "s" : ""} require{count === 1 ? "s" : ""}{" "}
          action
        </p>
        <p className="font-sans text-[12px] text-[var(--color-danger)]/70 mt-0.5">
          {firstWithReason ? (
            <>
              <span className="font-semibold text-[var(--color-danger)]">{firstWithReason.name}:</span>{" "}
              {firstWithReason.rejectionReason}
            </>
          ) : (
            "Review the rejection feedback and resubmit the required documentation to restore listing visibility."
          )}
        </p>
      </div>
    </div>
  );
}
