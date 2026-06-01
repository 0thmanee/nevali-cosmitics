"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthField, AuthInput, AuthLayout } from "~/features/auth";
import { forgetPassword } from "~/lib/auth-client";

export function ForgotPasswordForm() {
	const { t } = useI18n();
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const res = await forgetPassword({
			email,
			redirectTo: "/auth/reset-password",
		});
		setLoading(false);
		if (res.error) {
			setError(res.error.message ?? t("common.errorGeneric"));
			return;
		}
		// Always show the same neutral message to avoid account enumeration.
		setSent(true);
	}

	return (
		<AuthLayout
			showLoginLink
			subtitle={t("auth.forgotHint")}
			title={t("auth.forgotTitle")}
		>
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="font-bold font-serif text-[28px] text-text-dark leading-tight">
						{t("auth.forgotHeading")}
					</h1>
					<p className="mt-1 font-sans text-sm text-text-muted">
						{t("auth.forgotHint")}
					</p>
				</div>

				{sent ? (
					<div
						className="rounded-sm px-4 py-3 font-sans text-sm"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 6%, transparent)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<p>{t("auth.forgotSuccess")}</p>
					</div>
				) : (
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						{error && (
							<div
								className="rounded-sm px-4 py-3 font-sans text-[var(--color-danger)] text-sm"
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
						<button
							className="w-full rounded px-8 py-3.5 font-sans font-semibold text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loading}
							style={{ background: "var(--color-ink)" }}
							type="submit"
						>
							{loading ? t("auth.forgotSending") : t("auth.forgotSubmit")}
						</button>
					</form>
				)}

				<p className="text-center font-sans text-[11px]">
					<Link
						className="text-text-muted/60 hover:text-text-muted"
						href="/auth/login"
					>
						{t("auth.backToLogin")}
					</Link>
				</p>
			</div>
		</AuthLayout>
	);
}
