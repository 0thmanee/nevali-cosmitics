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
          className="font-sans text-[12px] font-semibold rounded-xl px-4 py-1.5 transition-colors"
          style={
            activeTab === tab
              ? { background: "#000000", color: "white" }
              : { background: "white", color: "#727272", border: "1px solid #d8d0c4" }
          }
        >
          {tab}
          {tab === "My Tickets" && (
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
              {ticketCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
