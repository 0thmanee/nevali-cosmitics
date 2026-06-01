"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthField, AuthInput, AuthLayout } from "~/features/auth";
import { signIn } from "~/lib/auth-client";

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
			},
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
					<h1 className="font-bold font-serif text-[28px] text-text-dark leading-tight">
						{t("auth.loginHeading")}
					</h1>
					<p className="mt-1 font-sans text-sm text-text-muted">
						{t("auth.loginPortalHint")}
					</p>
				</div>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					{error && (
						<div
							className="space-y-2 rounded-sm px-4 py-3 font-sans text-[var(--color-danger)] text-sm"
							style={{
								background:
									"color-mix(in srgb, var(--color-danger) 10%, transparent)",
								border:
									"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
							}}
						>
							<p>{error}</p>
						</div>
					)}
					<AuthField label={t("auth.emailAddress")}>
						<AuthInput
							autoComplete="email"
							name="email"
							onChange={setEmail}
							placeholder={t("auth.emailPlaceholder")}
							required
							type="email"
							value={email}
						/>
					</AuthField>
					<AuthField label={t("auth.password")}>
						<AuthInput
							autoComplete="current-password"
							name="password"
							onChange={setPassword}
							placeholder={t("auth.passwordPlaceholder")}
							required
							type="password"
							value={password}
						/>
					</AuthField>
					<div className="-mt-1 text-right">
						<Link
							className="font-sans text-[12px] text-text-muted hover:text-text-dark"
							href="/auth/forgot-password"
						>
							{t("auth.forgotLinkLabel")}
						</Link>
					</div>
					<button
						className="w-full rounded px-8 py-3.5 font-sans font-semibold text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
						disabled={loading}
						style={{ background: "var(--color-ink)" }}
						type="submit"
					>
						{loading ? t("auth.signingIn") : t("auth.signInButton")}
					</button>
				</form>

				<p className="text-center font-sans text-[11px]">
					<Link className="text-text-muted/60 hover:text-text-muted" href="/">
						{t("auth.backToHomepage")}
					</Link>
				</p>
			</div>
		</AuthLayout>
	);
}
