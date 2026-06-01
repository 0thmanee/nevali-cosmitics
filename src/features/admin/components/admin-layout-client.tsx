"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { Avatar } from "~/components/avatar";
import { signOut } from "~/lib/auth-client";
import { ADMIN_NAV_ITEMS, getPageSubtitle, getPageTitle } from "../config";
import { useAdminNavStats } from "../hooks/use-admin-nav-stats";
import { useAdminOrganizationFilter } from "../hooks/use-admin-organizations";

function IconDashboard({ active }: { active?: boolean }) {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<rect
				fill={active ? "var(--color-text-muted)" : "none"}
				height="5.5"
				rx="1.5"
				stroke={
					active
						? "var(--color-text-muted)"
						: "color-mix(in srgb, var(--color-paper) 40%, transparent)"
				}
				strokeWidth="1.3"
				width="5.5"
				x="1.5"
				y="1.5"
			/>
			<rect
				fill={active ? "var(--color-text-muted)" : "none"}
				height="5.5"
				rx="1.5"
				stroke={
					active
						? "var(--color-text-muted)"
						: "color-mix(in srgb, var(--color-paper) 40%, transparent)"
				}
				strokeWidth="1.3"
				width="5.5"
				x="9"
				y="1.5"
			/>
			<rect
				fill={active ? "var(--color-text-muted)" : "none"}
				height="5.5"
				rx="1.5"
				stroke={
					active
						? "var(--color-text-muted)"
						: "color-mix(in srgb, var(--color-paper) 40%, transparent)"
				}
				strokeWidth="1.3"
				width="5.5"
				x="1.5"
				y="9"
			/>
			<rect
				fill={active ? "var(--color-text-muted)" : "none"}
				height="5.5"
				rx="1.5"
				stroke={
					active
						? "var(--color-text-muted)"
						: "color-mix(in srgb, var(--color-paper) 40%, transparent)"
				}
				strokeWidth="1.3"
				width="5.5"
				x="9"
				y="9"
			/>
		</svg>
	);
}

function IconUsers() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<circle
				cx="5.5"
				cy="4.5"
				r="2.5"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.3"
			/>
			<path
				d="M2 13c0-2 1.5-3 3.5-3s3.5 1 3.5 3"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.3"
			/>
			<path
				d="M10.5 6c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.3"
			/>
			<path
				d="M14 13c0-1.2-.6-2.2-1.5-2.7"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.3"
			/>
		</svg>
	);
}

function IconProducts() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<rect
				height="5"
				rx="1.2"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
				width="5"
				x="2"
				y="2"
			/>
			<rect
				height="5"
				rx="1.2"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
				width="5"
				x="9"
				y="2"
			/>
			<rect
				height="5"
				rx="1.2"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
				width="5"
				x="2"
				y="9"
			/>
			<rect
				height="5"
				rx="1.2"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
				width="5"
				x="9"
				y="9"
			/>
		</svg>
	);
}

function IconOrders() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M1 2h2l1 8h9l2-5H4"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.3"
			/>
			<circle
				cx="6.5"
				cy="13.5"
				fill="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				r="1"
			/>
			<circle
				cx="12"
				cy="13.5"
				fill="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				r="1"
			/>
		</svg>
	);
}

function IconCertifications() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinejoin="round"
				strokeWidth="1.3"
			/>
		</svg>
	);
}

function IconTraining() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M2 4h12v7H2V4z"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
			<path
				d="M5 4V2a1 1 0 012 0v2M9 4V2a1 1 0 012 0v2"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
			/>
			<path
				d="M4 8h8M4 10h5"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.2"
			/>
		</svg>
	);
}

function IconSupport() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M8 14A6 6 0 108 2a6 6 0 000 12z"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeWidth="1.2"
			/>
			<path
				d="M8 10.5v-.5a1.5 1.5 0 10-1.5-1.5"
				stroke="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.2"
			/>
			<circle
				cx="8"
				cy="6.25"
				fill="color-mix(in srgb, var(--color-paper) 40%, transparent)"
				r="0.9"
			/>
		</svg>
	);
}

