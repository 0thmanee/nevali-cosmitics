"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { SUPPORT_CATEGORIES, SUPPORT_PRIORITIES } from "./support-constants";
import { SUPPORT_CATEGORY_LABEL_KEY, SUPPORT_PRIORITY_LABEL_KEY } from "./support-constants";
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
          className="rounded-sm px-6 py-10 flex flex-col items-center gap-4 text-center"
          style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12l4 4 10-10"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-serif font-bold text-[18px] text-text-dark">
              {t("support.ticketSubmitted")}
            </h3>
            <p className="font-sans text-sm text-text-muted mt-1 max-w-sm">
              {t("support.ticketSubmittedHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={onViewTickets}
            className="font-sans text-sm font-semibold rounded-sm px-6 py-2.5 transition-colors"
            style={{ background: "var(--color-ink)", color: "white" }}
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
        className="rounded-sm overflow-hidden"
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-cream-dark)" }}>
          <h3 className="font-serif font-bold text-[15px] text-text-dark">
            {t("support.openSupportTicket")}
          </h3>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">
            {t("support.openSupportTicketHint")}
          </p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
              {t("support.subject")}
            </label>
            <input
              type="text"
              placeholder={t("support.subjectPlaceholder")}
              value={form.subject}
              onChange={(e) => onFormChange({ ...form, subject: e.target.value })}
              className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
                {t("support.category")}
              </label>
              <select
                value={form.category}
                onChange={(e) => onFormChange({ ...form, category: e.target.value })}
                className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full appearance-none"
                style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
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
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
                {t("support.priority")}
              </label>
              <select
                value={form.priority}
                onChange={(e) => onFormChange({ ...form, priority: e.target.value })}
                className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full appearance-none"
                style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
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
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
              {t("support.message")}
            </label>
            <textarea
              placeholder={t("support.messagePlaceholder")}
              value={form.message}
              onChange={(e) => onFormChange({ ...form, message: e.target.value })}
              rows={5}
              className="font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full resize-none"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
            />
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="font-sans font-semibold text-sm text-white rounded-sm px-6 py-3 transition-colors self-start disabled:opacity-50"
            style={{
              background: canSubmit && !isSubmitting ? "var(--color-ink)" : "var(--color-text-muted)",
            }}
          >
            {isSubmitting ? t("support.submitting") : t("support.submitTicket")}
          </button>
        </div>
      </div>
    </div>
  );
}
