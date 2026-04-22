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
        className="font-sans text-sm font-medium text-text-dark border border-text-dark/30 px-5 h-10 inline-flex items-center hover:bg-text-dark/5 transition-colors hidden sm:inline-flex"
      >
        Dashboard
      </Link>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="font-sans text-sm font-medium text-text-dark border border-text-dark/30 px-4 h-10 hover:bg-text-dark/5 transition-colors flex items-center gap-2"
      >
        <span className="w-6 h-6 rounded-full bg-forest-mid flex items-center justify-center text-white text-xs font-bold">
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
            className="absolute right-0 top-full mt-2 py-2 w-48 rounded-xl bg-white border border-cream-dark shadow-lg z-50"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-cream-dark">
              <p className="font-sans text-sm font-semibold text-text-dark truncate">{name || "Account"}</p>
              <p className="font-sans text-xs text-text-muted truncate">{email}</p>
            </div>
            <Link
              href={dash}
              className="block px-4 py-2 font-sans text-sm text-text-dark hover:bg-cream transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              type="button"
              className="w-full text-left px-4 py-2 font-sans text-sm text-text-dark hover:bg-cream transition-colors"
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
