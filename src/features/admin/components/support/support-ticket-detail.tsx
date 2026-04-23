"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAdminSupportTicketDetail,
  useUpdateSupportTicketStatus,
  useUpdateSupportTicketAdminNotes,
} from "../../hooks/use-admin-support";
import type { SupportTicketDetailForAdmin } from "~/app/api/support";

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  OPEN: { bg: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" },
  IN_REVIEW: { bg: "rgba(201,145,61,0.15)", color: "#E8B84B", border: "1px solid rgba(201,145,61,0.3)" },
  RESOLVED: { bg: "rgba(0,0,0,0.08)", color: "#727272", border: "1px solid #d8d0c4" },
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
  const { data: ticket, isLoading, isError, error } = useAdminSupportTicketDetail(ticketId);
  const updateStatusMutation = useUpdateSupportTicketStatus();
  const updateNotesMutation = useUpdateSupportTicketAdminNotes();
  const [notesDraft, setNotesDraft] = useState<string | null>(null);
  const [notesSaving, setNotesSaving] = useState(false);

  const handleStatusChange = useCallback(
    (status: "OPEN" | "IN_REVIEW" | "RESOLVED") => {
      updateStatusMutation.mutate({ ticketId, status });
    },
    [ticketId, updateStatusMutation]
  );

  const handleSaveNotes = useCallback(async () => {
    if (notesDraft === null) return;
    setNotesSaving(true);
    try {
      await updateNotesMutation.mutateAsync({ ticketId, adminNotes: notesDraft || null });
      setNotesDraft(null);
    } finally {
      setNotesSaving(false);
    }
  }, [ticketId, notesDraft, updateNotesMutation]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
          <div className="px-5 py-12 flex items-center justify-center">
            <p className="font-sans text-sm text-[#727272]">Loading ticket…</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-xl overflow-hidden px-5 py-6" style={{ background: "white", border: "1px solid #d8d0c4" }}>
          <p className="font-sans text-sm text-red-600">
            {error instanceof Error ? error.message : "Ticket not found."}
          </p>
          <Link href="/admin/support" className="font-sans text-sm text-[#000000] hover:underline mt-2 inline-block">
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
    <div className="p-4 lg:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/support"
          className="font-sans text-sm text-[#727272] hover:text-[#000000] transition-colors"
        >
          ← Support
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: "#d8d0c4" }}>
          <div>
            <h2 className="font-serif font-bold text-[15px] text-[#000000]">{t.subject}</h2>
            <p className="font-sans text-[11px] text-[#727272] mt-0.5">
              {t.organizationName} · {t.category} · {formatDate(t.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase"
              style={style}
            >
              {t.status.replace("_", " ")}
            </span>
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(e.target.value as "OPEN" | "IN_REVIEW" | "RESOLVED")}
              disabled={updateStatusMutation.isPending}
              className="font-sans text-[12px] font-semibold rounded-xl px-3 py-1.5 border"
              style={{ borderColor: "#d8d0c4", background: "#ffffff", color: "#000000" }}
            >
              <option value="OPEN">Open</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-6">
          <section>
            <h3 className="font-sans text-[10px] font-bold tracking-wider text-[#727272] uppercase mb-2">Message</h3>
            <div className="rounded-xl px-4 py-3" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
              <p className="font-sans text-[13px] text-[#000000] leading-relaxed whitespace-pre-wrap">{t.message}</p>
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[10px] font-bold tracking-wider text-[#727272] uppercase mb-2">Internal notes</h3>
            <textarea
              value={notesValue}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => notesDirty && handleSaveNotes()}
              placeholder="Add internal notes (only visible to admins)…"
              rows={4}
              className="font-sans text-[13px] text-[#000000] w-full rounded-xl px-4 py-3 outline-none resize-y"
              style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
            />
            {notesDirty && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className="font-sans text-[12px] font-semibold rounded-xl px-3 py-1.5 transition-colors disabled:opacity-60"
                  style={{ background: "#000000", color: "white" }}
                >
                  {notesSaving ? "Saving…" : "Save notes"}
                </button>
                <button
                  type="button"
                  onClick={() => setNotesDraft(null)}
                  disabled={notesSaving}
                  className="font-sans text-[12px] text-[#727272] hover:text-[#000000]"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {t.statusEvents.length > 0 && (
            <section>
              <h3 className="font-sans text-[10px] font-bold tracking-wider text-[#727272] uppercase mb-2">Status history</h3>
              <ul className="rounded-xl overflow-hidden" style={{ border: "1px solid #d8d0c4" }}>
                {t.statusEvents.map((evt) => (
                  <li
                    key={evt.id}
                    className="flex items-center justify-between px-4 py-2 border-b border-[#d8d0c4] last:border-b-0 font-sans text-[12px]"
                    style={{ background: "#ffffff" }}
                  >
                    <span
                      className="font-semibold rounded-full px-2 py-0.5 text-[10px] uppercase"
                      style={statusStyles[evt.status] ?? statusStyles.OPEN}
                    >
                      {evt.status.replace("_", " ")}
                    </span>
                    <span className="text-[#727272]">{formatDate(evt.createdAt)}</span>
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
