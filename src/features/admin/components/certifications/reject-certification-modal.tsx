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
      style={{ background: "rgba(13,40,24,0.4)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-cert-modal-title"
    >
      <div
        className="rounded-xl w-full max-w-md overflow-hidden"
        style={{ background: "white", border: "1px solid #d8d0c4" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
          <h3 id="reject-cert-modal-title" className="font-serif font-bold text-[15px] text-[#000000]">
            Reject certification
          </h3>
          <p className="font-sans text-[12px] text-[#727272] mt-0.5">{certificationName}</p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reject-cert-reason"
              className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase"
            >
              Reason for rejection (optional but recommended)
            </label>
            <textarea
              id="reject-cert-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Document expired or unclear. Please upload an updated version."
              rows={3}
              className="font-sans text-sm text-[#000000] rounded-xl px-3.5 py-2.5 outline-none w-full resize-none"
              style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
              maxLength={500}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onConfirm(reason.trim() || "")}
              className="font-sans font-semibold text-sm text-white rounded-xl px-4 py-2.5 transition-colors"
              style={{ background: "#b91c1c" }}
            >
              Reject certification
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="font-sans text-sm font-medium text-[#727272] hover:text-[#000000] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
