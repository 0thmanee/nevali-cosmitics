"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthField, AuthInput, AuthLayout } from "~/features/auth";
import { resetPassword } from "~/lib/auth-client";

export function ResetPasswordForm() {
	const { t } = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		if (password !== confirm) {
			setError(t("auth.passwordsDontMatch"));
			return;
		}
		setLoading(true);
		const res = await resetPassword({ newPassword: password, token });
		setLoading(false);
		if (res.error) {
			setError(res.error.message ?? t("auth.invalidResetLink"));
			return;
		}
		setDone(true);
		setTimeout(() => router.push("/auth/login"), 1500);
	}

	const tokenMissing = token.trim() === "";

	return (
		<AuthLayout
			showLoginLink
			subtitle={t("auth.resetHint")}
			title={t("auth.resetTitle")}
		>
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="font-bold font-serif text-[28px] text-text-dark leading-tight">
						{t("auth.resetHeading")}
					</h1>
					<p className="mt-1 font-sans text-sm text-text-muted">
						{t("auth.resetHint")}
					</p>
				</div>

				{done ? (
					<div
						className="rounded-sm px-4 py-3 font-sans text-sm"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 6%, transparent)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<p>{t("auth.resetSuccess")}</p>
					</div>
				) : tokenMissing ? (
					<div
						className="rounded-sm px-4 py-3 font-sans text-[var(--color-danger)] text-sm"
						style={{
							background:
								"color-mix(in srgb, var(--color-danger) 10%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
						}}
					>
						<p>{t("auth.invalidResetLink")}</p>
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
						<AuthField label={t("auth.newPassword")}>
							<AuthInput
								autoComplete="new-password"
								name="newPassword"
								onChange={setPassword}
								placeholder={t("auth.newPasswordPlaceholder")}
								required
								type="password"
								value={password}
							/>
						</AuthField>
						<AuthField label={t("auth.confirmPassword")}>
							<AuthInput
								autoComplete="new-password"
								name="confirmPassword"
								onChange={setConfirm}
								placeholder={t("auth.confirmPasswordPlaceholder")}
								required
								type="password"
								value={confirm}
							/>
						</AuthField>
						<button
							className="w-full rounded px-8 py-3.5 font-sans font-semibold text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loading}
							style={{ background: "var(--color-ink)" }}
							type="submit"
						>
							{loading ? t("auth.resetting") : t("auth.resetSubmit")}
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
