"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { ProductGallery } from "~/features/artisan/components/products/product-gallery";
import { paymentOptionLabel } from "~/lib/format-price";
import { useSetCertificationStatus } from "../../hooks/use-admin-certifications";
import {
	useAdminProduct,
	useSetProductStatus,
} from "../../hooks/use-admin-products";
import { RejectCertificationModal } from "../certifications/reject-certification-modal";
import { ApproveProductModal } from "./approve-product-modal";
import { RejectProductModal } from "./reject-product-modal";

const statusStyles: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	PENDING: {
		bg: "color-mix(in srgb, var(--color-gold) 20%, transparent)",
		color: "var(--color-gold)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
	},
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 20%, transparent)",
		color: "var(--color-danger)",
		border:
			"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
	},
};

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(d));
}

export function AdminProductDetailView() {
	const { t } = useI18n();
	const params = useParams();
	const productId = typeof params.id === "string" ? params.id : null;
	const {
		data: product,
		isLoading,
		isError,
		error,
	} = useAdminProduct(productId);
	const setStatusMutation = useSetProductStatus();
	const setCertStatusMutation = useSetCertificationStatus();
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [rejectingCert, setRejectingCert] = useState<CertificationRow | null>(
		null,
	);

	const handleApproveConfirm = useCallback(
		(paymentOption: ProductPaymentOptionValue) => {
			if (productId) {
				setStatusMutation.mutate(
					{ productId, status: "APPROVED", paymentOption },
					{ onSuccess: () => setShowApproveModal(false) },
				);
			}
		},
		[productId, setStatusMutation],
	);

	const handleRejectConfirm = useCallback(
		(rejectionReason: string) => {
			if (productId)
				setStatusMutation.mutate(
					{
						productId,
						status: "REJECTED",
						rejectionReason: rejectionReason || undefined,
					},
					{ onSuccess: () => setShowRejectModal(false) },
				);
		},
		[productId, setStatusMutation],
	);

	const handleCertApprove = useCallback(
		(certId: string) => {
			setCertStatusMutation.mutate({
				certificationId: certId,
				status: "APPROVED",
			});
		},
		[setCertStatusMutation],
	);

	const handleCertRejectConfirm = useCallback(
		(rejectionReason: string) => {
			if (!rejectingCert) return;
			setCertStatusMutation.mutate(
				{
					certificationId: rejectingCert.id,
					status: "REJECTED",
					rejectionReason: rejectionReason || undefined,
				},
				{ onSuccess: () => setRejectingCert(null) },
			);
		},
		[rejectingCert, setCertStatusMutation],
	);

	if (!productId) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="overflow-hidden rounded-sm px-6 py-12 text-center"
					style={cardStyle}
				>
					<p className="font-sans text-[var(--color-danger)] text-sm">
						Invalid product.
					</p>
					<Link
						className="mt-4 inline-block font-medium font-sans text-sm text-text-dark underline"
						href="/admin/products"
					>
						← Back to products
					</Link>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="flex items-center justify-center overflow-hidden rounded-sm py-20"
					style={cardStyle}
				>
					<p className="font-sans text-sm text-text-muted">Loading product…</p>
				</div>
			</div>
		);
	}

	if (isError || !product) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="overflow-hidden rounded-sm px-6 py-12 text-center"
					style={cardStyle}
				>
					<p className="font-sans text-[var(--color-danger)] text-sm">
						{error instanceof Error ? error.message : "Product not found."}
					</p>
					<Link
						className="mt-4 inline-block font-medium font-sans text-sm text-text-dark underline"
						href="/admin/products"
					>
						← Back to products
					</Link>
				</div>
			</div>
		);
	}

	const style = statusStyles[product.status] ?? statusStyles.PENDING;

	return (
		<div className="flex flex-col gap-6 p-4 lg:p-6">
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							{product.name}
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							{product.category}
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted">
							{product.organizationName} · Updated{" "}
							{formatDate(product.updatedAt)}
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<span
							className="rounded-full px-4 py-1.5 font-bold font-sans text-[11px] uppercase tracking-wide"
							style={style}
						>
							{product.status}
						</span>
						{product.status === "PENDING" && productId && (
							<>
								<button
									className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
									disabled={setStatusMutation.isPending}
									onClick={() => setShowApproveModal(true)}
									style={{ background: "var(--color-ink)", color: "white" }}
									type="button"
								>
									Approve
								</button>
								<button
									className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
									disabled={setStatusMutation.isPending}
									onClick={() => setShowRejectModal(true)}
									style={{
										background:
											"color-mix(in srgb, var(--color-danger-dark) 12%, transparent)",
										color: "var(--color-danger-dark)",
										border:
											"1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent)",
									}}
									type="button"
								>
									Reject
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			<ProductGallery alt={product.name} images={product.images ?? []} />

			{(product.variants?.length ?? 0) > 0 && (
				<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
					<div className="border-cream-dark border-b px-6 py-4">
						<h2 className="font-bold font-serif text-[15px] text-text-dark">
							Variants & pricing
						</h2>
					</div>
					<ul className="flex flex-col gap-2 p-6">
						{(product.variants ?? []).map((v) => (
							<li
								className="flex flex-wrap justify-between gap-2 rounded-sm px-4 py-3 font-sans text-sm text-text-dark"
								key={v.id}
								style={{
									background: "var(--color-paper)",
									border: "1px solid var(--color-cream-dark)",
								}}
							>
								<span className="font-semibold">{v.name}</span>
								<span className="text-text-muted">
									{v.price} MAD · MOQ {v.minOrderQuantity}
									{v.quantityOnHand > 0 ? ` · Stock ${v.quantityOnHand}` : ""}
									{!v.inStock ? " · Out of stock" : ""}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Certifications
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						The producer adds certifications on the product detail page. Approve
						or reject each certification here—separately from the product
						status.
					</p>
				</div>
				<div className="p-6">
					{(product.certifications?.length ?? 0) === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							No certifications for this product yet. The producer can add
							documents (PDF or image) on their product detail page; they will
							appear here for review.
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{(product.certifications ?? []).map((c: CertificationRow) => {
								const certStyle =
									statusStyles[c.status] ?? statusStyles.PENDING;
								return (
									<li
										className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-3"
										key={c.id}
										style={{
											background: "var(--color-paper)",
											border: "1px solid var(--color-cream-dark)",
										}}
									>
										<div className="min-w-0">
											<a
												className="block truncate font-sans font-semibold text-sm text-text-dark hover:underline"
												href={c.fileUrl}
												rel="noopener noreferrer"
												target="_blank"
											>
												{c.name}
											</a>
											{c.status === "REJECTED" && c.rejectionReason && (
												<p className="mt-0.5 font-sans text-[11px] text-[var(--color-danger)]">
													{c.rejectionReason}
												</p>
											)}
										</div>
										<div className="flex shrink-0 items-center gap-2">
											<span
												className="rounded-full px-2.5 py-1 font-bold font-sans text-[10px] uppercase tracking-wide"
												style={certStyle}
											>
												{c.status}
											</span>
											<a
												className="font-medium font-sans text-[12px] text-text-dark hover:underline"
												href={c.fileUrl}
												rel="noopener noreferrer"
												target="_blank"
											>
												View
											</a>
											{c.status === "PENDING" && (
												<>
													<button
														className="rounded-sm px-2.5 py-1.5 font-sans font-semibold text-[11px] transition-colors disabled:opacity-60"
														disabled={setCertStatusMutation.isPending}
														onClick={() => handleCertApprove(c.id)}
														style={{
															background: "var(--color-ink)",
															color: "white",
															border: "1px solid var(--color-ink)",
														}}
														type="button"
													>
														Approve
													</button>
													<button
														className="rounded-sm px-2.5 py-1.5 font-sans font-semibold text-[11px] transition-colors disabled:opacity-60"
														disabled={setCertStatusMutation.isPending}
														onClick={() => setRejectingCert(c)}
														style={{
															background:
																"color-mix(in srgb, var(--color-danger-dark) 12%, transparent)",
															color: "var(--color-danger-dark)",
															border:
																"1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent)",
														}}
														type="button"
													>
														Reject
													</button>
												</>
											)}
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Details
					</h2>
				</div>
				<div className="flex flex-col gap-4 p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div
							className="rounded-sm p-4"
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								Minimum order quantity
							</p>
							<p className="font-sans font-semibold text-[15px] text-text-dark">
								{product.moq ?? "—"}
							</p>
						</div>
						<div
							className="rounded-sm p-4"
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								Capacity
							</p>
							<p className="font-sans font-semibold text-[15px] text-text-dark">
								{product.capacity ?? "—"}
							</p>
						</div>
						{product.status === "APPROVED" && (
							<div
								className="rounded-sm p-4 sm:col-span-2"
								style={{
									background: "var(--color-paper)",
									border: "1px solid var(--color-cream-dark)",
								}}
							>
								<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
									Checkout payment options
								</p>
								<p className="font-sans font-semibold text-[15px] text-text-dark">
									{paymentOptionLabel(product.paymentOption, t)}
								</p>
							</div>
						)}
					</div>
					{product.status === "REJECTED" && product.rejectionReason?.trim() && (
						<div
							className="flex flex-col gap-1 rounded-sm px-4 py-3"
							style={{
								background:
									"color-mix(in srgb, var(--color-danger) 8%, transparent)",
								border:
									"1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
							}}
						>
							<p className="font-bold font-sans text-[11px] text-[var(--color-danger)] uppercase tracking-wide">
								Rejection reason
							</p>
							<p className="font-sans text-sm text-text-dark">
								{product.rejectionReason}
							</p>
						</div>
					)}
				</div>
			</div>

			<Link
				className="w-fit font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
				href="/admin/products"
			>
				← Back to products
			</Link>

			{showApproveModal && (
				<ApproveProductModal
					isSubmitting={setStatusMutation.isPending}
					onCancel={() => setShowApproveModal(false)}
					onConfirm={handleApproveConfirm}
					productName={product.name}
				/>
			)}
			{showRejectModal && (
				<RejectProductModal
					onCancel={() => setShowRejectModal(false)}
					onConfirm={handleRejectConfirm}
					productId={product.id}
					productName={product.name}
				/>
			)}
			{rejectingCert && (
				<RejectCertificationModal
					certificationName={rejectingCert.name}
					onCancel={() => setRejectingCert(null)}
					onConfirm={handleCertRejectConfirm}
				/>
			)}
		</div>
	);
}
