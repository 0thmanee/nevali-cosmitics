import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { LocaleSwitcher } from "~/components/i18n/locale-switcher";
import { CartNavLink } from "~/components/cart-nav-link";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavLinks } from "./NavLinks";

export default async function Navbar() {
  const t = await getTranslator();
  const session = await getSession();
  const user = session?.user ?? null;
  const role = (user as { role?: string } | null)?.role;

  return (
    <nav className="fixed start-0 top-0 z-50 w-full border-b border-cream-dark/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[56px] w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/assets/logo.svg" alt={t("navbar.logoAlt")} className="h-8 w-auto" />
        </Link>

        <NavLinks />

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <CartNavLink />
          {user ? (
            <NavbarUserMenu name={user.name ?? ""} email={user.email ?? ""} role={role ?? "partner"} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-sans text-sm text-text-dark transition-colors hover:text-forest-light"
              >
                {t("navbar.signIn")}
              </Link>
              <Link
                href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/auth/register" : "/auth/register-buyer"}
                className="rounded-sm border border-primary/50 bg-primary/10 px-4 py-1.5 font-sans text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("navbar.signUp") : t("navbar.createAccount")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
