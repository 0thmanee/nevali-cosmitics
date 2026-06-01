"use client";

import Link from "next/link";
import React from "react";
import type { RegisterFormData } from "../config/register";

const bg =
	"linear-gradient(in oklab 160deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)";

export function RegisterSuccess({ form }: { form: RegisterFormData }) {
	return (
		<div
			className="flex min-h-screen items-center justify-center px-4"
			style={{ background: bg }}
		>
			<svg
				aria-hidden
				className="pointer-events-none absolute inset-0 h-full w-full"
				style={{ opacity: 0.04 }}
			>
				<defs>
					<pattern
						height="48"
						id="reg-success-pattern"
						patternUnits="userSpaceOnUse"
						width="48"
						x="0"
						y="0"
					>
						<rect
							fill="none"
							height="28"
							stroke="var(--color-gold)"
							strokeWidth="0.7"
							width="28"
							x="10"
							y="10"
						/>
						<rect
							fill="none"
							height="28"
							stroke="var(--color-gold)"
							strokeWidth="0.7"
							transform="rotate(45 24 24)"
							width="28"
							x="10"
							y="10"
						/>
						<circle
							cx="24"
							cy="24"
							fill="color-mix(in srgb, var(--color-gold) 40%, transparent)"
							r="3"
						/>
					</pattern>
				</defs>
				<rect fill="url(#reg-success-pattern)" height="100%" width="100%" />
			</svg>

			<div className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
				<div
					className="flex h-20 w-20 items-center justify-center rounded-full"
					style={{
						background:
							"color-mix(in srgb, var(--color-gold) 12%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)",
					}}
				>
					<svg fill="none" height="36" viewBox="0 0 36 36" width="36">
						<path
							d="M7 18l6 6 16-14"
							stroke="var(--color-text-muted)"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
						/>
					</svg>
				</div>
				<div>
					<div className="mb-2 flex items-center justify-center gap-2">
						<span
							className="text-sm"
							style={{ color: "var(--color-text-muted)" }}
						>
							★
						</span>
						<span className="font-sans font-semibold text-[11px] text-white/50 uppercase tracking-[0.18em]">
							Application Submitted
						</span>
						<span
							className="text-sm"
							style={{ color: "var(--color-text-muted)" }}
						>
							★
						</span>
					</div>
					<h1 className="font-bold font-serif text-[32px] text-white leading-tight">
						Welcome, {form.firstName}.
					</h1>
					<p className="mt-3 max-w-sm font-sans text-base text-white/60 leading-relaxed">
						Your application has been received. Our team will review your
						documents and get back to you within 3-5 business days.
					</p>
				</div>
				<div
					className="flex w-full flex-col gap-3 rounded-sm p-5 text-left"
					style={{
						background:
							"color-mix(in srgb, var(--color-paper) 4%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-paper) 8%, transparent)",
					}}
				>
					{[
						{
							step: "1",
							label: "Application review",
							detail: "1-2 business days",
						},
						{
							step: "2",
							label: "Document verification",
							detail: "1-2 business days",
						},
						{
							step: "3",
							label: "On-site audit scheduled",
							detail: "1-3 weeks",
						},
						{
							step: "4",
							label: "Certification granted",
							detail: "Up to 1 week",
						},
					].map((s) => (
						<div className="flex items-center gap-3" key={s.step}>
							<div
								className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold font-sans text-[10px]"
								style={{
									background:
										"color-mix(in srgb, var(--color-text-muted) 15%, transparent)",
									border:
										"1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
									color: "var(--color-text-muted)",
								}}
							>
								{s.step}
							</div>
							<div className="flex flex-1 items-center justify-between gap-2">
								<span className="font-sans text-sm text-white/80">
									{s.label}
								</span>
								<span className="font-sans text-[11px] text-white/35">
									{s.detail}
								</span>
							</div>
						</div>
					))}
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<Link
						className="rounded px-8 py-3.5 font-sans font-semibold text-sm text-white transition-colors"
						href="/artisan"
						style={{ background: "var(--color-ink)" }}
					>
						Go to Dashboard
					</Link>
					<Link
						className="font-sans text-sm text-white/60 transition-colors hover:text-white/80"
						href="/"
					>
						Back to Homepage
					</Link>
				</div>
			</div>
		</div>
	);
}
