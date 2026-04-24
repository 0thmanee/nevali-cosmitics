"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signOut } from "~/lib/auth-client";

export function PendingApprovalContent() {
  const { t, messages } = useI18n();
  const steps = messages.pendingApproval.steps;
  return (
    <div className="w-full max-w-2xl flex flex-col gap-10">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          {/* Clock icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "color-mix(in srgb, var(--color-ink) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-ink) 18%, transparent)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="font-sans text-xs font-bold tracking-[0.18em] uppercase text-text-muted">
            {t("pendingApproval.eyebrow")}
          </span>
        </div>

        <h1 className="font-serif font-bold text-text-dark leading-[1.0] mb-3"
          style={{ fontSize: "clamp(32px, 4vw, 44px)" }}>
          {t("pendingApproval.titleLine1")}
          <br />
          {t("pendingApproval.titleLine2")}
        </h1>
        <p className="font-sans text-base text-text-muted leading-relaxed">{t("pendingApproval.body")}</p>
      </div>

      {/* What happens next */}
      <div>
        <p className="font-sans text-xs font-bold tracking-[0.18em] uppercase text-text-muted mb-4">
          {t("pendingApproval.nextHeading")}
        </p>
        <div className="flex items-start gap-0">
          {steps.map((s, i) => (
            <div key={String(i)} className="flex items-start gap-0 flex-1">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-xs shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-ink) 8%, transparent)", color: "var(--color-ink)", border: "1px solid color-mix(in srgb, var(--color-ink) 18%, transparent)" }}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-full h-px mt-3.5 hidden" />
                )}
              </div>
              <div className="flex-1 ps-3 pe-6">
                <p className="font-sans text-sm font-semibold text-text-dark">{s.label}</p>
                <p className="font-sans text-xs text-text-muted mt-0.5">{s.detail}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="self-center w-6 h-px shrink-0 me-2" style={{ background: "color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: "var(--color-cream-dark)" }} />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-text-muted">
          {t("pendingApproval.questionsLead")}{" "}
          <Link href="mailto:support@nevali-cosmetics.ma" className="hover:underline" style={{ color: "var(--color-ink)" }}>
            {t("pendingApproval.contactSupport")}
          </Link>
        </p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => signOut()}
            className="font-sans text-sm text-text-muted hover:text-text-dark transition-colors">
            {t("pendingApproval.signOut")}
          </button>
          <Link href="/"
            className="font-sans font-semibold text-sm text-white px-5 py-2.5 rounded-sm transition-colors"
            style={{ background: "var(--color-ink)" }}>
            {t("pendingApproval.backToHomepage")}
          </Link>
        </div>
      </div>
    </div>
  );
}
