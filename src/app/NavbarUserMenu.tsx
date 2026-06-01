"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signOut } from "~/lib/auth-client";

type Props = {
	name: string;
	email: string;
	role: string;
};

function profileHref(_role: string): string {
	return "/profile";
}

export function NavbarUserMenu({ name, email, role }: Props) {
	const { t } = useI18n();
	const [menuOpen, setMenuOpen] = useState(false);
	const profile = profileHref(role);

	return (
		<div className="relative flex items-center">
			<button
				className="flex h-10 items-center gap-2 rounded-sm border border-primary/30 bg-white px-3 font-medium font-sans text-primary text-sm transition-colors hover:bg-primary/10"
				onClick={() => setMenuOpen((o) => !o)}
				type="button"
			>
				<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-white text-xs">
					{(name || email || "?").slice(0, 1).toUpperCase()}
				</span>
				<span className="hidden max-w-[88px] truncate xl:inline">
					{name || email}
				</span>
				<svg
					className={menuOpen ? "rotate-180" : ""}
					fill="none"
					height="12"
					viewBox="0 0 12 12"
					width="12"
				>
					<path
						d="M2.5 4.5L6 8l3.5-3.5"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
					/>
				</svg>
			</button>
			{menuOpen && (
				<>
					<div
						aria-hidden
						className="fixed inset-0 z-40"
						onClick={() => setMenuOpen(false)}
					/>
					<div
						className="absolute inset-e-0 top-full z-50 mt-2 w-48 rounded-sm border border-cream-dark bg-white py-2 shadow-lg"
						role="menu"
					>
						<div className="border-cream-dark border-b px-4 py-2">
							<p className="truncate font-sans font-semibold text-sm text-text-dark">
								{name || t("navbarUserMenu.accountFallback")}
							</p>
							<p className="truncate font-sans text-text-muted text-xs">
								{email}
							</p>
						</div>
						<Link
							className="block px-4 py-2 font-sans text-sm text-text-dark transition-colors hover:bg-cream"
							href={profile}
							onClick={() => setMenuOpen(false)}
						>
							{t("navbarUserMenu.profile")}
						</Link>
						<button
							className="w-full px-4 py-2 text-start font-sans text-sm text-text-dark transition-colors hover:bg-cream"
							onClick={() => {
								signOut();
								setMenuOpen(false);
							}}
							type="button"
						>
							{t("navbarUserMenu.signOut")}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
