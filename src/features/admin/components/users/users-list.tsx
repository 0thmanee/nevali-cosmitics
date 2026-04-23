"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Clock, UserMinus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminStatCard, STAT_ICON_COLOR } from "../admin-stat-card";
import {
  usePartnersPaginated,
  useApproveUser,
  useDeletePartner,
} from "../../hooks/use-partners";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import type { PartnerRow } from "~/app/api/partners/schemas/partners.schema";
import { DeleteConfirmModal } from "./delete-confirm-modal";
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
  BtnDanger,
  StatusBadge,
} from "../admin-ui";

const PAGE_SIZE = 10;

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_GRADIENTS = [
  "linear-gradient(in oklab 135deg, oklab(36% 0.09 0.048) 0%, oklab(24% 0.07 0.038) 100%)",
  "linear-gradient(in oklab 135deg, oklab(30% 0.08 0.04) 0%, oklab(20% 0.06 0.03) 100%)",
  "linear-gradient(in oklab 135deg, oklab(40% 0.09 0.05) 0%, oklab(28% 0.07 0.04) 100%)",
  "linear-gradient(in oklab 135deg, oklab(34% 0.085 0.045) 0%, oklab(22% 0.065 0.035) 100%)",
];

function getAvatarGradient(id: string) {
  const code = id.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[code] ?? AVATAR_GRADIENTS[0];
}

type StatusFilter = "all" | "active" | "pending";

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
];

export function UsersList() {
  const router = useRouter();
  const { selectedOrganizationId } = useAdminOrganizationFilter();
  const [page, setPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState<PartnerRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, isError, error } = usePartnersPaginated(
    page,
    PAGE_SIZE,
    selectedOrganizationId,
  );
  const approveMutation = useApproveUser();
  const deleteMutation = useDeletePartner();

  const handleConfirmDelete = useCallback(
    (userId: string) => {
      deleteMutation.mutate(userId, { onSuccess: () => setDeleteUser(null) });
    },
    [deleteMutation],
  );

  if (isLoading) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-text-muted">Loading partners…</p>
      </AdminPageWrapper>
    );
  }

  if (isError) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load partners."}
        </p>
      </AdminPageWrapper>
    );
  }

  const { items, total, totalPages } = data!;
  const activeCount = items.filter((u) => u.status === "enabled").length;
  const pendingCount = items.filter((u) => u.status === "disabled").length;

  const filteredItems =
    statusFilter === "active"
      ? items.filter((u) => u.status === "enabled")
      : statusFilter === "pending"
        ? items.filter((u) => u.status === "disabled")
        : items;

  return (
    <AdminPageWrapper>
      <AdminStatRow>
        <AdminStatCard label="Total Partners" value={total}        variant="neutral" icon={<Users      size={18} color={STAT_ICON_COLOR.neutral} strokeWidth={1.5} />} />
        <AdminStatCard label="Active"         value={activeCount}  variant="green"   icon={<UserCheck  size={18} color={STAT_ICON_COLOR.green}   strokeWidth={1.5} />} />
        <AdminStatCard label="Pending Review" value={pendingCount} variant="amber"   icon={<Clock      size={18} color={STAT_ICON_COLOR.amber}   strokeWidth={1.5} />} />
        <AdminStatCard label="Suspended"      value={0}            variant="red"     icon={<UserMinus  size={18} color={STAT_ICON_COLOR.red}     strokeWidth={1.5} />} />
      </AdminStatRow>

      <AdminTable>
        <AdminTableToolbar>
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <FilterTab
                key={tab.key}
                label={tab.label}
                active={statusFilter === tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              />
            ))}
          </div>
          <p className="font-sans text-xs text-text-muted">
            {total} partner{total !== 1 ? "s" : ""}
          </p>
        </AdminTableToolbar>

        <AdminTableHead>
          <div className="w-7 shrink-0" />
          <AdminTableHeadCell className="[flex:2.5]">Partner</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:1.2]">Entity</AdminTableHeadCell>
          <AdminTableHeadCell className="flex-1">Email</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:1.2]">Status</AdminTableHeadCell>
          <AdminTableHeadCell className="flex-1">Joined</AdminTableHeadCell>
          <AdminTableHeadCell className="w-[120px] shrink-0">Actions</AdminTableHeadCell>
        </AdminTableHead>

        {filteredItems.length === 0 ? (
          <AdminTableEmpty message="No partners found." />
        ) : (
          filteredItems.map((u: PartnerRow) => (
            <AdminTableRow
              key={u.id}
              onClick={() => router.push(`/admin/users/${u.id}`)}
            >
              <div className="w-7 shrink-0">
                <div className="w-4 h-4 border-[1.5px] border-cream-dark" />
              </div>

              <div className="[flex:2.5] flex items-center gap-[10px]">
                <div
                  className="w-[34px] h-[34px] flex items-center justify-center shrink-0"
                  style={{ background: getAvatarGradient(u.id) }}
                >
                  <span className="font-sans font-bold text-xs text-white">{getInitials(u.name)}</span>
                </div>
                <div className="font-sans font-semibold text-sm text-text-dark leading-tight">{u.name}</div>
              </div>

              <div className="[flex:1.2] font-sans text-sm text-text-dark">
                {u.profile?.entityName ?? "—"}
              </div>

              <div className="flex-1 font-sans text-xs text-text-muted truncate pr-2">
                {u.email}
              </div>

              <div className="[flex:1.2]">
                <StatusBadge status={u.status === "enabled" ? "ACTIVE" : "PENDING"} />
              </div>

              <div className="flex-1 font-sans text-sm text-text-dark">
                {formatDate(u.createdAt)}
              </div>

              <div
                className="w-[120px] shrink-0 flex gap-1.5 items-center"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {u.status === "disabled" && (
                  <BtnPrimary
                    onClick={() => approveMutation.mutate(u.id)}
                    disabled={approveMutation.isPending && approveMutation.variables === u.id}
                  >
                    {approveMutation.isPending && approveMutation.variables === u.id ? "…" : "Activate"}
                  </BtnPrimary>
                )}
                <BtnSecondary href={`/admin/users/${u.id}`}>View</BtnSecondary>
                <BtnDanger onClick={() => setDeleteUser(u)}>
                  <Trash2 size={14} strokeWidth={1.4} />
                </BtnDanger>
              </div>
            </AdminTableRow>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <p className="font-sans text-xs text-text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} partners
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`w-8 h-8 border border-cream-dark bg-white flex items-center justify-center ${
                  page <= 1 ? "opacity-40 cursor-default" : "cursor-pointer hover:bg-cream"
                }`}
              >
                <ChevronLeft size={14} color="var(--color-text-dark)" strokeWidth={1.5} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 font-sans font-medium text-sm cursor-pointer ${
                      isActive ? "bg-primary text-white" : "bg-white text-text-dark border border-cream-dark hover:bg-cream"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={`w-8 h-8 border border-cream-dark bg-white flex items-center justify-center ${
                  page >= totalPages ? "opacity-40 cursor-default" : "cursor-pointer hover:bg-cream"
                }`}
              >
                <ChevronRight size={14} color="var(--color-text-dark)" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </AdminTable>

      {deleteUser && (
        <DeleteConfirmModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </AdminPageWrapper>
  );
}
