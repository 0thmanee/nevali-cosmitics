"use client";

import { useMemo } from "react";
import { AlertCircle, ClipboardList, Package } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";
import { DashboardOverviewCharts } from "./dashboard-overview-charts";

function countByStatus(
  rows: { status: string; count: number }[] | undefined,
  status: string
): number {
  return rows?.find((r) => r.status === status)?.count ?? 0;
}

export function DashboardStats() {
  const { data: stats, isPending } = useArtisanDashboardStats();
  const openSupportTickets = stats?.openSupportTickets ?? 0;
  const activeCount = useMemo(
    () => countByStatus(stats?.productsByStatus, "APPROVED"),
    [stats]
  );
  const pendingCount = useMemo(
    () => countByStatus(stats?.productsByStatus, "PENDING"),
    [stats]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Live listings"
          value={activeCount}
          icon={<Package size={20} color={STAT_ICON_COLOR.neutral} />}
          variant="neutral"
          subline="Approved and visible in the shop catalog."
        />
        <StatCard
          label="In review"
          value={pendingCount}
          icon={<ClipboardList size={20} color={STAT_ICON_COLOR.neutral} />}
          variant="neutral"
          subline="Awaiting platform approval."
        />
        <StatCard
          label="Open support tickets"
          value={openSupportTickets}
          icon={<AlertCircle size={20} color={STAT_ICON_COLOR.amber} />}
          variant="amber"
          subline="Needs a reply from your team."
        />
      </div>

      <DashboardOverviewCharts stats={stats} isLoading={isPending} />
    </div>
  );
}
