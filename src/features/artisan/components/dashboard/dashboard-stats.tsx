"use client";

import React from "react";
import { Package, FileText, Shield, TrendingUp } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";
import { useProducts } from "../../hooks/use-products";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";

export function DashboardStats() {
  const { data: products = [] } = useProducts();
  const { data: stats } = useArtisanDashboardStats();
  const activeCount = products.filter((p) => p.status === "APPROVED").length;

  const openRfqs = stats?.openRfqs ?? 0;
  const pendingReplyCount = stats?.pendingReplyCount ?? 0;
  const activeContracts = stats?.activeContracts ?? 0;
  const revenueYtd = stats?.revenueYtd ?? "€0";
  const rfqSubline =
    pendingReplyCount > 0
      ? `${pendingReplyCount} new — awaiting your reply`
      : undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <StatCard
        label="Active Products"
        value={activeCount}
        icon={<Package size={20} color={STAT_ICON_COLOR.neutral} />}
        variant="neutral"
      />
      <StatCard
        label="Open RFQs"
        value={openRfqs}
        subline={rfqSubline}
        icon={<FileText size={20} color={STAT_ICON_COLOR.amber} />}
        variant="amber"
      />
      <StatCard
        label="Active Contracts"
        value={activeContracts}
        icon={<Shield size={20} color={STAT_ICON_COLOR.green} />}
        variant="green"
      />
      <StatCard
        label="Revenue (YTD)"
        value={revenueYtd}
        icon={<TrendingUp size={20} color={STAT_ICON_COLOR.amber} />}
        variant="amber"
      />
    </div>
  );
}
