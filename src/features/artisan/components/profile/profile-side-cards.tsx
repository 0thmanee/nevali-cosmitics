"use client";

import React from "react";
import Link from "next/link";
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
      <div className="rounded-xl overflow-hidden" style={{ background: "#1a0500" }}>
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="font-display font-bold uppercase text-[15px] text-white tracking-wide">Artisan status</h3>
          <p className="font-sans text-[11px] text-white/40 mt-0.5">nevali verified brand</p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(200,150,60,0.1)", border: "1px solid rgba(200,150,60,0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z" stroke="#C8963C" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-[#C8963C]">Active & Certified</p>
              <p className="font-sans text-[11px] text-white/40">Registered artisan on the platform</p>
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
            className="w-full font-sans text-[12px] font-semibold rounded-xl py-2 transition-colors text-center block hover:opacity-90"
            style={{ background: "rgba(200,150,60,0.12)", color: "#C8963C", border: "1px solid rgba(200,150,60,0.2)" }}
          >
            Download Certificate
          </Link>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #f0e8dc" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f0e8dc" }}>
          <h3 className="font-display font-bold uppercase text-[15px] text-[#2a0f05] tracking-wide">Documents</h3>
          <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">Certification files on record</p>
        </div>
        <div className="p-5 flex flex-col gap-2">
          {isLoading && (
            <p className="font-sans text-[12px] text-[#7a4d38] py-2">Loading documents…</p>
          )}
          {isError && (
            <p className="font-sans text-[12px] text-[#f87171] py-2">Failed to load documents.</p>
          )}
          {!isLoading && !isError && certifications.length === 0 && (
            <p className="font-sans text-[12px] text-[#7a4d38] py-2">No documents yet. Upload certifications below or on the Certification page.</p>
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
                      <rect x="2" y="1" width="9" height="11" rx="1.5" stroke="#7a4d38" strokeWidth="1.1" />
                      <line x1="4.5" y1="5" x2="8.5" y2="5" stroke="#7a4d38" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="4.5" y1="7.5" x2="7" y2="7.5" stroke="#7a4d38" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[12px] text-[#2a0f05] truncate hover:underline block min-w-0"
                    >
                      {doc.name}
                    </a>
                  </div>
                  <span
                    className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase shrink-0"
                    style={
                      isVerified
                        ? { background: "rgba(26,5,0,0.85)", color: "#C8963C", border: "1px solid rgba(200,150,60,0.3)" }
                        : isRejected
                          ? { background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }
                          : { background: "rgba(201,145,61,0.15)", color: "#C9913D", border: "1px solid rgba(201,145,61,0.3)" }
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          <Link
            href="/artisan/certification"
            className="w-full font-sans text-[12px] font-medium rounded-xl py-2 mt-1 transition-colors text-center block hover:opacity-90"
            style={{ background: "#FAF5EE", color: "#2a0f05", border: "1px solid #f0e8dc" }}
          >
            + Upload Document
          </Link>
        </div>
      </div>
    </div>
  );
}
