"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "~/components/i18n/i18n-provider";
import { postRegisterKind } from "~/app/api/auth/register-kind-actions";
import { signUp } from "~/lib/auth-client";
import { AuthLayout, AuthInput, AuthField } from "~/features/auth";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export function RegisterForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === confirmPassword &&
    agreeTerms;
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <AuthLayout
      contentClassName="max-w-md"
      showLoginLink
      subtitle={<>{t("registerPartner.layoutSubtitle")}</>}
      title={t("registerPartner.layoutTitle")}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AuthField label={t("registerPartner.fullName")}>
            <AuthInput
              placeholder={t("registerPartner.namePlaceholder")}
              value={name}
              onChange={(v) => setName(v)}
            />
          </AuthField>
          <AuthField label={t("registerPartner.emailAddress")}>
            <AuthInput
              type="email"
              placeholder={t("registerPartner.emailPlaceholder")}
              value={email}
              onChange={(v) => setEmail(v)}
            />
          </AuthField>
          <AuthField label={t("registerPartner.password")}>
            <AuthInput
              type="password"
              placeholder={t("registerPartner.passwordPlaceholder")}
              value={password}
              onChange={(v) => setPassword(v)}
            />
          </AuthField>
          <AuthField
            error={passwordMismatch ? t("registerPartner.passwordsMismatch") : undefined}
            label={t("registerPartner.confirmPassword")}
          >
            <AuthInput
              type="password"
              placeholder={t("registerPartner.repeatPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(v) => setConfirmPassword(v)}
            />
          </AuthField>
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0 mt-0.5 transition-colors"
              style={
                agreeTerms
                  ? { background: "var(--color-ink)", border: "1px solid var(--color-ink)" }
                  : {
                      background: "var(--color-paper)",
                      border: "1px solid color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
                    }
              }
              onClick={() => setAgreeTerms(!agreeTerms)}
              onKeyDown={(e) => e.key === "Enter" && setAgreeTerms(!agreeTerms)}
              role="button"
              tabIndex={0}
              aria-checked={agreeTerms}
            >
              {agreeTerms && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 5l2 2 4-4" />
                </svg>
              )}
            </div>
            <span className="font-sans text-[13px] text-text-muted leading-relaxed">
              {t("registerPartner.agreeTerms")}{" "}
              <span style={{ color: "var(--color-ink)" }}>{t("registerPartner.requiredMark")}</span>
            </span>
          </label>
        </div>

        {submitError && (
          <div
            className="rounded-sm px-4 py-3 font-sans text-sm text-[var(--color-danger)]"
            style={{
              background: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
            }}
          >
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={async () => {
              if (!canSubmit || submitting) return;
              setSubmitError(null);
              setSubmitting(true);
              const res = await signUp.email({
                name: name.trim() || email,
                email: email.trim(),
                password,
              });
              setSubmitting(false);
              if (res.error) {
                setSubmitError(res.error.message ?? t("registerPartner.registrationFailed"));
                return;
              }
              await postRegisterKind("artisan");
              router.push("/onboarding");
            }}
            className="font-sans font-semibold text-sm rounded-sm px-8 py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed w-full"
            style={
              canSubmit && !submitting
                ? { background: "var(--color-ink)", color: "var(--color-paper)" }
                : {
                    background: "color-mix(in srgb, var(--color-ink) 12%, transparent)",
                    color: "color-mix(in srgb, var(--color-ink) 35%, transparent)",
                    cursor: "not-allowed",
                  }
            }
          >
            {submitting ? t("registerPartner.creatingAccount") : t("registerPartner.createAccount")}
          </button>
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <Link
              href="/auth/register-buyer"
              className="font-sans text-sm text-text-muted/80 hover:text-text-muted transition-colors text-center"
            >
              {t("registerPartner.buyingForStore")}
            </Link>
          ) : null}
          <Link
            href="/auth/login"
            className="font-sans text-sm text-text-muted/60 hover:text-text-muted transition-colors text-center"
          >
            {t("registerPartner.alreadyHaveAccountSignIn")}
          </Link>
        </div>
      </div>

      <p className="font-sans text-[11px] text-text-muted/50 mt-6 text-center">{t("registerPartner.dataLawNote")}</p>
    </AuthLayout>
  );
}
