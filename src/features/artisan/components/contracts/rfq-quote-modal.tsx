"use client";

import React, { useEffect, useState } from "react";
import type { SubmitProducerRfqQuoteInput } from "~/app/api/contracts";

type Props = {
  open: boolean;
  title: string;
  rfqId: string | null;
  initialEstimatedValue: string;
  initialDeadlineYmd: string;
  isPending: boolean;
  onClose: () => void;
  onSave: (input: SubmitProducerRfqQuoteInput) => Promise<{ error?: string }>;
};

export function RfqQuoteModal({
  open,
  title,
  rfqId,
  initialEstimatedValue,
  initialDeadlineYmd,
  isPending,
  onClose,
  onSave,
}: Props) {
  const [estimatedValue, setEstimatedValue] = useState(initialEstimatedValue);
  const [deadlineYmd, setDeadlineYmd] = useState(initialDeadlineYmd);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEstimatedValue(initialEstimatedValue);
      setDeadlineYmd(initialDeadlineYmd);
      setError(null);
    }
  }, [open, initialEstimatedValue, initialDeadlineYmd]);

  if (!open || !rfqId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={() => !isPending && onClose()}
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border"
        style={{ borderColor: "#f0e8dc" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-quote-title"
      >
        <h2 id="rfq-quote-title" className="font-serif font-bold text-lg text-[#2a0f05] mb-1">
          {title}
        </h2>
        <p className="font-sans text-sm text-[#7a4d38] mb-4">
          Add an estimated value (e.g. ~€8,200 or quote range). Optional response deadline for the buyer.
        </p>
        <div className="flex flex-col gap-3">
          <label className="font-sans text-xs font-semibold text-[#7a4d38] uppercase tracking-wide">
            Estimated value
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 font-sans text-sm text-[#2a0f05]"
              style={{ borderColor: "#e8d8c8" }}
              placeholder="e.g. ~€12,500"
              disabled={isPending}
            />
          </label>
          <label className="font-sans text-xs font-semibold text-[#7a4d38] uppercase tracking-wide">
            Response deadline (optional)
            <input
              type="date"
              value={deadlineYmd}
              onChange={(e) => setDeadlineYmd(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 font-sans text-sm text-[#2a0f05]"
              style={{ borderColor: "#e8d8c8" }}
              disabled={isPending}
            />
          </label>
        </div>
        {error && (
          <p className="mt-3 font-sans text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => !isPending && onClose()}
            className="font-sans text-sm font-medium px-4 py-2 rounded-xl border border-[#e8d8c8] text-[#7a4d38] hover:bg-[#faf7f4]"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending || !estimatedValue.trim()}
            onClick={async () => {
              setError(null);
              const res = await onSave({
                rfqId,
                estimatedValue: estimatedValue.trim(),
                deadlineAt: deadlineYmd.trim() || null,
              });
              if (res.error) {
                setError(res.error);
                return;
              }
              onClose();
            }}
            className="font-sans text-sm font-semibold px-5 py-2 rounded-xl text-white disabled:opacity-50"
            style={{ background: "#1a0500" }}
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
