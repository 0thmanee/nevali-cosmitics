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
      className="rounded-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
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
            <circle cx="6" cy="6" r="4.5" stroke="var(--color-text-muted)" strokeWidth="1.3" />
            <path
              d="M9.5 9.5L12 12"
              stroke="var(--color-text-muted)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full font-sans text-sm text-text-dark pl-8 pr-4 py-2 rounded-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className="font-sans text-[12px] font-semibold rounded-sm px-3.5 py-1.5 transition-colors"
              style={
                activeTab === tab
                  ? { background: "var(--color-ink)", color: "white" }
                  : {
                      background: "var(--color-paper)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-cream-dark)",
                    }
              }
            >
              {tab}
              <span
                className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5"
                style={
                  activeTab === tab
                    ? {
                        background: "color-mix(in srgb, var(--color-paper) 15%, transparent)",
                        color: "color-mix(in srgb, var(--color-paper) 80%, transparent)",
                      }
                    : { background: "color-mix(in srgb, var(--color-ink) 8%, transparent)", color: "var(--color-text-muted)" }
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
