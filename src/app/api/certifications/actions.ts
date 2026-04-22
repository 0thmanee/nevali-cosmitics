"use server";

import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { getProducerOrgId } from "~/app/api/producer-context";
import { prisma } from "~/lib/db";
import {
  listCertificationsByOrgRepo,
  createCertificationRepo,
  deleteCertificationRepo,
  listCertificationsForAdminRepo,
  updateCertificationStatusRepo,
} from "./repo/certifications.repo";
import { getOrganizationMemberEmails, notifyCertificationReviewResult } from "~/lib/notifications";
import { addCertificationSchema, setCertificationStatusSchema } from "./schemas/certifications.schema";
import type { AddCertificationInput, SetCertificationStatusInput } from "./schemas/certifications.schema";

async function requireSuperadmin() {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "superadmin") {
    redirectNonSuperadminHome();
  }
  return session!;
}

/** List certifications for current org. Optional productId: null = global only, string = for that product, omit = all. */
export async function listMyCertifications(options: { productId?: string | null } = {}) {
  const organizationId = await getProducerOrgId();
  if (!organizationId) throw new Error("You must belong to an organization.");
  return listCertificationsByOrgRepo(organizationId, options);
}

/** Add a certification (global or linked to product). Upload file first via media API with type certificationDocuments. */
export async function addCertification(data: AddCertificationInput) {
  const organizationId = await getProducerOrgId();
  if (!organizationId) throw new Error("You must belong to an organization.");
  const parsed = addCertificationSchema.parse(data);
  if (parsed.productId) {
    const product = await prisma.product.findFirst({
      where: { id: parsed.productId, organizationId },
      select: { id: true },
    });
    if (!product) throw new Error("Product not found or does not belong to your organization.");
  }
  return createCertificationRepo({
    organizationId,
    name: parsed.name,
    fileUrl: parsed.fileUrl,
    productId: parsed.productId ?? null,
  });
}

/** Remove a certification (must belong to current org). */
export async function removeCertification(certificationId: string) {
  const organizationId = await getProducerOrgId();
  if (!organizationId) throw new Error("You must belong to an organization.");
  await deleteCertificationRepo(certificationId, organizationId);
}

/** Admin: list all certifications with optional filters. */
export async function listCertificationsForAdmin(filters: {
  organizationId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  productId?: string | null;
} = {}) {
  await requireSuperadmin();
  return listCertificationsForAdminRepo(filters);
}

/** Admin certification counts by status (optional organizationId via product). */
export async function getAdminCertificationCounts(organizationId?: string | null): Promise<{ ALL: number; PENDING: number; APPROVED: number; REJECTED: number }> {
  await requireSuperadmin();
  const base = organizationId ? { product: { organizationId } } : {};
  const [ALL, PENDING, APPROVED, REJECTED] = await Promise.all([
    prisma.certification.count({ where: base }),
    prisma.certification.count({ where: { ...base, status: "PENDING" } }),
    prisma.certification.count({ where: { ...base, status: "APPROVED" } }),
    prisma.certification.count({ where: { ...base, status: "REJECTED" } }),
  ]);
  return { ALL, PENDING, APPROVED, REJECTED };
}

/** Admin: approve or reject a certification (separate from product approval). */
export async function setCertificationStatus(input: SetCertificationStatusInput) {
  await requireSuperadmin();
  const parsed = setCertificationStatusSchema.parse(input);
  const row = await updateCertificationStatusRepo(
    parsed.certificationId,
    parsed.status,
    parsed.status === "REJECTED" ? parsed.rejectionReason : null
  );
  const recipients = await getOrganizationMemberEmails(row.organizationId);
  await notifyCertificationReviewResult({
    recipients,
    certificationName: row.name,
    approved: parsed.status === "APPROVED",
    rejectionReason: parsed.rejectionReason,
  });
  return row;
}
