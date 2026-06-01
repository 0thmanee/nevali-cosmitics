import { cache } from "react";
import { prisma } from "~/lib/db";
import type {
	OnboardingInput,
	PublicProducerProfile,
} from "../schemas/profile.schema";

export const getProfileByUserId = cache(async (userId: string) => {
	return prisma.profile.findUnique({
		where: { userId },
	});
});

export async function upsertProfileByUserId(
	userId: string,
	data: OnboardingInput,
) {
	return prisma.profile.upsert({
		where: { userId },
		create: {
			userId,
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone,
			entityType: data.entityType,
			entityName: data.entityName,
			registrationNumber: data.registrationNumber ?? null,
			region: data.region,
			city: data.city,
			yearEstablished: data.yearEstablished ?? null,
			website: data.website ?? null,
			categories: data.categories as string[],
			annualCapacity: data.annualCapacity ?? null,
			exportExperience: data.exportExperience ?? null,
			publicTagline: data.publicTagline?.trim() || null,
			businessDescription: data.businessDescription?.trim() || null,
			exportMarkets: data.exportMarkets?.trim() || null,
			valuesHighlight: data.valuesHighlight?.trim() || null,
			agreeTerms: data.agreeTerms,
			agreeMarketing: data.agreeMarketing,
		},
		update: {
			firstName: data.firstName,
			lastName: data.lastName,
			phone: data.phone,
			entityType: data.entityType,
			entityName: data.entityName,
			registrationNumber: data.registrationNumber ?? null,
			region: data.region,
			city: data.city,
			yearEstablished: data.yearEstablished ?? null,
			website: data.website ?? null,
			categories: data.categories as string[],
			annualCapacity: data.annualCapacity ?? null,
			exportExperience: data.exportExperience ?? null,
			publicTagline: data.publicTagline?.trim() || null,
			businessDescription: data.businessDescription?.trim() || null,
			exportMarkets: data.exportMarkets?.trim() || null,
			valuesHighlight: data.valuesHighlight?.trim() || null,
			agreeTerms: data.agreeTerms,
			agreeMarketing: data.agreeMarketing,
		},
	});
}

export async function setProfileCompleted(userId: string) {
	return prisma.user.update({
		where: { id: userId },
		data: { profileCompleted: true },
	});
}

export async function updateProfileImageRepo(
	userId: string,
	profileImageUrl: string | null,
) {
	return prisma.profile.update({
		where: { userId },
		data: { profileImage: profileImageUrl },
	});
}

/** Public producer page: enabled partner org by slug; no PII. */
export async function getPublicProducerByOrgSlug(
	slug: string,
): Promise<PublicProducerProfile | null> {
	const org = await prisma.organization.findUnique({
		where: { slug },
		select: {
			slug: true,
			members: {
				select: {
					user: {
						select: {
							role: true,
							status: true,
							profile: true,
						},
					},
				},
			},
		},
	});
	if (!org) return null;
	for (const m of org.members) {
		const u = m.user;
		if (u.role !== "partner" || u.status !== "enabled" || !u.profile) continue;
		const p = u.profile;
		return {
			slug: org.slug,
			entityName: p.entityName,
			entityType: p.entityType,
			region: p.region,
			city: p.city,
			yearEstablished: p.yearEstablished,
			categories: Array.isArray(p.categories) ? (p.categories as string[]) : [],
			annualCapacity: p.annualCapacity,
			website: p.website,
			profileImage: p.profileImage,
			exportExperience: p.exportExperience,
			publicTagline: p.publicTagline,
			businessDescription: p.businessDescription,
			exportMarkets: p.exportMarkets,
			valuesHighlight: p.valuesHighlight,
		};
	}
	return null;
}

export const getOrganizationSlugByUserId = cache(
	async (userId: string): Promise<string | null> => {
		const row = await prisma.member.findFirst({
			where: { userId },
			select: { organization: { select: { slug: true } } },
		});
		return row?.organization.slug ?? null;
	},
);