function IconAnalytics() {
	return (
		<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
			<path
				d="M3 13V8M8 13V4M13 13v-5"
				stroke="color-mix(in srgb, var(--color-paper) 45%, transparent)"
				strokeLinecap="round"
				strokeWidth="1.3"
			/>
			<path
				d="M2 14h12"
				stroke="color-mix(in srgb, var(--color-paper) 35%, transparent)"
				strokeWidth="1.2"
			/>
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
		case "/admin/users":
			return stats.partnersTotal;
		case "/admin/products":
			return stats.productsPending;
		case "/admin/certifications":
			return stats.certificationsPending;
		case "/admin/training":
			return stats.trainingProgramsTotal;
		case "/admin/support":
			return stats.supportTicketsOpen;
		default:
			return null;
	}
}

const SIDEBAR_GRADIENT =
	"linear-gradient(180deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)";

export function AdminLayoutClient({ user, children }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { selectedSlug, selectedOrganizationId } = useAdminOrganizationFilter();
	const { data: navStats } = useAdminNavStats(selectedOrganizationId);
	const subtitle = getPageSubtitle(pathname);
	const title = getPageTitle(pathname);
	const orgQuery = selectedSlug
		? `?org=${encodeURIComponent(selectedSlug)}`
		: "";

	return (
		<div className="flex h-screen overflow-hidden bg-cream">
			<aside
				className="hidden h-screen w-[248px] shrink-0 flex-col lg:flex"
				style={{ background: SIDEBAR_GRADIENT }}
			>
				<Link
					className="block shrink-0 border-white/[0.08] border-b px-5 pt-6 pb-5 transition-opacity hover:opacity-90"
					href="/"
				>
					<div className="flex items-center gap-2.5">
						<div>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								alt="nevali"
								className="block h-8 w-auto"
								src="/assets/logo-white.svg"
							/>
							<span className="mt-[3px] block font-sans font-semibold text-secondary text-xs uppercase tracking-[0.1em]">
								Super Admin
							</span>
						</div>
					</div>
				</Link>

				<nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pt-3">
					{ADMIN_NAV_ITEMS.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/admin" && pathname.startsWith(item.href + "/"));
						const Icon =
							ICONS[item.href] ?? (() => <IconDashboard active={false} />);
						const badgeValue = getNavBadge(item.href, navStats);
						const showBadge = badgeValue !== null;
						return (
							<Link
								className={`flex w-full items-center gap-3 px-3 py-2 transition-colors ${
									isActive
										? "border border-secondary/25 bg-secondary/15"
										: "border border-transparent bg-transparent"
								}`}
								href={item.href + orgQuery}
								key={item.href}
								onMouseEnter={() => router.prefetch(item.href + orgQuery)}
							>
								<span className="shrink-0">{Icon(isActive)}</span>
								<span
									className={`flex-1 font-sans text-sm leading-none ${
										isActive
											? "font-semibold text-gold-light"
											: "font-normal text-white/60"
									}`}
								>
									{item.label}
								</span>
								{showBadge && (
									<span
										className={`px-2 py-0.5 font-bold font-sans text-xs leading-none ${
											isActive
												? "bg-secondary/30 text-gold-light"
												: "bg-white/10 text-white/50"
										}`}
									>
										{badgeValue}
									</span>
								)}
							</Link>
						);
					})}
				</nav>

				<div className="shrink-0 border-white/[0.08] border-t px-4 py-4">
					<div className="flex items-center gap-3">
						<Avatar
							className="text-white"
							displayName={user.name}
							imageUrl={user.imageUrl}
							size="sm"
						/>
						<div className="flex min-w-0 flex-col gap-0.5">
							<span className="truncate font-sans font-semibold text-sm text-white leading-tight">
								{user.name}
							</span>
							<span className="truncate font-sans text-white/40 text-xs leading-tight">
								{user.email}
							</span>
						</div>
					</div>
				</div>
			</aside>

			<div className="flex h-screen min-w-0 flex-1 flex-col">
				<header className="z-10 flex shrink-0 items-center justify-between border-cream-dark border-b bg-white px-6 py-3.5 lg:px-8">
					<div>
						<h1 className="font-bold font-serif text-forest-mid text-xl leading-tight">
							{title}
						</h1>
						<p className="mt-0.5 font-sans text-sm text-text-muted">
							{subtitle}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							className="cursor-pointer font-sans text-sm text-text-muted transition-colors hover:text-forest-mid"
							onClick={() => signOut()}
							type="button"
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

// Seeded superadmin: admin@nevali-cosmetics.local (see prisma/seed.ts)
// Password123!
