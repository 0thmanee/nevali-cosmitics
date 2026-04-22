"use client";

import React from "react";
import type { RfqRow } from "~/app/api/contracts";
import { mapRfqToDisplay } from "./contracts-mappers";
import { RfqCard } from "./rfq-card";

export type RfqListProps = {
  rfqs: RfqRow[];
  isLoading: boolean;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onQuote: (r: RfqRow) => void;
  onEditQuote: (r: RfqRow) => void;
  onNegotiate: (r: RfqRow) => void;
  onRespond: (r: RfqRow) => void;
  onRecordContract: (r: RfqRow) => void;
  onDecline: (r: RfqRow) => void;
  onCancel: (r: RfqRow) => void;
};

export function RfqList({
  rfqs,
  isLoading,
  expandedId,
  onToggleExpand,
  onQuote,
  onEditQuote,
  onNegotiate,
  onRespond,
  onRecordContract,
  onDecline,
  onCancel,
}: RfqListProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">Loading RFQs…</p>
      </div>
    );
  }

  if (rfqs.length === 0) {
    return (
      <div
        className="rounded-xl px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">
          No RFQs yet. When buyers send requests, they’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rfqs.map((r, i) => (
        <RfqCard
          key={r.id}
          rfq={mapRfqToDisplay(r, i)}
          isExpanded={expandedId === r.id}
          onToggleExpand={() => onToggleExpand(expandedId === r.id ? "" : r.id)}
          onQuote={r.status === "NEW" ? () => onQuote(r) : undefined}
          onEditQuote={r.status === "QUOTED" ? () => onEditQuote(r) : undefined}
          onNegotiate={r.status === "QUOTED" ? () => onNegotiate(r) : undefined}
          onRespond={r.status === "NEGOTIATING" ? () => onRespond(r) : undefined}
          onRecordContract={
            r.status === "QUOTED" || r.status === "NEGOTIATING" ? () => onRecordContract(r) : undefined
          }
          onDecline={
            r.status === "NEW" || r.status === "QUOTED" || r.status === "NEGOTIATING"
              ? () => onDecline(r)
              : undefined
          }
          onCancel={
            r.status === "NEW" || r.status === "QUOTED" || r.status === "NEGOTIATING"
              ? () => onCancel(r)
              : undefined
          }
        />
      ))}
    </div>
  );
}
