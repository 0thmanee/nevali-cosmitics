"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "~/components/avatar";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signOut } from "~/lib/auth-client";
import { useUnreadNotificationCount } from "~/features/notifications/use-unread-notification-count";
import { PRODUCER_NAV_ITEMS, getPageSubtitle, getPageTitle } from "../config";
import { useArtisanDashboardStats } from "../hooks/use-dashboard-stats";
import type { UserDisplay, LayoutProfile } from "~/app/api/profile/schemas/profile.schema";
import { interpolate } from "~/lib/i18n/interpolate";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconDashboard({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <rect
        x="1.5"
        y="1.5"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <rect
        x="9"
        y="1.5"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <rect
        x="1.5"
        y="9"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <rect
        x="9"
        y="9"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <line x1="3" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconJournal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <path
        d="M4.5 2.5h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7A1.5 1.5 0 0 1 3 13V4a1.5 1.5 0 0 1 1.5-1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="6" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="10.5" x2="8.5" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <path
        d="M1 1h2l1 8h9l2-5H4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="13.5" r="1" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconCertification() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <path
        d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTraining() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <line x1="3" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 7l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 6a2 2 0 0 1 4 0c0 1.5-2 1.5-2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

function IconNotifications() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-current">
      <path
        d="M8 2a4 4 0 0 0-4 4v2.5L3 13h10l-1-4.5V6a4 4 0 0 0-4-4z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 13a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  "/artisan": (active) => <IconDashboard active={active} />,
  "/artisan/profile": () => <IconProfile />,
  "/artisan/products": () => <IconProducts />,
  "/artisan/articles": () => <IconJournal />,
  "/artisan/orders": () => <IconOrders />,
  "/artisan/certification": () => <IconCertification />,
  "/artisan/training": () => <IconTraining />,
  "/artisan/support": () => <IconSupport />,
  "/artisan/notifications": () => <IconNotifications />,
};

/** @deprecated Use UserDisplay from profile schema. */
export type ProducerLayoutUser = UserDisplay;
/** @deprecated Use LayoutProfile from profile schema. */
export type ProducerLayoutProfile = LayoutProfile;

type Props = {
  user: UserDisplay;
  profile: LayoutProfile;
  children: React.ReactNode;
};

export function ProducerLayoutClient({ user, profile, children }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { data: dashboardStats } = useArtisanDashboardStats();
  const { data: unreadAlerts = 0 } = useUnreadNotificationCount();

  const openSupportTickets = dashboardStats?.openSupportTickets ?? 0;
  const subtitle = t(getPageSubtitle(pathname));
  const firstName = profile?.firstName ?? user.name.split(/\s+/)[0] ?? null;
  const titleData = getPageTitle(pathname, firstName);
  const title = titleData.firstName
    ? interpolate(t(titleData.key), { firstName: titleData.firstName })
    : t(titleData.key);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim() || user.name
    : user.name;
  const shortName = profile?.firstName?.trim() || displayName || user.email;
  const entityLabel = profile?.entityName?.trim() || user.email;
  return (
    <div className="h-screen flex overflow-hidden bg-cream">
      <aside className="hidden h-screen w-[248px] shrink-0 flex-col border-r border-cream-dark bg-linear-to-b from-cream via-cream-dark/45 to-primary-light/35 lg:flex">
        <Link
          href="/"
          className="shrink-0 px-5 pb-5 pt-6 transition-opacity hover:opacity-90"
        >
          <div className="flex items-center gap-2.5">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.svg" alt="nevali" className="block h-8 w-auto" />
              <span className="mt-[3px] block font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-primary/70">
                {t("artisanLayout.brandPortal")}
              </span>
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-0.5 px-2 pt-3 flex-1 overflow-y-auto">
          {PRODUCER_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/artisan" && pathname.startsWith(item.href + "/"));
            const Icon = ICONS[item.href] ?? (() => <IconDashboard active={false} />);
            const badge =
              item.href === "/artisan/support"
                ? openSupportTickets
                : item.href === "/artisan/notifications"
                  ? unreadAlerts
                  : null;
            const showBadge = badge !== null && badge > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => router.prefetch(item.href)}
                className={`flex w-full items-center gap-3 rounded-sm border px-3 py-2 transition-colors ${
                  isActive
                    ? "border-primary/35 bg-white/70 text-primary-dark"
                    : "border-transparent bg-transparent text-primary/70 hover:bg-white/55 hover:text-primary-dark"
                }`}
              >
                <span className={`shrink-0 ${isActive ? "text-primary-dark" : "text-primary/60"}`}>
                  {Icon(isActive)}
                </span>
                <span
                  className={`flex-1 font-sans text-sm leading-none ${
                    isActive ? "font-semibold text-primary-dark" : "font-normal"
                  }`}
                >
                  {t(item.labelKey)}
                </span>
                {showBadge && (
                  <span
                    className={`rounded-full border px-2 py-0.5 font-sans text-[10px] font-bold leading-none ${
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary-dark"
                        : "border-primary/20 bg-white/60 text-primary/80"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-primary/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar
              displayName={displayName}
              imageUrl={profile?.profileImage}
              size="sm"
              className="text-primary-dark"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-sans text-sm font-semibold text-primary-dark leading-tight truncate">{shortName}</span>
              <span className="font-sans text-[11px] text-primary/70 leading-tight truncate">{entityLabel}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="z-10 flex shrink-0 items-center justify-between border-b border-cream-dark bg-paper px-6 py-3.5 lg:px-8">
          <div>
            <h1 className="font-serif text-[18px] font-bold leading-tight text-text-dark">{title}</h1>
            <p className="mt-0.5 font-sans text-sm text-text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="cursor-pointer font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
          >
            {t("artisanLayout.logOut")}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-cream">
          <div className="px-6 pb-8 pt-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
