"use client";

import React from "react";
import { CONTRACTS_TABS, type ContractsTab } from "./contracts-constants";
import type { ContractsCounts } from "./contracts-types";

export type ContractsTabListProps = {
  activeTab: ContractsTab;
  onTabChange: (tab: ContractsTab) => void;
  counts: ContractsCounts;
};

export function ContractsTabList({
  activeTab,
  onTabChange,
  counts,
}: ContractsTabListProps) {
  return (
    <div className="flex items-center gap-1">
      {CONTRACTS_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className="font-sans text-[12px] font-semibold rounded-xl px-4 py-1.5 transition-colors"
          style={
            activeTab === tab
              ? { background: "#1a0500", color: "white" }
              : { background: "white", color: "#7a4d38", border: "1px solid #f0e8dc" }
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
                : { background: "rgba(26,5,0,0.08)", color: "#7a4d38" }
            }
          >
            {counts[tab]}
          </span>
        </button>
      ))}
    </div>
  );
}
