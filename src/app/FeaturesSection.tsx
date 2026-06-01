import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "~/lib/i18n/interpolate";
import { getMessages } from "~/lib/i18n/load-messages";
import type { Messages } from "~/lib/i18n/messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

function IconPillar1() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6L2 5.5h4.5L8 1z"
				stroke="var(--color-ink)"
				strokeLinejoin="round"
				strokeWidth="1.3"
			/>
		</svg>
	);
}

function IconPillar2() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<circle
				cx="8"
				cy="8"
				r="6"
				stroke="var(--color-text-muted)"
				strokeWidth="1.3"
			/>
			<path
				d="M5 8h6M8 5l3 3-3 3"
				stroke="var(--color-text-muted)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.3"
			/>
		</svg>
	);
}

function IconPillar3() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M2 12l4-4 3 3 5-7"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.3"
			/>
		</svg>
	);
}

function IconStar() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<path
				d="M10 2l1.8 5.5H18l-5 3.6 1.8 5.5L10 13l-4.6 3.6 1.8-5.5L2 7.5h6.2L10 2z"
				stroke="var(--color-ink)"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconCheckCircle() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<path
				d="M5 10l3 3 7-7"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
			<circle
				cx="10"
				cy="10"
				r="8"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconAudit() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<rect
				height="11"
				rx="1.5"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
				width="14"
				x="3"
				y="5"
			/>
			<path
				d="M7 5V4a3 3 0 0 1 6 0v1M8 11l2 2 4-4"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconGrid() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<rect
				height="6"
				rx="1"
				stroke="var(--color-text-muted)"
				strokeWidth="1.6"
				width="6"
				x="2"
				y="2"
			/>
			<rect
				height="6"
				rx="1"
				stroke="var(--color-text-muted)"
				strokeWidth="1.6"
				width="6"
				x="12"
				y="2"
			/>
			<rect
				height="6"
				rx="1"
				stroke="var(--color-text-muted)"
				strokeWidth="1.6"
				width="6"
				x="2"
				y="12"
			/>
			<rect
				height="6"
				rx="1"
				stroke="var(--color-text-muted)"
				strokeWidth="1.6"
				width="6"
				x="12"
				y="12"
			/>
		</svg>
	);
}

function IconShoppingBag() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<path
				d="M5 7h10v11H5V7z"
				stroke="var(--color-text-muted)"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
			<path
				d="M8 7V5a2 2 0 0 1 4 0v2"
				stroke="var(--color-text-muted)"
				strokeLinecap="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconMatch() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<path
				d="M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3z"
				stroke="var(--color-gold)"
				strokeWidth="1.6"
			/>
			<path
				d="M7 10l2 2 4-4"
				stroke="var(--color-gold)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconTraining() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<path
				d="M10 3v14M5 7l5-4 5 4M5 13l5 4 5-4"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconDoc() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<rect
				height="14"
				rx="1.5"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
				width="12"
				x="4"
				y="3"
			/>
			<path
				d="M8 7h4M8 10h4M8 13h2"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function IconAnalytics() {
	return (
		<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
			<rect
				height="6"
				rx="1"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
				width="6"
				x="2"
				y="2"
			/>
			<rect
				height="6"
				rx="1"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
				width="6"
				x="12"
				y="2"
			/>
			<rect
				height="6"
				rx="1"
				stroke="var(--color-ink)"
				strokeWidth="1.6"
				width="6"
				x="2"
				y="12"
			/>
			<path
				d="M12 15h6M15 12v6"
				stroke="var(--color-ink)"
				strokeLinecap="round"
				strokeWidth="1.6"
			/>
		</svg>
	);
}

