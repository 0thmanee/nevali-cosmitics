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
      style={{ background: "color-mix(in srgb, var(--color-ink) 40%, transparent)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-partner-title"
    >
      <div
        className="w-full max-w-sm rounded-sm overflow-hidden"
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
          <h2 id="delete-partner-title" className="font-serif font-bold text-[15px] text-text-dark">
            Delete partner
          </h2>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">
            This will permanently remove the partner and their profile. This action cannot be undone.
          </p>
        </div>
        <div className="p-5">
          <p className="font-sans text-sm text-text-dark">
            <span className="font-semibold">{user.name}</span> — {user.email}
          </p>
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-sm font-medium rounded-sm px-4 py-2.5 transition-colors"
              style={{ background: "var(--color-paper)", color: "var(--color-ink)", border: "1px solid var(--color-cream-dark)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.id)}
              disabled={isDeleting}
              className="font-sans text-sm font-semibold rounded-sm px-4 py-2.5 transition-colors disabled:opacity-60"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 15%, transparent)",
                color: "var(--color-danger-dark)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)",
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
