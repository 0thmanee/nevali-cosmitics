"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { postRegisterKind } from "~/app/api/auth/register-kind-actions";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthField, AuthInput, AuthLayout } from "~/features/auth";
import { signUp } from "~/lib/auth-client";
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
							onChange={(v) => setName(v)}
							placeholder={t("registerPartner.namePlaceholder")}
							value={name}
						/>
					</AuthField>
					<AuthField label={t("registerPartner.emailAddress")}>
						<AuthInput
							onChange={(v) => setEmail(v)}
							placeholder={t("registerPartner.emailPlaceholder")}
							type="email"
							value={email}
						/>
					</AuthField>
					<AuthField label={t("registerPartner.password")}>
						<AuthInput
							onChange={(v) => setPassword(v)}
							placeholder={t("registerPartner.passwordPlaceholder")}
							type="password"
							value={password}
						/>
					</AuthField>
					<AuthField
						error={
							passwordMismatch
								? t("registerPartner.passwordsMismatch")
								: undefined
						}
						label={t("registerPartner.confirmPassword")}
					>
						<AuthInput
							onChange={(v) => setConfirmPassword(v)}
							placeholder={t("registerPartner.repeatPasswordPlaceholder")}
							type="password"
							value={confirmPassword}
						/>
					</AuthField>
					<label className="flex cursor-pointer items-start gap-3">
						<div
							aria-checked={agreeTerms}
							className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors"
							onClick={() => setAgreeTerms(!agreeTerms)}
							onKeyDown={(e) => e.key === "Enter" && setAgreeTerms(!agreeTerms)}
							role="button"
							style={
								agreeTerms
									? {
											background: "var(--color-ink)",
											border: "1px solid var(--color-ink)",
										}
									: {
											background: "var(--color-paper)",
											border:
												"1px solid color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
										}
							}
							tabIndex={0}
						>
							{agreeTerms && (
								<svg
									fill="none"
									height="10"
									stroke="white"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 10 10"
									width="10"
								>
									<path d="M2 5l2 2 4-4" />
								</svg>
							)}
						</div>
						<span className="font-sans text-[13px] text-text-muted leading-relaxed">
							{t("registerPartner.agreeTerms")}{" "}
							<span style={{ color: "var(--color-ink)" }}>
								{t("registerPartner.requiredMark")}
							</span>
						</span>
					</label>
				</div>

				{submitError && (
					<div
						className="rounded-sm px-4 py-3 font-sans text-[var(--color-danger)] text-sm"
						style={{
							background:
								"color-mix(in srgb, var(--color-danger) 10%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
						}}
					>
						{submitError}
					</div>
				)}

				<div className="flex flex-col gap-4">
					<button
						className="w-full rounded-sm px-8 py-3.5 font-sans font-semibold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
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
								setSubmitError(
									res.error.message ?? t("registerPartner.registrationFailed"),
								);
								return;
							}
							await postRegisterKind("artisan");
							router.push("/onboarding");
						}}
						style={
							canSubmit && !submitting
								? {
										background: "var(--color-ink)",
										color: "var(--color-paper)",
									}
								: {
										background:
											"color-mix(in srgb, var(--color-ink) 12%, transparent)",
										color:
											"color-mix(in srgb, var(--color-ink) 35%, transparent)",
										cursor: "not-allowed",
									}
						}
						type="button"
					>
						{submitting
							? t("registerPartner.creatingAccount")
							: t("registerPartner.createAccount")}
					</button>
					{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
						<Link
							className="text-center font-sans text-sm text-text-muted/80 transition-colors hover:text-text-muted"
							href="/auth/register-buyer"
						>
							{t("registerPartner.buyingForStore")}
						</Link>
					) : null}
					<Link
						className="text-center font-sans text-sm text-text-muted/60 transition-colors hover:text-text-muted"
						href="/auth/login"
					>
						{t("registerPartner.alreadyHaveAccountSignIn")}
					</Link>
				</div>
			</div>

			<p className="mt-6 text-center font-sans text-[11px] text-text-muted/50">
				{t("registerPartner.dataLawNote")}
			</p>
		</AuthLayout>
	);
}
