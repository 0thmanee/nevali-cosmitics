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
          className="rounded-sm overflow-hidden"
          style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => onToggleFaq(openFaqIndex === i ? null : i)}
          >
            <span className="font-sans font-semibold text-sm text-text-dark leading-snug">
              {faq.q}
            </span>
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border transition-colors"
              style={{
                borderColor: openFaqIndex === i ? "var(--color-gold)" : "color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))",
                background: openFaqIndex === i ? "color-mix(in srgb, var(--color-gold) 8%, transparent)" : "transparent",
              }}
            >
              <span
                className="font-sans font-bold text-sm leading-none"
                style={{ color: "var(--color-gold)", marginTop: -1 }}
              >
                {openFaqIndex === i ? "−" : "+"}
              </span>
            </div>
          </button>
          {openFaqIndex === i && (
            <p className="font-sans text-[13px] text-text-muted leading-relaxed px-5 pb-5">
              {faq.a}
            </p>
          )}
        </div>
      ))}
      <div
        className="rounded-sm px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
      >
        <div>
          <p className="font-sans font-semibold text-[15px] text-text-dark">
            Still need help?
          </p>
          <p className="font-sans text-sm text-text-muted mt-0.5">
            Our team typically responds within 4 business hours.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTicket}
          className="font-sans font-semibold text-sm text-white rounded-sm px-5 py-2.5 shrink-0 transition-colors flex items-center gap-2"
          style={{ background: "var(--color-ink)" }}
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
