"use client";

import {
	ChevronLeft,
	ChevronRight,
	Clock,
	Trash2,
	UserCheck,
	UserMinus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import type { PartnerRow } from "~/app/api/partners/schemas/partners.schema";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import {
	useApproveUser,
	useDeletePartner,
	usePartnersPaginated,
} from "../../hooks/use-partners";
import { AdminStatCard, STAT_ICON_COLOR } from "../admin-stat-card";
import {
	AdminPageWrapper,
	AdminStatRow,
	AdminTable,
	AdminTableEmpty,
	AdminTableHead,
	AdminTableHeadCell,
	AdminTableRow,
	AdminTableToolbar,
	BtnDanger,
	BtnPrimary,
	BtnSecondary,
	FilterTab,
	StatusBadge,
} from "../admin-ui";
import { DeleteConfirmModal } from "./delete-confirm-modal";

const PAGE_SIZE = 10;

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(d));
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
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
				<p className="font-sans text-red-600 text-sm">
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
				<AdminStatCard
					icon={
						<Users
							color={STAT_ICON_COLOR.neutral}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Total Partners"
					value={total}
					variant="neutral"
				/>
				<AdminStatCard
					icon={
						<UserCheck
							color={STAT_ICON_COLOR.green}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Active"
					value={activeCount}
					variant="green"
				/>
				<AdminStatCard
					icon={
						<Clock color={STAT_ICON_COLOR.amber} size={18} strokeWidth={1.5} />
					}
					label="Pending Review"
					value={pendingCount}
					variant="amber"
				/>
				<AdminStatCard
					icon={
						<UserMinus
							color={STAT_ICON_COLOR.red}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Suspended"
					value={0}
					variant="red"
				/>
			</AdminStatRow>

			<AdminTable>
				<AdminTableToolbar>
					<div className="flex gap-1">
						{TABS.map((tab) => (
							<FilterTab
								active={statusFilter === tab.key}
								key={tab.key}
								label={tab.label}
								onClick={() => {
									setStatusFilter(tab.key);
									setPage(1);
								}}
							/>
						))}
					</div>
					<p className="font-sans text-text-muted text-xs">
						{total} partner{total !== 1 ? "s" : ""}
					</p>
				</AdminTableToolbar>

				<AdminTableHead>
					<div className="w-7 shrink-0" />
					<AdminTableHeadCell className="[flex:2.5]">
						Partner
					</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:1.2]">Entity</AdminTableHeadCell>
					<AdminTableHeadCell className="flex-1">Email</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:1.2]">Status</AdminTableHeadCell>
					<AdminTableHeadCell className="flex-1">Joined</AdminTableHeadCell>
					<AdminTableHeadCell className="w-[120px] shrink-0">
						Actions
					</AdminTableHeadCell>
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
								<div className="h-4 w-4 border-[1.5px] border-cream-dark" />
							</div>

							<div className="flex items-center gap-[10px] [flex:2.5]">
								<div
									className="flex h-[34px] w-[34px] shrink-0 items-center justify-center"
									style={{ background: getAvatarGradient(u.id) }}
								>
									<span className="font-bold font-sans text-white text-xs">
										{getInitials(u.name)}
									</span>
								</div>
								<div className="font-sans font-semibold text-sm text-text-dark leading-tight">
									{u.name}
								</div>
							</div>

							<div className="font-sans text-sm text-text-dark [flex:1.2]">
								{u.profile?.entityName ?? "—"}
							</div>

							<div className="flex-1 truncate pr-2 font-sans text-text-muted text-xs">
								{u.email}
							</div>

							<div className="[flex:1.2]">
								<StatusBadge
									status={u.status === "enabled" ? "ACTIVE" : "PENDING"}
								/>
							</div>

							<div className="flex-1 font-sans text-sm text-text-dark">
								{formatDate(u.createdAt)}
							</div>

							<div
								className="flex w-[120px] shrink-0 items-center gap-1.5"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
							>
								{u.status === "disabled" && (
									<BtnPrimary
										disabled={
											approveMutation.isPending &&
											approveMutation.variables === u.id
										}
										onClick={() => approveMutation.mutate(u.id)}
									>
										{approveMutation.isPending &&
										approveMutation.variables === u.id
											? "…"
											: "Activate"}
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
						<p className="font-sans text-text-muted text-xs">
							Showing {(page - 1) * PAGE_SIZE + 1}–
							{Math.min(page * PAGE_SIZE, total)} of {total} partners
						</p>
						<div className="flex gap-1">
							<button
								className={`flex h-8 w-8 items-center justify-center border border-cream-dark bg-white ${
									page <= 1
										? "cursor-default opacity-40"
										: "cursor-pointer hover:bg-cream"
								}`}
								disabled={page <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								type="button"
							>
								<ChevronLeft
									color="var(--color-text-dark)"
									size={14}
									strokeWidth={1.5}
								/>
							</button>
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const pageNum = i + 1;
								const isActive = pageNum === page;
								return (
									<button
										className={`h-8 w-8 cursor-pointer font-medium font-sans text-sm ${
											isActive
												? "bg-primary text-white"
												: "border border-cream-dark bg-white text-text-dark hover:bg-cream"
										}`}
										key={pageNum}
										onClick={() => setPage(pageNum)}
										type="button"
									>
										{pageNum}
									</button>
								);
							})}
							<button
								className={`flex h-8 w-8 items-center justify-center border border-cream-dark bg-white ${
									page >= totalPages
										? "cursor-default opacity-40"
										: "cursor-pointer hover:bg-cream"
								}`}
								disabled={page >= totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								type="button"
							>
								<ChevronRight
									color="var(--color-text-dark)"
									size={14}
									strokeWidth={1.5}
								/>
							</button>
						</div>
					</div>
				)}
			</AdminTable>

			{deleteUser && (
				<DeleteConfirmModal
					isDeleting={deleteMutation.isPending}
					onClose={() => setDeleteUser(null)}
					onConfirm={handleConfirmDelete}
					user={deleteUser}
				/>
			)}
		</AdminPageWrapper>
	);
}
