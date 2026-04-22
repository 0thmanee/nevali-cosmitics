"use client";

import React from "react";
import { Award, CheckCircle, Clock, XCircle } from "lucide-react";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";

// ── Status chip ───────────────────────────────────────────────────────────────

function StatusChip({ label, count, color, dot }: { label: string; count: number; color: string; dot: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
      <span className="font-sans text-[12px] text-[#7a4d38]">{label}</span>
      <span className="font-sans text-[12px] font-bold" style={{ color }}>{count}</span>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ approved, total, color }: { approved: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((approved / total) * 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-[#f0e8dc] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Cert type row ─────────────────────────────────────────────────────────────

function CertTypeRow({
  icon,
  label,
  total,
  approved,
  pending,
  rejected,
  accentColor,
  barColor,
  emptyHint,
}: {
  icon: React.ReactNode;
  label: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  accentColor: string;
  barColor: string;
  emptyHint: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ border: "1px solid #f0e8dc", background: "#FAFAF7" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: accentColor + "18" }}>
            {icon}
          </div>
          <span className="font-sans font-semibold text-[13px] text-[#2a0f05]">{label}</span>
        </div>
        <span
          className="font-sans text-[11px] font-bold rounded-full px-2 py-0.5"
          style={{ background: accentColor + "14", color: accentColor }}
        >
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <p className="font-sans text-[12px] text-[#7a4d38] italic">{emptyHint}</p>
      ) : (
        <>
          <ProgressBar approved={approved} total={total} color={barColor} />
          <div className="flex items-center gap-5 flex-wrap">
            <StatusChip label="Approved" count={approved} color="#16a34a" dot="#4ade80" />
            <StatusChip label="Pending"  count={pending}  color="#C8963C" dot="#fbbf24" />
            <StatusChip label="Rejected" count={rejected} color="#dc2626" dot="#f87171" />
          </div>
        </>
      )}
    </div>
  );
}

// ── Stat number ───────────────────────────────────────────────────────────────

