"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signIn } from "~/lib/auth-client";
import { AuthLayout, AuthInput, AuthField } from "~/features/auth";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/artisan";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn.email(
      { email, password, callbackURL: callbackUrl },
      {
        onError: (ctx) => {
          setError(ctx.error?.message ?? t("auth.invalidCredentials"));
        },
      }
    );
    setLoading(false);
    if (res.error) return;
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthLayout
      showRegisterLink
      subtitle={
        <>
          {t("auth.loginWelcomeLine1")}
          <br />
          <span className="italic" style={{ color: "var(--color-text-muted)" }}>
            {t("auth.loginWelcomeLine2")}
          </span>
        </>
      }
      title={t("auth.loginTitle")}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif font-bold text-[28px] text-text-dark leading-tight">
            {t("auth.loginHeading")}
          </h1>
          <p className="font-sans text-text-muted text-sm mt-1">{t("auth.loginPortalHint")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="rounded-sm px-4 py-3 font-sans text-sm text-[var(--color-danger)] space-y-2"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
              }}
            >
              <p>{error}</p>
            </div>
          )}
          <AuthField label={t("auth.emailAddress")}>
            <AuthInput
              type="email"
              name="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
          </AuthField>
          <AuthField label={t("auth.password")}>
            <AuthInput
              type="password"
              name="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />
          </AuthField>
          <button
            type="submit"
            disabled={loading}
            className="font-sans font-semibold text-sm text-white rounded px-8 py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full"
            style={{ background: "var(--color-ink)" }}
          >
            {loading ? t("auth.signingIn") : t("auth.signInButton")}
          </button>
        </form>

        <p className="font-sans text-[11px] text-center">
          <Link href="/" className="text-text-muted/60 hover:text-text-muted">
            {t("auth.backToHomepage")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
