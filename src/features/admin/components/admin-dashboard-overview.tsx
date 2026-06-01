"use client";

import {
	Award,
	ChevronRight,
	MessageCircle,
	Package,
	Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";
import { useAdminOrganizationFilter } from "../hooks/use-admin-organizations";
import { AdminStatCard, STAT_ICON_COLOR } from "./admin-stat-card";
import { AdminPageWrapper } from "./admin-ui";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
	approved: "var(--color-text-muted)", // amber — positive / approved
	pending: "var(--color-text-muted)", // amber-dark — pending
	rejected: "var(--color-danger-dark)", // red — rejected
	draft: "var(--color-text-muted)", // gray — draft
	primary: "var(--color-ink)", // terracotta
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
			<svg height={size} viewBox="0 0 100 100" width={size}>
				<circle
					cx={50}
					cy={50}
					fill="none"
					r={r}
					stroke="var(--color-cream-dark)"
					strokeWidth={10}
				/>
				{total > 0 &&
					segments.map((seg, i) => {
						const fraction = seg.value / total;
						const segLen = fraction * circumference;
						const rotation = -90 + cumulativeDeg;
						cumulativeDeg += fraction * 360;
						return (
							<circle
								cx={50}
								cy={50}
								fill="none"
								key={i}
								r={r}
								stroke={seg.color}
								strokeDasharray={`${segLen} ${circumference}`}
								strokeDashoffset={0}
								strokeWidth={10}
								transform={`rotate(${rotation} 50 50)`}
							/>
						);
					})}
			</svg>
			<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
				<span className="font-bold font-sans text-2xl text-text-dark leading-none">
					{total}
				</span>
				<span className="mt-0.5 font-sans text-text-muted text-xs">total</span>
			</div>
		</div>
	);
}

function LegendRow({
	color,
	label,
	value,
}: {
	color: string;
	label: string;
	value: number;
}) {
	return (
		<div className="flex items-center justify-between gap-3 py-1">
			<div className="flex min-w-0 items-center gap-2">
				<div className="h-2.5 w-2.5 shrink-0" style={{ background: color }} />
				<span className="truncate font-sans text-sm text-text-dark/80">
					{label}
				</span>
			</div>
			<span className="shrink-0 font-sans font-semibold text-sm text-text-dark">
				{value}
			</span>
		</div>
	);
}

function Bar({ fraction, color }: { fraction: number; color: string }) {
	return (
		<div className="h-2 w-full overflow-hidden bg-cream-dark">
			<div
				className="h-full transition-all duration-500"
				style={{
					width: `${Math.min(100, Math.max(0, fraction * 100))}%`,
					background: color,
				}}
			/>
		</div>
	);
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="mb-5">
			<h3 className="font-bold font-serif text-base text-text-dark">{title}</h3>
			<p className="mt-0.5 font-sans text-text-muted text-xs">{subtitle}</p>
		</div>
	);
}

