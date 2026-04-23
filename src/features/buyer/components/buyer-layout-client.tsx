"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { Avatar } from "~/components/avatar";
import { useUnreadNotificationCount } from "~/features/notifications/use-unread-notification-count";
import { signOut } from "~/lib/auth-client";
import {
	BUYER_NAV_ITEMS,
	BUYER_PAGE_SUBTITLE,
	getBuyerPageTitle,
} from "../config";

type UserDisplay = { name: string; email: string };

type Props = {
	user: UserDisplay;
	children: React.ReactNode;
};

const SIDEBAR_GRADIENT =
	"linear-gradient(in oklab 180deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)";

export function BuyerLayoutClient({ user, children }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: unreadAlerts = 0 } = useUnreadNotificationCount();
	const subtitle =
		BUYER_PAGE_SUBTITLE[pathname] ?? BUYER_PAGE_SUBTITLE["/buyer"];
	const title = getBuyerPageTitle(pathname);
	const displayName = user.name?.trim() || user.email;

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
								className="block h-4 w-auto"
								src="/assets/logo-white.svg"
							/>
							<span className="mt-[3px] block font-sans font-semibold text-[var(--color-gold)] text-[9px] uppercase tracking-[0.1em]">
								Buyer
							</span>
						</div>
					</div>
				</Link>

				<nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pt-3">
					{BUYER_NAV_ITEMS.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/buyer" && pathname.startsWith(`${item.href}/`));
						const badge =
							item.href === "/buyer/notifications" ? unreadAlerts : null;
						const showBadge = badge !== null && badge > 0;
						return (
							<Link
								className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 transition-colors ${
									isActive
										? "border border-[var(--color-text-muted)]/25 bg-[var(--color-text-muted)]/15"
										: "border border-transparent bg-transparent"
								}`}
								href={item.href}
								key={item.href}
								onMouseEnter={() => router.prefetch(item.href)}
							>
								<span
									className={`flex-1 font-sans text-sm leading-none ${
										isActive
											? "font-semibold text-[var(--color-gold)]"
											: "font-normal text-white/60"
									}`}
								>
									{item.label}
								</span>
								{showBadge ? (
									<span
										className={`rounded-full px-2 py-0.5 font-bold font-sans text-[10px] leading-none ${
											isActive
												? "bg-[var(--color-gold)]/30 text-[var(--color-gold)]"
												: "bg-white/10 text-white/50"
										}`}
									>
										{badge}
									</span>
								) : null}
							</Link>
						);
					})}
				</nav>

				<div className="shrink-0 border-white/[0.08] border-t px-4 py-4">
					<div className="flex items-center gap-3">
						<Avatar
							className="text-white"
							displayName={displayName}
							imageUrl={null}
							size="sm"
						/>
						<div className="flex min-w-0 flex-col gap-0.5">
							<span className="truncate font-sans font-semibold text-sm text-white leading-tight">
								{displayName}
							</span>
							<span className="truncate font-sans text-[11px] text-white/40 leading-tight">
								{user.email}
							</span>
						</div>
					</div>
				</div>
			</aside>

			<div className="flex h-screen min-w-0 flex-1 flex-col">
				<header className="z-10 flex shrink-0 items-center justify-between border-cream-dark border-b bg-white px-6 py-3.5 lg:px-8">
					<div>
						<h1 className="font-bold font-serif text-[18px] text-forest-mid leading-tight">
							{title}
						</h1>
						<p className="mt-0.5 font-sans text-sm text-text-muted">
							{subtitle}
						</p>
					</div>
					<button
						className="cursor-pointer font-sans text-sm text-text-muted transition-colors hover:text-forest-mid"
						onClick={() => signOut()}
						type="button"
					>
						Log out
					</button>
				</header>

				<main className="flex-1 overflow-y-auto">
					<div className="px-6 pt-6 pb-8 lg:px-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
