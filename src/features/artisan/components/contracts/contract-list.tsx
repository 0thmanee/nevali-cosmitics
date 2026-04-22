"use client";

import React from "react";
import { ContractCard } from "./contract-card";
import type { ContractDisplay } from "./contracts-types";

export type ContractListProps = {
  contracts: ContractDisplay[];
  isLoading: boolean;
};

export function ContractList({ contracts, isLoading }: ContractListProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">Loading contracts…</p>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div
        className="rounded-xl px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">
          No active contracts yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}
