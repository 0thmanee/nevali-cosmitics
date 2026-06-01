"use client";

import { AlertCircle, ClipboardList, Package } from "lucide-react";
import { useMemo } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
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
	const { t } = useI18n();
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
					label={t("producerDashboard.liveListings")}
					subline={t("producerDashboard.liveListingsSub")}
					value={activeCount}
					variant="neutral"
				/>
				<StatCard
					icon={<ClipboardList color={STAT_ICON_COLOR.neutral} size={20} />}
					label={t("producerDashboard.inReview")}
					subline={t("producerDashboard.inReviewSub")}
					value={pendingCount}
					variant="neutral"
				/>
				<StatCard
					icon={<AlertCircle color={STAT_ICON_COLOR.amber} size={20} />}
					label={t("producerDashboard.openTickets")}
					subline={t("producerDashboard.openTicketsSub")}
					value={openSupportTickets}
					variant="amber"
				/>
			</div>

			<DashboardOverviewCharts isLoading={isPending} stats={stats} />
		</div>
	);
}
