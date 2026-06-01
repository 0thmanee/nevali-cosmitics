"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import type { SupportTicketDetailForAdmin } from "~/app/api/support";
import {
	useAdminSupportTicketDetail,
	useUpdateSupportTicketAdminNotes,
	useUpdateSupportTicketStatus,
} from "../../hooks/use-admin-support";

const statusStyles: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	OPEN: {
		bg: "color-mix(in srgb, var(--color-info) 12%, transparent)",
		color: "var(--color-info)",
		border: "1px solid color-mix(in srgb, var(--color-info) 25%, transparent)",
	},
	IN_REVIEW: {
		bg: "color-mix(in srgb, var(--color-gold) 15%, transparent)",
		color: "var(--color-gold)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
	},
	RESOLVED: {
		bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid var(--color-cream-dark)",
	},
};

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(d));
}

type Props = { ticketId: string };

export function SupportTicketDetail({ ticketId }: Props) {
	const router = useRouter();
	const {
		data: ticket,
		isLoading,
		isError,
		error,
	} = useAdminSupportTicketDetail(ticketId);
	const updateStatusMutation = useUpdateSupportTicketStatus();
	const updateNotesMutation = useUpdateSupportTicketAdminNotes();
	const [notesDraft, setNotesDraft] = useState<string | null>(null);
	const [notesSaving, setNotesSaving] = useState(false);

	const handleStatusChange = useCallback(
		(status: "OPEN" | "IN_REVIEW" | "RESOLVED") => {
			updateStatusMutation.mutate({ ticketId, status });
		},
		[ticketId, updateStatusMutation],
	);

	const handleSaveNotes = useCallback(async () => {
		if (notesDraft === null) return;
		setNotesSaving(true);
		try {
			await updateNotesMutation.mutateAsync({
				ticketId,
				adminNotes: notesDraft || null,
			});
			setNotesDraft(null);
		} finally {
			setNotesSaving(false);
		}
	}, [ticketId, notesDraft, updateNotesMutation]);

	if (isLoading) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="overflow-hidden rounded-sm"
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<div className="flex items-center justify-center px-5 py-12">
						<p className="font-sans text-sm text-text-muted">Loading ticket…</p>
					</div>
				</div>
			</div>
		);
	}

	if (isError || !ticket) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="overflow-hidden rounded-sm px-5 py-6"
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<p className="font-sans text-red-600 text-sm">
						{error instanceof Error ? error.message : "Ticket not found."}
					</p>
					<Link
						className="mt-2 inline-block font-sans text-sm text-text-dark hover:underline"
						href="/admin/support"
					>
						← Back to Support
					</Link>
				</div>
			</div>
		);
	}

	const t = ticket as SupportTicketDetailForAdmin;
	const style = statusStyles[t.status] ?? statusStyles.OPEN;
	const notesValue = notesDraft !== null ? notesDraft : (t.adminNotes ?? "");
	const notesDirty = notesDraft !== null && notesDraft !== (t.adminNotes ?? "");

	return (
		<div className="flex flex-col gap-4 p-4 lg:p-6">
			<div className="flex items-center gap-3">
				<Link
					className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href="/admin/support"
				>
					← Support
				</Link>
			</div>

			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<div>
						<h2 className="font-bold font-serif text-[15px] text-text-dark">
							{t.subject}
						</h2>
						<p className="mt-0.5 font-sans text-[11px] text-text-muted">
							{t.organizationName} · {t.category} · {formatDate(t.createdAt)}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span
							className="rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
							style={style}
						>
							{t.status.replace("_", " ")}
						</span>
						<select
							className="rounded-sm border px-3 py-1.5 font-sans font-semibold text-[12px]"
							disabled={updateStatusMutation.isPending}
							onChange={(e) =>
								handleStatusChange(
									e.target.value as "OPEN" | "IN_REVIEW" | "RESOLVED",
								)
							}
							style={{
								borderColor: "var(--color-cream-dark)",
								background: "var(--color-paper)",
								color: "var(--color-ink)",
							}}
							value={t.status}
						>
							<option value="OPEN">Open</option>
							<option value="IN_REVIEW">In Review</option>
							<option value="RESOLVED">Resolved</option>
						</select>
					</div>
				</div>

				<div className="flex flex-col gap-6 p-5">
					<section>
						<h3 className="mb-2 font-bold font-sans text-[10px] text-text-muted uppercase tracking-wider">
							Message
						</h3>
						<div
							className="rounded-sm px-4 py-3"
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							<p className="whitespace-pre-wrap font-sans text-[13px] text-text-dark leading-relaxed">
								{t.message}
							</p>
						</div>
					</section>

					<section>
						<h3 className="mb-2 font-bold font-sans text-[10px] text-text-muted uppercase tracking-wider">
							Internal notes
						</h3>
						<textarea
							className="w-full resize-y rounded-sm px-4 py-3 font-sans text-[13px] text-text-dark outline-none"
							onBlur={() => notesDirty && handleSaveNotes()}
							onChange={(e) => setNotesDraft(e.target.value)}
							placeholder="Add internal notes (only visible to admins)…"
							rows={4}
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
							value={notesValue}
						/>
						{notesDirty && (
							<div className="mt-2 flex items-center gap-2">
								<button
									className="rounded-sm px-3 py-1.5 font-sans font-semibold text-[12px] transition-colors disabled:opacity-60"
									disabled={notesSaving}
									onClick={handleSaveNotes}
									style={{ background: "var(--color-ink)", color: "white" }}
									type="button"
								>
									{notesSaving ? "Saving…" : "Save notes"}
								</button>
								<button
									className="font-sans text-[12px] text-text-muted hover:text-text-dark"
									disabled={notesSaving}
									onClick={() => setNotesDraft(null)}
									type="button"
								>
									Cancel
								</button>
							</div>
						)}
					</section>

					{t.statusEvents.length > 0 && (
						<section>
							<h3 className="mb-2 font-bold font-sans text-[10px] text-text-muted uppercase tracking-wider">
								Status history
							</h3>
							<ul
								className="overflow-hidden rounded-sm"
								style={{ border: "1px solid var(--color-cream-dark)" }}
							>
								{t.statusEvents.map((evt) => (
									<li
										className="flex items-center justify-between border-cream-dark border-b px-4 py-2 font-sans text-[12px] last:border-b-0"
										key={evt.id}
										style={{ background: "var(--color-paper)" }}
									>
										<span
											className="rounded-full px-2 py-0.5 font-semibold text-[10px] uppercase"
											style={statusStyles[evt.status] ?? statusStyles.OPEN}
										>
											{evt.status.replace("_", " ")}
										</span>
										<span className="text-text-muted">
											{formatDate(evt.createdAt)}
										</span>
									</li>
								))}
							</ul>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
