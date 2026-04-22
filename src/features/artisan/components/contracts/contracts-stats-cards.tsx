"use client";

import React from "react";
import { FileText, Shield, TrendingUp, CheckCircle } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";

export type ContractsStatsCardsProps = {
  openRfqs: number;
  pendingReplyCount?: number;
  activeContracts: number;
  revenueYtd: string;
  completedCount: number;
};

export function ContractsStatsCards({
  openRfqs,
  pendingReplyCount = 0,
  activeContracts,
  revenueYtd,
  completedCount,
}: ContractsStatsCardsProps) {
  const rfqSubline =
    pendingReplyCount > 0
      ? `${pendingReplyCount} new — awaiting your reply`
      : undefined;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
      <StatCard
        label="Completed"
        value={completedCount}
        icon={<CheckCircle size={20} color={STAT_ICON_COLOR.neutral} />}
        variant="neutral"
      />
    </div>
  );
}
