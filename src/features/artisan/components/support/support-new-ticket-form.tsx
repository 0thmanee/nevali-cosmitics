"use client";

import React from "react";
import { SUPPORT_CATEGORIES, SUPPORT_PRIORITIES } from "./support-constants";
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
  const canSubmit =
    form.subject.trim() !== "" &&
    form.category !== "" &&
    form.message.trim() !== "";

  if (submitted) {
    return (
      <div className="max-w-2xl">
        <div
          className="rounded-sm px-6 py-10 flex flex-col items-center gap-4 text-center"
          style={{ background: "white", border: "1px solid #d8d0c4" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(200,150,60,0.2)",
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
                stroke="#727272"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-serif font-bold text-[18px] text-[#000000]">
              Ticket Submitted
            </h3>
            <p className="font-sans text-sm text-[#727272] mt-1 max-w-sm">
              Our team typically responds within 4 hours during business days.
              You&apos;ll be notified by email.
            </p>
          </div>
          <button
            type="button"
            onClick={onViewTickets}
            className="font-sans text-sm font-semibold rounded-sm px-6 py-2.5 transition-colors"
            style={{ background: "#000000", color: "white" }}
          >
            View My Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div
        className="rounded-sm overflow-hidden"
        style={{ background: "white", border: "1px solid #d8d0c4" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
          <h3 className="font-serif font-bold text-[15px] text-[#000000]">
            Open a Support Ticket
          </h3>
          <p className="font-sans text-[11px] text-[#727272] mt-0.5">
            Describe your issue and our team will get back to you.
          </p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
              Subject
            </label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              value={form.subject}
              onChange={(e) => onFormChange({ ...form, subject: e.target.value })}
              className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 outline-none w-full"
              style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => onFormChange({ ...form, category: e.target.value })}
                className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 outline-none w-full appearance-none"
                style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
              >
                <option value="">Select category</option>
                {SUPPORT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => onFormChange({ ...form, priority: e.target.value })}
                className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 outline-none w-full appearance-none"
                style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
              >
                {SUPPORT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
              Message
            </label>
            <textarea
              placeholder="Describe your issue in detail. Include any relevant product names, listing IDs, or error messages."
              value={form.message}
              onChange={(e) => onFormChange({ ...form, message: e.target.value })}
              rows={5}
              className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 outline-none w-full resize-none"
              style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
            />
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="font-sans font-semibold text-sm text-white rounded-sm px-6 py-3 transition-colors self-start disabled:opacity-50"
            style={{
              background: canSubmit && !isSubmitting ? "#000000" : "#727272",
            }}
          >
            {isSubmitting ? "Submitting…" : "Submit Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
