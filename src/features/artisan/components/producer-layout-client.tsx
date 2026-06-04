"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import type {
	LayoutProfile,
	UserDisplay,
} from "~/app/api/profile/schemas/profile.schema";
import { Avatar } from "~/components/avatar";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useUnreadNotificationCount } from "~/features/notifications/use-unread-notification-count";
import { signOut } from "~/lib/auth-client";
import { interpolate } from "~/lib/i18n/interpolate";
import { getPageSubtitle, getPageTitle, PRODUCER_NAV_ITEMS } from "../config";
import { useArtisanDashboardStats } from "../hooks/use-dashboard-stats";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconDashboard({ active }: { active?: boolean }) {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<rect
				fill={active ? "currentColor" : "none"}
				fillOpacity={active ? 0.12 : 0}
				height="5.5"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.2"
				width="5.5"
				x="1.5"
				y="1.5"
			/>
			<rect
				fill={active ? "currentColor" : "none"}
				fillOpacity={active ? 0.12 : 0}
				height="5.5"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.2"
				width="5.5"
				x="9"
				y="1.5"
			/>
			<rect
				fill={active ? "currentColor" : "none"}
				fillOpacity={active ? 0.12 : 0}
				height="5.5"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.2"
				width="5.5"
				x="1.5"
				y="9"
			/>
			<rect
				fill={active ? "currentColor" : "none"}
				fillOpacity={active ? 0.12 : 0}
				height="5.5"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.2"
				width="5.5"
				x="9"
				y="9"
			/>
		</svg>
	);
}

function IconProfile() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="13"
				y1="4"
				y2="4"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="13"
				y1="8"
				y2="8"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="10"
				y1="12"
				y2="12"
			/>
		</svg>
	);
}

function IconProducts() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<rect
				height="12"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.2"
				width="12"
				x="2"
				y="2"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="5"
				x2="11"
				y1="6"
				y2="6"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="5"
				x2="9"
				y1="9"
				y2="9"
			/>
		</svg>
	);
}

function IconJournal() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<path
				d="M4.5 2.5h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7A1.5 1.5 0 0 1 3 13V4a1.5 1.5 0 0 1 1.5-1.5z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="6"
				x2="10"
				y1="5.5"
				y2="5.5"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="6"
				x2="10"
				y1="8"
				y2="8"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="6"
				x2="8.5"
				y1="10.5"
				y2="10.5"
			/>
		</svg>
	);
}

function IconOrders() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<path
				d="M1 1h2l1 8h9l2-5H4"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
			<circle cx="6.5" cy="13.5" fill="currentColor" r="1" />
			<circle cx="12" cy="13.5" fill="currentColor" r="1" />
		</svg>
	);
}

function IconCertification() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<path
				d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
		</svg>
	);
}

function IconTraining() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="9"
				y1="5"
				y2="5"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="9"
				y1="8"
				y2="8"
			/>
			<line
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
				x1="3"
				x2="7"
				y1="11"
				y2="11"
			/>
			<path
				d="M11 7l2 2-2 2"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
		</svg>
	);
}

function IconSupport() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
			<path
				d="M6 6a2 2 0 0 1 4 0c0 1.5-2 1.5-2 3"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
			/>
			<circle cx="8" cy="12" fill="currentColor" r="0.6" />
		</svg>
	);
}

