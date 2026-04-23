"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PLATFORM_OWNED_ORG_SLUG,
  SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  ...(SHOW_MULTI_PRODUCER_EXPERIENCE
    ? [{ label: "Brands", href: "/artisans" as const }]
    : [{ label: "Our brand", href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` as const }]),
  { label: "Our story", href: "/artisan-process" },
  { label: "Training", href: "/training" },
  { label: "Shop", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-7">
      {NAV_LINKS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative font-sans text-sm transition-colors pb-0.5 ${
              isActive
                ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-secondary"
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
