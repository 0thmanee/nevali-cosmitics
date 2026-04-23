"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "~/lib/auth-client";

type Props = {
  name: string;
  email: string;
  role: string;
};

function dashboardHref(role: string): string {
  if (role === "superadmin") return "/admin";
  if (role === "buyer") return "/buyer";
  return "/artisan";
}

export function NavbarUserMenu({ name, email, role }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dash = dashboardHref(role);

  return (
    <div className="relative flex items-center gap-2">
      <Link
        href={dash}
        className="hidden h-10 items-center rounded-sm border border-primary/40 bg-white px-5 font-sans text-sm font-medium text-primary transition-colors hover:bg-primary/10 sm:inline-flex"
      >
        Dashboard
      </Link>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-10 items-center gap-2 rounded-sm border border-primary/35 bg-white px-4 font-sans text-sm font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {(name || email || "?").slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[100px] truncate hidden sm:inline">{name || email}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={menuOpen ? "rotate-180" : ""}
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={() => setMenuOpen(false)} />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-48 rounded-sm border border-cream-dark bg-white py-2 shadow-lg"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-cream-dark">
              <p className="font-sans text-sm font-semibold text-text-dark truncate">{name || "Account"}</p>
              <p className="font-sans text-xs text-text-muted truncate">{email}</p>
            </div>
            <Link
              href={dash}
              className="block px-4 py-2 font-sans text-sm text-text-dark transition-colors hover:bg-cream"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              type="button"
              className="w-full px-4 py-2 text-left font-sans text-sm text-text-dark transition-colors hover:bg-cream"
              onClick={() => { signOut(); setMenuOpen(false); }}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
