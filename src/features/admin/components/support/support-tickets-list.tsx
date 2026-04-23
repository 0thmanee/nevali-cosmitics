"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock, CheckCircle, Timer } from "lucide-react";
import { AdminStatCard, STAT_ICON_COLOR } from "../admin-stat-card";
import {
  useAdminSupportTickets,
  useAdminSupportTicketCounts,
  useUpdateSupportTicketStatus,
} from "../../hooks/use-admin-support";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import type { SupportTicketAdminRow } from "~/app/api/support";
import {
  AdminPageWrapper,
  AdminStatRow,
  AdminTable,
  AdminTableToolbar,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
  AdminTableEmpty,
  FilterTab,
  BtnPrimary,
  BtnSecondary,
  StatusBadge,
} from "../admin-ui";

const STATUS_TABS = [
  { key: "ALL" as const,       label: "All" },
  { key: "OPEN" as const,      label: "Open" },
  { key: "IN_REVIEW" as const, label: "In Review" },
  { key: "RESOLVED" as const,  label: "Resolved" },
];

const PRIORITY_BADGE: Record<string, { bg: string; color: string }> = {
  High:   { bg: "color-mix(in srgb, var(--color-danger-dark) 10%, transparent)", color: "var(--color-danger-dark)" },
  Medium: { bg: "color-mix(in srgb, var(--color-text-muted) 6%, transparent)", color: "var(--color-text-muted)" },
  Low:    { bg: "color-mix(in srgb, var(--color-ink) 6%, transparent)",     color: "var(--color-text-muted)"    },
};

const PRIORITY_DEFAULT = { bg: "color-mix(in srgb, var(--color-text-muted) 6%, transparent)", color: "var(--color-text-muted)" };

function formatRelativeTime(d: Date): string {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(d));
}

export function SupportTicketsList() {
  const router = useRouter();
  const { selectedOrganizationId } = useAdminOrganizationFilter();
  const [statusFilter, setStatusFilter] = useState<"OPEN" | "IN_REVIEW" | "RESOLVED" | "ALL">("ALL");

  const { data: allTickets = [], isLoading, isError, error } = useAdminSupportTickets(
    undefined,
    selectedOrganizationId,
  );
  const { data: counts } = useAdminSupportTicketCounts(selectedOrganizationId);
  const updateStatusMutation = useUpdateSupportTicketStatus();

  const tickets =
    statusFilter === "ALL"
      ? allTickets
      : allTickets.filter((t) => t.status === statusFilter);

  const handleSetStatus = useCallback(
    (ticketId: string, status: "OPEN" | "IN_REVIEW" | "RESOLVED") => {
      updateStatusMutation.mutate({ ticketId, status });
    },
    [updateStatusMutation],
  );

  if (isLoading) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-text-muted">Loading support tickets…</p>
      </AdminPageWrapper>
    );
  }

  if (isError) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load support tickets."}
        </p>
      </AdminPageWrapper>
    );
  }

  const openCount     = allTickets.filter((t) => t.status === "OPEN").length;
  const inReviewCount = allTickets.filter((t) => t.status === "IN_REVIEW").length;
  const resolvedCount = allTickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <AdminPageWrapper>
      <AdminStatRow>
        <AdminStatCard label="Open"           value={openCount}     variant="red"     icon={<AlertCircle size={18} color={STAT_ICON_COLOR.red}     strokeWidth={1.5} />} />
        <AdminStatCard label="In Progress"    value={inReviewCount} variant="amber"   icon={<Clock       size={18} color={STAT_ICON_COLOR.amber}   strokeWidth={1.5} />} />
        <AdminStatCard label="Resolved (30d)" value={resolvedCount} variant="green"   icon={<CheckCircle size={18} color={STAT_ICON_COLOR.green}   strokeWidth={1.5} />} />
        <AdminStatCard label="Avg. Response"  value="—"             variant="neutral" icon={<Timer       size={18} color={STAT_ICON_COLOR.neutral} strokeWidth={1.5} />} />
      </AdminStatRow>

      <AdminTable>
        <AdminTableToolbar>
          <div className="flex gap-1">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.key === "ALL"       ? allTickets.length :
                tab.key === "OPEN"      ? openCount :
                tab.key === "IN_REVIEW" ? inReviewCount :
                resolvedCount;
              return (
                <FilterTab
                  key={tab.key}
                  label={tab.label}
                  count={count}
                  active={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                />
              );
            })}
          </div>
          <p className="font-sans text-xs text-text-muted">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </p>
        </AdminTableToolbar>

        <AdminTableHead>
          <AdminTableHeadCell className="[flex:2.5]">Subject</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:1.5]">Partner</AdminTableHeadCell>
          <AdminTableHeadCell className="flex-1">Category</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.8]">Priority</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.8]">Status</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.8]">Updated</AdminTableHeadCell>
          <AdminTableHeadCell className="w-20 shrink-0 text-right">Action</AdminTableHeadCell>
        </AdminTableHead>

        {tickets.length === 0 ? (
          <AdminTableEmpty message="No tickets in this view." />
        ) : (
          tickets.map((t: SupportTicketAdminRow) => {
            const priorityBadge = PRIORITY_BADGE[t.priority] ?? PRIORITY_DEFAULT;
            return (
              <AdminTableRow
                key={t.id}
                onClick={() => router.push(`/admin/support/${t.id}`)}
              >
                <div className="[flex:2.5] pr-4">
                  <div className="font-sans font-semibold text-sm text-text-dark truncate">{t.subject}</div>
                  <div className="font-sans text-xs text-text-muted mt-0.5">#{t.id.slice(0, 8).toUpperCase()}</div>
                </div>

                <div className="[flex:1.5] font-sans text-sm text-text-dark truncate pr-3">
                  {t.organizationName}
                </div>

                <div className="flex-1 font-sans text-xs text-text-muted truncate pr-3">
                  {t.category}
                </div>

                <div className="[flex:0.8]">
                  <span
                    className="inline-block font-sans font-semibold text-xs px-2.5 py-0.5 uppercase tracking-wide"
                    style={{ background: priorityBadge.bg, color: priorityBadge.color }}
                  >
                    {t.priority}
                  </span>
                </div>

                <div className="[flex:0.8]">
                  <StatusBadge status={t.status} />
                </div>

                <div className="[flex:0.8] font-sans text-xs text-text-muted">
                  {formatRelativeTime(t.updatedAt)}
                </div>

                <div
                  className="w-20 shrink-0 flex justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.status === "OPEN" ? (
                    <BtnPrimary
                      onClick={() => handleSetStatus(t.id, "IN_REVIEW")}
                      disabled={updateStatusMutation.isPending}
                    >
                      Reply
                    </BtnPrimary>
                  ) : t.status === "RESOLVED" ? (
                    <BtnSecondary onClick={() => router.push(`/admin/support/${t.id}`)}>
                      View
                    </BtnSecondary>
                  ) : (
                    <BtnPrimary
                      onClick={() => handleSetStatus(t.id, "RESOLVED")}
                      disabled={updateStatusMutation.isPending}
                    >
                      Resolve
                    </BtnPrimary>
                  )}
                </div>
              </AdminTableRow>
            );
          })
        )}
      </AdminTable>
    </AdminPageWrapper>
  );
}
