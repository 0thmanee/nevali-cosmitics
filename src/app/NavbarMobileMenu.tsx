"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "~/lib/auth-client";
import { useI18n } from "~/components/i18n/i18n-provider";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import {
  PLATFORM_OWNED_ORG_SLUG,
  SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";

function dashboardHref(role: string): string {
  if (role === "superadmin") return "/admin";
  if (role === "buyer") return "/buyer";
  return "/artisan";
}

type Props = {
  isAuthenticated: boolean;
  role: string;
  name: string;
  email: string;
};

export function NavbarMobileMenu({ isAuthenticated, role, name, email }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dash = dashboardHref(role);

  const navLinks = [
    ...(SHOW_MULTI_PRODUCER_EXPERIENCE
      ? [{ label: t("nav.brands"), href: "/artisans" }]
      : [{ label: NEVALI_HOUSE_BRAND.navBrandLabel, href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` }]),
    { label: t("nav.ourStory"), href: "/artisan-process" },
    { label: t("nav.shop"), href: "/products" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/25 bg-white text-primary transition-colors hover:bg-primary/10"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          {open ? (
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path d="M3 5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M3 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-ink/15" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-e-0 top-14 z-50 w-[min(88vw,340px)] rounded-sm border border-cream-dark bg-white p-4 shadow-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-sm px-3 py-2 font-sans text-sm ${
                      active ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-cream-dark pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="truncate font-sans text-xs text-text-muted">{name || email}</p>
                  <Link
                    href={dash}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm px-3 py-2 font-sans text-sm text-text-dark hover:bg-cream"
                  >
                    {t("navbarUserMenu.dashboard")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="w-full rounded-sm px-3 py-2 text-start font-sans text-sm text-text-dark hover:bg-cream"
                  >
                    {t("navbarUserMenu.signOut")}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="rounded-sm border border-cream-dark px-3 py-2 text-center font-sans text-sm text-text-dark hover:bg-cream"
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <Link
                    href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/auth/register" : "/auth/register-buyer"}
                    onClick={() => setOpen(false)}
                    className="rounded-sm bg-primary px-3 py-2 text-center font-sans text-sm font-medium text-white"
                  >
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("navbar.signUp") : t("navbar.createAccount")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

