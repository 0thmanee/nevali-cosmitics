"use server";

import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { listShopOrdersForAdminRepo } from "./repo/shop-orders.repo";

async function requireSuperadmin() {
  const session = await getSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "superadmin") {
    redirectNonSuperadminHome();
  }
  return session!;
}

export async function listShopOrdersForAdmin(organizationId?: string | null) {
  await requireSuperadmin();
  return listShopOrdersForAdminRepo({ organizationId: organizationId ?? undefined });
}
