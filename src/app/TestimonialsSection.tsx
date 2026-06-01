import type { CSSProperties, ReactNode } from "react";
import React from "react";
import { interpolate } from "~/lib/i18n/interpolate";
import { getMessages } from "~/lib/i18n/load-messages";
import type { Messages } from "~/lib/i18n/messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

function IconQuoteGreen() {
	return (
		<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
			<path
				d="M2 9C2 6.2 4 4 6 3L7 5C5.5 5.8 5 7 5 8v1H2V9zM8 9C8 6.2 10 4 12 3l1 2c-1.5.8-2 2-2 3v1H8V9z"
				fill="var(--color-ink)"
			/>
		</svg>
	);
}

function IconQuoteGold() {
	return (
		<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
			<path
				d="M2 9C2 6.2 4 4 6 3L7 5C5.5 5.8 5 7 5 8v1H2V9zM8 9C8 6.2 10 4 12 3l1 2c-1.5.8-2 2-2 3v1H8V9z"
				fill="var(--color-text-muted)"
			/>
		</svg>
	);
}

function IconGlobe() {
	return (
		<svg fill="none" height="14" viewBox="0 0 14 14" width="14">
			<circle
				cx="7"
				cy="7"
				r="5"
				stroke="var(--color-text-muted)"
				strokeWidth="1.4"
			/>
			<path
				d="M4 7h6M7 4l3 3-3 3"
				stroke="var(--color-text-muted)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.4"
			/>
		</svg>
	);
}

type CardJson = Messages["testimonials"]["cards"][number];

type TestimonialCard = {
	location: string;
	locationIcon: ReactNode;
	locationIconStyle: CSSProperties;
	topBar: string;
	cardBg: string;
	cardBorder: string;
	cardShadow: string;
	dark: boolean;
	quote: string;
	name: string;
	role: string;
	initials: string;
	avatarGradient: string;
	badge: string;
	badgeStyle: CSSProperties;
};

function buildCard(data: CardJson, brand: string): TestimonialCard {
	const quote = interpolate(data.quote, { brand });
	const role = interpolate(data.role, { brand });
	const name = interpolate(data.name, { brand });

	if (data.variant === "green") {
		return {
			location: data.location,
			locationIcon: <IconQuoteGreen />,
			locationIconStyle: {
				background: "var(--color-paper)",
				borderRadius: "10px 10px 6px 6px",
			},
			topBar:
				"linear-gradient(in oklab 90deg, oklab(24% 0.07 0.038) 0%, oklab(36% 0.09 0.048) 50%, oklab(69.6% 0.033 0.116) 100%)",
			cardBg: "var(--color-paper)",
			cardBorder: "1px solid var(--color-paper)",
			cardShadow:
				"0 4px 32px color-mix(in srgb, var(--color-ink) 7%, transparent)",
			dark: false,
			quote,
			name,
			role,
			initials: data.initials,
			avatarGradient:
				"linear-gradient(in oklab 135deg, oklab(24% 0.07 0.038) 0%, oklab(36% 0.09 0.048) 100%)",
			badge: data.badge,
			badgeStyle: {
				background: "var(--color-paper)",
				color: "var(--color-ink)",
			},
		};
	}
	if (data.variant === "globe") {
		return {
			location: data.location,
			locationIcon: <IconGlobe />,
			locationIconStyle: {
				background:
					"color-mix(in srgb, var(--color-text-muted) 15%, transparent)",
				border:
					"1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
				borderRadius: "10px 10px 6px 6px",
			},
			topBar:
				"linear-gradient(in oklab 90deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 50%, oklab(69.6% 0.033 0.116) 100%)",
			cardBg:
				"linear-gradient(in oklab 155deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)",
			cardBorder: "none",
			cardShadow:
				"0 8px 48px color-mix(in srgb, var(--color-ink) 25%, transparent)",
			dark: true,
			quote,
			name,
			role,
			initials: data.initials,
			avatarGradient:
				"linear-gradient(in oklab 135deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 100%)",
			badge: data.badge,
			badgeStyle: {
				background:
					"color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
				color: "var(--color-paper)",
				border:
					"1px solid color-mix(in srgb, var(--color-text-muted) 35%, transparent)",
			},
		};
	}
	return {
		location: data.location,
		locationIcon: <IconQuoteGold />,
		locationIconStyle: {
			background: "var(--color-cream)",
			borderRadius: "10px 10px 6px 6px",
		},
		topBar:
			"linear-gradient(in oklab 90deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 50%, oklab(24% 0.07 0.038) 100%)",
		cardBg: "var(--color-paper)",
		cardBorder: "1px solid var(--color-paper)",
		cardShadow:
			"0 4px 32px color-mix(in srgb, var(--color-ink) 7%, transparent)",
		dark: false,
		quote,
		name,
		role,
		initials: data.initials,
		avatarGradient:
			"linear-gradient(in oklab 135deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 100%)",
		badge: data.badge,
		badgeStyle: {
			background: "var(--color-cream)",
			color: "var(--color-text-muted)",
		},
	};
}

