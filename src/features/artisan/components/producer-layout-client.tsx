"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "~/components/avatar";
import { signOut } from "~/lib/auth-client";
import { useUnreadNotificationCount } from "~/features/notifications/use-unread-notification-count";
import { PRODUCER_NAV_ITEMS, PAGE_SUBTITLE, getPageTitle } from "../config";
import { useArtisanDashboardStats } from "../hooks/use-dashboard-stats";
import type { UserDisplay, LayoutProfile } from "~/app/api/profile/schemas/profile.schema";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconDashboard({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill={active ? "#C9913D" : "none"} stroke={active ? "#C9913D" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill={active ? "#C9913D" : "none"} stroke={active ? "#C9913D" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill={active ? "#C9913D" : "none"} stroke={active ? "#C9913D" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill={active ? "#C9913D" : "none"} stroke={active ? "#C9913D" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="4" x2="13" y2="4" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="3" y1="8" x2="13" y2="8" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="3" y1="12" x2="10" y2="12" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" />
      <line x1="5" y1="6" x2="11" y2="6" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="5" y1="9" x2="9" y2="9" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 1h2l1 8h9l2-5H4"
        stroke="rgba(250,250,247,0.4)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="13.5" r="1" fill="rgba(250,250,247,0.4)" />
      <circle cx="12" cy="13.5" r="1" fill="rgba(250,250,247,0.4)" />
    </svg>
  );
}

function IconCertification() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function IconTraining() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="5" x2="9" y2="5" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="3" y1="8" x2="9" y2="8" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="3" y1="11" x2="7" y2="11" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 7l2 2-2 2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" />
      <path d="M6 6a2 2 0 0 1 4 0c0 1.5-2 1.5-2 3" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="12" r="0.6" fill="rgba(250,250,247,0.4)" />
    </svg>
  );
}

function IconNotifications() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2a4 4 0 0 0-4 4v2.5L3 13h10l-1-4.5V6a4 4 0 0 0-4-4z"
        stroke="rgba(250,250,247,0.4)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6 13a2 2 0 0 0 4 0" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  "/artisan": (active) => <IconDashboard active={active} />,
  "/artisan/profile": () => <IconProfile />,
  "/artisan/products": () => <IconProducts />,
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

const SIDEBAR_GRADIENT = "linear-gradient(in oklab 180deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)";

export function ProducerLayoutClient({ user, profile, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: dashboardStats } = useArtisanDashboardStats();
  const { data: unreadAlerts = 0 } = useUnreadNotificationCount();

  const openSupportTickets = dashboardStats?.openSupportTickets ?? 0;
  const subtitle = PAGE_SUBTITLE[pathname] ?? PAGE_SUBTITLE["/artisan"];
  const firstName = profile?.firstName ?? user.name.split(/\s+/)[0] ?? null;
  const title = getPageTitle(pathname, firstName);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim() || user.name
    : user.name;
  const shortName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}.`
      : user.name.split(/\s+/)[0] ?? user.name;
  const entityLabel = profile?.entityName ?? user.email;

  return (
    <div className="h-screen flex overflow-hidden bg-cream">
      <aside
        className="hidden lg:flex flex-col w-[248px] shrink-0 h-screen"
        style={{ background: SIDEBAR_GRADIENT }}
      >
        <Link
          href="/"
          className="px-5 pt-6 pb-5 border-b border-white/[0.08] shrink-0 block hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-2.5">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-white.svg" alt="nevali" className="h-8 w-auto block" />
              <span className="block uppercase font-sans font-semibold text-[9px] tracking-[0.1em] text-[#C9913D] mt-[3px]">
                Brand portal
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
                className={`flex items-center gap-3 rounded-sm px-3 py-2 w-full transition-colors ${
                  isActive
                    ? "bg-[#727272]/15 border border-[#727272]/25"
                    : "bg-transparent border border-transparent"
                }`}
              >
                <span className="shrink-0">{Icon(isActive)}</span>
                <span
                  className={`font-sans text-sm flex-1 leading-none ${
                    isActive ? "text-[#E8B84B] font-semibold" : "text-white/60 font-normal"
                  }`}
                >
                  {item.label}
                </span>
                {showBadge && (
                  <span
                    className={`font-sans text-[10px] font-bold rounded-full px-2 py-0.5 leading-none ${
                      isActive ? "bg-[#C9913D]/30 text-[#E8B84B]" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <Avatar
              displayName={displayName}
              imageUrl={profile?.profileImage}
              size="sm"
              className="text-white"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-sans text-sm font-semibold text-white leading-tight truncate">{shortName}</span>
              <span className="font-sans text-[11px] text-white/40 leading-tight truncate">{entityLabel}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="shrink-0 flex items-center justify-between px-6 lg:px-8 py-3.5 border-b border-[#d8d0c4] bg-white z-10">
          <div>
            <h1 className="font-serif font-bold text-[18px] text-forest-mid leading-tight">{title}</h1>
            <p className="font-sans text-sm text-text-muted mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="font-sans text-sm text-text-muted hover:text-forest-mid transition-colors cursor-pointer"
          >
            Log out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-8 pt-6 pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
