"use client";

import { Award, CheckCircle, Clock, XCircle } from "lucide-react";
import type React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

// ── Status chip ───────────────────────────────────────────────────────────────

function StatusChip({
	label,
	count,
	color,
	dot,
}: {
	label: string;
	count: number;
	color: string;
	dot: string;
}) {
	return (
		<div className="flex items-center gap-1.5">
			<span
				className="h-2 w-2 shrink-0 rounded-full"
				style={{ background: dot }}
			/>
			<span className="font-sans text-[12px] text-text-muted">{label}</span>
			<span className="font-bold font-sans text-[12px]" style={{ color }}>
				{count}
			</span>
		</div>
	);
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({
	approved,
	total,
	color,
}: {
	approved: number;
	total: number;
	color: string;
}) {
	const pct = total === 0 ? 0 : Math.round((approved / total) * 100);
	return (
		<div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-cream-dark)]">
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
	const { t } = useI18n();
	return (
		<div
			className="flex flex-col gap-3 rounded-sm p-4"
			style={{
				border: "1px solid var(--color-cream-dark)",
				background: "var(--color-paper)",
			}}
		>
			{/* Header */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<div
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
						style={{ background: accentColor + "18" }}
					>
						{icon}
					</div>
					<span className="font-sans font-semibold text-[13px] text-text-dark">
						{label}
					</span>
				</div>
				<span
					className="rounded-full px-2 py-0.5 font-bold font-sans text-[11px]"
					style={{ background: accentColor + "14", color: accentColor }}
				>
					{t("producerProfileCert.totalCount", { count: total })}
				</span>
			</div>

			{total === 0 ? (
				<p className="font-sans text-[12px] text-text-muted italic">
					{emptyHint}
				</p>
			) : (
				<>
					<ProgressBar approved={approved} color={barColor} total={total} />
					<div className="flex flex-wrap items-center gap-5">
						<StatusChip
							color="var(--color-success)"
							count={approved}
							dot="var(--color-success-light)"
							label={t("producerProfileCert.statusApproved")}
						/>
						<StatusChip
							color="var(--color-text-muted)"
							count={pending}
							dot="var(--color-text-muted)"
							label={t("producerProfileCert.statusPending")}
						/>
						<StatusChip
							color="var(--color-danger-dark)"
							count={rejected}
							dot="var(--color-danger)"
							label={t("producerProfileCert.statusRejected")}
						/>
					</div>
				</>
			)}
		</div>
	);
}

// ── Stat number ───────────────────────────────────────────────────────────────

function StatNumber({
	value,
	label,
	sub,
}: {
	value: number;
	label: string;
	sub?: string;
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="font-bold font-serif text-[28px] text-text-dark leading-none">
				{value}
			</span>
			<span className="font-sans font-semibold text-[12px] text-text-dark">
				{label}
			</span>
			{sub && (
				<span className="font-sans text-[11px] text-text-muted">{sub}</span>
			)}
		</div>
	);
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function CertificationOverview() {
	const { t } = useI18n();
	const { data: certifications = [], isLoading: certLoading } =
		useCertifications();
	const { data: certifiedProducts = [], isLoading: productsLoading } =
		useCertifiedProducts();

	const isLoading = certLoading || productsLoading;

	const globalCerts = certifications.filter((c) => !c.productId);
	const productCerts = certifications.filter((c) => !!c.productId);

	const gApproved = globalCerts.filter((c) => c.status === "APPROVED").length;
	const gPending = globalCerts.filter((c) => c.status === "PENDING").length;
	const gRejected = globalCerts.filter((c) => c.status === "REJECTED").length;

	const pApproved = productCerts.filter((c) => c.status === "APPROVED").length;
	const pPending = productCerts.filter((c) => c.status === "PENDING").length;
	const pRejected = productCerts.filter((c) => c.status === "REJECTED").length;

	const certifiedCount = certifiedProducts.length;
	const totalApproved = gApproved + pApproved;
	const totalPending = gPending + pPending;
	const totalRejected = gRejected + pRejected;

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center rounded-sm py-12"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-[13px] text-text-muted">
					{t("producerProfileCert.loading")}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* ── Top stat strip ── */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{(
					[
						{
							value: certifiedCount,
							label: t("producerProfileCert.certifiedProducts"),
							icon: <Award size={18} strokeWidth={1.5} />,
							bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)",
							color: "var(--color-ink)",
						},
						{
							value: totalApproved,
							label: t("producerProfileCert.approvedCerts"),
							icon: <CheckCircle size={18} strokeWidth={1.5} />,
							bg: "color-mix(in srgb, var(--color-success) 8%, transparent)",
							color: "var(--color-success)",
						},
						{
							value: totalPending,
							label: t("producerProfileCert.pendingReview"),
							icon: <Clock size={18} strokeWidth={1.5} />,
							bg: "color-mix(in srgb, var(--color-gold) 8%, transparent)",
							color: "var(--color-text-muted)",
						},
						{
							value: totalRejected,
							label: t("producerProfileCert.statusRejected"),
							icon: <XCircle size={18} strokeWidth={1.5} />,
							bg: "color-mix(in srgb, var(--color-danger-dark) 8%, transparent)",
							color: "var(--color-danger-dark)",
						},
					] as const
				).map(({ value, label, icon, bg, color }) => (
					<div
						className="flex items-center gap-3 rounded-sm px-4 py-3.5"
						key={label}
						style={{
							background: "white",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<div
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm"
							style={{ background: bg, color }}
						>
							{icon}
						</div>
						<div>
							<p
								className="font-bold font-serif text-[22px] leading-none"
								style={{ color }}
							>
								{value}
							</p>
							<p className="mt-0.5 font-sans text-[11px] text-text-muted">
								{label}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* ── Main grid ── */}
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
				{/* Left: breakdown card */}
				<div
					className="overflow-hidden rounded-sm"
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<div
						className="flex items-center gap-2 border-b px-5 py-4"
						style={{ borderColor: "var(--color-cream-dark)" }}
					>
						<h3 className="font-bold font-serif text-[15px] text-text-dark">
							{t("producerProfileCert.certificationBreakdown")}
						</h3>
					</div>
					<div className="flex flex-col gap-3 p-5">
						<CertTypeRow
							accentColor="var(--color-ink)"
							approved={gApproved}
							barColor="var(--color-success-light)"
							emptyHint={t("producerProfileCert.orgCertsEmptyHint")}
							icon={
								<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
									<path
										d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z"
										stroke="var(--color-ink)"
										strokeLinejoin="round"
										strokeWidth="1.2"
									/>
								</svg>
							}
							label={t("producerProfileCert.orgCertifications")}
							pending={gPending}
							rejected={gRejected}
							total={globalCerts.length}
						/>
						<CertTypeRow
							accentColor="var(--color-info-dark)"
							approved={pApproved}
							barColor="var(--color-info)"
							emptyHint={t("producerProfileCert.productCertsEmptyHint")}
							icon={
								<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
									<rect
										height="7.5"
										rx="1.5"
										stroke="var(--color-info-dark)"
										strokeWidth="1.2"
										width="11"
										x="1.5"
										y="5"
									/>
									<path
										d="M4.5 5V4a2.5 2.5 0 0 1 5 0v1"
										stroke="var(--color-info-dark)"
										strokeLinecap="round"
										strokeWidth="1.2"
									/>
									<circle
										cx="7"
										cy="8.5"
										fill="var(--color-info-dark)"
										r="1.2"
									/>
								</svg>
							}
							label={t("producerProfileCert.productCertifications")}
							pending={pPending}
							rejected={pRejected}
							total={productCerts.length}
						/>
					</div>
				</div>

				{/* Right: info + tips */}
				<div className="flex flex-col gap-3">
					{/* Rejection alert */}
					{totalRejected > 0 && (
						<div
							className="flex flex-col gap-2 rounded-sm px-4 py-4"
							style={{
								background:
									"color-mix(in srgb, var(--color-danger-dark) 5%, transparent)",
								border:
									"1px solid color-mix(in srgb, var(--color-danger-dark) 18%, transparent)",
							}}
						>
							<div className="flex items-center gap-2">
								<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
									<circle
										cx="7"
										cy="7"
										r="5.5"
										stroke="var(--color-danger-dark)"
										strokeWidth="1.2"
									/>
									<path
										d="M7 4v4"
										stroke="var(--color-danger-dark)"
										strokeLinecap="round"
										strokeWidth="1.4"
									/>
									<circle
										cx="7"
										cy="10"
										fill="var(--color-danger-dark)"
										r="0.8"
									/>
								</svg>
								<span className="font-bold font-sans text-[11px] text-[var(--color-danger-dark)] uppercase tracking-wide">
									{t("producerProfileCert.actionNeeded")}
								</span>
							</div>
							<p className="font-sans text-[12px] text-[var(--color-danger-dark)]/80 leading-relaxed">
								{totalRejected !== 1
									? t("producerProfileCert.rejectionAlertPlural", {
											count: totalRejected,
										})
									: t("producerProfileCert.rejectionAlertSingular", {
											count: totalRejected,
										})}
							</p>
						</div>
					)}

					{/* Certified products */}
					<div
						className="flex flex-col gap-3 rounded-sm px-4 py-4"
						style={{
							background: "white",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<div
							className="flex items-center gap-2 border-b pb-3"
							style={{ borderColor: "var(--color-cream-dark)" }}
						>
							<div
								className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
								style={{
									background:
										"color-mix(in srgb, var(--color-ink) 10%, transparent)",
								}}
							>
								<svg fill="none" height="13" viewBox="0 0 14 14" width="13">
									<path
										d="M7 1l1.6 4H13L9.5 7.5l1.3 4L7 9.4l-3.8 2.1 1.3-4L1 5h4.4L7 1z"
										stroke="var(--color-ink)"
										strokeLinejoin="round"
										strokeWidth="1.2"
									/>
								</svg>
							</div>
							<span className="font-sans font-semibold text-[13px] text-text-dark">
								{t("producerProfileCert.certifiedProducts")}
							</span>
						</div>
						<div className="flex items-end gap-2">
							<span className="font-bold font-serif text-[32px] text-text-dark leading-none">
								{certifiedCount}
							</span>
							<span className="mb-1 font-sans text-[12px] text-text-muted">
								{certifiedCount !== 1
									? t("producerProfileCert.productsApprovedPlural")
									: t("producerProfileCert.productsApprovedSingular")}
							</span>
						</div>
						<p className="font-sans text-[11px] text-text-muted leading-relaxed">
							{SHOW_MULTI_PRODUCER_EXPERIENCE
								? t("producerProfileCert.approvedProductsMarketplace")
								: t("producerProfileCert.approvedProductsCatalog", {
										brand: NEVALI_HOUSE_BRAND.legalName,
									})}
						</p>
					</div>

					{/* Renewal tip */}
					<div
						className="flex flex-col gap-2 rounded-sm px-4 py-4"
						style={{
							background:
								"color-mix(in srgb, var(--color-gold) 6%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
						}}
					>
						<div className="flex items-center gap-2">
							<svg fill="none" height="13" viewBox="0 0 14 14" width="13">
								<circle
									cx="7"
									cy="7"
									r="5.5"
									stroke="var(--color-text-muted)"
									strokeWidth="1.2"
								/>
								<path
									d="M7 4v3.5l2 1.5"
									stroke="var(--color-text-muted)"
									strokeLinecap="round"
									strokeWidth="1.2"
								/>
							</svg>
							<span className="font-bold font-sans text-[11px] text-text-muted uppercase tracking-wide">
								{t("producerProfileCert.renewalReminder")}
							</span>
						</div>
						<p className="font-sans text-[12px] text-text-muted/80 leading-relaxed">
							{t("producerProfileCert.renewalReminderText")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
