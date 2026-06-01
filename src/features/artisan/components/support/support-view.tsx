"use client";

import React, { useMemo, useState } from "react";
import {
	useCreateSupportTicket,
	useMySupportTickets,
} from "../../hooks/use-support";
import { SUPPORT_TABS, type SupportTab } from "./support-constants";
import { SupportFaqSection } from "./support-faq-section";
import { mapTicketToDisplay } from "./support-mappers";
import { SupportNewTicketForm } from "./support-new-ticket-form";
import { SupportStatsCards } from "./support-stats-cards";
import { SupportTabList } from "./support-tab-list";
import { SupportTicketDetail } from "./support-ticket-detail";
import { SupportTicketList } from "./support-ticket-list";
import type { SupportFormState } from "./support-types";

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
		[ticketList],
	);

	const openCount = ticketList.filter(
		(t) => t.status === "OPEN" || t.status === "IN_REVIEW",
	).length;
	const resolvedCount = ticketList.filter(
		(t) => t.status === "RESOLVED",
	).length;

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
			},
		);
	};

	const handleViewTickets = () => {
		setSubmitted(false);
		setForm(INITIAL_FORM);
		setActiveTab("My Tickets");
	};

	return (
		<div className="flex flex-col gap-4">
			<SupportStatsCards openCount={openCount} resolvedCount={resolvedCount} />
			<SupportTabList
				activeTab={activeTab}
				onTabChange={setActiveTab}
				ticketCount={ticketsForUi.length}
			/>
			{activeTab === SUPPORT_TABS[0] && (
				<SupportTicketList
					isLoading={isLoading}
					onOpenNewTicket={() => setActiveTab("New Ticket")}
					onViewTicket={(id) => setSelectedTicketId(id)}
					tickets={ticketsForUi}
				/>
			)}
			{activeTab === SUPPORT_TABS[1] && (
				<SupportNewTicketForm
					form={form}
					isSubmitting={createMutation.isPending}
					onFormChange={setForm}
					onSubmit={handleSubmitTicket}
					onViewTickets={handleViewTickets}
					submitted={submitted}
				/>
			)}
			{activeTab === SUPPORT_TABS[2] && (
				<SupportFaqSection
					onOpenTicket={() => setActiveTab("New Ticket")}
					onToggleFaq={setOpenFaqIndex}
					openFaqIndex={openFaqIndex}
				/>
			)}
			{selectedTicketId &&
				(() => {
					const raw = ticketList.find((t) => t.id === selectedTicketId);
					return raw ? (
						<SupportTicketDetail
							onClose={() => setSelectedTicketId(null)}
							ticket={raw}
						/>
					) : null;
				})()}
		</div>
	);
}
