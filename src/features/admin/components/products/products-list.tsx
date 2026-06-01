"use client";

import {
	AlertCircle,
	CheckCircle,
	LayoutGrid,
	Trash2,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import type {
	ProductAdminListRow,
	ProductPaymentOptionValue,
} from "~/app/api/products/schemas/products.schema";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import {
	useAdminProductCounts,
	useAdminProducts,
	useSetProductStatus,
} from "../../hooks/use-admin-products";
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
import { ApproveProductModal } from "./approve-product-modal";
import { RejectProductModal } from "./reject-product-modal";

const CATEGORY_COLORS: Record<
	string,
	{ bg: string; dot: string; text: string }
> = {
	"Oils & Extracts": {
		bg: "var(--color-cream)",
		dot: "var(--color-text-muted)",
		text: "var(--color-ink)",
	},
	"Spices & Herbs": {
		bg: "var(--color-cream)",
		dot: "color-mix(in srgb, var(--color-ink) 58%, var(--color-text-muted))",
		text: "var(--color-ink)",
	},
	"Florals & Essences": {
		bg: "var(--color-cream)",
		dot: "color-mix(in srgb, var(--color-ink) 72%, var(--color-text-muted))",
		text: "var(--color-ink)",
	},
	"Dried Fruits": {
		bg: "var(--color-cream)",
		dot: "var(--color-text-muted)",
		text: "var(--color-ink)",
	},
	Cosmetics: {
		bg: "var(--color-cream)",
		dot: "var(--color-ink)",
		text: "var(--color-ink)",
	},
};

function getCategoryStyle(category: string) {
	return (
		CATEGORY_COLORS[category] ?? {
			bg: "var(--color-cream)",
			dot: "var(--color-text-muted)",
			text: "var(--color-ink)",
		}
	);
}

const STATUS_TABS = [
	{ key: "ALL" as const, label: "All" },
	{ key: "APPROVED" as const, label: "Approved" },
	{ key: "PENDING" as const, label: "Pending" },
	{ key: "REJECTED" as const, label: "Rejected" },
];

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
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

export function ProductsList() {
	const router = useRouter();
	const { selectedOrganizationId } = useAdminOrganizationFilter();
	const [statusFilter, setStatusFilter] = useState<
		"PENDING" | "APPROVED" | "REJECTED" | "ALL"
	>("ALL");
	const [rejectingProduct, setRejectingProduct] =
		useState<ProductAdminListRow | null>(null);
	const [approvingProduct, setApprovingProduct] =
		useState<ProductAdminListRow | null>(null);

	const {
		data: allProducts = [],
		isLoading,
		isError,
		error,
	} = useAdminProducts("ALL", selectedOrganizationId);
	const { data: counts } = useAdminProductCounts(selectedOrganizationId);
	const setStatusMutation = useSetProductStatus();

	const products =
		statusFilter === "ALL"
			? allProducts
			: allProducts.filter((p) => p.status === statusFilter);

	const handleApproveConfirm = useCallback(
		(paymentOption: ProductPaymentOptionValue) => {
			if (!approvingProduct) return;
			setStatusMutation.mutate(
				{ productId: approvingProduct.id, status: "APPROVED", paymentOption },
				{ onSuccess: () => setApprovingProduct(null) },
			);
		},
		[approvingProduct, setStatusMutation],
	);

	const handleRejectConfirm = useCallback(
		(rejectionReason: string) => {
			if (!rejectingProduct) return;
			setStatusMutation.mutate(
				{
					productId: rejectingProduct.id,
					status: "REJECTED",
					rejectionReason: rejectionReason || undefined,
				},
				{ onSuccess: () => setRejectingProduct(null) },
			);
		},
		[rejectingProduct, setStatusMutation],
	);

	if (isLoading) {
		return (
			<AdminPageWrapper>
				<p className="font-sans text-sm text-text-muted">Loading products…</p>
			</AdminPageWrapper>
		);
	}

	if (isError) {
		return (
			<AdminPageWrapper>
				<p className="font-sans text-red-600 text-sm">
					{error instanceof Error ? error.message : "Failed to load products."}
				</p>
			</AdminPageWrapper>
		);
	}

	return (
		<AdminPageWrapper>
			<AdminStatRow>
				<AdminStatCard
					icon={
						<LayoutGrid
							color={STAT_ICON_COLOR.neutral}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Total Products"
					value={counts?.ALL ?? "—"}
					variant="neutral"
				/>
				<AdminStatCard
					icon={
						<CheckCircle
							color={STAT_ICON_COLOR.green}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Approved"
					value={counts?.APPROVED ?? "—"}
					variant="green"
				/>
				<AdminStatCard
					icon={
						<AlertCircle
							color={STAT_ICON_COLOR.amber}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Pending Review"
					value={counts?.PENDING ?? "—"}
					variant="amber"
				/>
				<AdminStatCard
					icon={
						<XCircle color={STAT_ICON_COLOR.red} size={18} strokeWidth={1.5} />
					}
					label="Rejected"
					value={counts?.REJECTED ?? "—"}
					variant="red"
				/>
			</AdminStatRow>

			<AdminTable>
				<AdminTableToolbar>
					<div className="flex gap-1">
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
					<p className="font-sans text-text-muted text-xs">
						{products.length} product{products.length !== 1 ? "s" : ""}
					</p>
				</AdminTableToolbar>

				<AdminTableHead>
					<div className="w-7 shrink-0" />
					<AdminTableHeadCell className="[flex:2.8]">
						Product
					</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:1.6]">
						Partner
					</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:1.2]">
						Category
					</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:0.9]">Status</AdminTableHeadCell>
					<AdminTableHeadCell className="[flex:0.8]">Added</AdminTableHeadCell>
					<AdminTableHeadCell className="text-right [flex:0.8]">
						Actions
					</AdminTableHeadCell>
				</AdminTableHead>

				{products.length === 0 ? (
					<AdminTableEmpty message="No products in this view." />
				) : (
					products.map((p) => {
						const catStyle = getCategoryStyle(p.category);
						return (
							<AdminTableRow
								key={p.id}
								onClick={() => router.push(`/admin/products/${p.id}`)}
							>
								<div className="w-7 shrink-0">
									<div className="h-[15px] w-[15px] border-[1.5px] border-cream-dark" />
								</div>

								<div className="flex items-center gap-3 [flex:2.8]">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										alt=""
										className="h-11 w-11 shrink-0 bg-cream object-cover"
										src={
											p.firstImageUrl ??
											productPlaceholderImageUrl(`${p.id}:${p.category}`, 176)
										}
									/>
									<div>
										<div className="font-sans font-semibold text-sm text-text-dark leading-[1.3]">
											{p.name}
										</div>
										<div className="mt-0.5 font-sans text-text-muted text-xs">
											{p.category}
											{p.moq ? ` · Min ${p.moq}` : ""}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2 [flex:1.6]">
									<div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center bg-secondary">
										<span className="font-bold font-sans text-[9px] text-white">
											{getInitials(p.organizationName ?? "—")}
										</span>
									</div>
									<span className="font-sans text-sm text-text-dark">
										{p.organizationName}
									</span>
								</div>

								<div className="[flex:1.2]">
									<span
										className="inline-flex items-center gap-1.5 px-2.5 py-[3px] font-medium font-sans text-xs"
										style={{ background: catStyle.bg, color: catStyle.text }}
									>
										<span
											className="h-1.5 w-1.5 shrink-0"
											style={{ background: catStyle.dot }}
										/>
										{p.category}
									</span>
								</div>

								<div className="[flex:0.9]">
									<StatusBadge status={p.status} />
								</div>

								<div className="font-sans text-sm text-text-muted [flex:0.8]">
									{formatDate(p.createdAt)}
								</div>

								<div
									className="flex items-center justify-end gap-1.5 [flex:0.8]"
									onClick={(e) => e.stopPropagation()}
								>
									{p.status === "PENDING" && (
										<BtnPrimary
											disabled={setStatusMutation.isPending}
											onClick={() => setApprovingProduct(p)}
										>
											{setStatusMutation.isPending ? "…" : "Approve"}
										</BtnPrimary>
									)}
									<BtnSecondary href={`/admin/products/${p.id}`}>
										View
									</BtnSecondary>
									{p.status === "PENDING" && (
										<BtnDanger
											disabled={setStatusMutation.isPending}
											onClick={() => setRejectingProduct(p)}
										>
											<Trash2 size={14} strokeWidth={1.2} />
										</BtnDanger>
									)}
								</div>
							</AdminTableRow>
						);
					})
				)}

				<div className="flex items-center justify-between border-cream-dark border-t bg-cream px-5 py-3.5">
					<p className="font-sans text-text-muted text-xs">
						{products.length} product{products.length !== 1 ? "s" : ""} shown
					</p>
				</div>
			</AdminTable>

			{approvingProduct && (
				<ApproveProductModal
					isSubmitting={setStatusMutation.isPending}
					onCancel={() => setApprovingProduct(null)}
					onConfirm={handleApproveConfirm}
					productName={approvingProduct.name}
				/>
			)}
			{rejectingProduct && (
				<RejectProductModal
					onCancel={() => setRejectingProduct(null)}
					onConfirm={handleRejectConfirm}
					productId={rejectingProduct.id}
					productName={rejectingProduct.name}
				/>
			)}
		</AdminPageWrapper>
	);
}
