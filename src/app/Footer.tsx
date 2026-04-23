import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import {
	PLATFORM_OWNED_ORG_SLUG,
	SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";

function buildFooterLinks(): Record<string, { label: string; href: string }[]> {
	const platform = SHOW_MULTI_PRODUCER_EXPERIENCE
		? [
				{ label: "Our brands", href: "/artisans" },
				{ label: "Shop cosmetics", href: "/products" },
				{ label: "Sell on nevali", href: "/auth/register" },
			]
		: [
				{ label: NEVALI_HOUSE_BRAND.navBrandLabel, href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` },
				{ label: "Shop cosmetics", href: "/products" },
			];

	const resources = SHOW_MULTI_PRODUCER_EXPERIENCE
		? [
				{ label: "Training & readiness", href: "/training" },
				{ label: "Quality Standards", href: "/products" },
				{ label: "Partner Program", href: "/auth/register" },
			]
		: [
				{ label: "Training & readiness", href: "/training" },
				{ label: "Quality Standards", href: "/products" },
			];

	return {
		Platform: platform,
		Company: [
			{ label: "About nevali", href: "/#about" },
			{ label: "Our Mission", href: "/#mission" },
			{ label: "Contact", href: "/contact" },
		],
		Resources: resources,
	};
}

const SOCIAL = [
	{ label: "Instagram", href: "https://www.instagram.com", icon: "IG" },
	{ label: "LinkedIn", href: "https://www.linkedin.com", icon: "LI" },
	{ label: "Facebook", href: "https://www.facebook.com", icon: "FB" },
];

export default function Footer() {
	const LINKS = buildFooterLinks();
	return (
		<footer className="border-t border-cream-dark bg-paper">
			{/* Main grid */}
			<div className="mx-auto max-w-7xl px-6 pb-12 pt-16">
				<AnimateOnScroll className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4" direction="up">
					{/* Brand column */}
					<div className="flex flex-col gap-5">
						<Link className="flex flex-col gap-1" href="/">
							<span
								className="font-bold font-display uppercase leading-none"
								style={{
									fontSize: "22px",
									letterSpacing: "0.08em",
									color: "var(--color-primary-darker)",
								}}
							>
								nevali
							</span>
							<span
								className="font-sans text-xs uppercase tracking-[0.2em]"
								style={{ color: "var(--color-primary-dark)" }}
							>
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? "soft beauty marketplace" : NEVALI_HOUSE_BRAND.lineUnderLogo}
							</span>
						</Link>
						<p
							className="font-sans text-xs leading-relaxed text-text-muted"
							style={{ maxWidth: "220px" }}
						>
							{SHOW_MULTI_PRODUCER_EXPERIENCE
								? "A gentler way to discover Moroccan cosmetics by women-led and values-led brands."
								: NEVALI_HOUSE_BRAND.footerBlurb}
						</p>
						{/* Social */}
						<div className="mt-1 flex items-center gap-3">
							{SOCIAL.map((s) => (
								<a
									aria-label={s.label}
									className="border border-primary/35 bg-white px-2 py-1 font-bold font-sans text-xs text-primary-dark uppercase tracking-wider transition-colors duration-200 hover:border-primary hover:text-primary-darker"
									href={s.href}
									key={s.label}
									rel="noopener noreferrer"
									target="_blank"
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					{/* Link columns */}
					{Object.entries(LINKS).map(([heading, items]) => (
						<div className="flex flex-col gap-4" key={heading}>
							<span
								className="font-sans font-semibold text-xs uppercase tracking-[0.2em]"
								style={{ color: "var(--color-primary-dark)" }}
							>
								{heading}
							</span>
							<ul className="flex flex-col gap-2.5">
								{items.map((item) => {
									const external = item.href.startsWith("http");
									return (
										<li key={item.label}>
											{external ? (
												<a
													className="font-sans text-sm text-text-muted transition-colors duration-200 hover:text-primary-darker"
													href={item.href}
													rel="noopener noreferrer"
													target="_blank"
												>
													{item.label}
												</a>
											) : (
												<Link
													className="font-sans text-sm text-text-muted transition-colors duration-200 hover:text-primary-darker"
													href={item.href}
												>
													{item.label}
												</Link>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</AnimateOnScroll>
			</div>

			{/* Bottom strip */}
			<AnimateOnScroll
				className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-cream-dark px-6 py-4 sm:flex-row sm:items-center"
				delay={80}
				direction="up"
			>
				<span className="font-sans text-xs text-text-muted">
					© 2027 nevali. All rights reserved. Casablanca, Morocco.
				</span>
				<div className="flex items-center gap-4">
					<Link
						className="font-sans text-xs text-text-muted transition-colors duration-200 hover:text-primary-darker"
						href="/contact#privacy"
					>
						Privacy Policy
					</Link>
					<Link
						className="font-sans text-xs text-text-muted transition-colors duration-200 hover:text-primary-darker"
						href="/contact#terms"
					>
						Terms of Service
					</Link>
				</div>
			</AnimateOnScroll>
		</footer>
	);
}
