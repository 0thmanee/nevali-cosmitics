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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-cream-dark/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[56px] w-full max-w-7xl items-center justify-between px-6">
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
                className="rounded-sm border border-primary/50 bg-primary/10 px-4 py-1.5 font-sans text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
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
