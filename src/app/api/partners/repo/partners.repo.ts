import type { PublicPartnerListItem } from "~/app/partners/public-types";
import { prisma } from "~/lib/db";

const partnerSelect = {
	id: true,
	name: true,
	email: true,
	status: true,
	profileCompleted: true,
	createdAt: true,
	profile: { select: { entityName: true, region: true } },
} as const;

export async function listPendingUsersRepo() {
	return prisma.user.findMany({
		where: { role: "partner", status: "disabled" },
		select: {
			id: true,
			name: true,
			email: true,
			createdAt: true,
			profileCompleted: true,
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function listPartnersRepo(
	filters: { organizationId?: string } = {},
) {
	const where: {
		role: "partner";
		members?: { some: { organizationId: string } };
	} = { role: "partner" };
	if (filters.organizationId)
		where.members = { some: { organizationId: filters.organizationId } };
	return prisma.user.findMany({
		where,
		select: partnerSelect,
		orderBy: { createdAt: "desc" },
	});
}

/** Paginated list: one query for items, one for total; run in parallel for efficiency. */
export async function listPartnersPaginatedRepo(params: {
	page: number;
	pageSize: number;
	organizationId?: string;
}) {
	const { page, pageSize, organizationId } = params;
	const skip = (page - 1) * pageSize;

	const where: {
		role: "partner";
		members?: { some: { organizationId: string } };
	} = { role: "partner" };
	if (organizationId) where.members = { some: { organizationId } };

	const [items, total, enabledCount, disabledCount] = await Promise.all([
		prisma.user.findMany({
			where,
			select: partnerSelect,
			orderBy: { createdAt: "desc" },
			skip,
			take: pageSize,
		}),
		prisma.user.count({ where }),
		prisma.user.count({ where: { ...where, status: "enabled" } }),
		prisma.user.count({ where: { ...where, status: "disabled" } }),
	]);

	return {
		items,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize) || 1,
		enabledCount,
		disabledCount,
	};
}

export async function setUserStatusEnabled(userId: string) {
	return prisma.user.update({
		where: { id: userId },
		data: { status: "enabled" },
	});
}

/**
 * Create an organization for the partner and link them as owner.
 * Idempotent: if the user already has a member record, only enables status.
 * Call this when admin approves the partner.
 */
export async function ensureOrganizationAndMemberForPartner(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId, role: "partner" },
		select: {
			id: true,
			name: true,
			members: { select: { id: true } },
			profile: { select: { entityName: true } },
		},
	});
	if (!user) return;

	const alreadyHasOrg = user.members.length > 0;

	if (alreadyHasOrg) {
		await prisma.user.update({
			where: { id: userId },
			data: { status: "enabled" },
		});
		return;
	}

	const orgName =
		user.profile?.entityName?.trim() || user.name?.trim() || "Partner";
	const slug = `partner-${userId}`;

	await prisma.$transaction(async (tx) => {
		const org = await tx.organization.create({
			data: { name: orgName, slug },
		});
		await tx.member.create({
			data: {
				organizationId: org.id,
				userId,
				role: "owner",
			},
		});
		await tx.user.update({
			where: { id: userId },
			data: { status: "enabled" },
		});
	});
}

export async function updatePartnerRepo(
	userId: string,
	data: { name: string; email: string; status: "enabled" | "disabled" },
) {
	return prisma.user.update({
		where: { id: userId },
		data: {
			name: data.name,
			email: data.email,
			status: data.status,
		},
	});
}

export async function deletePartnerRepo(userId: string) {
	return prisma.user.delete({
		where: { id: userId },
	});
}

const fullProfileSelect = {
	id: true,
	firstName: true,
	lastName: true,
	phone: true,
	entityType: true,
	entityName: true,
	registrationNumber: true,
	region: true,
	city: true,
	yearEstablished: true,
	website: true,
	categories: true,
	annualCapacity: true,
	exportExperience: true,
	agreeTerms: true,
	agreeMarketing: true,
	profileImage: true,
	publicTagline: true,
	businessDescription: true,
	exportMarkets: true,
	valuesHighlight: true,
	createdAt: true,
	updatedAt: true,
} as const;

/** Single partner with full profile. */
export async function getPartnerByIdRepo(userId: string) {
	return prisma.user.findFirst({
		where: { id: userId, role: "partner" },
		select: {
			id: true,
			name: true,
			email: true,
			status: true,
			profileCompleted: true,
			createdAt: true,
			updatedAt: true,
			profile: { select: fullProfileSelect },
		},
	});
}

// ─── Public (no-auth) queries ────────────────────────────────────────────────

const publicPartnerSelect = {
	id: true,
	createdAt: true,
	members: {
		take: 1,
		select: {
			organization: {
				select: {
					slug: true,
					name: true,
					products: {
						where: { status: "APPROVED" },
						select: { id: true },
					},
				},
			},
		},
	},
	profile: {
		select: {
			entityName: true,
			entityType: true,
			region: true,
			city: true,
			yearEstablished: true,
			categories: true,
			profileImage: true,
			annualCapacity: true,
			exportExperience: true,
			publicTagline: true,
			website: true,
		},
	},
} as const;

/** List enabled + profile-complete partners (public, no auth). */
export async function listPublicPartnersRepo(): Promise<
	PublicPartnerListItem[]
> {
	const rows = await prisma.user.findMany({
		where: { role: "partner", status: "enabled", profileCompleted: true },
		select: publicPartnerSelect,
		orderBy: { createdAt: "desc" },
	});

	return rows.map((u) => ({
		id: u.id,
		createdAt: u.createdAt,
		profile: u.profile,
		members: u.members.map((m) => ({
			organization: {
				slug: m.organization.slug,
				name: m.organization.name,
				approvedProductCount: m.organization.products.length,
			},
		})),
	}));
}

/** Single public partner with full profile, approved catalog, and verified certifications. */
export async function getPublicPartnerByIdRepo(userId: string) {
	return prisma.user.findFirst({
		where: {
			id: userId,
			role: "partner",
			status: "enabled",
			profileCompleted: true,
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			profile: { select: fullProfileSelect },
			members: {
				select: {
					organization: {
						select: {
							id: true,
							name: true,
							slug: true,
							logo: true,
							products: {
								where: { status: "APPROVED" },
								orderBy: { updatedAt: "desc" },
								select: {
									id: true,
									organizationId: true,
									name: true,
									category: true,
									status: true,
									moq: true,
									capacity: true,
									description: true,
									paymentOption: true,
									createdAt: true,
									updatedAt: true,
									images: {
										orderBy: { sortOrder: "asc" },
										select: {
											id: true,
											url: true,
											sortOrder: true,
											variantId: true,
										},
									},
									variants: {
										orderBy: { sortOrder: "asc" },
										select: {
											id: true,
											name: true,
											unit: true,
											minOrderQuantity: true,
											minOrderNote: true,
											price: true,
											quantityOnHand: true,
											inStock: true,
											sortOrder: true,
										},
									},
								},
							},
							certifications: {
								where: { status: "APPROVED" },
								orderBy: { createdAt: "desc" },
								select: {
									id: true,
									name: true,
									fileUrl: true,
									productId: true,
									createdAt: true,
									product: { select: { name: true } },
								},
							},
						},
					},
				},
				take: 1,
			},
		},
	});
}
