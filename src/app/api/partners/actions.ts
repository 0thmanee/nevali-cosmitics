"use server";

import { prisma } from "~/lib/db";
import {
  notifyPartnerAccessDisabled,
  notifyPartnerAccessReenabled,
  notifyPartnerApplicationApproved,
} from "~/lib/notifications";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import {
  listPendingUsersRepo,
  listPartnersRepo,
  listPartnersPaginatedRepo,
  getPartnerByIdRepo,
  ensureOrganizationAndMemberForPartner,
  updatePartnerRepo,
  deletePartnerRepo,
} from "./repo/partners.repo";
import { paginationSchema } from "./schemas/partners.schema";
import type { UpdatePartnerInput } from "./schemas/partners.schema";

async function requireSuperadmin() {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "superadmin") {
    redirectNonSuperadminHome();
  }
  return session!;
}

/** List users with status disabled (pending approval). */
export async function listPendingUsers() {
  await requireSuperadmin();
  return listPendingUsersRepo();
}

/** List all partners (optional organizationId = only members of that org). */
export async function listPartners(filters: { organizationId?: string } = {}) {
  await requireSuperadmin();
  return listPartnersRepo(filters);
}

/** Paginated list of partners (optional organizationId). */
export async function listPartnersPaginated(params: { page: number; pageSize: number; organizationId?: string }) {
  await requireSuperadmin();
  const { page, pageSize, organizationId } = paginationSchema.parse(params);
  return listPartnersPaginatedRepo({ page, pageSize, organizationId });
}

/** Approve a user: create their organization, link them as owner, and set status to enabled. */
export async function approveUser(userId: string) {
  await requireSuperadmin();
  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, email: true, name: true },
  });
  await ensureOrganizationAndMemberForPartner(userId);
  if (before?.status === "disabled" && before.email) {
    await notifyPartnerApplicationApproved({ to: before.email, name: before.name });
  }
}

/** Update partner name, email, or status. */
export async function updatePartner(userId: string, data: UpdatePartnerInput) {
  await requireSuperadmin();
  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, email: true, name: true },
  });
  const updated = await updatePartnerRepo(userId, data);
  if (before?.status === "enabled" && data.status === "disabled" && updated.email) {
    await notifyPartnerAccessDisabled({ to: updated.email, name: updated.name });
  }
  if (before?.status === "disabled" && data.status === "enabled" && updated.email) {
    await notifyPartnerAccessReenabled({ to: updated.email, name: updated.name });
  }
  return updated;
}

/** Get a single partner with full profile. */
export async function getPartner(userId: string) {
  await requireSuperadmin();
  return getPartnerByIdRepo(userId);
}

/** Delete a partner (cascades to profile, sessions, accounts). */
export async function deletePartner(userId: string) {
  await requireSuperadmin();
  await deletePartnerRepo(userId);
}
