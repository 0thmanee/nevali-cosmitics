"use client";

import React from "react";

const TABS = ["All", "Approved", "Pending", "Rejected"] as const;
export type ProductsTab = (typeof TABS)[number];

export type ProductsFilterBarProps = {
  activeTab: ProductsTab;
  onTabChange: (tab: ProductsTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts: { All: number; Approved: number; Pending: number; Rejected: number };
  action?: React.ReactNode;
};

export function ProductsFilterBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  counts,
  action,
}: ProductsFilterBarProps) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ background: "white", border: "1px solid #d8d0c4" }}
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="6" cy="6" r="4.5" stroke="#727272" strokeWidth="1.3" />
            <path
              d="M9.5 9.5L12 12"
              stroke="#727272"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full font-sans text-sm text-[#000000] pl-8 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className="font-sans text-[12px] font-semibold rounded-xl px-3.5 py-1.5 transition-colors"
              style={
                activeTab === tab
                  ? { background: "#000000", color: "white" }
                  : {
                      background: "#ffffff",
                      color: "#727272",
                      border: "1px solid #d8d0c4",
                    }
              }
            >
              {tab}
              <span
                className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5"
                style={
                  activeTab === tab
                    ? {
                        background: "rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.8)",
                      }
                    : { background: "rgba(0,0,0,0.08)", color: "#727272" }
                }
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
