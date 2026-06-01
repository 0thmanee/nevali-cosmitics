"use client";

import { AlertCircle, ClipboardList, Package } from "lucide-react";
import { useMemo } from "react";
import { STAT_ICON_COLOR, StatCard } from "~/components/stat-card";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";
import { DashboardOverviewCharts } from "./dashboard-overview-charts";

function countByStatus(
	rows: { status: string; count: number }[] | undefined,
	status: string,
): number {
	return rows?.find((r) => r.status === status)?.count ?? 0;
}

export function DashboardStats() {
	const { data: stats, isPending } = useArtisanDashboardStats();
	const openSupportTickets = stats?.openSupportTickets ?? 0;
	const activeCount = useMemo(
		() => countByStatus(stats?.productsByStatus, "APPROVED"),
		[stats],
	);
	const pendingCount = useMemo(
		() => countByStatus(stats?.productsByStatus, "PENDING"),
		[stats],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard
					icon={<Package color={STAT_ICON_COLOR.neutral} size={20} />}
					label="Live listings"
					subline="Approved and visible in the shop catalog."
					value={activeCount}
					variant="neutral"
				/>
				<StatCard
					icon={<ClipboardList color={STAT_ICON_COLOR.neutral} size={20} />}
					label="In review"
					subline="Awaiting platform approval."
					value={pendingCount}
					variant="neutral"
				/>
				<StatCard
					icon={<AlertCircle color={STAT_ICON_COLOR.amber} size={20} />}
					label="Open support tickets"
					subline="Needs a reply from your team."
					value={openSupportTickets}
					variant="amber"
				/>
			</div>

			<DashboardOverviewCharts isLoading={isPending} stats={stats} />
		</div>
	);
}
