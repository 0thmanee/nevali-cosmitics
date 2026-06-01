"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import {
	SUPPORT_CATEGORIES,
	SUPPORT_CATEGORY_LABEL_KEY,
	SUPPORT_PRIORITIES,
	SUPPORT_PRIORITY_LABEL_KEY,
} from "./support-constants";
import type { SupportFormState } from "./support-types";

export type SupportNewTicketFormProps = {
	form: SupportFormState;
	onFormChange: (form: SupportFormState) => void;
	onSubmit: () => void;
	submitted: boolean;
	onViewTickets: () => void;
	isSubmitting?: boolean;
};

export function SupportNewTicketForm({
	form,
	onFormChange,
	onSubmit,
	submitted,
	onViewTickets,
	isSubmitting = false,
}: SupportNewTicketFormProps) {
	const { t } = useI18n();
	const canSubmit =
		form.subject.trim() !== "" &&
		form.category !== "" &&
		form.message.trim() !== "";

	if (submitted) {
		return (
			<div className="max-w-2xl">
				<div
					className="flex flex-col items-center gap-4 rounded-sm px-6 py-10 text-center"
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<div
						className="flex h-14 w-14 items-center justify-center rounded-full"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 80%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
						}}
					>
						<svg fill="none" height="24" viewBox="0 0 24 24" width="24">
							<path
								d="M5 12l4 4 10-10"
								stroke="var(--color-text-muted)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>
						</svg>
					</div>
					<div>
						<h3 className="font-bold font-serif text-[18px] text-text-dark">
							{t("support.ticketSubmitted")}
						</h3>
						<p className="mt-1 max-w-sm font-sans text-sm text-text-muted">
							{t("support.ticketSubmittedHint")}
						</p>
					</div>
					<button
						className="rounded-sm px-6 py-2.5 font-sans font-semibold text-sm transition-colors"
						onClick={onViewTickets}
						style={{ background: "var(--color-ink)", color: "white" }}
						type="button"
					>
						{t("support.viewMyTickets")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl">
			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="border-b px-5 py-4"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h3 className="font-bold font-serif text-[15px] text-text-dark">
						{t("support.openSupportTicket")}
					</h3>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						{t("support.openSupportTicketHint")}
					</p>
				</div>
				<div className="flex flex-col gap-4 p-5">
					<div className="flex flex-col gap-1.5">
						<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							{t("support.subject")}
						</label>
						<input
							className="w-full rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark outline-none"
							onChange={(e) =>
								onFormChange({ ...form, subject: e.target.value })
							}
							placeholder={t("support.subjectPlaceholder")}
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
							type="text"
							value={form.subject}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								{t("support.category")}
							</label>
							<select
								className="w-full appearance-none rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark outline-none"
								onChange={(e) =>
									onFormChange({ ...form, category: e.target.value })
								}
								style={{
									background: "var(--color-paper)",
									border: "1px solid var(--color-cream-dark)",
								}}
								value={form.category}
							>
								<option value="">{t("support.selectCategory")}</option>
								{SUPPORT_CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{t(SUPPORT_CATEGORY_LABEL_KEY[c])}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								{t("support.priority")}
							</label>
							<select
								className="w-full appearance-none rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark outline-none"
								onChange={(e) =>
									onFormChange({ ...form, priority: e.target.value })
								}
								style={{
									background: "var(--color-paper)",
									border: "1px solid var(--color-cream-dark)",
								}}
								value={form.priority}
							>
								{SUPPORT_PRIORITIES.map((p) => (
									<option key={p} value={p}>
										{t(SUPPORT_PRIORITY_LABEL_KEY[p])}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							{t("support.message")}
						</label>
						<textarea
							className="w-full resize-none rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark outline-none"
							onChange={(e) =>
								onFormChange({ ...form, message: e.target.value })
							}
							placeholder={t("support.messagePlaceholder")}
							rows={5}
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
							value={form.message}
						/>
					</div>
					<button
						className="self-start rounded-sm px-6 py-3 font-sans font-semibold text-sm text-white transition-colors disabled:opacity-50"
						disabled={!canSubmit || isSubmitting}
						onClick={onSubmit}
						style={{
							background:
								canSubmit && !isSubmitting
									? "var(--color-ink)"
									: "var(--color-text-muted)",
						}}
						type="button"
					>
						{isSubmitting ? t("support.submitting") : t("support.submitTicket")}
					</button>
				</div>
			</div>
		</div>
	);
}
