"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import {
	SUPPORT_TAB_LABEL_KEY,
	SUPPORT_TABS,
	type SupportTab,
} from "./support-constants";

export type SupportTabListProps = {
	activeTab: SupportTab;
	onTabChange: (tab: SupportTab) => void;
	ticketCount: number;
};

export function SupportTabList({
	activeTab,
	onTabChange,
	ticketCount,
}: SupportTabListProps) {
	const { t } = useI18n();
	return (
		<div className="flex items-center gap-1">
			{SUPPORT_TABS.map((tab) => (
				<button
					className="rounded-sm px-4 py-1.5 font-sans font-semibold text-[12px] transition-colors"
					key={tab}
					onClick={() => onTabChange(tab)}
					style={
						activeTab === tab
							? { background: "var(--color-ink)", color: "white" }
							: {
									background: "white",
									color: "var(--color-text-muted)",
									border: "1px solid var(--color-cream-dark)",
								}
					}
					type="button"
				>
					{t(SUPPORT_TAB_LABEL_KEY[tab])}
					{tab === "My Tickets" && (
						<span
							className="ml-1.5 rounded-full px-1.5 py-0.5 font-bold text-[10px]"
							style={
								activeTab === tab
									? {
											background:
												"color-mix(in srgb, var(--color-paper) 15%, transparent)",
											color:
												"color-mix(in srgb, var(--color-paper) 80%, transparent)",
										}
									: {
											background:
												"color-mix(in srgb, var(--color-ink) 8%, transparent)",
											color: "var(--color-text-muted)",
										}
							}
						>
							{ticketCount}
						</span>
					)}
				</button>
			))}
		</div>
	);
}