// ─── Quick actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
	{
		label: "Manage partners",
		href: "/admin/users",
		description: "Activate accounts and manage access",
	},
	{
		label: "Products",
		href: "/admin/products",
		description: "Approve or reject product listings",
	},
	{
		label: "Certifications",
		href: "/admin/certifications",
		description: "Review certification documents",
	},
	{
		label: "Training",
		href: "/admin/training",
		description: "Programs and assignments",
	},
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdminDashboardOverview() {
	const { selectedOrganizationId, selectedSlug } = useAdminOrganizationFilter();
	const orgQuery = selectedSlug
		? `?org=${encodeURIComponent(selectedSlug)}`
		: "";
	const { data } = useAdminDashboard(selectedOrganizationId);

	const navStats = data?.navStats;
	const productCounts = data?.productCounts;
	const certCounts = data?.certCounts;
	const trainingCounts = data?.trainingCounts;
	const partnerStats = data?.partnerStats;

	const partnersTotal = navStats?.partnersTotal ?? 0;
	const productTotal = productCounts?.ALL ?? 0;
	const certTotal = certCounts?.ALL ?? 0;
	const trainingTotal = trainingCounts?.ALL ?? 0;
	const partnerActive = partnerStats?.active ?? 0;
	const partnerPending = partnerStats?.pending ?? 0;
	const partnerProfileCompleted = partnerStats?.profileCompleted ?? 0;

	return (
		<AdminPageWrapper>
			{/* ── Stat cards ── */}
			<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
				<AdminStatCard
					icon={
						<Users
							color={STAT_ICON_COLOR.neutral}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Total Partners"
					value={partnersTotal}
					variant="neutral"
				/>
				<AdminStatCard
					icon={
						<Package
							color={STAT_ICON_COLOR.amber}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Pending Products"
					value={navStats?.productsPending ?? 0}
					variant="amber"
				/>
				<AdminStatCard
					icon={
						<Award color={STAT_ICON_COLOR.amber} size={18} strokeWidth={1.5} />
					}
					label="Pending Certifications"
					value={navStats?.certificationsPending ?? 0}
					variant="amber"
				/>
				<AdminStatCard
					icon={
						<MessageCircle
							color={STAT_ICON_COLOR.red}
							size={18}
							strokeWidth={1.5}
						/>
					}
					label="Open Support Tickets"
					value={navStats?.supportTicketsOpen ?? 0}
					variant="red"
				/>
			</div>

			{/* ── Charts row ── */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{[
					{
						title: "Products",
						subtitle: "Status across all listings",
						total: productTotal,
						segments: [
							{
								value: productCounts?.APPROVED ?? 0,
								color: C.approved,
								label: "Approved",
								count: productCounts?.APPROVED ?? 0,
							},
							{
								value: productCounts?.PENDING ?? 0,
								color: C.pending,
								label: "Pending review",
								count: productCounts?.PENDING ?? 0,
							},
							{
								value: productCounts?.REJECTED ?? 0,
								color: C.rejected,
								label: "Rejected",
								count: productCounts?.REJECTED ?? 0,
							},
						],
					},
					{
						title: "Certifications",
						subtitle: "Status across all documents",
						total: certTotal,
						segments: [
							{
								value: certCounts?.APPROVED ?? 0,
								color: C.approved,
								label: "Approved",
								count: certCounts?.APPROVED ?? 0,
							},
							{
								value: certCounts?.PENDING ?? 0,
								color: C.pending,
								label: "Pending review",
								count: certCounts?.PENDING ?? 0,
							},
							{
								value: certCounts?.REJECTED ?? 0,
								color: C.rejected,
								label: "Rejected",
								count: certCounts?.REJECTED ?? 0,
							},
						],
					},
					{
						title: "Training programs",
						subtitle: "Published vs draft",
						total: trainingTotal,
						segments: [
							{
								value: trainingCounts?.PUBLISHED ?? 0,
								color: C.approved,
								label: "Published",
								count: trainingCounts?.PUBLISHED ?? 0,
							},
							{
								value: trainingCounts?.DRAFT ?? 0,
								color: C.draft,
								label: "Draft",
								count: trainingCounts?.DRAFT ?? 0,
							},
						],
					},
				].map((card) => (
					<div
						className="border border-cream-dark bg-white p-6"
						key={card.title}
					>
						<SectionHead subtitle={card.subtitle} title={card.title} />
						<div className="flex items-center gap-6">
							<DonutChart segments={card.segments} total={card.total} />
							<div className="flex flex-1 flex-col divide-y divide-cream-dark">
								{card.segments.map((s) => (
									<LegendRow
										color={s.color}
										key={s.label}
										label={s.label}
										value={s.count}
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* ── Partners + Platform ── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
				{/* Partners — takes 3/5 */}
				<div className="border border-cream-dark bg-white p-6 lg:col-span-3">
					<SectionHead
						subtitle="Account status and regional distribution"
						title="Partners"
					/>
					<div className="flex gap-8">
						{/* Donut + status legend */}
						<div className="flex shrink-0 flex-col items-center gap-4">
							<DonutChart
								segments={[
									{ value: partnerActive, color: C.approved },
									{ value: partnerPending, color: C.pending },
								]}
								size={96}
								total={partnersTotal}
							/>
							<div className="flex w-full flex-col gap-0.5">
								<LegendRow
									color={C.approved}
									label="Active"
									value={partnerActive}
								/>
								<LegendRow
									color={C.pending}
									label="Pending approval"
									value={partnerPending}
								/>
							</div>
						</div>

						{/* Bars */}
						<div className="flex min-w-0 flex-1 flex-col gap-6">
							{/* Profile completion */}
							<div>
								<p className="mb-3 font-sans font-semibold text-text-muted text-xs uppercase tracking-widest">
									Profile completion
								</p>
								<div className="flex flex-col gap-3">
									{[
										{
											label: "Complete",
											value: partnerProfileCompleted,
											total: partnersTotal,
											color: C.approved,
										},
										{
											label: "Incomplete",
											value: partnersTotal - partnerProfileCompleted,
											total: partnersTotal,
											color: C.pending,
										},
									].map((row) => (
										<div key={row.label}>
											<div className="mb-1.5 flex items-baseline justify-between">
												<span className="font-medium font-sans text-sm text-text-dark">
													{row.label}
												</span>
												<span className="font-sans text-text-muted text-xs">
													{row.value} / {row.total} partners
												</span>
											</div>
											<Bar
												color={row.color}
												fraction={row.total > 0 ? row.value / row.total : 0}
											/>
										</div>
									))}
								</div>
							</div>

							{/* By region */}
							{(partnerStats?.byRegion?.length ?? 0) > 0 && (
								<div>
									<p className="mb-3 font-sans font-semibold text-text-muted text-xs uppercase tracking-widest">
										By region
									</p>
									<div className="flex flex-col gap-3">
										{partnerStats!.byRegion
											.slice(0, 5)
											.map(({ region, count }) => (
												<div key={region}>
													<div className="mb-1.5 flex items-baseline justify-between">
														<span className="truncate pr-3 font-sans text-sm text-text-dark">
															{region}
														</span>
														<span className="shrink-0 font-sans font-semibold text-sm text-text-dark">
															{count}
														</span>
													</div>
													<Bar
														color={C.primary}
														fraction={
															partnersTotal > 0 ? count / partnersTotal : 0
														}
													/>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Platform overview — takes 2/5 */}
				<div className="border border-cream-dark bg-white p-6 lg:col-span-2">
					<SectionHead
						subtitle="Key metrics at a glance"
						title="Platform overview"
					/>
					<div className="flex flex-col gap-5">
						{[
							{
								label: "Partners",
								right: String(partnersTotal),
								fraction: 1,
								color: C.primary,
							},
							{
								label: "Products",
								right: `${productCounts?.APPROVED ?? 0} / ${productTotal} approved`,
								fraction:
									productTotal > 0
										? (productCounts?.APPROVED ?? 0) / productTotal
										: 0,
								color: C.approved,
							},
							{
								label: "Certifications",
								right: `${certCounts?.APPROVED ?? 0} / ${certTotal} approved`,
								fraction:
									certTotal > 0 ? (certCounts?.APPROVED ?? 0) / certTotal : 0,
								color: C.approved,
							},
							{
								label: "Training",
								right: `${trainingCounts?.PUBLISHED ?? 0} / ${trainingTotal} published`,
								fraction:
									trainingTotal > 0
										? (trainingCounts?.PUBLISHED ?? 0) / trainingTotal
										: 0,
								color: C.approved,
							},
						].map((item) => (
							<div key={item.label}>
								<div className="mb-1.5 flex items-baseline justify-between">
									<span className="font-sans font-semibold text-text-muted text-xs uppercase tracking-widest">
										{item.label}
									</span>
									<span className="font-sans font-semibold text-sm text-text-dark">
										{item.right}
									</span>
								</div>
								<Bar color={item.color} fraction={item.fraction} />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── Quick actions ── */}
			<div className="border border-cream-dark bg-white">
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-base text-text-dark">
						Quick actions
					</h2>
					<p className="mt-0.5 font-sans text-text-muted text-xs">
						Partner &amp; product management, certification, analytics,
						training, and wholesale oversight.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
					{QUICK_ACTIONS.map((action, i) => (
						<Link
							className={`group flex items-center justify-between gap-3 px-6 py-5 no-underline transition-colors hover:bg-cream ${i > 0 ? "border-cream-dark border-l" : ""}`}
							href={action.href + orgQuery}
							key={action.href}
						>
							<div className="flex flex-col gap-1">
								<span className="font-sans font-semibold text-sm text-text-dark transition-colors group-hover:text-primary">
									{action.label}
								</span>
								<span className="font-sans text-text-muted text-xs">
									{action.description}
								</span>
							</div>
							<ChevronRight
								className="shrink-0 text-text-muted transition-colors group-hover:text-primary"
								size={14}
							/>
						</Link>
					))}
				</div>
			</div>
		</AdminPageWrapper>
	);
}
