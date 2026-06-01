import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { CartNavLink } from "~/components/cart-nav-link";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavLinks } from "./NavLinks";

export default async function Navbar() {
	const t = await getTranslator();
	const session = await getSession();
	const user = session?.user ?? null;
	const role = (user as { role?: string } | null)?.role;

	return (
		<nav className="fixed inset-s-0 top-0 z-50 w-full border-cream-dark/80 border-b bg-paper/92 backdrop-blur-md">
			<div className="mx-auto flex h-[68px] w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link className="flex shrink-0 items-center" href="/">
					{/* biome-ignore lint/performance/noImgElement: static SVG logo — next/image does not optimize SVG and would only add layout-shift risk */}
					<img
						alt={t("navbar.logoAlt")}
						className="h-9 w-auto"
						src="/assets/logo.svg"
					/>
				</Link>

				<div className="flex min-w-0 flex-1 items-center justify-center">
					<NavLinks />
				</div>

				<div className="ms-auto flex items-center gap-2 sm:gap-3">
					<CartNavLink />
					{user ? (
						<NavbarUserMenu
							email={user.email ?? ""}
							name={user.name ?? ""}
							role={role ?? "partner"}
						/>
					) : (
						<>
							<Link
								className="hidden font-sans text-sm text-text-dark transition-colors hover:text-forest-light sm:inline"
								href="/auth/login"
							>
								{t("navbar.signIn")}
							</Link>
							<Link
								className="hidden rounded-sm border border-primary/45 bg-primary/10 px-4 py-2 font-medium font-sans text-primary text-sm transition-colors hover:bg-primary hover:text-white sm:inline-flex"
								href={
									SHOW_MULTI_PRODUCER_EXPERIENCE
										? "/auth/register"
										: "/auth/register-buyer"
								}
							>
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("navbar.signUp")
									: t("navbar.createAccount")}
							</Link>
						</>
					)}
					<NavbarMobileMenu
						email={user?.email ?? ""}
						isAuthenticated={Boolean(user)}
						name={user?.name ?? ""}
						role={role ?? "partner"}
					/>
				</div>
			</div>
		</nav>
	);
}
