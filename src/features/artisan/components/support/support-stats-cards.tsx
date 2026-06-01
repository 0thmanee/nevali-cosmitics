"use client";

import { CheckCircle, Clock, MessageCircle } from "lucide-react";
import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { STAT_ICON_COLOR, StatCard } from "~/components/stat-card";

export type SupportStatsCardsProps = {
	openCount: number;
	resolvedCount: number;
};

export function SupportStatsCards({
	openCount,
	resolvedCount,
}: SupportStatsCardsProps) {
	const { t } = useI18n();
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<StatCard
				icon={<Clock color={STAT_ICON_COLOR.neutral} size={20} />}
				label={t("support.stats.avgResponse")}
				value="~4h"
				variant="neutral"
			/>
			<StatCard
				icon={
					<MessageCircle
						color={openCount > 0 ? STAT_ICON_COLOR.red : STAT_ICON_COLOR.amber}
						size={20}
					/>
				}
				label={t("support.stats.openTickets")}
				value={openCount}
				variant={openCount > 0 ? "red" : "amber"}
			/>
			<StatCard
				icon={<CheckCircle color={STAT_ICON_COLOR.green} size={20} />}
				label={t("support.stats.resolved")}
				value={resolvedCount}
				variant="green"
			/>
		</div>
	);
}