function tagStyle(label: string): CSSProperties {
	const paperInk = {
		background: "var(--color-paper)",
		color: "var(--color-ink)",
		border: "1px solid var(--color-cream-dark)",
	} as const;
	const cosmetics = {
		background:
			"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
		color: "var(--color-text-muted)",
		border:
			"1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-gold-light))",
	} as const;
	const noLogin = {
		background:
			"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
		color: "var(--color-text-muted)",
		border:
			"1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-gold-light))",
	} as const;
	const curated = {
		background: "color-mix(in srgb, var(--color-gold) 20%, transparent)",
		color: "var(--color-gold)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
	} as const;

	switch (label) {
		case "ISO READY":
		case "MULTI-CATEGORY":
		case "QR SCANNABLE":
		case "BATCH LINKED":
		case "AUTO-ALERTS":
		case "SECURE & AUDITABLE":
		case "PROGRESS TRACKING":
		case "REAL-TIME STATUS":
		case "EXPORT PDF / XLS":
			return paperInk;
		case "COSMETICS FOCUS":
			return cosmetics;
		case "NO LOGIN REQUIRED":
			return noLogin;
		case "CURATED DIRECTORY":
		case "CURATED LINE":
			return curated;
		default:
			return paperInk;
	}
}

type JsonCard = {
	title?: string;
	titleMulti?: string;
	titleSingle?: string;
	desc?: string;
	descMulti?: string;
	descSingle?: string;
	tags?: string[];
	tagMulti?: string;
	tagSingle?: string;
};

function resolveDesc(card: JsonCard, brand: string): string {
	if (card.desc) return interpolate(card.desc, { brand });
	const raw = SHOW_MULTI_PRODUCER_EXPERIENCE ? card.descMulti : card.descSingle;
	return interpolate(raw ?? "", { brand });
}

function resolveTitle(card: JsonCard, brand: string): string {
	if (card.title) return interpolate(card.title, { brand });
	const raw = SHOW_MULTI_PRODUCER_EXPERIENCE
		? card.titleMulti
		: card.titleSingle;
	return interpolate(raw ?? "", { brand });
}

function jsonCardToUi(
	card: JsonCard,
	brand: string,
	icon: ReactNode,
	iconBg: string,
	cardBg: string,
	cardBorder: string,
	dark: boolean,
): {
	icon: ReactNode;
	iconBg: string;
	cardBg: string;
	cardBorder: string;
	dark: boolean;
	title: string;
	desc: string;
	tags: { label: string; style: CSSProperties }[];
} {
	const title = resolveTitle(card, brand);
	const desc = resolveDesc(card, brand);
	let tagLabels: string[] = card.tags ?? [];
	if (card.tagMulti || card.tagSingle) {
		tagLabels = [
			SHOW_MULTI_PRODUCER_EXPERIENCE
				? (card.tagMulti ?? "")
				: (card.tagSingle ?? ""),
		];
	}
	return {
		icon,
		iconBg,
		cardBg,
		cardBorder,
		dark,
		title,
		desc,
		tags: tagLabels.map((label) => ({ label, style: tagStyle(label) })),
	};
}

