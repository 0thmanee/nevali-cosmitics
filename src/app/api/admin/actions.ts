"use server";

import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";

export type AdminNavStats = {
	partnersTotal: number;
	productsPending: number;
	certificationsPending: number;
	trainingProgramsTotal: number;
	supportTicketsOpen: number;
};

export type AdminOrganizationRow = { id: string; name: string; slug: string };

export type AdminPartnerStats = {
	total: number;
	active: number;
	pending: number;
	profileCompleted: number;
	byRegion: Array<{ region: string; count: number }>;
};

export type AdminDashboardData = {
	navStats: AdminNavStats;
	partnerStats: Omit<AdminPartnerStats, "total">;
	productCounts: {
		ALL: number;
		PENDING: number;
		APPROVED: number;
		REJECTED: number;
	};
	certCounts: {
		ALL: number;
		PENDING: number;
		APPROVED: number;
		REJECTED: number;
	};
	trainingCounts: { ALL: number; PUBLISHED: number; DRAFT: number };
};

async function requireSuperadmin() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		redirectNonSuperadminHome();
	}
}

/**
 * Single consolidated action for the admin dashboard.
 * Runs one session check and all DB queries in parallel — much faster than 5 separate calls.
 */
export async function getAdminDashboardData(
	organizationId?: string | null,
): Promise<AdminDashboardData> {
	await requireSuperadmin();

	const partnerWhere = organizationId
		? { role: "partner" as const, members: { some: { organizationId } } }
		: { role: "partner" as const };
	const profileWhere = organizationId
		? {
				user: {
					role: "partner" as const,
					members: { some: { organizationId } },
				},
			}
		: { user: { role: "partner" as const } };
	const productBase = organizationId ? { organizationId } : {};
	const certBase = organizationId ? { product: { organizationId } } : {};

	const [
		partnersTotal,
		partnerActive,
		partnerPending,
		partnerProfileCompleted,
		regionGroups,
		productAll,
		productPending,
		productApproved,
		productRejected,
		certAll,
		certPending,
		certApproved,
		certRejected,
		trainingAll,
		trainingPublished,
		trainingDraft,
		supportOpen,
	] = await Promise.all([
		prisma.user.count({ where: partnerWhere }),
		prisma.user.count({ where: { ...partnerWhere, status: "enabled" } }),
		prisma.user.count({ where: { ...partnerWhere, status: "disabled" } }),
		prisma.user.count({ where: { ...partnerWhere, profileCompleted: true } }),
		prisma.profile.groupBy({
			by: ["region"],
			_count: { userId: true },
			where: profileWhere,
			orderBy: { _count: { userId: "desc" } },
		}),
		prisma.product.count({ where: productBase }),
		prisma.product.count({ where: { ...productBase, status: "PENDING" } }),
		prisma.product.count({ where: { ...productBase, status: "APPROVED" } }),
		prisma.product.count({ where: { ...productBase, status: "REJECTED" } }),
		prisma.certification.count({ where: certBase }),
		prisma.certification.count({ where: { ...certBase, status: "PENDING" } }),
		prisma.certification.count({ where: { ...certBase, status: "APPROVED" } }),
		prisma.certification.count({ where: { ...certBase, status: "REJECTED" } }),
		prisma.trainingProgram.count(),
		prisma.trainingProgram.count({ where: { status: "PUBLISHED" } }),
		prisma.trainingProgram.count({ where: { status: "DRAFT" } }),
		prisma.supportTicket.count({
			where: { status: { in: ["OPEN", "IN_REVIEW"] }, ...productBase },
		}),
	]);

	return {
		navStats: {
			partnersTotal,
			productsPending: productPending,
			certificationsPending: certPending,
			trainingProgramsTotal: trainingAll,
			supportTicketsOpen: supportOpen,
		},
		partnerStats: {
			active: partnerActive,
			pending: partnerPending,
			profileCompleted: partnerProfileCompleted,
			byRegion: regionGroups.map((g) => ({
				region: g.region,
				count: g._count.userId,
			})),
		},
		productCounts: {
			ALL: productAll,
			PENDING: productPending,
			APPROVED: productApproved,
			REJECTED: productRejected,
		},
		certCounts: {
			ALL: certAll,
			PENDING: certPending,
			APPROVED: certApproved,
			REJECTED: certRejected,
		},
		trainingCounts: {
			ALL: trainingAll,
			PUBLISHED: trainingPublished,
			DRAFT: trainingDraft,
		},
	};
}

/** Partner breakdown stats: status split, profile completion, regional distribution. */
export async function getAdminPartnerStats(
	organizationId?: string | null,
): Promise<AdminPartnerStats> {
	await requireSuperadmin();

	const userWhere = organizationId
		? { role: "partner" as const, members: { some: { organizationId } } }
		: { role: "partner" as const };

	const profileWhere = organizationId
		? {
				user: {
					role: "partner" as const,
					members: { some: { organizationId } },
				},
			}
		: { user: { role: "partner" as const } };

	const [total, active, pending, profileCompleted, regionGroups] =
		await Promise.all([
			prisma.user.count({ where: userWhere }),
			prisma.user.count({ where: { ...userWhere, status: "enabled" } }),
			prisma.user.count({ where: { ...userWhere, status: "disabled" } }),
			prisma.user.count({ where: { ...userWhere, profileCompleted: true } }),
			prisma.profile.groupBy({
				by: ["region"],
				_count: { userId: true },
				where: profileWhere,
				orderBy: { _count: { userId: "desc" } },
			}),
		]);

	return {
		total,
		active,
		pending,
		profileCompleted,
		byRegion: regionGroups.map((g) => ({
			region: g.region,
			count: g._count.userId,
		})),
	};
}

/** Admin: list all organizations for org selector. */
export async function listOrganizationsForAdmin(): Promise<
	AdminOrganizationRow[]
> {
	await requireSuperadmin();
	const rows = await prisma.organization.findMany({
		orderBy: { name: "asc" },
		select: { id: true, name: true, slug: true },
	});
	return rows as AdminOrganizationRow[];
}

/**
 * Light stats for admin sidebar badges. Superadmin only.
 * When organizationId is provided, counts are scoped to that organization.
 */
export async function getAdminNavStats(
	organizationId?: string | null,
): Promise<AdminNavStats> {
	await requireSuperadmin();

	const orgFilter = organizationId ? { organizationId } : undefined;
	const partnerWhere = organizationId
		? { role: "partner" as const, members: { some: { organizationId } } }
		: { role: "partner" as const };

	const certWhere = organizationId
		? { status: "PENDING" as const, product: { organizationId } }
		: { status: "PENDING" as const };
	const [
		partnersTotal,
		productsPending,
		certificationsPending,
		trainingProgramsTotal,
		supportTicketsOpen,
	] = await Promise.all([
		prisma.user.count({ where: partnerWhere }),
		prisma.product.count({
			where: { status: "PENDING", ...(orgFilter ?? {}) },
		}),
		prisma.certification.count({ where: certWhere }),
		organizationId
			? prisma.trainingEnrollment.count({ where: { organizationId } })
			: prisma.trainingProgram.count(),
		prisma.supportTicket.count({
			where: { status: { in: ["OPEN", "IN_REVIEW"] }, ...(orgFilter ?? {}) },
		}),
	]);

	return {
		partnersTotal,
		productsPending,
		certificationsPending,
		trainingProgramsTotal,
		supportTicketsOpen,
	};
}

function csvCell(v: unknown): string {
	const s = String(v ?? "");
	if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
	return s;
}
