"use client";

import React, { useState } from "react";
import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";

const OPTIONS: { value: ProductPaymentOptionValue; label: string; hint: string }[] = [
  { value: "CARD", label: "Card payment", hint: "Buyers pay online by card." },
  { value: "COD", label: "Cash on delivery (COD)", hint: "Payment when the order is delivered." },
  { value: "BOTH", label: "Card & COD", hint: "Buyers can choose either method." },
];

export type ApproveProductModalProps = {
  productName: string;
  onConfirm: (paymentOption: ProductPaymentOptionValue) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function ApproveProductModal({
  productName,
  onConfirm,
  onCancel,
  isSubmitting,
}: ApproveProductModalProps) {
  const [paymentOption, setPaymentOption] = useState<ProductPaymentOptionValue>("BOTH");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "color-mix(in srgb, var(--color-ink) 40%, transparent)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="approve-modal-title"
    >
      <div
        className="rounded-sm w-full max-w-md overflow-hidden"
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
          <h3 id="approve-modal-title" className="font-serif font-bold text-[15px] text-text-dark">
            Approve product
          </h3>
          <p className="font-sans text-[12px] text-text-muted mt-0.5">{productName}</p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="font-sans text-[11px] font-bold tracking-[0.12em] text-text-muted uppercase">
            How can buyers pay?
          </p>
          <div className="flex flex-col gap-2">
            {OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 rounded-sm border px-3.5 py-3 cursor-pointer transition-colors ${
                  paymentOption === opt.value
                    ? "border-[var(--color-ink)] bg-[var(--color-paper)]"
                    : "border-cream-dark hover:border-[color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))]"
                }`}
              >
                <input
                  type="radio"
                  name="payment-option"
                  value={opt.value}
                  checked={paymentOption === opt.value}
                  onChange={() => setPaymentOption(opt.value)}
                  className="mt-1 shrink-0"
                  disabled={isSubmitting}
                />
                <span className="min-w-0">
                  <span className="font-sans font-semibold text-sm text-text-dark block">{opt.label}</span>
                  <span className="font-sans text-[12px] text-text-muted mt-0.5 block">{opt.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onConfirm(paymentOption)}
              disabled={isSubmitting}
              className="font-sans font-semibold text-sm text-white rounded-sm px-4 py-2.5 transition-colors disabled:opacity-60"
              style={{ background: "var(--color-ink)" }}
            >
              {isSubmitting ? "Approving…" : "Approve product"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="font-sans text-sm font-medium text-text-muted hover:text-text-dark transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
