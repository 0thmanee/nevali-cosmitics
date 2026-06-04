/**
 * E2E test seed — deterministic, data-rich fixture for Playwright.
 * Admin + producer (Nevali) + buyer, a spread of products (APPROVED/PENDING/REJECTED,
 * low-stock, featured), journal articles, and one existing confirmed order.
 * Run against the TEST database only:
 *   DATABASE_URL=<test> npx tsx prisma/seed.e2e.ts
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
const BUYER_EMAIL = "buyer@nevali-cosmetics.local";
const ORG_SLUG = "nevali-cosmetics";
const ORG_NAME = "Nevali";

function photo(id: string, w: number): string {
	return `https://images.unsplash.com/photo-${id}?q=80&auto=format&fit=crop&w=${w}`;
}
const PH = {
	argan: "1609597876248-e5f7c84f0295",
	creams: "1571875257727-256c39da42af",
	spa: "1570172619644-dfd03ed5d881",
	portrait: "1573496359142-b8d87734a5a2",
	hero: "1617897903246-719242758050",
	flatlay: "1612817288484-6f916006741a",
} as const;

type V = {
	name: string;
	unit: string;
	price: string;
	qty: number;
	inStock?: boolean;
};
type P = {
	name: string;
	category: string;
	cosmeticsCategory: ProductCategory;
	description: string;
	status: "APPROVED" | "PENDING" | "REJECTED";
	featuredOnHome?: boolean;
	rejectionReason?: string;
	image: string;
	variants: V[];
};

const CATALOG: P[] = [
	{
		name: "Cold-pressed argan oil — signature",
		category: "Botanical oils",
		cosmeticsCategory: ProductCategory.HAIRCARE,
		description: "Single-origin argan, cold-pressed and lab-tested.",
		status: "APPROVED",
		featuredOnHome: true,
		image: PH.argan,
		variants: [
			{ name: "100 ml glass", unit: "bottle", price: "189.00", qty: 400 },
			{ name: "30 ml travel", unit: "bottle", price: "79.00", qty: 320 },
		],
	},
	{
		name: "Damask rose water mist",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description: "Steam-distilled rose water toner.",
		status: "APPROVED",
		image: PH.spa,
		variants: [{ name: "200 ml mist", unit: "bottle", price: "96.00", qty: 500 }],
	},
	{
		name: "Ghassoul clay mask — weekly reset",
		category: "Hammam & body",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description: "Volcanic clay blend for scalp and body.",
		status: "APPROVED",
		image: PH.creams,
		// Low stock (1–10) to exercise the low-stock badge.
		variants: [{ name: "250 g pouch", unit: "pouch", price: "112.00", qty: 5 }],
	},
	{
		name: "Kohl pencil — mineral brown",
		category: "Makeup",
		cosmeticsCategory: ProductCategory.MAKEUP,
		description: "Soft-glide mineral kohl, ophthalmologist-tested.",
		status: "APPROVED",
		image: PH.portrait,
		variants: [{ name: "1.2 g", unit: "item", price: "58.00", qty: 800 }],
	},
	{
		name: "Neroli night serum",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description: "Lightweight oil-serum with neroli and squalane.",
		status: "PENDING",
		image: PH.flatlay,
		variants: [{ name: "30 ml", unit: "bottle", price: "218.00", qty: 190 }],
	},
	{
		name: "Beldi black soap — eucalyptus",
		category: "Hammam & body",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description: "Traditional olive-paste hammam soap.",
		status: "REJECTED",
		rejectionReason: "Please add a full ingredient (INCI) list before resubmitting.",
		image: PH.hero,
		variants: [{ name: "200 g jar", unit: "jar", price: "68.00", qty: 420 }],
	},
];

async function wipe(adminId: string) {
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

async function upsertUser(data: {
	email: string;
	name: string;
	role: "partner" | "buyer";
	hashedPassword: string;
}) {
	const user = await prisma.user.upsert({
		where: { email: data.email },
		update: {
			name: data.name,
			role: data.role,
			status: "enabled",
			profileCompleted: true,
		},
		create: {
			name: data.name,
			email: data.email,
			emailVerified: true,
			role: data.role,
			status: "enabled",
			profileCompleted: true,
		},
	});
	const acct = await prisma.account.findFirst({
		where: { userId: user.id, providerId: "credential", accountId: user.email },
	});
	if (!acct) {
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
			where: { id: acct.id },
			data: { password: data.hashedPassword },
		});
	}
	return user;
}

async function main() {
	const hashed = await hashPassword(SEED_PASSWORD);

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
	const adminAcct = await prisma.account.findFirst({
		where: { userId: admin.id, providerId: "credential", accountId: admin.email },
	});
	if (!adminAcct) {
		await prisma.account.create({
			data: {
				userId: admin.id,
				providerId: "credential",
				accountId: admin.email,
				password: hashed,
			},
		});
	} else {
		await prisma.account.update({
			where: { id: adminAcct.id },
			data: { password: hashed },
		});
	}

	await wipe(admin.id);

	const partner = await upsertUser({
		email: PARTNER_EMAIL,
		name: "Zineb Badr",
		role: "partner",
		hashedPassword: hashed,
	});
	const buyer = await upsertUser({
		email: BUYER_EMAIL,
		name: "Demo Buyer",
		role: "buyer",
		hashedPassword: hashed,
	});

	const org = await prisma.organization.create({
		data: {
			name: ORG_NAME,
			slug: ORG_SLUG,
			logo: photo(PH.hero, 400),
			metadata: { seed: true, brand: "nevali" } as Prisma.InputJsonValue,
		},
	});
	await prisma.member.create({
		data: { organizationId: org.id, userId: partner.id, role: "owner" },
	});
	await prisma.profile.create({
		data: {
			userId: partner.id,
			firstName: "Zineb",
			lastName: "Badr",
			phone: "+212 5 22 00 00 00",
			entityType: "Cosmetics Brand",
			entityName: ORG_NAME,
			registrationNumber: "RC-CASABLANCA-DEMO-2026",
			region: "Casablanca-Settat",
			city: "Casablanca",
			yearEstablished: "2019",
			website: "https://nevali-cosmetics.example",
			categories: ["Skincare", "Haircare", "Body care"] as unknown as Prisma.InputJsonValue,
			annualCapacity: "120k units / year",
			exportExperience: "5+ years",
			agreeTerms: true,
			agreeMarketing: false,
			publicTagline: "Moroccan lab, global standards.",
			businessDescription: "Nevali formulates and fills Moroccan cosmetics.",
			exportMarkets: "European Union, United Kingdom",
			valuesHighlight: "Women-led R&D · Ingredient transparency",
			profileImage: photo(PH.portrait, 800),
		},
	});

	const created: { id: string; name: string; variantId: string; price: string }[] =
		[];
	for (const item of CATALOG) {
		const product = await prisma.product.create({
			data: {
				organizationId: org.id,
				name: item.name,
				category: item.category,
				cosmeticsCategory: item.cosmeticsCategory,
				description: item.description,
				moq: "1",
				status: item.status,
				rejectionReason: item.rejectionReason ?? null,
				featuredOnHome: item.featuredOnHome ?? false,
				paymentOption: ProductPaymentOption.BOTH,
				variants: {
					create: item.variants.map((v, idx) => ({
						name: v.name,
						unit: v.unit,
						minOrderQuantity: 1,
						price: new Prisma.Decimal(v.price),
						quantityOnHand: v.qty,
						inStock: v.inStock ?? true,
						sortOrder: idx,
					})),
				},
			},
			include: { variants: true },
		});
		await prisma.productImage.create({
			data: { productId: product.id, url: photo(item.image, 1400), sortOrder: 0 },
		});
		const firstVariant = product.variants[0];
		if (firstVariant) {
			created.push({
				id: product.id,
				name: product.name,
				variantId: firstVariant.id,
				price: firstVariant.price.toFixed(2),
			});
		}
	}

	// Journal articles: 2 published + 1 draft.
	const pub = new Date("2026-05-10T12:00:00.000Z");
	await prisma.producerArticle.createMany({
		data: [
			{
				organizationId: org.id,
				title: "How we trace argan from cooperative to bottle",
				tag: "Community",
				excerpt: "Origin, acidity, and cold-chain in one place.",
				body: "## Traceability\n\nWe document press date, acidity, and fill dates.",
				coverGradient: "linear-gradient(135deg, #1a1a1a, #777)",
				coverImageUrl: photo(PH.argan, 1200),
				status: "PUBLISHED",
				publishedAt: pub,
			},
			{
				organizationId: org.id,
				title: "INCI lists for EU-conscious shoppers",
				tag: "Compliance",
				excerpt: "What buyers see on a label and why it matters.",
				body: "Versioned INCI per market, batch-linked COA references.",
				coverGradient: "linear-gradient(135deg, #222, #999)",
				coverImageUrl: null,
				status: "PUBLISHED",
				publishedAt: new Date(pub.getTime() - 86_400_000),
			},
			{
				organizationId: org.id,
				title: "Draft: winter barrier routines",
				tag: "Formulation",
				excerpt: null,
				body: "Work in progress — not public yet.",
				coverGradient: "linear-gradient(135deg, #1a1a1a, #777)",
				status: "DRAFT",
				publishedAt: null,
			},
		],
	});

	// One existing CONFIRMED order for the producer (orders/admin tests).
	const orderProduct = created[0];
	if (orderProduct) {
		await prisma.shopOrder.create({
			data: {
				buyerUserId: buyer.id,
				buyerName: "Demo Buyer",
				buyerEmail: BUYER_EMAIL,
				buyerPhone: "+212600000000",
				addressLine1: "1 Test Street",
				city: "Casablanca",
				postalCode: "20000",
				country: "Morocco",
				paymentMethod: "COD",
				status: "CONFIRMED",
				lines: {
					create: [
						{
							productId: orderProduct.id,
							productVariantId: orderProduct.variantId,
							variantName: "100 ml glass",
							organizationId: org.id,
							productName: orderProduct.name,
							unitPrice: new Prisma.Decimal(orderProduct.price),
							quantity: 2,
							stockTracked: true,
							stockDecremented: true,
						},
					],
				},
			},
		});
	}

	console.log("✓ E2E seed complete");
	console.log(`  Admin:    ${ADMIN_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Producer: ${PARTNER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Buyer:    ${BUYER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(
		`  Products: ${CATALOG.length} (4 APPROVED, 1 PENDING, 1 REJECTED; 1 low-stock; 1 featured)`,
	);
	console.log("  Journal:  2 published + 1 draft · Orders: 1 confirmed");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
