"use server";

import { cache } from "react";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get current session — memoized per request via React.cache.
 * Within a single server render, multiple callers share one DB lookup.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

/**
 * Require auth: redirect to /auth/login if no session.
 * Returns session.
 */
export async function requireSession(options?: { callbackUrl?: string }) {
  const session = await getSession();
  if (!session?.user) {
    const cb = options?.callbackUrl ?? "/artisan";
    redirect("/auth/login?callbackUrl=" + encodeURIComponent(cb));
  }
  return session;
}

/**
 * Non-superadmin hit an admin-only action — send them to their app home.
 */
export async function redirectNonSuperadminHome(): Promise<never> {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role ?? "partner";
  if (role === "buyer") {
    redirect("/buyer");
  }
  redirect("/artisan");
}
