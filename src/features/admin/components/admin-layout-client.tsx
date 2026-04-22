"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "~/components/avatar";
import { signOut } from "~/lib/auth-client";
import { ADMIN_NAV_ITEMS, getPageTitle, getPageSubtitle } from "../config";
import { useAdminNavStats } from "../hooks/use-admin-nav-stats";
import { useAdminOrganizationFilter } from "../hooks/use-admin-organizations";

function IconDashboard({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill={active ? "#D87708" : "none"} stroke={active ? "#D87708" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill={active ? "#D87708" : "none"} stroke={active ? "#D87708" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill={active ? "#D87708" : "none"} stroke={active ? "#D87708" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill={active ? "#D87708" : "none"} stroke={active ? "#D87708" : "rgba(250,250,247,0.4)"} strokeWidth="1.3" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5.5" cy="4.5" r="2.5" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" />
      <path d="M2 13c0-2 1.5-3 3.5-3s3.5 1 3.5 3" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10.5 6c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 13c0-1.2-.6-2.2-1.5-2.7" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
      <rect x="9" y="2" width="5" height="5" rx="1.2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1.2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
      <rect x="9" y="9" width="5" height="5" rx="1.2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 2h2l1 8h9l2-5H4"
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

function IconCertifications() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function IconTraining() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12v7H2V4z" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 4V2a1 1 0 012 0v2M9 4V2a1 1 0 012 0v2" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
      <path d="M4 8h8M4 10h5" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" />
      <path d="M8 10.5v-.5a1.5 1.5 0 10-1.5-1.5" stroke="rgba(250,250,247,0.4)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="6.25" r="0.9" fill="rgba(250,250,247,0.4)" />
    </svg>
  );
}

function IconContracts() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L3 5v4c0 2.8 2 5.1 5 5.9 3-0.8 5-3.1 5-5.9V5L8 2z" stroke="rgba(250,250,247,0.4)" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 13V8M8 13V4M13 13v-5" stroke="rgba(250,250,247,0.45)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M2 14h12" stroke="rgba(250,250,247,0.35)" strokeWidth="1.2" />
    </svg>
  );
}

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  "/admin": (active) => <IconDashboard active={active} />,
  "/admin/analytics": () => <IconAnalytics />,
  "/admin/users": () => <IconUsers />,
  "/admin/products": () => <IconProducts />,
  "/admin/orders": () => <IconOrders />,
  "/admin/certifications": () => <IconCertifications />,
  "/admin/training": () => <IconTraining />,
  "/admin/support": () => <IconSupport />,
  "/admin/contracts": () => <IconContracts />,
};

import type { UserDisplay } from "~/app/api/profile/schemas/profile.schema";

/** @deprecated Use UserDisplay from profile schema. */
export type AdminLayoutUser = UserDisplay;

type Props = {
  user: UserDisplay;
  children: React.ReactNode;
};

function getNavBadge(
  href: string,
  stats:
    | {
        partnersTotal: number;
        productsPending: number;
        certificationsPending: number;
        trainingProgramsTotal: number;
        supportTicketsOpen: number;
      }
    | undefined,
): number | null {
  if (!stats) return null;
  switch (href) {
    case "/admin/users":          return stats.partnersTotal;
    case "/admin/products":       return stats.productsPending;
    case "/admin/certifications": return stats.certificationsPending;
    case "/admin/training":       return stats.trainingProgramsTotal;
    case "/admin/support":        return stats.supportTicketsOpen;
    default:                      return null;
  }
}

const SIDEBAR_GRADIENT = "linear-gradient(180deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)";

export function AdminLayoutClient({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedSlug, selectedOrganizationId } = useAdminOrganizationFilter();
  const { data: navStats } = useAdminNavStats(selectedOrganizationId);
  const subtitle = getPageSubtitle(pathname);
  const title = getPageTitle(pathname);
  const orgQuery = selectedSlug ? `?org=${encodeURIComponent(selectedSlug)}` : "";

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
              <img
                src="/assets/logo-white.svg"
                alt="CraftHouse"
                className="h-8 w-auto block"
              />
              <span className="block uppercase font-sans font-semibold text-xs tracking-[0.1em] text-secondary mt-[3px]">
                Super Admin
              </span>
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-0.5 px-2 pt-3 flex-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            const Icon = ICONS[item.href] ?? (() => <IconDashboard active={false} />);
            const badgeValue = getNavBadge(item.href, navStats);
            const showBadge = badgeValue !== null;
            return (
              <Link
                key={item.href}
                href={item.href + orgQuery}
                onMouseEnter={() => router.prefetch(item.href + orgQuery)}
                className={`flex items-center gap-3 px-3 py-2 w-full transition-colors ${
                  isActive
                    ? "bg-secondary/15 border border-secondary/25"
                    : "bg-transparent border border-transparent"
                }`}
              >
                <span className="shrink-0">{Icon(isActive)}</span>
                <span
                  className={`font-sans text-sm flex-1 leading-none ${
                    isActive ? "text-gold-light font-semibold" : "text-white/60 font-normal"
                  }`}
                >
                  {item.label}
                </span>
                {showBadge && (
                  <span
                    className={`font-sans text-xs font-bold px-2 py-0.5 leading-none ${
                      isActive ? "bg-secondary/30 text-gold-light" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <Avatar
              displayName={user.name}
              imageUrl={user.imageUrl}
              size="sm"
              className="text-white"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-sans text-sm font-semibold text-white leading-tight truncate">
                {user.name}
              </span>
              <span className="font-sans text-xs text-white/40 leading-tight truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="shrink-0 flex items-center justify-between px-6 lg:px-8 py-3.5 border-b border-[#f0e8dc] bg-white z-10">
          <div>
            <h1 className="font-serif font-bold text-xl text-forest-mid leading-tight">{title}</h1>
            <p className="font-sans text-sm text-text-muted mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => signOut()}
              className="font-sans text-sm text-text-muted hover:text-forest-mid transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}



// Seeded superadmin: admin@crafthouse.local (see prisma/seed.ts)
// Password123!