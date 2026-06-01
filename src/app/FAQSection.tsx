"use client";

import React, { useMemo, useState } from "react";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type FaqItem = { q: string; a: string };

export default function FAQSection() {
	const { t, messages } = useI18n();
	const [open, setOpen] = useState(0);
	const brand = NEVALI_HOUSE_BRAND.legalName;

	const faqs: FaqItem[] = useMemo(() => {
		const raw = SHOW_MULTI_PRODUCER_EXPERIENCE
			? messages.faq.multi
			: messages.faq.single;
		return raw.map((item) => ({
			q: interpolate(item.q, { brand }),
			a: interpolate(item.a, { brand }),
		}));
	}, [SHOW_MULTI_PRODUCER_EXPERIENCE, messages, brand]);

	return (
		<section
			className="py-16 lg:py-24"
			style={{ background: "var(--color-paper)" }}
		>
			<div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 sm:px-6 lg:gap-16 lg:px-12">
				<AnimateOnScroll
					className="flex flex-col items-center gap-5 text-center"
					direction="up"
					scale
				>
					<div className="flex items-center gap-3">
						<div className="h-px w-10 bg-secondary/40" />
						<svg fill="none" height="18" viewBox="0 0 22 22" width="18">
							<path
								d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
								stroke="var(--color-text-muted)"
								strokeLinejoin="round"
								strokeWidth="1.8"
							/>
						</svg>
						<span className="font-sans font-semibold text-secondary text-sm uppercase tracking-[0.18em]">
							{t("faq.kicker")}
						</span>
						<svg fill="none" height="18" viewBox="0 0 22 22" width="18">
							<path
								d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
								stroke="var(--color-text-muted)"
								strokeLinejoin="round"
								strokeWidth="1.8"
							/>
						</svg>
						<div className="h-px w-10 bg-secondary/40" />
					</div>

					<h2 className="font-bold font-serif text-4xl text-text-dark leading-tight md:text-5xl">
						{t("faq.titleLine1")}
						<br />
						{t("faq.titleLine2")}
					</h2>

					<p className="max-w-[480px] font-sans text-lg text-text-muted leading-relaxed">
						{SHOW_MULTI_PRODUCER_EXPERIENCE
							? t("faq.introMulti")
							: t("faq.introSingle", { brand })}
					</p>
				</AnimateOnScroll>

				<AnimateOnScroll
					className="mx-auto flex w-full max-w-[820px] flex-col"
					delay={100}
					direction="up"
				>
					{faqs.map((faq, i) => (
						<div className="border-cream-dark border-b" key={faq.q}>
							<button
								className="flex w-full items-center justify-between gap-6 py-7 text-start"
								onClick={() => setOpen(open === i ? -1 : i)}
								type="button"
							>
								<span className="font-sans font-semibold text-lg text-text-dark leading-snug">
									{faq.q}
								</span>
								<div
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
									style={{
										borderColor:
											"color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))",
									}}
								>
									<span
										className="text-base text-secondary leading-none"
										style={{ marginTop: -1 }}
									>
										{open === i ? "−" : "+"}
									</span>
								</div>
							</button>
							{open === i ? (
								<p className="max-w-[720px] pb-7 font-sans text-base text-text-muted leading-relaxed">
									{faq.a}
								</p>
							) : null}
						</div>
					))}

					<div
						className="mt-8 flex flex-col gap-4 rounded-sm px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
						style={{
							background: "var(--color-paper)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<div>
							<p className="mb-0.5 font-sans font-semibold text-base text-text-dark">
								{t("faq.stillTitle")}
							</p>
							<p className="font-sans text-sm text-text-muted">
								{t("faq.stillBody")}
							</p>
						</div>
						<button
							className="flex shrink-0 items-center gap-2 rounded-sm px-6 py-3 font-sans font-semibold text-sm text-white transition-colors"
							style={{ background: "var(--color-ink)" }}
							type="button"
						>
							{t("faq.contactSupport")}
							<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
								<path
									d="M2 7h10M8 3l4 4-4 4"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
								/>
							</svg>
						</button>
					</div>
				</AnimateOnScroll>
			</div>
		</section>
	);
}
