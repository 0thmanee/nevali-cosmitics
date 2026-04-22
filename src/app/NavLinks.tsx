"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Artisans", href: "/artisans" },
  { label: "Artisan Process", href: "/artisan-process" },
  { label: "Training", href: "/training" },
  { label: "Our Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
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
