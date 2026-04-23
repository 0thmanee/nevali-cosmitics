"use client";

import React from "react";
import {
	getTicketStatusStyle,
	TICKET_PRIORITY_STYLE,
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
	const statusEntry = getTicketStatusStyle(ticket.status);
	const { label: statusLabel, ...statusPillStyle } = statusEntry;
	const priorityColor =
		TICKET_PRIORITY_STYLE[ticket.priority]?.color ?? "#727272";

	return (
		<div
			className="flex flex-col items-start gap-4 rounded-xl px-5 py-4 sm:flex-row sm:items-center"
			style={{ background: "white", border: "1px solid #d8d0c4" }}
		>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex flex-wrap items-center gap-2">
					<span className="font-bold font-mono font-sans text-[#727272] text-[10px]">
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
				<p className="font-sans font-semibold text-[#000000] text-sm leading-snug">
					{ticket.subject}
				</p>
				<p className="mt-1 font-sans text-[#727272] text-[11px]">
					{ticket.category} · Opened {ticket.created} · Last reply{" "}
					{ticket.lastReply} · {ticket.messages} message
					{ticket.messages !== 1 ? "s" : ""}
				</p>
			</div>
			{onViewOrReply && (
				<button
					className="shrink-0 rounded-xl px-4 py-2 font-sans font-semibold text-[12px] transition-colors"
					onClick={onViewOrReply}
					style={
						ticket.status === "RESOLVED"
							? {
									background: "#ffffff",
									color: "#727272",
									border: "1px solid #d8d0c4",
								}
							: { background: "#000000", color: "white" }
					}
					type="button"
				>
					{ticket.status === "RESOLVED" ? "View" : "Reply →"}
				</button>
			)}
		</div>
	);
}