function buildPillars(messages: Messages, brand: string) {
	const f = messages.features;
	const pillar2Label = SHOW_MULTI_PRODUCER_EXPERIENCE
		? f.pillar2LabelMulti
		: f.pillar2LabelSingle;

	return [
		{
			label: f.pillar1Label,
			pillarIcon: <IconPillar1 />,
			pillarIconBg: "var(--color-paper)",
			cards: [
				jsonCardToUi(
					f.pillar1Cards[0] as JsonCard,
					brand,
					<IconStar />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
				jsonCardToUi(
					f.pillar1Cards[1] as JsonCard,
					brand,
					<IconCheckCircle />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
				jsonCardToUi(
					f.pillar1Cards[2] as JsonCard,
					brand,
					<IconAudit />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
			],
		},
		{
			label: pillar2Label,
			pillarIcon: <IconPillar2 />,
			pillarIconBg:
				"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
			cards: [
				jsonCardToUi(
					f.pillar2Cards[0] as JsonCard,
					brand,
					<IconGrid />,
					"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
					"var(--color-paper)",
					"color-mix(in srgb, var(--color-cream-dark) 85%, var(--color-paper))",
					false,
				),
				jsonCardToUi(
					f.pillar2Cards[1] as JsonCard,
					brand,
					<IconShoppingBag />,
					"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
					"var(--color-paper)",
					"color-mix(in srgb, var(--color-cream-dark) 85%, var(--color-paper))",
					false,
				),
				jsonCardToUi(
					f.pillar2Cards[2] as JsonCard,
					brand,
					<IconMatch />,
					"color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
					"var(--color-ink)",
					"var(--color-ink)",
					true,
				),
			],
		},
		{
			label: f.pillar3Label,
			pillarIcon: <IconPillar3 />,
			pillarIconBg: "var(--color-paper)",
			cards: [
				jsonCardToUi(
					f.pillar3Cards[0] as JsonCard,
					brand,
					<IconTraining />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
				jsonCardToUi(
					f.pillar3Cards[1] as JsonCard,
					brand,
					<IconDoc />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
				jsonCardToUi(
					f.pillar3Cards[2] as JsonCard,
					brand,
					<IconAnalytics />,
					"var(--color-paper)",
					"var(--color-paper)",
					"var(--color-paper)",
					false,
				),
			],
		},
	];
}

export default async function FeaturesSection() {
	const t = await getTranslator();
	const locale = await getLocale();
	const messages = getMessages(locale);
	const brand = NEVALI_HOUSE_BRAND.legalName;
	const pillars = buildPillars(messages, brand);

	return (
		<section className="bg-white py-16 lg:py-24" id="how-it-works">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:gap-16">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="h-px w-6 bg-secondary/60" />
							<span className="font-sans font-semibold text-secondary text-sm uppercase tracking-[0.18em]">
								{t("features.kicker")}
							</span>
						</div>
						<h2 className="font-bold font-serif text-4xl text-text-dark leading-tight md:text-5xl">
							{t("features.titleLine1")}
							<br />
							{t("features.titleLine2")}
						</h2>
					</div>
					<p className="max-w-[340px] font-sans text-lg text-text-muted leading-relaxed lg:pt-14 lg:text-right">
						{SHOW_MULTI_PRODUCER_EXPERIENCE
							? t("features.blurbMulti")
							: t("features.blurbSingle", { brand })}
					</p>
				</div>

				<div className="flex flex-col gap-14">
					{pillars.map((pillar) => (
						<div className="flex flex-col gap-6" key={pillar.label}>
							<div className="flex items-center gap-3">
								<div
									className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
									style={{ background: pillar.pillarIconBg }}
								>
									{pillar.pillarIcon}
								</div>
								<span className="font-bold font-sans text-sm text-text-dark uppercase tracking-[0.18em]">
									{pillar.label}
								</span>
								<div className="h-px flex-1 bg-cream-dark" />
							</div>

							<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
								{pillar.cards.map((card) => (
									<div
										className="flex flex-col gap-4 rounded-sm p-7"
										key={card.title}
										style={{
											background: card.cardBg,
											border: `1px solid ${card.cardBorder}`,
										}}
									>
										<div
											className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm"
											style={{ background: card.iconBg }}
										>
											{card.icon}
										</div>

										<div className="flex flex-1 flex-col gap-2">
											<h3
												className="font-bold font-serif text-xl leading-snug"
												style={{
													color: card.dark
														? "var(--color-paper)"
														: "var(--color-ink)",
												}}
											>
												{card.title}
											</h3>
											<p
												className="font-sans text-sm leading-relaxed"
												style={{
													color: card.dark
														? "color-mix(in srgb, var(--color-paper) 55%, transparent)"
														: "var(--color-text-muted)",
												}}
											>
												{card.desc}
											</p>
										</div>

										<div className="flex flex-wrap gap-2">
											{card.tags.map((tag) => (
												<span
													className="rounded-full px-3 py-1 font-bold font-sans text-xs uppercase tracking-wide"
													key={tag.label}
													style={tag.style}
												>
													{tag.label}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
