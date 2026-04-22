"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminTrainingPrograms, useAdminTrainingCounts } from "../../hooks/use-admin-training";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import type { TrainingProgramRow } from "~/app/api/training/schemas/training.schema";
import {
  AdminPageWrapper,
  AdminTable,
  AdminTableToolbar,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableEmpty,
  FilterTab,
  BtnPrimary,
  BtnSecondary,
  StatusBadge,
} from "../admin-ui";

const STATUS_TABS = [
  { key: "ALL" as const,       label: "All" },
  { key: "PUBLISHED" as const, label: "Published" },
  { key: "DRAFT" as const,     label: "Draft" },
];

export function TrainingProgramsList() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"DRAFT" | "PUBLISHED" | "ALL">("ALL");

  const { data: programs = [], isLoading, isError, error } = useAdminTrainingPrograms(
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const { data: counts } = useAdminTrainingCounts();

  if (isLoading) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-text-muted">Loading programs…</p>
      </AdminPageWrapper>
    );
  }

  if (isError) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-red-600">{error instanceof Error ? error.message : "Failed to load."}</p>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <AdminTable>
        <AdminTableToolbar>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div>
              <h2 className="font-serif font-bold text-base text-text-dark">Training programs</h2>
              <p className="font-sans text-xs text-text-muted mt-0.5">
                {programs.length} program{programs.length !== 1 ? "s" : ""}. Create programs, add modules and media, then publish and assign to partners.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <BtnPrimary onClick={() => router.push("/admin/training/new")}>
              New program
            </BtnPrimary>
            <div className="flex items-center gap-1">
              {STATUS_TABS.map((tab) => (
                <FilterTab
                  key={tab.key}
                  label={tab.label}
                  count={counts?.[tab.key]}
                  active={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                />
              ))}
            </div>
          </div>
        </AdminTableToolbar>

        <AdminTableHead>
          <AdminTableHeadCell className="flex-1 px-4">Program</AdminTableHeadCell>
          <AdminTableHeadCell className="w-36 shrink-0 px-4">Category</AdminTableHeadCell>
          <AdminTableHeadCell className="w-28 shrink-0 px-4">Level</AdminTableHeadCell>
          <AdminTableHeadCell className="w-24 shrink-0 px-4">Status</AdminTableHeadCell>
          <AdminTableHeadCell className="w-20 shrink-0 px-4 text-right">Actions</AdminTableHeadCell>
        </AdminTableHead>

        {programs.length === 0 ? (
          <AdminTableEmpty message="No programs in this view. Create one to get started." />
        ) : (
          (programs as TrainingProgramRow[]).map((p) => (
            <div
              key={p.id}
              className="flex items-center border-b border-cream-dark last:border-0 hover:bg-cream/60 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/admin/training/${p.id}`)}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/admin/training/${p.id}`)}
            >
              <div className="flex-1 px-4 py-3">
                <p className="font-sans text-sm font-semibold text-text-dark">{p.name}</p>
                <p className="font-sans text-xs text-text-muted mt-0.5">{p.provider}{p.durationLabel ? ` · ${p.durationLabel}` : ""}</p>
              </div>
              <div className="w-36 shrink-0 px-4 py-3 font-sans text-sm text-text-muted">{p.category}</div>
              <div className="w-28 shrink-0 px-4 py-3 font-sans text-sm text-text-muted">{getTrainingLevelLabel(p.level)}</div>
              <div className="w-24 shrink-0 px-4 py-3">
                <StatusBadge status={p.status} />
              </div>
              <div className="w-20 shrink-0 px-4 py-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
                <BtnSecondary href={`/admin/training/${p.id}`}>Edit</BtnSecondary>
              </div>
            </div>
          ))
        )}
      </AdminTable>
    </AdminPageWrapper>
  );
}