function IconNotifications() {
	return (
		<svg
			className="text-current"
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
		>
			<path
				d="M8 2a4 4 0 0 0-4 4v2.5L3 13h10l-1-4.5V6a4 4 0 0 0-4-4z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.2"
			/>
			<path
				d="M6 13a2 2 0 0 0 4 0"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.2"
			/>
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

	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	// Close the mobile drawer whenever the route changes.
	useEffect(() => {
		setMobileNavOpen(false);
	}, [pathname]);

	// Shared nav list — used by both the desktop sidebar and the mobile drawer.
	const renderNavLinks = (onNavigate?: () => void) =>
		PRODUCER_NAV_ITEMS.map((item) => {
			const isActive =
				pathname === item.href ||
				(item.href !== "/artisan" && pathname.startsWith(`${item.href}/`));
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
					className={`flex w-full items-center gap-3 rounded-sm border px-3 py-2 transition-colors ${
						isActive
							? "border-primary/35 bg-white/70 text-primary-dark"
							: "border-transparent bg-transparent text-primary/70 hover:bg-white/55 hover:text-primary-dark"
					}`}
					href={item.href}
					key={item.href}
					onClick={onNavigate}
					onMouseEnter={() => router.prefetch(item.href)}
				>
					<span
						className={`shrink-0 ${isActive ? "text-primary-dark" : "text-primary/60"}`}
					>
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
							className={`rounded-full border px-2 py-0.5 font-bold font-sans text-[10px] leading-none ${
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
		});

	return (
		<div className="flex h-screen overflow-hidden bg-cream">
			<aside className="hidden h-screen w-[248px] shrink-0 flex-col border-cream-dark border-r bg-linear-to-b from-cream via-cream-dark/45 to-primary-light/35 lg:flex">
				<Link
					className="shrink-0 px-5 pt-6 pb-5 transition-opacity hover:opacity-90"
					href="/"
				>
					<div className="flex items-center gap-2.5">
						<div>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								alt="nevali"
								className="block h-8 w-auto"
								src="/assets/logo.svg"
							/>
							<span className="mt-[3px] block font-sans font-semibold text-[9px] text-primary/70 uppercase tracking-[0.14em]">
								{t("artisanLayout.brandPortal")}
							</span>
						</div>
					</div>
				</Link>

				<nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pt-3">
					{renderNavLinks()}
				</nav>

				<div className="shrink-0 border-primary/20 border-t px-4 py-4">
					<div className="flex items-center gap-3">
						<Avatar
							className="text-primary-dark"
							displayName={displayName}
							imageUrl={profile?.profileImage}
							size="sm"
						/>
						<div className="flex min-w-0 flex-col gap-0.5">
							<span className="truncate font-sans font-semibold text-primary-dark text-sm leading-tight">
								{shortName}
							</span>
							<span className="truncate font-sans text-[11px] text-primary/70 leading-tight">
								{entityLabel}
							</span>
						</div>
					</div>
				</div>
			</aside>

			<div className="flex h-screen min-w-0 flex-1 flex-col">
				<header className="z-10 flex shrink-0 items-center justify-between gap-3 border-cream-dark border-b bg-paper px-4 py-3.5 sm:px-6 lg:px-8">
					<div className="flex min-w-0 items-center gap-3">
						<button
							aria-label={t("artisanLayout.openMenu")}
							className="-ms-1 shrink-0 rounded-sm p-2 text-text-muted transition-colors hover:bg-cream hover:text-text-dark lg:hidden"
							onClick={() => setMobileNavOpen(true)}
							type="button"
						>
							<svg
								fill="none"
								height="20"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="1.6"
								viewBox="0 0 20 20"
								width="20"
							>
								<path d="M3 5h14M3 10h14M3 15h14" />
							</svg>
						</button>
						<div className="min-w-0">
							<h1 className="truncate font-bold font-serif text-[18px] text-text-dark leading-tight">
								{title}
							</h1>
							<p className="mt-0.5 hidden font-sans text-sm text-text-muted sm:block">
								{subtitle}
							</p>
						</div>
					</div>
					<button
						className="shrink-0 cursor-pointer font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						onClick={() => signOut()}
						type="button"
					>
						{t("artisanLayout.logOut")}
					</button>
				</header>

				<main className="flex-1 overflow-y-auto bg-cream">
					<div className="px-6 pt-6 pb-8 lg:px-8">{children}</div>
				</main>
			</div>

			{/* Mobile navigation drawer (hidden on desktop). */}
			{mobileNavOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<button
						aria-label={t("artisanLayout.closeMenu")}
						className="absolute inset-0 bg-ink/30"
						onClick={() => setMobileNavOpen(false)}
						type="button"
					/>
					<aside className="absolute inset-y-0 start-0 flex w-[280px] max-w-[85vw] flex-col bg-linear-to-b from-cream via-cream-dark/45 to-primary-light/35 shadow-xl">
						<div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-4">
							<Link
								className="transition-opacity hover:opacity-90"
								href="/"
								onClick={() => setMobileNavOpen(false)}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									alt="nevali"
									className="block h-8 w-auto"
									src="/assets/logo.svg"
								/>
							</Link>
							<button
								aria-label={t("artisanLayout.closeMenu")}
								className="rounded-sm p-2 text-primary/70 transition-colors hover:bg-white/55 hover:text-primary-dark"
								onClick={() => setMobileNavOpen(false)}
								type="button"
							>
								<svg
									fill="none"
									height="18"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth="1.6"
									viewBox="0 0 18 18"
									width="18"
								>
									<path d="M4 4l10 10M14 4L4 14" />
								</svg>
							</button>
						</div>
						<nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pt-1">
							{renderNavLinks(() => setMobileNavOpen(false))}
						</nav>
						<div className="shrink-0 border-primary/20 border-t px-4 py-4">
							<div className="flex items-center gap-3">
								<Avatar
									className="text-primary-dark"
									displayName={displayName}
									imageUrl={profile?.profileImage}
									size="sm"
								/>
								<div className="flex min-w-0 flex-col gap-0.5">
									<span className="truncate font-sans font-semibold text-primary-dark text-sm leading-tight">
										{shortName}
									</span>
									<span className="truncate font-sans text-[11px] text-primary/70 leading-tight">
										{entityLabel}
									</span>
								</div>
							</div>
						</div>
					</aside>
				</div>
			)}
		</div>
	);
}
