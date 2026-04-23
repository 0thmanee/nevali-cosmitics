"use client";

import React from "react";
import { SUPPORT_FAQ } from "./support-constants";
import type { SupportTab } from "./support-constants";

export type SupportFaqSectionProps = {
  openFaqIndex: number | null;
  onToggleFaq: (index: number | null) => void;
  onOpenTicket: () => void;
};

export function SupportFaqSection({
  openFaqIndex,
  onToggleFaq,
  onOpenTicket,
}: SupportFaqSectionProps) {
  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {SUPPORT_FAQ.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ background: "white", border: "1px solid #d8d0c4" }}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => onToggleFaq(openFaqIndex === i ? null : i)}
          >
            <span className="font-sans font-semibold text-sm text-[#000000] leading-snug">
              {faq.q}
            </span>
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border transition-colors"
              style={{
                borderColor: openFaqIndex === i ? "#C9913D" : "#d4c4a0",
                background: openFaqIndex === i ? "rgba(201,145,61,0.08)" : "transparent",
              }}
            >
              <span
                className="font-sans font-bold text-sm leading-none"
                style={{ color: "#C9913D", marginTop: -1 }}
              >
                {openFaqIndex === i ? "−" : "+"}
              </span>
            </div>
          </button>
          {openFaqIndex === i && (
            <p className="font-sans text-[13px] text-[#727272] leading-relaxed px-5 pb-5">
              {faq.a}
            </p>
          )}
        </div>
      ))}
      <div
        className="rounded-xl px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
      >
        <div>
          <p className="font-sans font-semibold text-[15px] text-[#000000]">
            Still need help?
          </p>
          <p className="font-sans text-sm text-[#727272] mt-0.5">
            Our team typically responds within 4 business hours.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTicket}
          className="font-sans font-semibold text-sm text-white rounded-xl px-5 py-2.5 shrink-0 transition-colors flex items-center gap-2"
          style={{ background: "#000000" }}
        >
          Open a Ticket
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
