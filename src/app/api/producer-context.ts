"use server";

import { cache } from "react";
import { prisma } from "~/lib/db";
import { getSession } from "~/app/api/auth/actions";

/**
 * Resolves the current producer's organizationId — memoized per request.
 * All producer actions that need the org ID call this instead of doing their own
 * getSession() + member.findFirst(), collapsing N lookups into 1 per request.
 *
 * Returns null if there is no session or the user has no organization membership.
 */
export const getProducerOrgId = cache(async (): Promise<string | null> => {
  const session = await getSession(); // already cached — free second call
  if (!session?.user?.id) return null;
  const member = await prisma.member.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });
  return member?.organizationId ?? null;
});
