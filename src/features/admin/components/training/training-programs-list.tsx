"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { TrainingProgramRow } from "~/app/api/training/schemas/training.schema";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import {
	useAdminTrainingCounts,
	useAdminTrainingPrograms,
} from "../../hooks/use-admin-training";
import {
	AdminPageWrapper,
	AdminTable,
	AdminTableEmpty,
	AdminTableHead,
	AdminTableHeadCell,
	AdminTableToolbar,
	BtnPrimary,
	BtnSecondary,
	FilterTab,
	StatusBadge,
} from "../admin-ui";

const STATUS_TABS = [
	{ key: "ALL" as const, label: "All" },
	{ key: "PUBLISHED" as const, label: "Published" },
	{ key: "DRAFT" as const, label: "Draft" },
];

export function TrainingProgramsList() {
	const router = useRouter();
	const [statusFilter, setStatusFilter] = useState<
		"DRAFT" | "PUBLISHED" | "ALL"
	>("ALL");

	const {
		data: programs = [],
		isLoading,
		isError,
		error,
	} = useAdminTrainingPrograms(
		statusFilter === "ALL" ? undefined : statusFilter,
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
				<p className="font-sans text-red-600 text-sm">
					{error instanceof Error ? error.message : "Failed to load."}
				</p>
			</AdminPageWrapper>
		);
	}

	return (
		<AdminPageWrapper>
			<AdminTable>
				<AdminTableToolbar>
					<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
						<div>
							<h2 className="font-bold font-serif text-base text-text-dark">
								Training programs
							</h2>
							<p className="mt-0.5 font-sans text-text-muted text-xs">
								{programs.length} program{programs.length !== 1 ? "s" : ""}.
								Create programs, add modules and media, then publish and assign
								to partners.
							</p>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<BtnPrimary onClick={() => router.push("/admin/training/new")}>
							New program
						</BtnPrimary>
						<div className="flex items-center gap-1">
							{STATUS_TABS.map((tab) => (
								<FilterTab
									active={statusFilter === tab.key}
									count={counts?.[tab.key]}
									key={tab.key}
									label={tab.label}
									onClick={() => setStatusFilter(tab.key)}
								/>
							))}
						</div>
					</div>
				</AdminTableToolbar>

				<AdminTableHead>
					<AdminTableHeadCell className="flex-1 px-4">
						Program
					</AdminTableHeadCell>
					<AdminTableHeadCell className="w-36 shrink-0 px-4">
						Category
					</AdminTableHeadCell>
					<AdminTableHeadCell className="w-28 shrink-0 px-4">
						Level
					</AdminTableHeadCell>
					<AdminTableHeadCell className="w-24 shrink-0 px-4">
						Status
					</AdminTableHeadCell>
					<AdminTableHeadCell className="w-20 shrink-0 px-4 text-right">
						Actions
					</AdminTableHeadCell>
				</AdminTableHead>

				{programs.length === 0 ? (
					<AdminTableEmpty message="No programs in this view. Create one to get started." />
				) : (
					(programs as TrainingProgramRow[]).map((p) => (
						<div
							className="flex cursor-pointer items-center border-cream-dark border-b transition-colors last:border-0 hover:bg-cream/60"
							key={p.id}
							onClick={() => router.push(`/admin/training/${p.id}`)}
							onKeyDown={(e) =>
								e.key === "Enter" && router.push(`/admin/training/${p.id}`)
							}
							role="button"
							tabIndex={0}
						>
							<div className="flex-1 px-4 py-3">
								<p className="font-sans font-semibold text-sm text-text-dark">
									{p.name}
								</p>
								<p className="mt-0.5 font-sans text-text-muted text-xs">
									{p.provider}
									{p.durationLabel ? ` · ${p.durationLabel}` : ""}
								</p>
							</div>
							<div className="w-36 shrink-0 px-4 py-3 font-sans text-sm text-text-muted">
								{p.category}
							</div>
							<div className="w-28 shrink-0 px-4 py-3 font-sans text-sm text-text-muted">
								{getTrainingLevelLabel(p.level)}
							</div>
							<div className="w-24 shrink-0 px-4 py-3">
								<StatusBadge status={p.status} />
							</div>
							<div
								className="flex w-20 shrink-0 justify-end px-4 py-3"
								onClick={(e) => e.stopPropagation()}
							>
								<BtnSecondary href={`/admin/training/${p.id}`}>
									Edit
								</BtnSecondary>
							</div>
						</div>
					))
				)}
			</AdminTable>
		</AdminPageWrapper>
	);
}
