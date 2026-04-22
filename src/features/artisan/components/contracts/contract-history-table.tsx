"use client";

import React from "react";
import type { ContractHistoryRowDisplay } from "./contracts-types";

export type ContractHistoryTableProps = {
  rows: ContractHistoryRowDisplay[];
  isLoading: boolean;
};

export function ContractHistoryTable({
  rows,
  isLoading,
}: ContractHistoryTableProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl overflow-hidden px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">Loading history…</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">
          No completed contracts yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid #f0e8dc" }}
    >
      <div
        className="grid px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#7a4d38] uppercase"
        style={{
          gridTemplateColumns: "auto 2fr 1fr 1fr 1fr 1fr",
          borderBottom: "1px solid #f0e8dc",
          background: "#FAFAF7",
        }}
      >
        <span className="mr-4">Buyer</span>
        <span>Product</span>
        <span>Value</span>
        <span>Period</span>
        <span>Deliveries</span>
        <span>Status</span>
      </div>
      {rows.map((h, i) => (
        <div
          key={h.id}
          className="grid items-center px-5 py-4 gap-4"
          style={{
            gridTemplateColumns: "auto 2fr 1fr 1fr 1fr 1fr",
            borderTop: i > 0 ? "1px solid #f0e8dc" : "none",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-sans font-bold text-xs text-white shrink-0"
            style={{ background: h.buyerColor }}
          >
            {h.buyerInitials}
          </div>
          <div className="min-w-0">
            <p className="font-sans font-semibold text-sm text-[#2a0f05] truncate">
              {h.buyer}
            </p>
            <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">
              {h.product}
            </p>
          </div>
          <span className="font-sans font-semibold text-sm text-[#2a0f05]">
            {h.value}
          </span>
          <span className="font-sans text-[12px] text-[#7a4d38]">{h.period}</span>
          <span className="font-sans text-[12px] text-[#7a4d38]">
            {h.deliveries}
          </span>
          <span
            className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1 uppercase w-fit"
            style={{
              background: "rgba(26,5,0,0.08)",
              color: "#7a4d38",
              border: "1px solid #f0e8dc",
            }}
          >
            Completed
          </span>
        </div>
      ))}
    </div>
  );
}