export default async function TestimonialsSection() {
	const t = await getTranslator();
	const locale = await getLocale();
	const messages = getMessages(locale);
	const brand = NEVALI_HOUSE_BRAND.legalName;
	const testimonials = messages.testimonials.cards.map((c) =>
		buildCard(c, brand),
	);

	return (
		<section className="bg-white py-16 lg:py-24">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:gap-16">
				<div className="flex flex-col items-center gap-5 text-center">
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
							{t("testimonials.kicker")}
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
						{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
							<>
								{t("testimonials.titleMultiLine1")}
								<br />
								{t("testimonials.titleMultiLine2")}
							</>
						) : (
							<>
								{t("testimonials.titleSingleLine1")}
								<br />
								{t("testimonials.titleSingleLine2")}
							</>
						)}
					</h2>

					<p className="max-w-[480px] font-sans text-lg text-text-muted leading-relaxed">
						{SHOW_MULTI_PRODUCER_EXPERIENCE
							? t("testimonials.subtitleMulti")
							: t("testimonials.subtitleSingle", { brand })}
					</p>
				</div>

				<div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
					{testimonials.map((row) => (
						<div
							className="flex flex-col overflow-hidden rounded-[20px]"
							key={row.name}
							style={{
								background: row.cardBg,
								border: row.cardBorder,
								boxShadow: row.cardShadow,
							}}
						>
							<div
								className="h-1.5 shrink-0"
								style={{ backgroundImage: row.topBar }}
							/>

							<div className="flex flex-1 flex-col gap-6 p-9">
								<div className="flex items-center gap-3">
									<div
										className="flex h-8 w-8 shrink-0 items-center justify-center"
										style={row.locationIconStyle}
									>
										{row.locationIcon}
									</div>
									<span
										className="font-bold font-sans text-sm uppercase tracking-[0.14em]"
										style={{
											color: row.dark
												? "color-mix(in srgb, var(--color-paper) 45%, transparent)"
												: "var(--color-text-muted)",
										}}
									>
										{row.location}
									</span>
								</div>

								<div className="flex gap-0.5">
									{[...Array(5)].map((_, i) => (
										<span
											className="text-lg text-secondary leading-none"
											key={`${row.name}-star-${i}`}
										>
											★
										</span>
									))}
								</div>

								<p
									className="flex-1 font-serif text-lg italic leading-relaxed"
									style={{
										color: row.dark
											? "color-mix(in srgb, var(--color-paper) 90%, transparent)"
											: "var(--color-ink)",
									}}
								>
									{row.quote}
								</p>

								<div className="flex min-w-0 items-center gap-3">
									<div
										className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold font-sans text-sm text-white"
										style={{ backgroundImage: row.avatarGradient }}
									>
										{row.initials}
									</div>

									<div className="flex min-w-0 flex-1 flex-col gap-0.5">
										<p
											className="font-sans font-semibold text-sm leading-tight"
											style={{
												color: row.dark
													? "var(--color-paper)"
													: "var(--color-ink)",
											}}
										>
											{row.name}
										</p>
										<p
											className="font-sans text-xs leading-tight"
											style={{
												color: row.dark
													? "color-mix(in srgb, var(--color-paper) 45%, transparent)"
													: "var(--color-text-muted)",
											}}
										>
											{row.role}
										</p>
									</div>

									<span
										className="shrink-0 rounded-full px-2.5 py-1 font-bold font-sans text-xs uppercase tracking-wider"
										style={row.badgeStyle}
									>
										{row.badge}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