function StatNumber({ value, label, sub }: { value: number; label: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-serif font-bold text-[28px] text-[#2a0f05] leading-none">{value}</span>
      <span className="font-sans text-[12px] font-semibold text-[#2a0f05]">{label}</span>
      {sub && <span className="font-sans text-[11px] text-[#7a4d38]">{sub}</span>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function CertificationOverview() {
  const { data: certifications = [], isLoading: certLoading } = useCertifications();
  const { data: certifiedProducts = [], isLoading: productsLoading } = useCertifiedProducts();

  const isLoading = certLoading || productsLoading;

  const globalCerts  = certifications.filter((c) => !c.productId);
  const productCerts = certifications.filter((c) => !!c.productId);

  const gApproved = globalCerts.filter((c) => c.status === "APPROVED").length;
  const gPending  = globalCerts.filter((c) => c.status === "PENDING").length;
  const gRejected = globalCerts.filter((c) => c.status === "REJECTED").length;

  const pApproved = productCerts.filter((c) => c.status === "APPROVED").length;
  const pPending  = productCerts.filter((c) => c.status === "PENDING").length;
  const pRejected = productCerts.filter((c) => c.status === "REJECTED").length;

  const certifiedCount  = certifiedProducts.length;
  const totalApproved   = gApproved + pApproved;
  const totalPending    = gPending + pPending;
  const totalRejected   = gRejected + pRejected;

  if (isLoading) {
    return (
      <div className="rounded-xl py-12 flex items-center justify-center" style={{ background: "white", border: "1px solid #f0e8dc" }}>
        <p className="font-sans text-[13px] text-[#7a4d38]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Top stat strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { value: certifiedCount, label: "Certified products", icon: <Award      size={18} strokeWidth={1.5} />, bg: "rgba(26,5,0,0.08)",   color: "#2a0f05" },
          { value: totalApproved,  label: "Approved certs",     icon: <CheckCircle size={18} strokeWidth={1.5} />, bg: "rgba(22,163,74,0.08)",  color: "#16a34a" },
          { value: totalPending,   label: "Pending review",     icon: <Clock       size={18} strokeWidth={1.5} />, bg: "rgba(201,145,61,0.08)", color: "#C8963C" },
          { value: totalRejected,  label: "Rejected",           icon: <XCircle     size={18} strokeWidth={1.5} />, bg: "rgba(220,38,38,0.08)",  color: "#dc2626" },
        ] as const).map(({ value, label, icon, bg, color }) => (
          <div key={label} className="rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ background: "white", border: "1px solid #f0e8dc" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>
              {icon}
            </div>
            <div>
              <p className="font-serif font-bold text-[22px] leading-none" style={{ color }}>{value}</p>
              <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">

        {/* Left: breakdown card */}
        <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #f0e8dc" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#f0e8dc" }}>
            <h3 className="font-serif font-bold text-[15px] text-[#2a0f05]">Certification breakdown</h3>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <CertTypeRow
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z" stroke="#2a0f05" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              }
              label="Organization certifications"
              total={globalCerts.length}
              approved={gApproved}
              pending={gPending}
              rejected={gRejected}
              accentColor="#2a0f05"
              barColor="#4ade80"
              emptyHint="No organization certifications yet — go to Documents to upload your ISO, BIO or export licenses."
            />
            <CertTypeRow
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="5" width="11" height="7.5" rx="1.5" stroke="#2563EB" strokeWidth="1.2" />
                  <path d="M4.5 5V4a2.5 2.5 0 0 1 5 0v1" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="8.5" r="1.2" fill="#2563EB" />
                </svg>
              }
              label="Product certifications"
              total={productCerts.length}
              approved={pApproved}
              pending={pPending}
              rejected={pRejected}
              accentColor="#2563EB"
              barColor="#60a5fa"
              emptyHint="No product certifications yet — go to Documents and select a product to attach a certificate."
            />
          </div>
        </div>

        {/* Right: info + tips */}
        <div className="flex flex-col gap-3">

          {/* Rejection alert */}
          {totalRejected > 0 && (
            <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.18)" }}>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#dc2626" strokeWidth="1.2" />
                  <path d="M7 4v4" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="7" cy="10" r="0.8" fill="#dc2626" />
                </svg>
                <span className="font-sans text-[11px] font-bold text-[#dc2626] uppercase tracking-wide">Action needed</span>
              </div>
              <p className="font-sans text-[12px] text-[#dc2626]/80 leading-relaxed">
                <strong>{totalRejected}</strong> certification{totalRejected !== 1 ? "s were" : " was"} rejected. Go to the Documents tab to review and re-upload.
              </p>
            </div>
          )}

          {/* Certified products */}
          <div className="rounded-xl px-4 py-4 flex flex-col gap-3" style={{ background: "white", border: "1px solid #f0e8dc" }}>
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "#f0e8dc" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(26,5,0,0.10)" }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z" stroke="#2a0f05" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans font-semibold text-[13px] text-[#2a0f05]">Certified products</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-serif font-bold text-[32px] leading-none text-[#2a0f05]">{certifiedCount}</span>
              <span className="font-sans text-[12px] text-[#7a4d38] mb-1">product{certifiedCount !== 1 ? "s" : ""} approved</span>
            </div>
            <p className="font-sans text-[11px] text-[#7a4d38] leading-relaxed">
              Products approved by the admin appear in the public marketplace under your partner profile.
            </p>
          </div>

          {/* Renewal tip */}
          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "rgba(201,145,61,0.06)", border: "1px solid rgba(201,145,61,0.20)" }}>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#C8963C" strokeWidth="1.2" />
                <path d="M7 4v3.5l2 1.5" stroke="#C8963C" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="font-sans text-[11px] font-bold text-[#C8963C] uppercase tracking-wide">Renewal reminder</span>
            </div>
            <p className="font-sans text-[12px] text-[#C8963C]/80 leading-relaxed">
              Keep your documents up to date. Re-submit updated certificates before they expire.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
