"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { PLATFORM_OWNED_ORG_SLUG, SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { useI18n } from "~/components/i18n/i18n-provider";

export function NavLinks() {
  const pathname = usePathname();
  const { t } = useI18n();

  const NAV_LINKS = [
    // { label: t("nav.home"), href: "/" },
    ...(SHOW_MULTI_PRODUCER_EXPERIENCE
      ? [{ label: t("nav.brands"), href: "/artisans" as const }]
      : [{ label: NEVALI_HOUSE_BRAND.navBrandLabel, href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` as const }]),
    { label: t("nav.ourStory"), href: "/artisan-process" },
    // { label: t("nav.training"), href: "/training" },
    { label: t("nav.shop"), href: "/products" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <div className="hidden items-center gap-7 md:flex">
      {NAV_LINKS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`relative pb-0.5 font-sans text-sm transition-colors ${
              isActive
                ? "font-semibold text-primary after:absolute after:bottom-0 after:start-0 after:end-0 after:h-[2px] after:bg-primary/70"
                : "text-text-dark hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
