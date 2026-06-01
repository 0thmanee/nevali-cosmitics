"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { SupportTicketCard } from "./support-ticket-card";
import type { TicketDisplay } from "./support-types";

export type SupportTicketListProps = {
	tickets: TicketDisplay[];
	isLoading: boolean;
	onOpenNewTicket: () => void;
	onViewTicket: (ticketId: string) => void;
};

export function SupportTicketList({
	tickets,
	isLoading,
	onOpenNewTicket,
	onViewTicket,
}: SupportTicketListProps) {
	const { t } = useI18n();
	if (isLoading) {
		return (
			<div
				className="rounded-sm px-5 py-12 text-center"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-sm text-text-muted">
					{t("support.loadingTickets")}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{tickets.map((ticket) => (
				<SupportTicketCard
					key={ticket.id}
					onViewOrReply={() => onViewTicket(ticket.id)}
					ticket={ticket}
				/>
			))}
			<button
				className="w-full rounded-sm py-3 font-sans font-semibold text-sm transition-colors"
				onClick={onOpenNewTicket}
				style={{
					background: "var(--color-paper)",
					color: "var(--color-ink)",
					border: "1px solid var(--color-cream-dark)",
				}}
				type="button"
			>
				{t("support.openNewTicket")}
			</button>
		</div>
	);
}
