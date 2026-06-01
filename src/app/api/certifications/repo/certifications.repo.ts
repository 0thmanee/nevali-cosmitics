import { prisma } from "~/lib/db";
import type {
	CertificationRow,
	CertificationWithProductRow,
} from "../schemas/certifications.schema";

const select = {
	id: true,
	organizationId: true,
	productId: true,
	name: true,
	fileUrl: true,
	status: true,
	rejectionReason: true,
	reviewedAt: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function listCertificationsByOrgRepo(
	organizationId: string,
	options: { productId?: string | null } = {},
): Promise<CertificationRow[]> {
	const where: { organizationId: string; productId?: string | null } = {
		organizationId,
	};
	if (options.productId !== undefined) {
		where.productId = options.productId;
	}
	return prisma.certification.findMany({
		where,
		orderBy: { createdAt: "desc" },
		select,
	});
}

export async function getCertificationByIdForOrgRepo(
	certificationId: string,
	organizationId: string,
): Promise<CertificationRow | null> {
	return prisma.certification.findFirst({
		where: { id: certificationId, organizationId },
		select,
	});
}

export async function createCertificationRepo(data: {
	organizationId: string;
	name: string;
	fileUrl: string;
	productId?: string | null;
	status?: "PENDING" | "APPROVED" | "REJECTED";
}): Promise<CertificationRow> {
	const status = data.status ?? "PENDING";
	return prisma.certification.create({
		data: {
			organizationId: data.organizationId,
			name: data.name,
			fileUrl: data.fileUrl,
			productId: data.productId ?? null,
			status,
			reviewedAt: status === "APPROVED" ? new Date() : null,
		},
		select,
	});
}

export async function deleteCertificationRepo(
	certificationId: string,
	organizationId: string,
): Promise<void> {
	const cert = await prisma.certification.findFirst({
		where: { id: certificationId, organizationId },
		select: { id: true },
	});
	if (!cert)
		throw new Error(
			"Certification not found or does not belong to your organization.",
		);
	await prisma.certification.delete({ where: { id: certificationId } });
}

export async function updateCertificationStatusRepo(
	certificationId: string,
	status: "APPROVED" | "REJECTED",
	rejectionReason?: string | null,
): Promise<CertificationRow> {
	return prisma.certification.update({
		where: { id: certificationId },
		data: {
			status,
			rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
			reviewedAt: new Date(),
		},
		select,
	});
}

/** Admin: list all certifications with optional organizationId, status and productId filter. */
export async function listCertificationsForAdminRepo(filters: {
	organizationId?: string;
	status?: "PENDING" | "APPROVED" | "REJECTED";
	productId?: string | null;
}): Promise<CertificationWithProductRow[]> {
	const where: {
		status?: string;
		productId?: string | null;
		product?: { organizationId: string; id?: string };
	} = {};
	if (filters.status) where.status = filters.status;
	if (filters.productId !== undefined) where.productId = filters.productId;
	if (filters.organizationId) {
		where.product = {
			organizationId: filters.organizationId,
			...(filters.productId && { id: filters.productId }),
		};
	}

	const rows = await prisma.certification.findMany({
		where,
		orderBy: { createdAt: "desc" },
		select: {
			...select,
			product: { select: { id: true, name: true } },
			organization: { select: { name: true } },
		},
	});
	return rows as CertificationWithProductRow[];
}

/** Certifications for a product (by product id, any org). Used in admin product detail. */
export async function listCertificationsByProductIdRepo(
	productId: string,
): Promise<CertificationRow[]> {
	return prisma.certification.findMany({
		where: { productId },
		orderBy: { createdAt: "desc" },
		select,
	});
}
