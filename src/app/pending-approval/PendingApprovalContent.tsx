"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signOut } from "~/lib/auth-client";

export function PendingApprovalContent() {
	const { t, messages } = useI18n();
	const steps = messages.pendingApproval.steps;
	return (
		<div className="flex w-full max-w-2xl flex-col gap-10">
			{/* Heading */}
			<div>
				<div className="mb-4 flex items-center gap-3">
					{/* Clock icon */}
					<div
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 8%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-ink) 18%, transparent)",
						}}
					>
						<svg
							fill="none"
							height="18"
							stroke="var(--color-ink)"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="18"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 6v6l4 2" />
						</svg>
					</div>
					<span className="font-bold font-sans text-text-muted text-xs uppercase tracking-[0.18em]">
						{t("pendingApproval.eyebrow")}
					</span>
				</div>

				<h1
					className="mb-3 font-bold font-serif text-text-dark leading-[1.0]"
					style={{ fontSize: "clamp(32px, 4vw, 44px)" }}
				>
					{t("pendingApproval.titleLine1")}
					<br />
					{t("pendingApproval.titleLine2")}
				</h1>
				<p className="font-sans text-base text-text-muted leading-relaxed">
					{t("pendingApproval.body")}
				</p>
			</div>

			{/* What happens next */}
			<div>
				<p className="mb-4 font-bold font-sans text-text-muted text-xs uppercase tracking-[0.18em]">
					{t("pendingApproval.nextHeading")}
				</p>
				<div className="flex items-start gap-0">
					{steps.map((s, i) => (
						<div className="flex flex-1 items-start gap-0" key={String(i)}>
							<div className="flex flex-col items-center">
								<div
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold font-sans text-xs"
									style={{
										background:
											"color-mix(in srgb, var(--color-ink) 8%, transparent)",
										color: "var(--color-ink)",
										border:
											"1px solid color-mix(in srgb, var(--color-ink) 18%, transparent)",
									}}
								>
									{i + 1}
								</div>
								{i < steps.length - 1 && (
									<div className="mt-3.5 hidden h-px w-full" />
								)}
							</div>
							<div className="flex-1 ps-3 pe-6">
								<p className="font-sans font-semibold text-sm text-text-dark">
									{s.label}
								</p>
								<p className="mt-0.5 font-sans text-text-muted text-xs">
									{s.detail}
								</p>
							</div>
							{i < steps.length - 1 && (
								<div
									className="me-2 h-px w-6 shrink-0 self-center"
									style={{
										background:
											"color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
									}}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Divider */}
			<div
				className="h-px w-full"
				style={{ background: "var(--color-cream-dark)" }}
			/>

			{/* Actions */}
			<div className="flex items-center justify-between">
				<p className="font-sans text-sm text-text-muted">
					{t("pendingApproval.questionsLead")}{" "}
					<Link
						className="hover:underline"
						href="mailto:support@nevali-cosmetics.ma"
						style={{ color: "var(--color-ink)" }}
					>
						{t("pendingApproval.contactSupport")}
					</Link>
				</p>
				<div className="flex items-center gap-4">
					<button
						className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						onClick={() => signOut()}
						type="button"
					>
						{t("pendingApproval.signOut")}
					</button>
					<Link
						className="rounded-sm px-5 py-2.5 font-sans font-semibold text-sm text-white transition-colors"
						href="/"
						style={{ background: "var(--color-ink)" }}
					>
						{t("pendingApproval.backToHomepage")}
					</Link>
				</div>
			</div>
		</div>
	);
}
