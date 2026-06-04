/**
 * nevali seed — minimal workspace + one flagship product.
 * Creates the superadmin, the Nevali workspace (organization + its producer
 * owner + profile), and a single fully-structured, APPROVED, homepage-featured
 * product with all buyer-facing copy in ARABIC (three costed variants, INCI
 * ingredients, skin types, a gallery of real argan-oil product photos, and an
 * approved certification). No journal articles, reviews, orders, or buyer.
 * Resets all org-scoped data and every non-admin user before rebuilding.
 * Run: pnpm prisma db seed
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
	Prisma,
	PrismaClient,
	ProductCategory,
	ProductPaymentOption,
} from "@prisma/client";
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

/** Brand/portrait photos (verified subset of `src/lib/cosmetics-image-placeholders.ts`). */
const PH = {
	hero: "1617897903246-719242758050",
	portrait: "1573496359142-b8d87734a5a2",
} as const;

/**
 * Real argan-oil product photos (Unsplash, hostname allow-listed in next.config).
 * Each id was fetched and visually verified to depict an argan-oil / serum bottle.
 */
const ARGAN_PHOTO = {
	labeled: "1667242003572-96caaf8ac5c4", // bottle labeled "PREMIUM MOROCCO ARGAN OIL"
	duo: "1748639582818-391e2849beca", // two "Argan Oil" labeled serum bottles
	dropper: "1608571424266-edeb9bbefdec", // amber dropper serum bottle
	serumBook: "1573575154488-f88a60e170df", // clear dropper serum, lifestyle
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

	// ── One flagship product: fully structured, APPROVED, homepage-featured. ──────
	// Every meaningful field is populated: typed category, multi-paragraph copy,
	// INCI ingredients, skin types, three costed variants (full economics), a
	// multi-image gallery (one photo pinned to a variant), and an approved
	// product certification.
	// All buyer-facing copy is in Arabic. `skinTypes` stays as enum CODES
	// (DRY/NORMAL/…) — the app maps them to localized Arabic labels at render time.
	const product = await prisma.product.create({
		data: {
			organizationId: org.id,
			name: "زيت الأركان المعصور على البارد — سيروم مميّز",
			category: "مستحضرات التجميل والزيوت", // legacy free-text category
			cosmeticsCategory: ProductCategory.SKINCARE,
			description: [
				"زيت أركان مغربي أحادي المصدر، مَعصور على البارد خلال 24 ساعة من فرز اللوز ومُختبَر مخبريًا للتأكد من نقائه. سيروم خفيف سريع الامتصاص للوجه والشعر.",
				"يُعصَر بكميات صغيرة في مشغلنا بالدار البيضاء من لوز أركان مصدره تعاونيات نسائية في منطقة سوس ماسة. بدون عطر، غير مخفّف، وقابل للتتبّع حتى موسم حصاد واحد.",
				"طريقة الاستعمال: دفّئي 3–4 قطرات بين راحتَي اليدين واضغطيها على بشرة نظيفة صباحًا ومساءً، أو وزّعيها على منتصف الشعر وأطرافه لترويض التطاير.",
			].join("\n\n"),
			ingredients:
				"زيت بذور الأركان (أركان مَعصور على البارد 100%)، توكوفيرول (فيتامين E الطبيعي)",
			skinTypes: "DRY, NORMAL, COMBINATION, SENSITIVE",
			moq: "12",
			capacity: "30 مل · 50 مل · 100 مل",
			status: "APPROVED",
			featuredOnHome: true,
			paymentOption: ProductPaymentOption.COD,
			variants: {
				create: [
					{
						name: "قارورة بقطّارة 30 مل",
						unit: "قارورة",
						sourceName: "تعاونية نساء سوس ماسة",
						minOrderQuantity: 12,
						minOrderNote: "يُباع بصندوق من 12 وحدة.",
						price: new Prisma.Decimal("129.00"),
						unitCost: new Prisma.Decimal("38.00"),
						packagingCost: new Prisma.Decimal("9.50"),
						handlingCost: new Prisma.Decimal("4.00"),
						otherCost: new Prisma.Decimal("2.50"),
						quantityOnHand: 320,
						inStock: true,
						sortOrder: 0,
					},
					{
						name: "قارورة بقطّارة 50 مل",
						unit: "قارورة",
						sourceName: "تعاونية نساء سوس ماسة",
						minOrderQuantity: 12,
						minOrderNote: "يُباع بصندوق من 12 وحدة.",
						price: new Prisma.Decimal("189.00"),
						unitCost: new Prisma.Decimal("60.00"),
						packagingCost: new Prisma.Decimal("11.00"),
						handlingCost: new Prisma.Decimal("4.50"),
						otherCost: new Prisma.Decimal("3.00"),
						quantityOnHand: 210,
						inStock: true,
						sortOrder: 1,
					},
					{
						name: "قارورة بمضخّة 100 مل",
						unit: "قارورة",
						sourceName: "تعاونية نساء سوس ماسة",
						minOrderQuantity: 6,
						minOrderNote: "حجم الصالونات / الجملة — صندوق من 6.",
						price: new Prisma.Decimal("329.00"),
						unitCost: new Prisma.Decimal("112.00"),
						packagingCost: new Prisma.Decimal("16.00"),
						handlingCost: new Prisma.Decimal("6.00"),
						otherCost: new Prisma.Decimal("4.00"),
						quantityOnHand: 90,
						inStock: true,
						sortOrder: 2,
					},
				],
			},
		},
		include: { variants: true },
	});

	// Gallery: real argan-oil product photos. Lead is the labeled Morocco-argan
	// bottle; the amber dropper shot is pinned to the 50 ml dropper variant.
	const variant50 = product.variants.find((v) => v.name.includes("50 مل"));
	await prisma.productImage.createMany({
		data: [
			{
				productId: product.id,
				url: cosmeticsPhoto(ARGAN_PHOTO.labeled, 1400),
				sortOrder: 0,
			},
			{
				productId: product.id,
				url: cosmeticsPhoto(ARGAN_PHOTO.duo, 1400),
				sortOrder: 1,
			},
			{
				productId: product.id,
				url: cosmeticsPhoto(ARGAN_PHOTO.dropper, 1400),
				sortOrder: 2,
				variantId: variant50?.id ?? null,
			},
			{
				productId: product.id,
				url: cosmeticsPhoto(ARGAN_PHOTO.serumBook, 1400),
				sortOrder: 3,
			},
		],
	});

	// Approved product-level certification (separate from product approval).
	await prisma.certification.create({
		data: {
			organizationId: org.id,
			productId: product.id,
			name: "شهادة إيكوسير كوزموس ناتشورال — زيت الأركان",
			fileUrl: "https://example.com/certs/nevali-argan-cosmos.pdf",
			status: "APPROVED",
			reviewedAt: new Date(),
		},
	});

	console.log("✓ Seed complete");
	console.log(`  Admin:     ${ADMIN_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Producer:  ${PARTNER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Workspace: ${ORG_NAME} (/artisans/${ORG_SLUG})`);
	console.log(
		`  Product:   ${product.name} (APPROVED · ${product.variants.length} variants · featured)`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
