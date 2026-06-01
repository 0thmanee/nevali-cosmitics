"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";
import {
	getTicketStatusStyle,
	TICKET_PRIORITY_STYLE,
	TICKET_STATUS_LABEL_KEY,
} from "./support-constants";
import type { TicketDisplay } from "./support-types";

export type SupportTicketCardProps = {
	ticket: TicketDisplay;
	onViewOrReply?: () => void;
};

export function SupportTicketCard({
	ticket,
	onViewOrReply,
}: SupportTicketCardProps) {
	const { t } = useI18n();
	const statusEntry = getTicketStatusStyle(ticket.status);
	const { ...statusPillStyle } = statusEntry;
	const statusKey =
		TICKET_STATUS_LABEL_KEY[
			ticket.status as keyof typeof TICKET_STATUS_LABEL_KEY
		];
	const statusLabel = statusKey ? t(statusKey) : ticket.status;
	const priorityColor =
		TICKET_PRIORITY_STYLE[ticket.priority]?.color ?? "var(--color-text-muted)";

	return (
		<div
			className="flex flex-col items-start gap-4 rounded-sm px-5 py-4 sm:flex-row sm:items-center"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex flex-wrap items-center gap-2">
					<span className="font-bold font-mono font-sans text-[10px] text-text-muted">
						{ticket.id.slice(0, 12)}
					</span>
					<span
						className="rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
						style={statusPillStyle}
					>
						{statusLabel}
					</span>
					<span
						className="font-bold font-sans text-[10px] uppercase"
						style={{ color: priorityColor }}
					>
						● {ticket.priority}
					</span>
				</div>
				<p className="font-sans font-semibold text-sm text-text-dark leading-snug">
					{ticket.subject}
				</p>
				<p className="mt-1 font-sans text-[11px] text-text-muted">
					{interpolate(t("support.ticketMeta"), {
						category: ticket.category,
						opened: ticket.created,
						lastReply: ticket.lastReply,
						count: ticket.messages,
						suffix: ticket.messages !== 1 ? "s" : "",
					})}
				</p>
			</div>
			{onViewOrReply && (
				<button
					className="shrink-0 rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors"
					onClick={onViewOrReply}
					style={
						ticket.status === "RESOLVED"
							? {
									background: "var(--color-paper)",
									color: "var(--color-text-muted)",
									border: "1px solid var(--color-cream-dark)",
								}
							: { background: "var(--color-ink)", color: "white" }
					}
					type="button"
				>
					{ticket.status === "RESOLVED"
						? t("support.view")
						: t("support.reply")}
				</button>
			)}
		</div>
	);
}
