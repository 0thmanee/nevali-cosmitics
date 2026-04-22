"use client";

import React from "react";
import type { PartnerRow } from "~/app/api/partners/schemas/partners.schema";

type Props = {
  user: PartnerRow | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  isDeleting: boolean;
};

export function DeleteConfirmModal({ user, onClose, onConfirm, isDeleting }: Props) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-partner-title"
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f0e8dc" }}>
          <h2 id="delete-partner-title" className="font-serif font-bold text-[15px] text-[#2a0f05]">
            Delete partner
          </h2>
          <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">
            This will permanently remove the partner and their profile. This action cannot be undone.
          </p>
        </div>
        <div className="p-5">
          <p className="font-sans text-sm text-[#2a0f05]">
            <span className="font-semibold">{user.name}</span> — {user.email}
          </p>
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
              style={{ background: "#F5F0E8", color: "#2a0f05", border: "1px solid #f0e8dc" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.id)}
              disabled={isDeleting}
              className="font-sans text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors disabled:opacity-60"
              style={{
                background: "rgba(248,113,113,0.15)",
                color: "#dc2626",
                border: "1px solid rgba(248,113,113,0.4)",
              }}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
