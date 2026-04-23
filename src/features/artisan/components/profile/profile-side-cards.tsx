"use client";

import React from "react";
import Link from "next/link";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";

type CertificationCardProps = {
  partnerId: string;
  partnerSince: string;
};

function documentStatusLabel(status: string): "Verified" | "Pending" | "Rejected" {
  switch (status) {
    case "APPROVED":
      return "Verified";
    case "PENDING":
      return "Pending";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

export function ProfileSideCards({ partnerId, partnerSince }: CertificationCardProps) {
  const { data: certifications = [], isLoading, isError } = useCertifications();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm overflow-hidden" style={{ background: "var(--color-ink)" }}>
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="font-display font-bold uppercase text-[15px] text-white tracking-wide">Artisan status</h3>
          <p className="font-sans text-[11px] text-white/40 mt-0.5">
            {SHOW_MULTI_PRODUCER_EXPERIENCE ? "nevali verified brand" : `${NEVALI_HOUSE_BRAND.legalName} studio profile`}
          </p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in srgb, var(--color-gold) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z" stroke="var(--color-text-muted)" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-text-muted">Active & Certified</p>
              <p className="font-sans text-[11px] text-white/40">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Registered artisan on the platform" : `Registered producer for ${NEVALI_HOUSE_BRAND.legalName}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] text-white/40">Artisan ID</span>
              <span className="font-sans text-[11px] font-semibold text-white/80">{partnerId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] text-white/40">Member since</span>
              <span className="font-sans text-[11px] font-semibold text-white/80">{partnerSince}</span>
            </div>
          </div>
          <Link
            href="/api/certificate"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-sans text-[12px] font-semibold rounded-sm py-2 transition-colors text-center block hover:opacity-90"
            style={{ background: "color-mix(in srgb, var(--color-gold) 12%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)" }}
          >
            Download Certificate
          </Link>
        </div>
      </div>

      <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
          <h3 className="font-display font-bold uppercase text-[15px] text-text-dark tracking-wide">Documents</h3>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">Certification files on record</p>
        </div>
        <div className="p-5 flex flex-col gap-2">
          {isLoading && (
            <p className="font-sans text-[12px] text-text-muted py-2">Loading documents…</p>
          )}
          {isError && (
            <p className="font-sans text-[12px] text-[var(--color-danger)] py-2">Failed to load documents.</p>
          )}
          {!isLoading && !isError && certifications.length === 0 && (
            <p className="font-sans text-[12px] text-text-muted py-2">No documents yet. Upload certifications below or on the Certification page.</p>
          )}
          {!isLoading &&
            certifications.map((doc: CertificationRow) => {
              const label = documentStatusLabel(doc.status);
              const isVerified = doc.status === "APPROVED";
              const isRejected = doc.status === "REJECTED";
              return (
                <div key={doc.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
                      <rect x="2" y="1" width="9" height="11" rx="1.5" stroke="var(--color-text-muted)" strokeWidth="1.1" />
                      <line x1="4.5" y1="5" x2="8.5" y2="5" stroke="var(--color-text-muted)" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="4.5" y1="7.5" x2="7" y2="7.5" stroke="var(--color-text-muted)" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[12px] text-text-dark truncate hover:underline block min-w-0"
                    >
                      {doc.name}
                    </a>
                  </div>
                  <span
                    className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase shrink-0"
                    style={
                      isVerified
                        ? { background: "color-mix(in srgb, var(--color-ink) 85%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)" }
                        : isRejected
                          ? { background: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)", border: "1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)" }
                          : { background: "color-mix(in srgb, var(--color-gold) 15%, transparent)", color: "var(--color-gold)", border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)" }
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          <Link
            href="/artisan/certification"
            className="w-full font-sans text-[12px] font-medium rounded-sm py-2 mt-1 transition-colors text-center block hover:opacity-90"
            style={{ background: "var(--color-paper)", color: "var(--color-ink)", border: "1px solid var(--color-cream-dark)" }}
          >
            + Upload Document
          </Link>
        </div>
      </div>
    </div>
  );
}
