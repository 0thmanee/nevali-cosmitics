"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { SUPPORT_FAQ } from "./support-constants";

export type SupportFaqSectionProps = {
	openFaqIndex: number | null;
	onToggleFaq: (index: number | null) => void;
	onOpenTicket: () => void;
};

export function SupportFaqSection({
	openFaqIndex,
	onToggleFaq,
	onOpenTicket,
}: SupportFaqSectionProps) {
	const { t } = useI18n();
	return (
		<div className="flex max-w-2xl flex-col gap-3">
			{SUPPORT_FAQ.map((faq, i) => (
				<div
					className="overflow-hidden rounded-sm"
					key={i}
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<button
						className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
						onClick={() => onToggleFaq(openFaqIndex === i ? null : i)}
						type="button"
					>
						<span className="font-sans font-semibold text-sm text-text-dark leading-snug">
							{faq.q}
						</span>
						<div
							className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors"
							style={{
								borderColor:
									openFaqIndex === i
										? "var(--color-gold)"
										: "color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))",
								background:
									openFaqIndex === i
										? "color-mix(in srgb, var(--color-gold) 8%, transparent)"
										: "transparent",
							}}
						>
							<span
								className="font-bold font-sans text-sm leading-none"
								style={{ color: "var(--color-gold)", marginTop: -1 }}
							>
								{openFaqIndex === i ? "−" : "+"}
							</span>
						</div>
					</button>
					{openFaqIndex === i && (
						<p className="px-5 pb-5 font-sans text-[13px] text-text-muted leading-relaxed">
							{faq.a}
						</p>
					)}
				</div>
			))}
			<div
				className="flex flex-col gap-4 rounded-sm px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
				style={{
					background: "var(--color-paper)",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div>
					<p className="font-sans font-semibold text-[15px] text-text-dark">
						{t("support.stillNeedHelp")}
					</p>
					<p className="mt-0.5 font-sans text-sm text-text-muted">
						{t("support.stillNeedHelpHint")}
					</p>
				</div>
				<button
					className="flex shrink-0 items-center gap-2 rounded-sm px-5 py-2.5 font-sans font-semibold text-sm text-white transition-colors"
					onClick={onOpenTicket}
					style={{ background: "var(--color-ink)" }}
					type="button"
				>
					{t("support.openTicket")}
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
		</div>
	);
}
