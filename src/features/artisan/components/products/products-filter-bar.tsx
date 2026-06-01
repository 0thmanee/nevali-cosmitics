"use client";

import type React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";

const TABS = ["All", "Approved", "Pending", "Rejected"] as const;
export type ProductsTab = (typeof TABS)[number];

const TAB_LABEL_KEYS: Record<ProductsTab, string> = {
	All: "producerProducts.tabAll",
	Approved: "producerProducts.tabApproved",
	Pending: "producerProducts.tabPending",
	Rejected: "producerProducts.tabRejected",
};

export type ProductsFilterBarProps = {
	activeTab: ProductsTab;
	onTabChange: (tab: ProductsTab) => void;
	search: string;
	onSearchChange: (value: string) => void;
	counts: { All: number; Approved: number; Pending: number; Rejected: number };
	action?: React.ReactNode;
};

export function ProductsFilterBar({
	activeTab,
	onTabChange,
	search,
	onSearchChange,
	counts,
	action,
}: ProductsFilterBarProps) {
	const { t } = useI18n();
	return (
		<div
			className="flex flex-col gap-3 rounded-sm px-4 py-3 sm:flex-row sm:items-center"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div className="flex flex-1 items-center gap-3">
				<div className="relative w-full max-w-sm">
					<svg
						className="absolute top-1/2 left-3 -translate-y-1/2"
						fill="none"
						height="14"
						viewBox="0 0 14 14"
						width="14"
					>
						<circle
							cx="6"
							cy="6"
							r="4.5"
							stroke="var(--color-text-muted)"
							strokeWidth="1.3"
						/>
						<path
							d="M9.5 9.5L12 12"
							stroke="var(--color-text-muted)"
							strokeLinecap="round"
							strokeWidth="1.3"
						/>
					</svg>
					<input
						className="w-full rounded-sm py-2 pr-4 pl-8 font-sans text-sm text-text-dark outline-none"
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t("producerProducts.searchProducts")}
						style={{
							background: "var(--color-paper)",
							border: "1px solid var(--color-cream-dark)",
						}}
						type="text"
						value={search}
					/>
				</div>
				<div className="flex flex-wrap items-center gap-1">
					{TABS.map((tab) => (
						<button
							className="rounded-sm px-3.5 py-1.5 font-sans font-semibold text-[12px] transition-colors"
							key={tab}
							onClick={() => onTabChange(tab)}
							style={
								activeTab === tab
									? { background: "var(--color-ink)", color: "white" }
									: {
											background: "var(--color-paper)",
											color: "var(--color-text-muted)",
											border: "1px solid var(--color-cream-dark)",
										}
							}
							type="button"
						>
							{t(TAB_LABEL_KEYS[tab])}
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
								{counts[tab]}
							</span>
						</button>
					))}
				</div>
			</div>
			{action && <div className="flex-shrink-0">{action}</div>}
		</div>
	);
}
