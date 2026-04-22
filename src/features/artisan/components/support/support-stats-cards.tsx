"use client";

import React from "react";
import { Clock, MessageCircle, CheckCircle } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";

export type SupportStatsCardsProps = {
  openCount: number;
  resolvedCount: number;
};

export function SupportStatsCards({ openCount, resolvedCount }: SupportStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        label="Avg. Response"
        value="~4h"
        icon={<Clock size={20} color={STAT_ICON_COLOR.neutral} />}
        variant="neutral"
      />
      <StatCard
        label="Open Tickets"
        value={openCount}
        icon={<MessageCircle size={20} color={openCount > 0 ? STAT_ICON_COLOR.red : STAT_ICON_COLOR.amber} />}
        variant={openCount > 0 ? "red" : "amber"}
      />
      <StatCard
        label="Resolved"
        value={resolvedCount}
        icon={<CheckCircle size={20} color={STAT_ICON_COLOR.green} />}
        variant="green"
      />
    </div>
  );
}
