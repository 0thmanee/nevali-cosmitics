/**
 * nevali seed — minimal workspace.
 * Creates only the superadmin and the Nevali workspace (organization + its
 * producer owner + profile). No products, journal articles, reviews, or buyer.
 * Resets all org-scoped data and every non-admin user before rebuilding.
 * Run: pnpm prisma db seed
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
	log: ["error", "warn"],
});

const SEED_PASSWORD = "Password123!";

const ADMIN_EMAIL = "admin@nevali.store";
const PARTNER_EMAIL = "contact@nevali.store";

const ORG_SLUG = "nevali-cosmetics";
const ORG_NAME = "Nevali";

/** Verified Unsplash photo ids (same set as `src/lib/cosmetics-image-placeholders.ts`). */
function cosmeticsPhoto(photoId: string, width: number): string {
	return `https://images.unsplash.com/photo-${photoId}?q=80&auto=format&fit=crop&w=${width}`;
}

const PH = {
	hero: "1617897903246-719242758050",
	portrait: "1573496359142-b8d87734a5a2",
} as const;

async function wipeCatalogAndUsersExcept(adminId: string) {
	await prisma.$transaction(
		async (tx) => {
			await tx.shopOrderLine.deleteMany();
			await tx.shopOrder.deleteMany();
			await tx.savedListProduct.deleteMany();
			await tx.savedList.deleteMany();
			await tx.userNotification.deleteMany();
			await tx.productReview.deleteMany();
			await tx.productBatch.deleteMany();
			await tx.certification.deleteMany();
			await tx.productImage.deleteMany();
			await tx.productVariant.deleteMany();
			await tx.product.deleteMany();
			await tx.producerArticle.deleteMany();
			await tx.trainingEnrollment.deleteMany();
			await tx.supportTicketStatusEvent.deleteMany();
			await tx.supportTicket.deleteMany();
			await tx.member.deleteMany();
			await tx.invitation.deleteMany();
			await tx.organization.deleteMany();

			await tx.session.deleteMany({ where: { userId: { not: adminId } } });
			await tx.account.deleteMany({ where: { userId: { not: adminId } } });
			await tx.profile.deleteMany({ where: { userId: { not: adminId } } });
			await tx.user.deleteMany({ where: { id: { not: adminId } } });
		},
		{ timeout: 120_000 },
	);
}

async function upsertCredentialUser(data: {
	email: string;
	name: string;
	role: "partner" | "buyer";
	status: "enabled" | "disabled";
	profileCompleted: boolean;
	hashedPassword: string;
}) {
	const user = await prisma.user.upsert({
		where: { email: data.email },
		update: {
			name: data.name,
			role: data.role,
			status: data.status,
			profileCompleted: data.profileCompleted,
		},
		create: {
			name: data.name,
			email: data.email,
			emailVerified: true,
			role: data.role,
			status: data.status,
			profileCompleted: data.profileCompleted,
		},
	});

	const existingAccount = await prisma.account.findFirst({
		where: { userId: user.id, providerId: "credential", accountId: user.email },
	});

	if (!existingAccount) {
		await prisma.account.create({
			data: {
				userId: user.id,
				providerId: "credential",
				accountId: user.email,
				password: data.hashedPassword,
			},
		});
	} else {
		await prisma.account.update({
			where: { id: existingAccount.id },
			data: { password: data.hashedPassword },
		});
	}

	return user;
}

async function main() {
	const hashedPassword = await hashPassword(SEED_PASSWORD);

	const admin = await prisma.user.upsert({
		where: { email: ADMIN_EMAIL },
		update: {},
		create: {
			name: "nevali Admin",
			email: ADMIN_EMAIL,
			emailVerified: true,
			role: "superadmin",
			status: "enabled",
			profileCompleted: true,
		},
	});

	const adminAccount = await prisma.account.findFirst({
		where: {
			userId: admin.id,
			providerId: "credential",
			accountId: admin.email,
		},
	});
	if (!adminAccount) {
		await prisma.account.create({
			data: {
				userId: admin.id,
				providerId: "credential",
				accountId: admin.email,
				password: hashedPassword,
			},
		});
	} else {
		await prisma.account.update({
			where: { id: adminAccount.id },
			data: { password: hashedPassword },
		});
	}

	await wipeCatalogAndUsersExcept(admin.id);

	// The Nevali workspace owner (producer). Accesses the /artisan portal.
	const partner = await upsertCredentialUser({
		email: PARTNER_EMAIL,
		name: "Zineb Badr",
		role: "partner",
		status: "enabled",
		profileCompleted: true,
		hashedPassword,
	});

	const org = await prisma.organization.create({
		data: {
			name: ORG_NAME,
			slug: ORG_SLUG,
			logo: cosmeticsPhoto(PH.hero, 400),
			metadata: { seed: true, brand: "nevali" } as Prisma.InputJsonValue,
		},
	});

	await prisma.member.create({
		data: {
			organizationId: org.id,
			userId: partner.id,
			role: "owner",
		},
	});

	await prisma.profile.create({
		data: {
			userId: partner.id,
			firstName: "Zineb",
			lastName: "Badr",
			phone: "+212 5 22 00 00 00",
			entityType: "Craft Company",
			entityName: ORG_NAME,
			registrationNumber: "RC-CASABLANCA-DEMO-2026",
			region: "Casablanca-Settat",
			city: "Casablanca",
			yearEstablished: "2019",
			website: "https://nevali-cosmetics.example",
			categories: [
				"Cosmetics & Oils",
				"Skincare",
				"Haircare",
				"Body care",
			] as unknown as Prisma.InputJsonValue,
			annualCapacity: "120k units / year (blending + filling)",
			exportExperience: "5+ years",
			agreeTerms: true,
			agreeMarketing: false,
			publicTagline:
				"Moroccan lab, global standards — traceable formulas from Casablanca.",
			businessDescription:
				"Nevali formulates and fills skincare, hair, and body products with Moroccan actives (argan, ghassoul, rose, prickly pear).",
			exportMarkets:
				"European Union, United Kingdom, Gulf Cooperation Council, North America",
			valuesHighlight:
				"Women-led R&D · HACCP-aligned production · Ingredient transparency",
			profileImage: cosmeticsPhoto(PH.portrait, 800),
		},
	});

	console.log("✓ Seed complete");
	console.log(`  Admin:     ${ADMIN_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Producer:  ${PARTNER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Workspace: ${ORG_NAME} (/artisans/${ORG_SLUG})`);
	console.log("  No products, journal articles, reviews, or buyer seeded.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
