"use client";

import React from "react";
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
  if (isLoading) {
    return (
      <div
        className="rounded-xl px-5 py-12 text-center"
        style={{ background: "white", border: "1px solid #f0e8dc" }}
      >
        <p className="font-sans text-sm text-[#7a4d38]">Loading tickets…</p>
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
        className="font-sans text-sm font-semibold rounded-xl py-3 transition-colors w-full"
        style={{
          background: "#FAF5EE",
          color: "#7b2d1e",
          border: "1px solid #f0e8dc",
        }}
      >
        + Open a New Ticket
      </button>
    </div>
  );
}
