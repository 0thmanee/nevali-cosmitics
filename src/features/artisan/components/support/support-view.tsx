"use client";

import React, { useState, useMemo } from "react";
import { useMySupportTickets, useCreateSupportTicket } from "../../hooks/use-support";
import { SupportStatsCards } from "./support-stats-cards";
import { SupportTabList } from "./support-tab-list";
import { SupportTicketList } from "./support-ticket-list";
import { SupportNewTicketForm } from "./support-new-ticket-form";
import { SupportFaqSection } from "./support-faq-section";
import { SUPPORT_TABS, type SupportTab } from "./support-constants";
import type { SupportFormState } from "./support-types";
import { mapTicketToDisplay } from "./support-mappers";
import { SupportTicketDetail } from "./support-ticket-detail";

const INITIAL_FORM: SupportFormState = {
  subject: "",
  category: "",
  priority: "Medium",
  message: "",
};

export function SupportView() {
  const [activeTab, setActiveTab] = useState<SupportTab>("My Tickets");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [form, setForm] = useState<SupportFormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketList = [], isLoading } = useMySupportTickets();
  const createMutation = useCreateSupportTicket();

  const ticketsForUi = useMemo(
    () => ticketList.map(mapTicketToDisplay),
    [ticketList]
  );

  const openCount = ticketList.filter(
    (t) => t.status === "OPEN" || t.status === "IN_REVIEW"
  ).length;
  const resolvedCount = ticketList.filter((t) => t.status === "RESOLVED").length;

  const handleSubmitTicket = () => {
    if (!form.subject.trim() || !form.category || !form.message.trim()) return;
    createMutation.mutate(
      {
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority as "Low" | "Medium" | "High",
        message: form.message.trim(),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setForm(INITIAL_FORM);
        },
      }
    );
  };

  const handleViewTickets = () => {
    setSubmitted(false);
    setForm(INITIAL_FORM);
    setActiveTab("My Tickets");
  };

  return (
    <div className="flex flex-col gap-4">
      <SupportStatsCards
        openCount={openCount}
        resolvedCount={resolvedCount}
      />
      <SupportTabList
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ticketCount={ticketsForUi.length}
      />
      {activeTab === SUPPORT_TABS[0] && (
        <SupportTicketList
          tickets={ticketsForUi}
          isLoading={isLoading}
          onOpenNewTicket={() => setActiveTab("New Ticket")}
          onViewTicket={(id) => setSelectedTicketId(id)}
        />
      )}
      {activeTab === SUPPORT_TABS[1] && (
        <SupportNewTicketForm
          form={form}
          onFormChange={setForm}
          onSubmit={handleSubmitTicket}
          submitted={submitted}
          onViewTickets={handleViewTickets}
          isSubmitting={createMutation.isPending}
        />
      )}
      {activeTab === SUPPORT_TABS[2] && (
        <SupportFaqSection
          openFaqIndex={openFaqIndex}
          onToggleFaq={setOpenFaqIndex}
          onOpenTicket={() => setActiveTab("New Ticket")}
        />
      )}
      {selectedTicketId && (() => {
        const raw = ticketList.find((t) => t.id === selectedTicketId);
        return raw ? (
          <SupportTicketDetail
            ticket={raw}
            onClose={() => setSelectedTicketId(null)}
          />
        ) : null;
      })()}
    </div>
  );
}
