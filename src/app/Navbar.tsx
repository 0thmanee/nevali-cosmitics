import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { CartNavLink } from "~/components/cart-nav-link";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { NavLinks } from "./NavLinks";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user ?? null;
  const role = (user as { role?: string } | null)?.role;

  return (
    <nav className="w-full bg-cream border-b border-cream-dark fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-6 h-[56px] flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/assets/logo.svg" alt="nevali" className="h-8 w-auto" />
        </Link>

        <NavLinks />

        <div className="flex items-center gap-3">
          <CartNavLink />
          {user ? (
            <NavbarUserMenu
              name={user.name ?? ""}
              email={user.email ?? ""}
              role={role ?? "partner"}
            />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-sans text-sm text-text-dark hover:text-forest-light transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/auth/register" : "/auth/register-buyer"}
                className="font-sans text-sm font-medium text-forest-light border border-forest-light px-4 py-1.5 hover:bg-forest-light hover:text-white transition-colors"
              >
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Sign Up" : "Create account"}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
