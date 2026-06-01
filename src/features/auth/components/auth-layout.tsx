"use client";

import Link from "next/link";
import type React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export function AuthLayout({
	children,
	title,
	subtitle,
	showRegisterLink = false,
	showLoginLink = false,
	contentClassName = "max-w-md",
	contentCenter = true,
}: {
	children: React.ReactNode;
	title: string;
	subtitle: React.ReactNode;
	showRegisterLink?: boolean;
	showLoginLink?: boolean;
	contentClassName?: string;
	contentCenter?: boolean;
}) {
	const { t } = useI18n();
	return (
		<div className="flex min-h-screen">
			{/* ── Left panel: brand side ── */}
			<div
				className="relative hidden w-[420px] shrink-0 flex-col justify-between overflow-hidden px-10 py-12 lg:flex"
				style={{ background: "var(--color-ink)" }}
			>
				{/* Subtle grid pattern */}
				<svg
					aria-hidden
					className="pointer-events-none absolute inset-0 h-full w-full"
					style={{ opacity: 0.06 }}
				>
					<defs>
						<pattern
							height="40"
							id="auth-grid"
							patternUnits="userSpaceOnUse"
							width="40"
							x="0"
							y="0"
						>
							<path
								d="M 40 0 L 0 0 0 40"
								fill="none"
								stroke="white"
								strokeWidth="0.5"
							/>
						</pattern>
					</defs>
					<rect fill="url(#auth-grid)" height="100%" width="100%" />
				</svg>

				{/* Top: logo + tagline */}
				<div className="relative z-10">
					<Link className="mb-14 flex flex-col gap-0.5" href="/">
						<span className="font-bold font-display text-[22px] text-white uppercase leading-none tracking-wide">
							nevali
						</span>
						<span className="mt-1 font-sans font-semibold text-[9px] text-white/40 uppercase tracking-[0.22em]">
							{SHOW_MULTI_PRODUCER_EXPERIENCE
								? t("auth.sideTaglineMulti")
								: t("auth.sideTaglineSingle")}
						</span>
					</Link>

					<div className="flex flex-col gap-3">
						<span className="font-bold font-sans text-[10px] text-white/40 uppercase tracking-[0.18em]">
							{title}
						</span>
						<h2 className="font-bold font-serif text-[34px] text-white leading-tight">
							{subtitle}
						</h2>
						<p className="mt-1 max-w-[280px] font-sans text-[13px] text-white/50 leading-relaxed">
							{t("auth.sideBody")}
						</p>
					</div>
				</div>

				{/* Decorative panel */}
				<div
					className="relative z-10 my-8 overflow-hidden rounded-sm"
					style={{ height: "180px" }}
				>
					<div
						className="h-full w-full"
						style={{
							background:
								"linear-gradient(135deg, var(--color-text-muted) 0%, color-mix(in srgb, var(--color-ink) 85%, black) 40%, var(--color-ink) 100%)",
						}}
					/>
					<div
						className="absolute inset-0 flex items-end p-4"
						style={{
							background:
								"linear-gradient(to top, color-mix(in srgb, var(--color-ink) 50%, transparent) 0%, transparent 60%)",
						}}
					>
						<span className="font-sans text-[10px] text-white/60 uppercase tracking-widest">
							{t("auth.sideBadge")}
						</span>
					</div>
				</div>

				{/* Bottom: testimonial */}
				<div className="relative z-10">
					<div
						className="rounded-sm p-5"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 20%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-paper) 10%, transparent)",
						}}
					>
						<div className="mb-3 flex gap-0.5">
							{[...Array(5)].map((_, i) => (
								<span className="text-sm text-white/35" key={i}>
									★
								</span>
							))}
						</div>
						<p className="font-serif text-[13px] text-white/75 italic leading-relaxed">
							&ldquo;{t("auth.testimonialQuote")}&rdquo;
						</p>
						<p className="mt-3 font-sans text-[11px] text-white/40">
							{t("auth.testimonialAttribution")}
						</p>
					</div>
				</div>
			</div>

			{/* ── Right panel: cream form side ── */}
			<div className="flex flex-1 flex-col overflow-y-auto bg-cream">
				{/* Top bar */}
				<div className="flex shrink-0 items-center justify-between border-cream-dark border-b px-8 py-5">
					<Link
						className="font-bold font-display text-[18px] text-text-dark uppercase tracking-wide lg:hidden"
						href="/"
					>
						nevali
					</Link>
					<div className="hidden lg:block" />
					<span className="font-sans text-[13px] text-text-muted">
						{showRegisterLink && (
							<>
								{t("auth.newHere")}{" "}
								<Link
									className="font-semibold text-forest-light hover:underline"
									href={
										SHOW_MULTI_PRODUCER_EXPERIENCE
											? "/auth/register"
											: "/auth/register-buyer"
									}
								>
									{SHOW_MULTI_PRODUCER_EXPERIENCE
										? t("auth.createAccount")
										: t("auth.createBuyerAccount")}
								</Link>
							</>
						)}
						{showLoginLink && (
							<>
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("auth.alreadyPartner")
									: t("auth.alreadyHaveAccount")}
								<Link
									className="font-semibold text-forest-light hover:underline"
									href="/auth/login"
								>
									{t("auth.signIn")}
								</Link>
							</>
						)}
					</span>
				</div>

				{/* Form area */}
				<div
					className={`flex flex-1 flex-col px-8 pb-12 lg:px-14 ${
						contentCenter ? "items-center justify-center" : "items-center pt-10"
					}`}
				>
					<div className={`w-full ${contentClassName}`}>{children}</div>
				</div>
			</div>
		</div>
	);
}

/* ── Shared style tokens for inputs (light theme) ── */
export const inputCls =
	"font-sans text-[14px] text-text-dark bg-white border border-cream-dark rounded px-4 py-3 outline-none w-full transition-colors placeholder:text-text-muted/40";

export const inputStyle = {};
export const inputFocusStyle = {
	borderColor: "var(--color-ink)",
	boxShadow: "0 0 0 2px color-mix(in srgb, var(--color-ink) 8%, transparent)",
};
