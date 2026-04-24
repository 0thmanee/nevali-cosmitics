"use client";

import React from "react";
import { Clock, MessageCircle, CheckCircle } from "lucide-react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";

export type SupportStatsCardsProps = {
  openCount: number;
  resolvedCount: number;
};

export function SupportStatsCards({ openCount, resolvedCount }: SupportStatsCardsProps) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        label={t("support.stats.avgResponse")}
        value="~4h"
        icon={<Clock size={20} color={STAT_ICON_COLOR.neutral} />}
        variant="neutral"
      />
      <StatCard
        label={t("support.stats.openTickets")}
        value={openCount}
        icon={<MessageCircle size={20} color={openCount > 0 ? STAT_ICON_COLOR.red : STAT_ICON_COLOR.amber} />}
        variant={openCount > 0 ? "red" : "amber"}
      />
      <StatCard
        label={t("support.stats.resolved")}
        value={resolvedCount}
        icon={<CheckCircle size={20} color={STAT_ICON_COLOR.green} />}
        variant="green"
      />
    </div>
  );
}
