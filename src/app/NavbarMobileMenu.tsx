"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { signOut } from "~/lib/auth-client";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import {
	PLATFORM_OWNED_ORG_SLUG,
	SHOW_MULTI_PRODUCER_EXPERIENCE,
} from "~/lib/platform-producer-mode";

function profileHref(_role: string): string {
	return "/profile";
}

type Props = {
	isAuthenticated: boolean;
	role: string;
	name: string;
	email: string;
};

export function NavbarMobileMenu({
	isAuthenticated,
	role,
	name,
	email,
}: Props) {
	const { t } = useI18n();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const profile = profileHref(role);

	const navLinks = [
		...(SHOW_MULTI_PRODUCER_EXPERIENCE
			? [{ label: t("nav.brands"), href: "/artisans" }]
			: [
					{
						label: NEVALI_HOUSE_BRAND.navBrandLabel,
						href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}`,
					},
				]),
		{ label: t("nav.ourStory"), href: "/artisan-process" },
		{ label: t("nav.shop"), href: "/products" },
		{ label: t("nav.contact"), href: "/contact" },
	];

	return (
		<div className="lg:hidden">
			<button
				aria-expanded={open}
				aria-label={t("navbarMobile.toggleMenuAria")}
				className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/25 bg-white text-primary transition-colors hover:bg-primary/10"
				onClick={() => setOpen((v) => !v)}
				type="button"
			>
				<svg aria-hidden fill="none" height="18" viewBox="0 0 18 18" width="18">
					{open ? (
						<path
							d="M4 4l10 10M14 4L4 14"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="1.6"
						/>
					) : (
						<>
							<path
								d="M3 5h12"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="1.6"
							/>
							<path
								d="M3 9h12"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="1.6"
							/>
							<path
								d="M3 13h12"
								stroke="currentColor"
								strokeLinecap="round"
								strokeWidth="1.6"
							/>
						</>
					)}
				</svg>
			</button>

			{open ? (
				<>
					<div
						aria-hidden
						className="fixed inset-0 z-40 bg-ink/15"
						onClick={() => setOpen(false)}
					/>
					<div className="absolute inset-e-0 top-14 z-50 w-[min(88vw,340px)] rounded-sm border border-cream-dark bg-white p-4 shadow-xl">
						<div className="flex flex-col gap-1">
							{navLinks.map((item) => {
								const active = pathname.startsWith(item.href);
								return (
									<Link
										className={`rounded-sm px-3 py-2 font-sans text-sm ${
											active
												? "bg-primary/10 text-primary"
												: "text-text-dark hover:bg-cream"
										}`}
										href={item.href}
										key={item.href}
										onClick={() => setOpen(false)}
									>
										{item.label}
									</Link>
								);
							})}
						</div>

						<div className="mt-4 border-cream-dark border-t pt-3">
							{isAuthenticated ? (
								<div className="space-y-2">
									<p className="truncate font-sans text-text-muted text-xs">
										{name || email}
									</p>
									<Link
										className="block rounded-sm px-3 py-2 font-sans text-sm text-text-dark hover:bg-cream"
										href={profile}
										onClick={() => setOpen(false)}
									>
										{t("navbarUserMenu.profile")}
									</Link>
									<button
										className="w-full rounded-sm px-3 py-2 text-start font-sans text-sm text-text-dark hover:bg-cream"
										onClick={() => {
											signOut();
											setOpen(false);
										}}
										type="button"
									>
										{t("navbarUserMenu.signOut")}
									</button>
								</div>
							) : (
								<div className="grid grid-cols-2 gap-2">
									<Link
										className="rounded-sm border border-cream-dark px-3 py-2 text-center font-sans text-sm text-text-dark hover:bg-cream"
										href="/auth/login"
										onClick={() => setOpen(false)}
									>
										{t("navbar.signIn")}
									</Link>
									<Link
										className="rounded-sm bg-primary px-3 py-2 text-center font-medium font-sans text-sm text-white"
										href={
											SHOW_MULTI_PRODUCER_EXPERIENCE
												? "/auth/register"
												: "/auth/register-buyer"
										}
										onClick={() => setOpen(false)}
									>
										{SHOW_MULTI_PRODUCER_EXPERIENCE
											? t("navbar.signUp")
											: t("navbar.createAccount")}
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
