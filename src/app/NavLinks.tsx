"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "~/components/i18n/i18n-provider";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import {
	PLATFORM_OWNED_ORG_SLUG,
	SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";

export function NavLinks() {
	const pathname = usePathname();
	const { t } = useI18n();

	const NAV_LINKS = [
		// { label: t("nav.home"), href: "/" },
		...(SHOW_MULTI_PRODUCER_EXPERIENCE
			? [{ label: t("nav.brands"), href: "/artisans" as const }]
			: [
					{
						label: NEVALI_HOUSE_BRAND.navBrandLabel,
						href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` as const,
					},
				]),
		{ label: t("nav.ourStory"), href: "/artisan-process" },
		// { label: t("nav.training"), href: "/training" },
		{ label: t("nav.shop"), href: "/products" },
		{ label: t("nav.contact"), href: "/contact" },
	];

	return (
		<div className="hidden items-center gap-2 lg:flex">
			{NAV_LINKS.map((item) => {
				const isActive =
					item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
				return (
					<Link
						className={`rounded-sm px-3 py-2 font-sans text-sm transition-colors ${
							isActive
								? "bg-primary/10 font-semibold text-primary"
								: "text-text-muted hover:bg-cream hover:text-text-dark"
						}`}
						href={item.href}
						key={item.href + item.label}
					>
						{item.label}
					</Link>
				);
			})}
		</div>
	);
}
