"use client";

import React from "react";
import { Award, CheckCircle, Clock, XCircle } from "lucide-react";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";

// ── Status chip ───────────────────────────────────────────────────────────────

function StatusChip({ label, count, color, dot }: { label: string; count: number; color: string; dot: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
      <span className="font-sans text-[12px] text-text-muted">{label}</span>
      <span className="font-sans text-[12px] font-bold" style={{ color }}>{count}</span>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ approved, total, color }: { approved: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((approved / total) * 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-[var(--color-cream-dark)] overflow-hidden">
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
    <div className="flex flex-col gap-3 p-4 rounded-sm" style={{ border: "1px solid var(--color-cream-dark)", background: "var(--color-paper)" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0" style={{ background: accentColor + "18" }}>
            {icon}
          </div>
          <span className="font-sans font-semibold text-[13px] text-text-dark">{label}</span>
        </div>
        <span
          className="font-sans text-[11px] font-bold rounded-full px-2 py-0.5"
          style={{ background: accentColor + "14", color: accentColor }}
        >
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <p className="font-sans text-[12px] text-text-muted italic">{emptyHint}</p>
      ) : (
        <>
          <ProgressBar approved={approved} total={total} color={barColor} />
          <div className="flex items-center gap-5 flex-wrap">
            <StatusChip label="Approved" count={approved} color="var(--color-success)" dot="var(--color-success-light)" />
            <StatusChip label="Pending"  count={pending}  color="var(--color-text-muted)" dot="var(--color-text-muted)" />
            <StatusChip label="Rejected" count={rejected} color="var(--color-danger-dark)" dot="var(--color-danger)" />
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
      <span className="font-serif font-bold text-[28px] text-text-dark leading-none">{value}</span>
      <span className="font-sans text-[12px] font-semibold text-text-dark">{label}</span>
      {sub && <span className="font-sans text-[11px] text-text-muted">{sub}</span>}
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
      <div className="rounded-sm py-12 flex items-center justify-center" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
        <p className="font-sans text-[13px] text-text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Top stat strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { value: certifiedCount, label: "Certified products", icon: <Award      size={18} strokeWidth={1.5} />, bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)",   color: "var(--color-ink)" },
          { value: totalApproved,  label: "Approved certs",     icon: <CheckCircle size={18} strokeWidth={1.5} />, bg: "color-mix(in srgb, var(--color-success) 8%, transparent)",  color: "var(--color-success)" },
          { value: totalPending,   label: "Pending review",     icon: <Clock       size={18} strokeWidth={1.5} />, bg: "color-mix(in srgb, var(--color-gold) 8%, transparent)", color: "var(--color-text-muted)" },
          { value: totalRejected,  label: "Rejected",           icon: <XCircle     size={18} strokeWidth={1.5} />, bg: "color-mix(in srgb, var(--color-danger-dark) 8%, transparent)",  color: "var(--color-danger-dark)" },
        ] as const).map(({ value, label, icon, bg, color }) => (
          <div key={label} className="rounded-sm px-4 py-3.5 flex items-center gap-3" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
            <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background: bg, color }}>
              {icon}
            </div>
            <div>
              <p className="font-serif font-bold text-[22px] leading-none" style={{ color }}>{value}</p>
              <p className="font-sans text-[11px] text-text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">

        {/* Left: breakdown card */}
        <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--color-cream-dark)" }}>
            <h3 className="font-serif font-bold text-[15px] text-text-dark">Certification breakdown</h3>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <CertTypeRow
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z" stroke="var(--color-ink)" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              }
              label="Organization certifications"
              total={globalCerts.length}
              approved={gApproved}
              pending={gPending}
              rejected={gRejected}
              accentColor="var(--color-ink)"
              barColor="var(--color-success-light)"
              emptyHint="No organization certifications yet — go to Documents to upload your ISO, BIO or export licenses."
            />
            <CertTypeRow
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="5" width="11" height="7.5" rx="1.5" stroke="var(--color-info-dark)" strokeWidth="1.2" />
                  <path d="M4.5 5V4a2.5 2.5 0 0 1 5 0v1" stroke="var(--color-info-dark)" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="8.5" r="1.2" fill="var(--color-info-dark)" />
                </svg>
              }
              label="Product certifications"
              total={productCerts.length}
              approved={pApproved}
              pending={pPending}
              rejected={pRejected}
              accentColor="var(--color-info-dark)"
              barColor="var(--color-info)"
              emptyHint="No product certifications yet — go to Documents and select a product to attach a certificate."
            />
          </div>
        </div>

        {/* Right: info + tips */}
        <div className="flex flex-col gap-3">

          {/* Rejection alert */}
          {totalRejected > 0 && (
            <div className="rounded-sm px-4 py-4 flex flex-col gap-2" style={{ background: "color-mix(in srgb, var(--color-danger-dark) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--color-danger-dark) 18%, transparent)" }}>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="var(--color-danger-dark)" strokeWidth="1.2" />
                  <path d="M7 4v4" stroke="var(--color-danger-dark)" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="7" cy="10" r="0.8" fill="var(--color-danger-dark)" />
                </svg>
                <span className="font-sans text-[11px] font-bold text-[var(--color-danger-dark)] uppercase tracking-wide">Action needed</span>
              </div>
              <p className="font-sans text-[12px] text-[var(--color-danger-dark)]/80 leading-relaxed">
                <strong>{totalRejected}</strong> certification{totalRejected !== 1 ? "s were" : " was"} rejected. Go to the Documents tab to review and re-upload.
              </p>
            </div>
          )}

          {/* Certified products */}
          <div className="rounded-sm px-4 py-4 flex flex-col gap-3" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
              <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0" style={{ background: "color-mix(in srgb, var(--color-ink) 10%, transparent)" }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z" stroke="var(--color-ink)" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans font-semibold text-[13px] text-text-dark">Certified products</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-serif font-bold text-[32px] leading-none text-text-dark">{certifiedCount}</span>
              <span className="font-sans text-[12px] text-text-muted mb-1">product{certifiedCount !== 1 ? "s" : ""} approved</span>
            </div>
            <p className="font-sans text-[11px] text-text-muted leading-relaxed">
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                <>Products approved by the admin appear in the public marketplace under your partner profile.</>
              ) : (
                <>Products approved by the admin appear in the public catalog under your {NEVALI_HOUSE_BRAND.legalName} studio profile.</>
              )}
            </p>
          </div>

          {/* Renewal tip */}
          <div className="rounded-sm px-4 py-4 flex flex-col gap-2" style={{ background: "color-mix(in srgb, var(--color-gold) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)" }}>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="var(--color-text-muted)" strokeWidth="1.2" />
                <path d="M7 4v3.5l2 1.5" stroke="var(--color-text-muted)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wide">Renewal reminder</span>
            </div>
            <p className="font-sans text-[12px] text-text-muted/80 leading-relaxed">
              Keep your documents up to date. Re-submit updated certificates before they expire.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
