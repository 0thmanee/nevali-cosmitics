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
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
      >
        <p className="font-sans text-sm text-text-muted">{t("support.loadingTickets")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <SupportTicketCard
          key={ticket.id}
          ticket={ticket}
          onViewOrReply={() => onViewTicket(ticket.id)}
        />
      ))}
      <button
        type="button"
        onClick={onOpenNewTicket}
        className="font-sans text-sm font-semibold rounded-sm py-3 transition-colors w-full"
        style={{
          background: "var(--color-paper)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-cream-dark)",
        }}
      >
        {t("support.openNewTicket")}
      </button>
    </div>
  );
}
