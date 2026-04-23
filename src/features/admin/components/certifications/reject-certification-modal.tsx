"use client";

import React, { useState } from "react";

type Props = {
  certificationName: string;
  onConfirm: (rejectionReason: string) => void;
  onCancel: () => void;
};

export function RejectCertificationModal({ certificationName, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "color-mix(in srgb, var(--color-ink) 40%, transparent)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-cert-modal-title"
    >
      <div
        className="rounded-sm w-full max-w-md overflow-hidden"
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
          <h3 id="reject-cert-modal-title" className="font-serif font-bold text-[15px] text-text-dark">
            Reject certification
          </h3>
          <p className="font-sans text-[12px] text-text-muted mt-0.5">{certificationName}</p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reject-cert-reason"
              className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase"
            >
              Reason for rejection (optional but recommended)
            </label>
            <textarea
              id="reject-cert-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Document expired or unclear. Please upload an updated version."
              rows={3}
              className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full resize-none"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
              maxLength={500}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onConfirm(reason.trim() || "")}
              className="font-sans font-semibold text-sm text-white rounded-sm px-4 py-2.5 transition-colors"
              style={{ background: "var(--color-danger-dark)" }}
            >
              Reject certification
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="font-sans text-sm font-medium text-text-muted hover:text-text-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
