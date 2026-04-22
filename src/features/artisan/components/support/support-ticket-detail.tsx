"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { SupportTicketRow } from "~/app/api/support/schemas/support.schema";
import { useAddProducerReply } from "../../hooks/use-support";
import {
	getTicketStatusStyle,
	TICKET_PRIORITY_STYLE,
} from "./support-constants";

// ── Parse conversation from the message field ─────────────────────────────────

type MessageSegment = { label: string; text: string };

function parseMessages(raw: string): MessageSegment[] {
	const parts = raw.split("\n\n---\n");
	return parts.map((part, i) => {
		if (i === 0) return { label: "Your message", text: part.trim() };
		const match = part.match(/^\[([^\]]+)\]\n([\s\S]*)$/);
		if (match) return { label: match[1]!, text: match[2]!.trim() };
		return { label: "Follow-up", text: part.trim() };
	});
}

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(d));
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
	segment,
	isFirst,
}: {
	segment: MessageSegment;
	isFirst: boolean;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans font-semibold text-[#7a4d38] text-[10px] uppercase tracking-wide">
				{segment.label}
			</span>
			<div
				className="whitespace-pre-wrap rounded-xl px-4 py-3 font-sans text-[#2a0f05] text-[13px] leading-relaxed"
				style={{
					background: isFirst ? "rgba(26,5,0,0.06)" : "white",
					border: "1px solid #f0e8dc",
				}}
			>
				{segment.text}
			</div>
		</div>
	);
}

// ── Detail drawer ─────────────────────────────────────────────────────────────

export function SupportTicketDetail({
	ticket,
	onClose,
}: {
	ticket: SupportTicketRow;
	onClose: () => void;
}) {
	const [reply, setReply] = useState("");
	const replyMutation = useAddProducerReply();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const statusEntry = getTicketStatusStyle(ticket.status);
	const { label: statusLabel, ...statusPillStyle } = statusEntry;
	const priorityColor = TICKET_PRIORITY_STYLE[
		ticket.priority?.toUpperCase()
	] ?? { color: "#7a4d38" };
	const segments = parseMessages(ticket.message);
	const isResolved = ticket.status === "RESOLVED";

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	// Lock scroll
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!reply.trim()) return;
		replyMutation.mutate(
			{ ticketId: ticket.id, reply },
			{ onSuccess: () => setReply("") },
		);
	}

	return (
		/* Overlay */
		<div
			className="fixed inset-0 z-[900] flex justify-end"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			style={{ background: "rgba(10,20,14,0.45)", backdropFilter: "blur(3px)" }}
		>
			{/* Drawer */}
			<div
				className="relative flex h-full flex-col overflow-hidden"
				style={{
					width: "min(560px, 100vw)",
					background: "#F8FAF8",
					borderLeft: "1px solid #f0e8dc",
					boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
				}}
			>
				{/* ── Header ── */}
				<div
					className="flex items-start justify-between gap-4 border-b px-6 py-5"
					style={{ borderColor: "#f0e8dc", background: "white" }}
				>
					<div className="flex min-w-0 flex-col gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-mono text-[#7a4d38] text-[10px]">
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
								style={{ color: priorityColor.color }}
							>
								● {ticket.priority}
							</span>
						</div>
						<h2 className="font-bold font-serif text-[#2a0f05] text-[17px] leading-snug">
							{ticket.subject}
						</h2>
						<div className="flex flex-wrap items-center gap-3">
							<span
								className="rounded-md px-2 py-0.5 font-sans font-semibold text-[10px]"
								style={{ background: "rgba(26,5,0,0.07)", color: "#7a4d38" }}
							>
								{ticket.category}
							</span>
							<span className="font-sans text-[#7a4d38] text-[11px]">
								Opened {formatDate(ticket.createdAt)}
							</span>
						</div>
					</div>
					<button
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F0F4F1]"
						onClick={onClose}
						style={{ border: "1px solid #f0e8dc" }}
						type="button"
					>
						<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
							<path
								d="M1 1l10 10M11 1L1 11"
								stroke="#7a4d38"
								strokeLinecap="round"
								strokeWidth="1.5"
							/>
						</svg>
					</button>
				</div>

				{/* ── Conversation ── */}
				<div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
					{segments.map((seg, i) => (
						<MessageBubble isFirst={i === 0} key={i} segment={seg} />
					))}
				</div>

				{/* ── Reply form ── */}
				<div
					className="border-t px-6 py-5"
					style={{ borderColor: "#f0e8dc", background: "white" }}
				>
					{isResolved ? (
						<div
							className="flex items-center gap-2 rounded-xl px-4 py-3"
							style={{
								background: "rgba(26,5,0,0.06)",
								border: "1px solid rgba(26,5,0,0.14)",
							}}
						>
							<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
								<path
									d="M2.5 7.5l3 3 6-6"
									stroke="#16a34a"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
								/>
							</svg>
							<span className="font-sans text-[#7a4d38] text-[12px]">
								This ticket is resolved. Open a new ticket if you need further
								help.
							</span>
						</div>
					) : (
						<form className="flex flex-col gap-3" onSubmit={handleSubmit}>
							<textarea
								className="w-full resize-none rounded-xl border px-4 py-3 font-sans text-[#2a0f05] text-[13px] transition-colors placeholder:text-[#9BB0A0] focus:outline-none"
								onChange={(e) => setReply(e.target.value)}
								placeholder="Add a follow-up message…"
								ref={textareaRef}
								rows={3}
								style={{
									borderColor: reply ? "#2a0f05" : "#f0e8dc",
									background: "#FAFAF7",
								}}
								value={reply}
							/>
							<div className="flex items-center justify-between gap-3">
								<p className="font-sans text-[#7a4d38] text-[11px]">
									The support team will review your follow-up.
								</p>
								<button
									className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-sans font-semibold text-[13px] transition-opacity disabled:opacity-50"
									disabled={!reply.trim() || replyMutation.isPending}
									style={{ background: "#1a0500", color: "white" }}
									type="submit"
								>
									{replyMutation.isPending ? (
										<>
											<svg
												className="animate-spin"
												fill="none"
												height="13"
												viewBox="0 0 13 13"
												width="13"
											>
												<circle
													cx="6.5"
													cy="6.5"
													r="5"
													stroke="white"
													strokeOpacity="0.3"
													strokeWidth="1.4"
												/>
												<path
													d="M6.5 1.5A5 5 0 0 1 11.5 6.5"
													stroke="white"
													strokeLinecap="round"
													strokeWidth="1.4"
												/>
											</svg>
											Sending…
										</>
									) : (
										<>
											Send
											<svg
												fill="none"
												height="13"
												viewBox="0 0 13 13"
												width="13"
											>
												<path
													d="M1.5 6.5h9M7 2.5l4 4-4 4"
													stroke="white"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="1.4"
												/>
											</svg>
										</>
									)}
								</button>
							</div>
							{replyMutation.isError && (
								<p className="font-sans text-[12px] text-red-500">
									Failed to send. Please try again.
								</p>
							)}
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
