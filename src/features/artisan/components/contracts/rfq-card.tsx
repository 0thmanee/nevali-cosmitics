"use client";

import React from "react";
import { RfqThreadPanel } from "~/components/rfq-thread-panel";
import { RFQ_STATUS_STYLE } from "./contracts-constants";
import type { RfqDisplay } from "./contracts-types";

export type RfqCardProps = {
  rfq: RfqDisplay;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onQuote?: () => void;
  onEditQuote?: () => void;
  onNegotiate?: () => void;
  onRespond?: () => void;
  onRecordContract?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
};

export function RfqCard({
  rfq,
  isExpanded,
  onToggleExpand,
  onQuote,
  onEditQuote,
  onNegotiate,
  onRespond,
  onRecordContract,
  onDecline,
  onCancel,
}: RfqCardProps) {
  const statusStyle = RFQ_STATUS_STYLE[rfq.status] ?? { bg: "", color: "", border: "", label: rfq.status };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid #f0e8dc" }}
    >
      <div className="px-5 py-4 flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-xs text-white shrink-0"
          style={{ background: rfq.buyerColor }}
        >
          {rfq.buyerInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-sans font-semibold text-sm text-[#2a0f05] leading-tight">
                  {rfq.buyer}
                </p>
                <span className="font-sans text-[10px] text-[#7a4d38] font-mono">
                  {rfq.id.slice(0, 12)}
                </span>
                <span
                  className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase"
                  style={statusStyle}
                >
                  {statusStyle.label ?? rfq.status}
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#7a4d38]">
                {rfq.location ? `${rfq.location} · ` : ""}
                {rfq.product} · {rfq.quantity}
              </p>
              <p className="font-sans text-[11px] text-[#7a4d38]/60 mt-0.5">
                Received {rfq.received} · Deadline {rfq.deadline} · Est. {rfq.value}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {rfq.status === "NEW" && onQuote && (
                <button
                  type="button"
                  onClick={onQuote}
                  className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors"
                  style={{ background: "#1a0500", color: "white" }}
                >
                  Quote
                </button>
              )}
              {rfq.status === "QUOTED" && onEditQuote && (
                <button
                  type="button"
                  onClick={onEditQuote}
                  className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors"
                  style={{
                    background: "rgba(201,145,61,0.12)",
                    color: "#C9913D",
                    border: "1px solid rgba(201,145,61,0.25)",
                  }}
                >
                  Edit Quote
                </button>
              )}
              {rfq.status === "QUOTED" && onNegotiate && (
                <button
                  type="button"
                  onClick={onNegotiate}
                  className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors"
                  style={{
                    background: "rgba(167,139,250,0.12)",
                    color: "#a78bfa",
                    border: "1px solid rgba(167,139,250,0.25)",
                  }}
                >
                  Open negotiation
                </button>
              )}
              {rfq.status === "NEGOTIATING" && onRespond && (
                <button
                  type="button"
                  onClick={onRespond}
                  className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors"
                  style={{
                    background: "rgba(167,139,250,0.12)",
                    color: "#a78bfa",
                    border: "1px solid rgba(167,139,250,0.25)",
                  }}
                >
                  Open thread
                </button>
              )}
              {(rfq.status === "QUOTED" || rfq.status === "NEGOTIATING") && onRecordContract && (
                <button
                  type="button"
                  onClick={onRecordContract}
                  className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors"
                  style={{
                    background: "rgba(22,163,74,0.12)",
                    color: "#15803d",
                    border: "1px solid rgba(22,163,74,0.28)",
                  }}
                >
                  Record contract
                </button>
              )}
              {(rfq.status === "DECLINED" || rfq.status === "CANCELLED") && (
                <span className="font-sans text-[12px] text-[#7a4d38]">
                  {rfq.status === "CANCELLED" ? "Cancelled" : "Closed"}
                </span>
              )}
              <button
                type="button"
                onClick={onToggleExpand}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "#F5F0E8", border: "1px solid #f0e8dc" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="#7a4d38"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div
          className="px-5 pb-5 border-t"
          style={{ borderColor: "#f0e8dc" }}
        >
          <div className="pt-4 flex flex-col gap-3">
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: "#F5F0E8", border: "1px solid #f0e8dc" }}
            >
              <p className="font-sans text-[10px] font-bold tracking-wider text-[#7a4d38] uppercase mb-1">
                Buyer Message
              </p>
              <p className="font-sans text-[13px] text-[#2a0f05] leading-relaxed">
                {rfq.message || "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Product", value: rfq.product },
                { label: "Quantity", value: rfq.quantity },
                { label: "Est. Value", value: rfq.value },
                { label: "Response Deadline", value: rfq.deadline },
              ].map((d) => (
                <div
                  key={d.label}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "#F5F0E8", border: "1px solid #f0e8dc" }}
                >
                  <p className="font-sans text-[9px] font-bold tracking-wider text-[#7a4d38] uppercase">
                    {d.label}
                  </p>
                  <p className="font-sans text-[12px] font-semibold text-[#2a0f05] mt-0.5">
                    {d.value}
                  </p>
                </div>
              ))}
            </div>
            {(rfq.status === "QUOTED" || rfq.status === "NEGOTIATING") && (
              <div
                className="rounded-xl border px-4 py-3"
                style={{ borderColor: "#f0e8dc", background: "#fff" }}
              >
                <p className="mb-2 font-sans font-bold text-[10px] uppercase tracking-wider text-[#7a4d38]">
                  Quote thread
                </p>
                <RfqThreadPanel rfqId={rfq.id} turnHint={rfq.negotiationHint || undefined} />
              </div>
            )}
            {(rfq.status === "NEW" || rfq.status === "QUOTED" || rfq.status === "NEGOTIATING") &&
              (onDecline || onCancel) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: "#f0e8dc" }}>
                  {onDecline && (
                    <button
                      type="button"
                      onClick={onDecline}
                      className="font-sans text-[12px] text-red-700 hover:underline"
                    >
                      Decline inquiry
                    </button>
                  )}
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="font-sans text-[12px] text-[#7a4d38] hover:underline"
                    >
                      Cancel thread
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
