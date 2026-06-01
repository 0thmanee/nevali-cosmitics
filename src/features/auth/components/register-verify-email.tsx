"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "~/features/auth";
import { sendVerificationEmail } from "~/lib/auth-client";

const CALLBACK_URL = "/onboarding";

export function RegisterVerifyEmail({ email }: { email: string }) {
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
		"idle",
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handleResend() {
		if (status === "sending") return;
		setErrorMessage(null);
		setStatus("sending");
		const res = await sendVerificationEmail({
			email,
			callbackURL: CALLBACK_URL,
		});
		if (res.error) {
			setStatus("error");
			setErrorMessage(res.error.message ?? "Failed to resend. Try again.");
			return;
		}
		setStatus("sent");
	}

	return (
		<AuthLayout
			contentClassName="max-w-md"
			showLoginLink
			subtitle="We sent you a verification link"
			title="Check your email"
		>
			<div className="flex flex-col gap-6 text-center">
				<div
					className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
					style={{
						background: "color-mix(in srgb, var(--color-ink) 8%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-ink) 20%, transparent)",
					}}
				>
					<svg
						fill="none"
						height="28"
						stroke="var(--color-ink)"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						width="28"
					>
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
						<path d="m22 6-10 7L2 6" />
					</svg>
				</div>
				<p className="font-sans text-sm text-text-muted leading-relaxed">
					We sent a verification link to{" "}
					<strong className="text-text-dark">{email}</strong>. Click the link to
					verify your email, then you can sign in and complete your profile.
				</p>
				<p className="font-sans text-text-muted/60 text-xs">
					Didn’t receive the email? Check your spam folder, or resend below.
				</p>

				<div className="flex flex-col gap-3">
					<button
						className="rounded px-6 py-3 font-sans font-semibold text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
						disabled={status === "sending"}
						onClick={handleResend}
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 8%, transparent)",
							color: "var(--color-ink)",
							border:
								"1px solid color-mix(in srgb, var(--color-ink) 20%, transparent)",
						}}
						type="button"
					>
						{status === "sending"
							? "Sending…"
							: status === "sent"
								? "Email sent again"
								: "Resend verification email"}
					</button>
					{status === "sent" && (
						<p className="font-sans text-[11px] text-text-muted/70">
							Check your inbox (and spam) for the new link.
						</p>
					)}
					{status === "error" && errorMessage && (
						<p className="font-sans text-[11px] text-[var(--color-danger)]">
							{errorMessage}
						</p>
					)}
					<Link
						className="font-sans font-semibold text-sm transition-colors"
						href="/auth/login"
						style={{ color: "var(--color-ink)" }}
					>
						Go to Sign in →
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}
