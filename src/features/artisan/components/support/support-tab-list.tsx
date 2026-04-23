"use client";

import React from "react";
import { SUPPORT_TABS, type SupportTab } from "./support-constants";

export type SupportTabListProps = {
  activeTab: SupportTab;
  onTabChange: (tab: SupportTab) => void;
  ticketCount: number;
};

export function SupportTabList({
  activeTab,
  onTabChange,
  ticketCount,
}: SupportTabListProps) {
  return (
    <div className="flex items-center gap-1">
      {SUPPORT_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className="font-sans text-[12px] font-semibold rounded-sm px-4 py-1.5 transition-colors"
          style={
            activeTab === tab
              ? { background: "var(--color-ink)", color: "white" }
              : { background: "white", color: "var(--color-text-muted)", border: "1px solid var(--color-cream-dark)" }
          }
        >
          {tab}
          {tab === "My Tickets" && (
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
              {ticketCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
