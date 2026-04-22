"use client";

import React from "react";
import type { ContractDisplay } from "./contracts-types";

export type ContractCardProps = {
  contract: ContractDisplay;
};

export function ContractCard({ contract }: ContractCardProps) {
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{ background: "white", border: "1px solid #f0e8dc" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-xs text-white shrink-0"
          style={{ background: contract.buyerColor }}
        >
          {contract.buyerInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-sans font-semibold text-sm text-[#2a0f05]">
                  {contract.buyer}
                </p>
                <span className="font-sans text-[10px] text-[#7a4d38] font-mono">
                  {contract.id.slice(0, 12)}
                </span>
                <span
                  className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase"
                  style={{
                    background: "rgba(26,5,0,0.8)",
                    color: "#C8963C",
                    border: "1px solid rgba(200,150,60,0.25)",
                  }}
                >
                  Active
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#7a4d38]">
                {contract.location ? `${contract.location} · ` : ""}
                {contract.product}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-serif font-bold text-[15px] text-[#2a0f05]">
                {contract.value}
              </p>
              <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">
                {contract.quantity}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-sans text-[11px] text-[#7a4d38]">
                Deliveries: {contract.deliveries}
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#2a0f05]">
                {contract.progress}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "#FAF5EE" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${contract.progress}%`,
                  background: "#C8963C",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-sans text-[11px] text-[#7a4d38]">
                Started {contract.started}
              </span>
              <span className="font-sans text-[11px] text-[#7a4d38]">
                Expires {contract.expires}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-2 mt-4 pt-4 border-t"
        style={{ borderColor: "#f0e8dc" }}
      >
        <button
          type="button"
          className="font-sans text-[12px] font-medium rounded-xl px-4 py-2 transition-colors"
          style={{
            background: "#F5F0E8",
            color: "#2a0f05",
            border: "1px solid #f0e8dc",
          }}
        >
          View Contract
        </button>
        <button
          type="button"
          className="font-sans text-[12px] font-medium rounded-xl px-4 py-2 transition-colors"
          style={{
            background: "#FAF5EE",
            color: "#7b2d1e",
            border: "1px solid #f0e8dc",
          }}
        >
          Message Buyer
        </button>
        <button
          type="button"
          className="font-sans text-[12px] font-medium rounded-xl px-4 py-2 transition-colors"
          style={{
            background: "#F5F0E8",
            color: "#2a0f05",
            border: "1px solid #f0e8dc",
          }}
        >
          Log Delivery
        </button>
      </div>
    </div>
  );
}
