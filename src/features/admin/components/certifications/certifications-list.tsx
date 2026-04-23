"use client";

import { AlertCircle, Award, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import type { CertificationWithProductRow } from "~/app/api/certifications/schemas/certifications.schema";
import {
	useAdminCertificationCounts,
	useAdminCertifications,
	useSetCertificationStatus,
} from "../../hooks/use-admin-certifications";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import { AdminStatCard, STAT_ICON_COLOR } from "../admin-stat-card";
import { RejectCertificationModal } from "./reject-certification-modal";
import {
	AdminPageWrapper,
	AdminStatRow,
	FilterTab,
	BtnPrimary,
	BtnSecondary,
	BtnDanger,
	StatusBadge,
} from "../admin-ui";

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_TABS = [
	{ key: "ALL" as const, label: "All" },
	{ key: "PENDING" as const, label: "Pending" },
	{ key: "APPROVED" as const, label: "Approved" },
	{ key: "REJECTED" as const, label: "Rejected" },
];

const TYPE_TABS = [
	{ key: "ALL" as const, label: "All types" },
	{ key: "ORGANIZATION" as const, label: "Organization" },
	{ key: "PRODUCT" as const, label: "Product" },
];

const TYPE_CONFIG = {
	ORGANIZATION: {
		label: "Organization",
		pillBg: "color-mix(in srgb, var(--color-ink) 10%, transparent)",
		pillColor: "var(--color-ink)",
		accent: "var(--color-ink)",
		iconGradient:
			"linear-gradient(in oklab 135deg, oklab(36% 0.09 0.048) 0%, oklab(24% 0.07 0.038) 100%)",
	},
	PRODUCT: {
		label: "Product",
		pillBg: "color-mix(in srgb, var(--color-info) 12%, var(--color-paper))",
		pillColor: "var(--color-info-dark)",
		accent: "var(--color-info-dark)",
		iconGradient:
			"linear-gradient(in oklab 135deg, oklab(52% -0.020 -0.100) 0%, oklab(40% -0.015 -0.080) 100%)",
	},
} as const;

const PARTNER_AVATAR_GRADIENT =
	"linear-gradient(in oklab 135deg, oklab(36% 0.09 0.048) 0%, oklab(24% 0.07 0.038) 100%)";

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

// ── Cert card ─────────────────────────────────────────────────────────────────

function CertCard({
	c,
	onApprove,
	onReject,
	isPending,
}: {
	c: CertificationWithProductRow;
	onApprove: () => void;
	onReject: () => void;
	isPending: boolean;
}) {
	const router = useRouter();
	const isProduct = !!c.product?.id;
	const type = isProduct ? TYPE_CONFIG.PRODUCT : TYPE_CONFIG.ORGANIZATION;
	const partnerName = c.organization.name;

	return (
		<div className="flex overflow-hidden border border-cream-dark bg-white">
			{/* Colored left accent */}
			<div className="w-1 shrink-0" style={{ background: type.accent }} />

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4 px-5 py-4">
					<div className="flex min-w-0 items-start gap-3">
						{/* Icon */}
						<div
							className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
							style={{ background: type.iconGradient }}
						>
							<svg fill="none" height="15" viewBox="0 0 16 16" width="15">
								<path
									d="M4 2h6l3 3v9H4V2z"
									stroke="white"
									strokeLinejoin="round"
									strokeWidth="1.2"
								/>
								<path
									d="M10 2v3h3"
									stroke="white"
									strokeLinejoin="round"
									strokeWidth="1.2"
								/>
								<path
									d="M6 7h4M6 9.5h4M6 12h2"
									stroke="white"
									strokeLinecap="round"
									strokeWidth="1.1"
								/>
							</svg>
						</div>

						{/* Name + meta */}
						<div className="flex min-w-0 flex-col gap-1">
							<div className="flex flex-wrap items-center gap-2">
								<a
									className="font-sans font-semibold text-text-dark text-sm hover:underline"
									href={c.fileUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									{c.name}
								</a>
								{/* Type pill */}
								<span
									className="shrink-0 px-2 py-0.5 font-bold font-sans text-[9px] uppercase tracking-widest"
									style={{ background: type.pillBg, color: type.pillColor }}
								>
									{type.label}
								</span>
								{/* Status badge */}
								<StatusBadge status={c.status} />
							</div>

							{/* Compact meta line */}
							<div className="flex flex-wrap items-center gap-2">
								{/* Partner avatar + name */}
								<div className="flex items-center gap-1.5">
									<div
										className="flex h-4 w-4 shrink-0 items-center justify-center"
										style={{ background: PARTNER_AVATAR_GRADIENT }}
									>
										<span className="font-bold font-sans text-[7px] text-white">
											{getInitials(partnerName)}
										</span>
									</div>
									<span className="font-sans text-text-muted text-xs">
										{partnerName}
									</span>
								</div>

								<span className="text-cream-dark text-[10px]">·</span>
								<span className="font-sans text-text-muted text-xs">
									{formatDate(c.createdAt)}
								</span>

								{/* Linked to */}
								{isProduct && c.product ? (
									<>
										<span className="text-cream-dark text-[10px]">·</span>
										<div className="flex items-center gap-1">
											<svg fill="none" height="10" viewBox="0 0 10 10" width="10">
												<rect height="5.5" rx="1" stroke="var(--color-info-dark)" strokeWidth="1.1" width="8" x="1" y="3" />
												<path d="M3.5 3V2.5a1.5 1.5 0 0 1 3 0V3" stroke="var(--color-info-dark)" strokeLinecap="round" strokeWidth="1.1" />
											</svg>
											<button
												className="cursor-pointer border-none bg-transparent p-0 font-medium font-sans text-[var(--color-info-dark)] text-xs hover:underline"
												onClick={() => router.push(`/admin/products/${c.product!.id}`)}
												type="button"
											>
												{c.product.name}
											</button>
										</div>
									</>
								) : (
									<>
										<span className="text-cream-dark text-[10px]">·</span>
										<span className="font-sans text-text-muted text-xs">Organization-wide</span>
									</>
								)}

								{/* Rejection reason */}
								{c.status === "REJECTED" && c.rejectionReason && (
									<>
										<span className="text-cream-dark text-[10px]">·</span>
										<span className="font-sans text-xs text-red-600 italic">
											{c.rejectionReason}
										</span>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex shrink-0 items-center gap-1.5">
						<BtnSecondary href={c.fileUrl}>View doc</BtnSecondary>
						{isProduct && c.product && (
							<BtnSecondary onClick={() => router.push(`/admin/products/${c.product!.id}`)}>
								View product
							</BtnSecondary>
						)}
						{c.status === "PENDING" && (
							<>
								<BtnPrimary onClick={onApprove} disabled={isPending}>Approve</BtnPrimary>
								<BtnDanger onClick={onReject} disabled={isPending}>Reject</BtnDanger>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Main export ───────────────────────────────────────────────────────────────

export function CertificationsList() {
	const { selectedOrganizationId } = useAdminOrganizationFilter();
	const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("ALL");
	const [typeFilter, setTypeFilter] = useState<"ALL" | "ORGANIZATION" | "PRODUCT">("ALL");
	const [rejectingCert, setRejectingCert] = useState<CertificationWithProductRow | null>(null);

	const {
		data: allCertifications = [],
		isLoading,
		isError,
		error,
	} = useAdminCertifications({ organizationId: selectedOrganizationId });
	const { data: counts } = useAdminCertificationCounts(selectedOrganizationId);
	const setStatusMutation = useSetCertificationStatus();

	const handleApprove = useCallback(
		(certId: string) => {
			setStatusMutation.mutate({ certificationId: certId, status: "APPROVED" });
		},
		[setStatusMutation],
	);

	const handleRejectConfirm = useCallback(
		(rejectionReason: string) => {
			if (!rejectingCert) return;
			setStatusMutation.mutate(
				{
					certificationId: rejectingCert.id,
					status: "REJECTED",
					rejectionReason: rejectionReason || undefined,
				},
				{ onSuccess: () => setRejectingCert(null) },
			);
		},
		[rejectingCert, setStatusMutation],
	);

	if (isLoading) {
		return (
			<AdminPageWrapper>
				<p className="font-sans text-sm text-text-muted">Loading certifications…</p>
			</AdminPageWrapper>
		);
	}

	if (isError) {
		return (
			<AdminPageWrapper>
				<p className="font-sans text-red-600 text-sm">
					{error instanceof Error ? error.message : "Failed to load certifications."}
				</p>
			</AdminPageWrapper>
		);
	}

	const totalCount    = allCertifications.length;
	const approvedCount = allCertifications.filter((c) => c.status === "APPROVED").length;
	const pendingCount  = allCertifications.filter((c) => c.status === "PENDING").length;
	const rejectedCount = allCertifications.filter((c) => c.status === "REJECTED").length;
	const orgCount      = allCertifications.filter((c) => !c.productId).length;
	const productCount  = allCertifications.filter((c) => !!c.productId).length;

	const certifications = allCertifications
		.filter((c) => statusFilter === "ALL" || c.status === statusFilter)
		.filter((c) => typeFilter === "ALL" || (typeFilter === "ORGANIZATION" ? !c.productId : !!c.productId));

	return (
		<AdminPageWrapper>
			<AdminStatRow>
				<AdminStatCard icon={<Award      color={STAT_ICON_COLOR.neutral} size={18} strokeWidth={1.5} />} label="Total Certs"    value={totalCount}    variant="neutral" />
				<AdminStatCard icon={<CheckCircle color={STAT_ICON_COLOR.green}   size={18} strokeWidth={1.5} />} label="Approved"       value={approvedCount} variant="green"   />
				<AdminStatCard icon={<AlertCircle color={STAT_ICON_COLOR.amber}   size={18} strokeWidth={1.5} />} label="Pending Review" value={pendingCount}  variant="amber"   />
				<AdminStatCard icon={<XCircle     color={STAT_ICON_COLOR.red}     size={18} strokeWidth={1.5} />} label="Rejected"       value={rejectedCount} variant="red"     />
			</AdminStatRow>

			<div className="flex flex-col gap-3">
				{/* Filter toolbar */}
				<div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-cream-dark px-5 py-3.5">
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex gap-1">
							{STATUS_TABS.map((tab) => {
								const count =
									tab.key === "ALL"      ? totalCount :
									tab.key === "APPROVED" ? approvedCount :
									tab.key === "PENDING"  ? pendingCount :
									rejectedCount;
								return (
									<FilterTab
										active={statusFilter === tab.key}
										count={count}
										key={tab.key}
										label={tab.label}
										onClick={() => setStatusFilter(tab.key)}
									/>
								);
							})}
						</div>
						<div className="h-5 w-px bg-cream-dark" />
						<div className="flex gap-1">
							{TYPE_TABS.map((tab) => {
								const count =
									tab.key === "ALL"          ? totalCount :
									tab.key === "ORGANIZATION" ? orgCount :
									productCount;
								return (
									<FilterTab
										active={typeFilter === tab.key}
										count={count}
										key={tab.key}
										label={tab.label}
										onClick={() => setTypeFilter(tab.key)}
									/>
								);
							})}
						</div>
					</div>
					<p className="font-sans text-text-muted text-xs">
						{certifications.length} certification{certifications.length !== 1 ? "s" : ""}
					</p>
				</div>

				{/* Certification cards */}
				{certifications.length === 0 ? (
					<div className="border border-cream-dark bg-white py-14 text-center font-sans text-sm text-text-muted">
						No certifications in this view.
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{certifications.map((c: CertificationWithProductRow) => (
							<CertCard
								c={c}
								isPending={setStatusMutation.isPending}
								key={c.id}
								onApprove={() => handleApprove(c.id)}
								onReject={() => setRejectingCert(c)}
							/>
						))}
					</div>
				)}
			</div>

			{rejectingCert && (
				<RejectCertificationModal
					certificationName={rejectingCert.name}
					onCancel={() => setRejectingCert(null)}
					onConfirm={handleRejectConfirm}
				/>
			)}
		</AdminPageWrapper>
	);
}
