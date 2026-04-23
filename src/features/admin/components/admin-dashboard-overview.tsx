"use client";

import React from "react";
import Link from "next/link";
import { Users, Package, Award, MessageCircle, ChevronRight } from "lucide-react";
import { AdminStatCard, STAT_ICON_COLOR } from "./admin-stat-card";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";
import { useAdminOrganizationFilter } from "../hooks/use-admin-organizations";
import { AdminPageWrapper } from "./admin-ui";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  approved: "#727272",   // amber — positive / approved
  pending:  "#727272",   // amber-dark — pending
  rejected: "#c0392b",   // red — rejected
  draft:    "#bbb",      // gray — draft
  primary:  "#000000",   // terracotta
} as const;

// ─── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart({
  segments,
  total,
  size = 104,
}: {
  segments: Array<{ value: number; color: string }>;
  total: number;
  size?: number;
}) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  let cumulativeDeg = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="#d8d0c4" strokeWidth={10} />
        {total > 0 &&
          segments.map((seg, i) => {
            const fraction = seg.value / total;
            const segLen = fraction * circumference;
            const rotation = -90 + cumulativeDeg;
            cumulativeDeg += fraction * 360;
            return (
              <circle key={i} cx={50} cy={50} r={r} fill="none"
                stroke={seg.color} strokeWidth={10}
                strokeDasharray={`${segLen} ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(${rotation} 50 50)`}
              />
            );
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-sans font-bold text-2xl text-text-dark leading-none">{total}</span>
        <span className="font-sans text-xs text-text-muted mt-0.5">total</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-2.5 h-2.5 shrink-0" style={{ background: color }} />
        <span className="font-sans text-sm text-text-dark/80 truncate">{label}</span>
      </div>
      <span className="font-sans font-semibold text-sm text-text-dark shrink-0">{value}</span>
    </div>
  );
}

function Bar({ fraction, color }: { fraction: number; color: string }) {
  return (
    <div className="h-2 bg-cream-dark overflow-hidden w-full">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, fraction * 100))}%`, background: color }}
      />
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-serif font-bold text-base text-text-dark">{title}</h3>
      <p className="font-sans text-xs text-text-muted mt-0.5">{subtitle}</p>
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Manage partners",  href: "/admin/users",         description: "Activate accounts and manage access" },
  { label: "Products",         href: "/admin/products",      description: "Approve or reject product listings" },
  { label: "Certifications",   href: "/admin/certifications",description: "Review certification documents" },
  { label: "Training",         href: "/admin/training",      description: "Programs and assignments" },
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdminDashboardOverview() {
  const { selectedOrganizationId, selectedSlug } = useAdminOrganizationFilter();
  const orgQuery = selectedSlug ? `?org=${encodeURIComponent(selectedSlug)}` : "";
  const { data } = useAdminDashboard(selectedOrganizationId);

  const navStats        = data?.navStats;
  const productCounts   = data?.productCounts;
  const certCounts      = data?.certCounts;
  const trainingCounts  = data?.trainingCounts;
  const partnerStats    = data?.partnerStats;

  const partnersTotal           = navStats?.partnersTotal ?? 0;
  const productTotal            = productCounts?.ALL ?? 0;
  const certTotal               = certCounts?.ALL ?? 0;
  const trainingTotal           = trainingCounts?.ALL ?? 0;
  const partnerActive           = partnerStats?.active ?? 0;
  const partnerPending          = partnerStats?.pending ?? 0;
  const partnerProfileCompleted = partnerStats?.profileCompleted ?? 0;

  return (
    <AdminPageWrapper>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard label="Total Partners"          value={partnersTotal}                      variant="neutral" icon={<Users        size={18} color={STAT_ICON_COLOR.neutral} strokeWidth={1.5} />} />
        <AdminStatCard label="Pending Products"        value={navStats?.productsPending ?? 0}     variant="amber"   icon={<Package      size={18} color={STAT_ICON_COLOR.amber}   strokeWidth={1.5} />} />
        <AdminStatCard label="Pending Certifications"  value={navStats?.certificationsPending ?? 0} variant="amber" icon={<Award        size={18} color={STAT_ICON_COLOR.amber}   strokeWidth={1.5} />} />
        <AdminStatCard label="Open Support Tickets"    value={navStats?.supportTicketsOpen ?? 0}  variant="red"     icon={<MessageCircle size={18} color={STAT_ICON_COLOR.red}    strokeWidth={1.5} />} />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Products",
            subtitle: "Status across all listings",
            total: productTotal,
            segments: [
              { value: productCounts?.APPROVED ?? 0, color: C.approved, label: "Approved",     count: productCounts?.APPROVED ?? 0 },
              { value: productCounts?.PENDING  ?? 0, color: C.pending,  label: "Pending review",count: productCounts?.PENDING  ?? 0 },
              { value: productCounts?.REJECTED ?? 0, color: C.rejected, label: "Rejected",     count: productCounts?.REJECTED ?? 0 },
            ],
          },
          {
            title: "Certifications",
            subtitle: "Status across all documents",
            total: certTotal,
            segments: [
              { value: certCounts?.APPROVED ?? 0, color: C.approved, label: "Approved",     count: certCounts?.APPROVED ?? 0 },
              { value: certCounts?.PENDING  ?? 0, color: C.pending,  label: "Pending review",count: certCounts?.PENDING  ?? 0 },
              { value: certCounts?.REJECTED ?? 0, color: C.rejected, label: "Rejected",     count: certCounts?.REJECTED ?? 0 },
            ],
          },
          {
            title: "Training programs",
            subtitle: "Published vs draft",
            total: trainingTotal,
            segments: [
              { value: trainingCounts?.PUBLISHED ?? 0, color: C.approved, label: "Published", count: trainingCounts?.PUBLISHED ?? 0 },
              { value: trainingCounts?.DRAFT     ?? 0, color: C.draft,    label: "Draft",     count: trainingCounts?.DRAFT     ?? 0 },
            ],
          },
        ].map((card) => (
          <div key={card.title} className="bg-white border border-cream-dark p-6">
            <SectionHead title={card.title} subtitle={card.subtitle} />
            <div className="flex items-center gap-6">
              <DonutChart segments={card.segments} total={card.total} />
              <div className="flex-1 flex flex-col divide-y divide-cream-dark">
                {card.segments.map((s) => (
                  <LegendRow key={s.label} color={s.color} label={s.label} value={s.count} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Partners + Platform ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Partners — takes 3/5 */}
        <div className="lg:col-span-3 bg-white border border-cream-dark p-6">
          <SectionHead title="Partners" subtitle="Account status and regional distribution" />
          <div className="flex gap-8">

            {/* Donut + status legend */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <DonutChart
                size={96}
                segments={[
                  { value: partnerActive,  color: C.approved },
                  { value: partnerPending, color: C.pending  },
                ]}
                total={partnersTotal}
              />
              <div className="flex flex-col gap-0.5 w-full">
                <LegendRow color={C.approved} label="Active"           value={partnerActive}  />
                <LegendRow color={C.pending}  label="Pending approval" value={partnerPending} />
              </div>
            </div>

            {/* Bars */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Profile completion */}
              <div>
                <p className="font-sans font-semibold text-xs tracking-widest uppercase text-text-muted mb-3">Profile completion</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Complete",   value: partnerProfileCompleted,              total: partnersTotal, color: C.approved },
                    { label: "Incomplete", value: partnersTotal - partnerProfileCompleted, total: partnersTotal, color: C.pending  },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="font-sans text-sm font-medium text-text-dark">{row.label}</span>
                        <span className="font-sans text-xs text-text-muted">{row.value} / {row.total} partners</span>
                      </div>
                      <Bar fraction={row.total > 0 ? row.value / row.total : 0} color={row.color} />
                    </div>
                  ))}
                </div>
              </div>

              {/* By region */}
              {(partnerStats?.byRegion?.length ?? 0) > 0 && (
                <div>
                  <p className="font-sans font-semibold text-xs tracking-widest uppercase text-text-muted mb-3">By region</p>
                  <div className="flex flex-col gap-3">
                    {partnerStats!.byRegion.slice(0, 5).map(({ region, count }) => (
                      <div key={region}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="font-sans text-sm text-text-dark truncate pr-3">{region}</span>
                          <span className="font-sans text-sm font-semibold text-text-dark shrink-0">{count}</span>
                        </div>
                        <Bar fraction={partnersTotal > 0 ? count / partnersTotal : 0} color={C.primary} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform overview — takes 2/5 */}
        <div className="lg:col-span-2 bg-white border border-cream-dark p-6">
          <SectionHead title="Platform overview" subtitle="Key metrics at a glance" />
          <div className="flex flex-col gap-5">
            {[
              { label: "Partners",       right: String(partnersTotal),                                                    fraction: 1,                                                                  color: C.primary  },
              { label: "Products",       right: `${productCounts?.APPROVED ?? 0} / ${productTotal} approved`,             fraction: productTotal  > 0 ? (productCounts?.APPROVED ?? 0) / productTotal  : 0, color: C.approved },
              { label: "Certifications", right: `${certCounts?.APPROVED    ?? 0} / ${certTotal} approved`,                fraction: certTotal     > 0 ? (certCounts?.APPROVED    ?? 0) / certTotal     : 0, color: C.approved },
              { label: "Training",       right: `${trainingCounts?.PUBLISHED ?? 0} / ${trainingTotal} published`,         fraction: trainingTotal > 0 ? (trainingCounts?.PUBLISHED ?? 0) / trainingTotal: 0, color: C.approved },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-sans font-semibold text-xs tracking-widest uppercase text-text-muted">{item.label}</span>
                  <span className="font-sans font-semibold text-sm text-text-dark">{item.right}</span>
                </div>
                <Bar fraction={item.fraction} color={item.color} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Quick actions ── */}
      <div className="bg-white border border-cream-dark">
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-base text-text-dark">Quick actions</h2>
          <p className="font-sans text-xs text-text-muted mt-0.5">Partner &amp; product management, certification, analytics, training, and wholesale oversight.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={action.href}
              href={action.href + orgQuery}
              className={`group flex items-center justify-between gap-3 px-6 py-5 transition-colors hover:bg-cream no-underline ${i > 0 ? "border-l border-cream-dark" : ""}`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-sans text-sm font-semibold text-text-dark group-hover:text-primary transition-colors">{action.label}</span>
                <span className="font-sans text-xs text-text-muted">{action.description}</span>
              </div>
              <ChevronRight size={14} className="text-text-muted shrink-0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

    </AdminPageWrapper>
  );
}
