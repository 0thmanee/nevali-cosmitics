import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { LocaleSwitcher } from "~/components/i18n/locale-switcher";
import { CartNavLink } from "~/components/cart-nav-link";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { NavLinks } from "./NavLinks";

export default async function Navbar() {
  const t = await getTranslator();
  const session = await getSession();
  const user = session?.user ?? null;
  const role = (user as { role?: string } | null)?.role;

  return (
    <nav className="fixed inset-s-0 top-0 z-50 w-full border-b border-cream-dark/80 bg-paper/92 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/assets/logo.svg" alt={t("navbar.logoAlt")} className="h-9 w-auto" />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <NavLinks />
        </div>

        <div className="ms-auto flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <CartNavLink />
          {user ? (
            <NavbarUserMenu name={user.name ?? ""} email={user.email ?? ""} role={role ?? "partner"} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden font-sans text-sm text-text-dark transition-colors hover:text-forest-light sm:inline"
              >
                {t("navbar.signIn")}
              </Link>
              <Link
                href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/auth/register" : "/auth/register-buyer"}
                className="hidden rounded-sm border border-primary/45 bg-primary/10 px-4 py-2 font-sans text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:inline-flex"
              >
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("navbar.signUp") : t("navbar.createAccount")}
              </Link>
            </>
          )}
          <NavbarMobileMenu
            isAuthenticated={Boolean(user)}
            role={role ?? "partner"}
            name={user?.name ?? ""}
            email={user?.email ?? ""}
          />
        </div>
      </div>
    </nav>
  );
}
