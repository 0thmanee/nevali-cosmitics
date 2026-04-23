/**
 * nevali seed — single producer (NEVALI Cosmetics), diverse APPROVED catalog + Unsplash images.
 * Resets org-scoped data and all users except the superadmin, then rebuilds demo accounts.
 * Run: pnpm prisma db seed
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
	Prisma,
	PrismaClient,
	ProductCategory,
	ProductPaymentOption,
	ReviewRating,
} from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
	log: ["error", "warn"],
});

const SEED_PASSWORD = "Password123!";

const ADMIN_EMAIL = "admin@nevali-cosmetics.local";
const PARTNER_EMAIL = "studio@nevali-cosmetics.local";
const BUYER_EMAIL = "buyer@nevali-cosmetics.local";

const ORG_SLUG = "nevali-cosmetics";
const ORG_NAME = "NEVALI Cosmetics";

/** Verified Unsplash photo ids (same set as `src/lib/cosmetics-image-placeholders.ts`). */
function cosmeticsPhoto(photoId: string, width: number): string {
	return `https://images.unsplash.com/photo-${photoId}?q=80&auto=format&fit=crop&w=${width}`;
}

const PH = {
	flatlay: "1612817288484-6f916006741a",
	creams: "1571875257727-256c39da42af",
	argan: "1609597876248-e5f7c84f0295",
	heroAlt: "1596462502278-27bfdc403348",
	brushes: "1522335789203-aabd1fc54bc9",
	wellness: "1487412912498-0447578fcca8",
	spa: "1570172619644-dfd03ed5d881",
	vanity: "1556228720-195a672e8a03",
	hero: "1617897903246-719242758050",
	portrait: "1573496359142-b8d87734a5a2",
} as const;

type SeedVariant = {
	name: string;
	unit: string;
	priceMad: string;
	minOrderQuantity?: number;
	quantityOnHand?: number;
};

type SeedProduct = {
	name: string;
	/** Free-form label (filters, PDP, admin). */
	category: string;
	cosmeticsCategory: ProductCategory;
	description: string;
	ingredients?: string;
	capacity?: string;
	moq?: string;
	imageIds: readonly [string, ...string[]];
	variants: SeedVariant[];
};

const CATALOG: SeedProduct[] = [
	{
		name: "Cold-pressed argan oil — signature",
		category: "Botanical oils",
		cosmeticsCategory: ProductCategory.HAIRCARE,
		description:
			"Single-origin argan from the Souss: slow cold-press, lab-tested acidity, glass bottle. Daily face, hair ends, and cuticle nutrition.",
		ingredients: "100% Argania spinosa kernel oil",
		capacity: "100 ml",
		moq: "24 bottles",
		imageIds: [PH.argan, PH.vanity],
		variants: [
			{
				name: "100 ml glass",
				unit: "bottle",
				priceMad: "189.00",
				quantityOnHand: 400,
			},
			{
				name: "30 ml travel",
				unit: "bottle",
				priceMad: "79.00",
				quantityOnHand: 320,
			},
		],
	},
	{
		name: "Prickly pear seed oil",
		category: "Botanical oils",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Rare lipid profile for barrier repair and glow. Best as PM serum or mixed into cream.",
		ingredients: "Opuntia ficus-indica seed oil",
		capacity: "15 ml",
		imageIds: [PH.heroAlt, PH.creams],
		variants: [
			{
				name: "15 ml dropper",
				unit: "bottle",
				priceMad: "349.00",
				quantityOnHand: 180,
			},
		],
	},
	{
		name: "Damask rose water mist",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Steam-distilled rose water for toning, setting makeup, or mid-day refresh.",
		ingredients: "Rosa damascena flower water, potassium sorbate",
		capacity: "200 ml",
		imageIds: [PH.spa, PH.flatlay],
		variants: [
			{
				name: "200 ml mist",
				unit: "bottle",
				priceMad: "96.00",
				quantityOnHand: 500,
			},
		],
	},
	{
		name: "Ghassoul clay mask — weekly reset",
		category: "Hammam & body",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description:
			"Volcanic clay blend for scalp and body. Mix with rose water for a silky paste.",
		ingredients: "Moroccan lava clay, illite, kaolin",
		capacity: "250 g",
		imageIds: [PH.wellness, PH.spa],
		variants: [
			{
				name: "250 g pouch",
				unit: "pouch",
				priceMad: "112.00",
				quantityOnHand: 260,
			},
		],
	},
	{
		name: "Beldi black soap — eucalyptus",
		category: "Hammam & body",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description:
			"Traditional olive-paste soap for hammam exfoliation. Pair with a kessa glove.",
		ingredients: "Olive oil, potassium hydroxide, eucalyptus globulus leaf oil",
		capacity: "200 g",
		imageIds: [PH.flatlay, PH.hero],
		variants: [
			{
				name: "200 g jar",
				unit: "jar",
				priceMad: "68.00",
				quantityOnHand: 420,
			},
		],
	},
	{
		name: "Argan & rhassoul hair mask",
		category: "Haircare",
		cosmeticsCategory: ProductCategory.HAIRCARE,
		description:
			"Weekly treatment for dry curls and color-treated hair. Rinse thoroughly, air dry.",
		ingredients:
			"Argan oil, rhassoul clay, shea butter, behentrimonium chloride",
		capacity: "300 ml",
		imageIds: [PH.vanity, PH.argan],
		variants: [
			{
				name: "300 ml tube",
				unit: "tube",
				priceMad: "142.00",
				quantityOnHand: 210,
			},
			{
				name: "75 ml travel",
				unit: "tube",
				priceMad: "52.00",
				quantityOnHand: 300,
			},
		],
	},
	{
		name: "Neroli night serum",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Lightweight oil-serum with neroli and squalane for overnight radiance.",
		ingredients:
			"Squalane, caprylic/capric triglyceride, citrus aurantium amara flower oil",
		capacity: "30 ml",
		imageIds: [PH.creams, PH.portrait],
		variants: [
			{
				name: "30 ml",
				unit: "bottle",
				priceMad: "218.00",
				quantityOnHand: 190,
			},
		],
	},
	{
		name: "SPF 50 mineral day cream",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Zinc-based broad spectrum SPF with a sheer beige tint for light–medium tones.",
		ingredients: "Zinc oxide, titanium dioxide, niacinamide, glycerin",
		capacity: "50 ml",
		imageIds: [PH.heroAlt, PH.flatlay],
		variants: [
			{
				name: "50 ml airless",
				unit: "bottle",
				priceMad: "168.00",
				quantityOnHand: 350,
			},
		],
	},
	{
		name: "Kessa exfoliating glove",
		category: "Tools & accessories",
		cosmeticsCategory: ProductCategory.TOOLS_ACCESSORIES,
		description:
			"Authentic crepe texture for hammam-style exfoliation after beldi soap.",
		imageIds: [PH.brushes, PH.wellness],
		variants: [
			{
				name: "One size",
				unit: "item",
				priceMad: "42.00",
				quantityOnHand: 600,
			},
		],
	},
	{
		name: "Kohl pencil — mineral brown",
		category: "Makeup",
		cosmeticsCategory: ProductCategory.MAKEUP,
		description:
			"Soft glide pencil inspired by traditional kohl, ophthalmologist-tested.",
		imageIds: [PH.portrait, PH.brushes],
		variants: [
			{ name: "1.2 g", unit: "item", priceMad: "58.00", quantityOnHand: 800 },
		],
	},
	{
		name: "Orange blossom eau fraîche",
		category: "Fragrance",
		cosmeticsCategory: ProductCategory.FRAGRANCE,
		description:
			"Bright citrus-floral mist for hair and décolleté. Alcohol-free formula.",
		ingredients: "Aqua, citrus aurantium amara flower water, fragrance",
		capacity: "100 ml",
		imageIds: [PH.spa, PH.hero],
		variants: [
			{
				name: "100 ml",
				unit: "bottle",
				priceMad: "124.00",
				quantityOnHand: 240,
			},
		],
	},
	{
		name: "Rhassoul volumizing shampoo",
		category: "Haircare",
		cosmeticsCategory: ProductCategory.HAIRCARE,
		description:
			"Gentle sulfate-free cleanse with rhassoul and panthenol for fine hair.",
		capacity: "400 ml",
		imageIds: [PH.vanity, PH.wellness],
		variants: [
			{
				name: "400 ml pump",
				unit: "bottle",
				priceMad: "118.00",
				quantityOnHand: 280,
			},
		],
	},
	{
		name: "Prickly pear day cream",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Matte-finish day cream with prickly pear extract and ceramide NP.",
		capacity: "50 ml",
		imageIds: [PH.creams, PH.flatlay],
		variants: [
			{
				name: "50 ml jar",
				unit: "jar",
				priceMad: "198.00",
				quantityOnHand: 220,
			},
		],
	},
	{
		name: "Amber & musk hair perfume",
		category: "Hair & fragrance",
		cosmeticsCategory: ProductCategory.FRAGRANCE,
		description: "Silicone-free hair mist with warm amber and clean musk.",
		capacity: "50 ml",
		imageIds: [PH.heroAlt, PH.argan],
		variants: [
			{
				name: "50 ml",
				unit: "bottle",
				priceMad: "134.00",
				quantityOnHand: 200,
			},
		],
	},
	{
		name: "Shea & argan body butter",
		category: "Body care",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description:
			"Rich whip for elbows, knees, and post-sun skin. Unscented base.",
		capacity: "200 ml",
		imageIds: [PH.wellness, PH.creams],
		variants: [
			{ name: "200 ml", unit: "jar", priceMad: "108.00", quantityOnHand: 310 },
		],
	},
	{
		name: "Vitamin C radiance serum",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"15% ethyl ascorbic acid in a hydrating base. Use AM under SPF.",
		capacity: "30 ml",
		imageIds: [PH.flatlay, PH.spa],
		variants: [
			{
				name: "30 ml",
				unit: "bottle",
				priceMad: "228.00",
				quantityOnHand: 170,
			},
		],
	},
	{
		name: "Argan lip balm — mint",
		category: "Makeup",
		cosmeticsCategory: ProductCategory.MAKEUP,
		description: "Sheer balm with cold-pressed argan and peppermint.",
		imageIds: [PH.vanity, PH.portrait],
		variants: [
			{ name: "4.5 g", unit: "item", priceMad: "46.00", quantityOnHand: 900 },
		],
	},
	{
		name: "Jasmine hair veil",
		category: "Hair & fragrance",
		cosmeticsCategory: ProductCategory.HAIRCARE,
		description: "Fine mist for lengths; layers with orange blossom eau.",
		capacity: "80 ml",
		imageIds: [PH.spa, PH.brushes],
		variants: [
			{ name: "80 ml", unit: "bottle", priceMad: "98.00", quantityOnHand: 250 },
		],
	},
	{
		name: "Rose ghassoul body paste",
		category: "Hammam & body",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description: "Pre-mixed paste with rose absolute for quick hammam at home.",
		capacity: "400 g",
		imageIds: [PH.wellness, PH.hero],
		variants: [
			{
				name: "400 g tub",
				unit: "tub",
				priceMad: "132.00",
				quantityOnHand: 150,
			},
		],
	},
	{
		name: "Biotin beauty gummies",
		category: "Supplements",
		cosmeticsCategory: ProductCategory.SUPPLEMENTS,
		description: "Biotin, zinc, and berry flavor — 30-day supply.",
		imageIds: [PH.flatlay, PH.heroAlt],
		variants: [
			{
				name: "60 gummies",
				unit: "jar",
				priceMad: "88.00",
				quantityOnHand: 400,
			},
		],
	},
	{
		name: "Shimmer dry oil — golden",
		category: "Body care",
		cosmeticsCategory: ProductCategory.BODY_CARE,
		description: "Silky dry oil with micro-shimmer for legs and shoulders.",
		capacity: "100 ml",
		imageIds: [PH.argan, PH.vanity],
		variants: [
			{
				name: "100 ml",
				unit: "bottle",
				priceMad: "128.00",
				quantityOnHand: 230,
			},
		],
	},
	{
		name: "Micellar cleansing water",
		category: "Skincare",
		cosmeticsCategory: ProductCategory.SKINCARE,
		description:
			"Removes SPF and light makeup without rubbing. Rinse optional.",
		capacity: "400 ml",
		imageIds: [PH.creams, PH.spa],
		variants: [
			{
				name: "400 ml",
				unit: "bottle",
				priceMad: "92.00",
				quantityOnHand: 380,
			},
		],
	},
	{
		name: "Brow gel — clear",
		category: "Makeup",
		cosmeticsCategory: ProductCategory.MAKEUP,
		description: "Flexible hold for brushed-up brows. Flake-free.",
		imageIds: [PH.brushes, PH.portrait],
		variants: [
			{ name: "8 ml", unit: "tube", priceMad: "54.00", quantityOnHand: 520 },
		],
	},
	{
		name: "Amlou spread — argan & almond",
		category: "Botanical oils",
		cosmeticsCategory: ProductCategory.OTHER,
		description:
			"Edible-beauty crossover: argan, roasted almond, honey. Limited batches.",
		capacity: "200 g",
		imageIds: [PH.hero, PH.flatlay],
		variants: [
			{
				name: "200 g jar",
				unit: "jar",
				priceMad: "76.00",
				quantityOnHand: 140,
			},
		],
	},
];

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

	const partner = await upsertCredentialUser({
		email: PARTNER_EMAIL,
		name: "Yasmine El Idrissi",
		role: "partner",
		status: "enabled",
		profileCompleted: true,
		hashedPassword,
	});

	await upsertCredentialUser({
		email: BUYER_EMAIL,
		name: "Demo Buyer",
		role: "buyer",
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
			firstName: "Yasmine",
			lastName: "El Idrissi",
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
				"NEVALI Cosmetics formulates and fills skincare, hair, and body products with Moroccan actives (argan, ghassoul, rose, prickly pear). This database seed populates a realistic catalog for demos and QA.",
			exportMarkets:
				"European Union, United Kingdom, Gulf Cooperation Council, North America",
			valuesHighlight:
				"Women-led R&D · HACCP-aligned production · Ingredient transparency",
			profileImage: cosmeticsPhoto(PH.portrait, 800),
		},
	});

	let productCount = 0;
	for (const item of CATALOG) {
		const created = await prisma.product.create({
			data: {
				organizationId: org.id,
				name: item.name,
				category: item.category,
				cosmeticsCategory: item.cosmeticsCategory,
				description: item.description,
				ingredients: item.ingredients ?? null,
				capacity: item.capacity ?? null,
				moq: item.moq ?? "1",
				status: "APPROVED",
				paymentOption: ProductPaymentOption.BOTH,
				variants: {
					create: item.variants.map((v, idx) => ({
						name: v.name,
						unit: v.unit,
						minOrderQuantity: v.minOrderQuantity ?? 1,
						price: new Prisma.Decimal(v.priceMad),
						quantityOnHand: v.quantityOnHand ?? 200,
						inStock: true,
						sortOrder: idx,
					})),
				},
			},
			include: { variants: true },
		});

		const imgs = item.imageIds.map((photoId, sortOrder) => ({
			productId: created.id,
			url: cosmeticsPhoto(photoId, 1400),
			sortOrder,
		}));
		await prisma.productImage.createMany({ data: imgs });
		productCount += 1;
	}

	await prisma.product.updateMany({
		where: {
			organizationId: org.id,
			name: "Cold-pressed argan oil — signature",
		},
		data: { featuredOnHome: true },
	});

	const someProducts = await prisma.product.findMany({
		where: { organizationId: org.id },
		take: 5,
		select: { id: true, name: true },
	});

	const reviewBodies = [
		{
			rating: ReviewRating.FIVE,
			title: "Texture is incredible",
			body: "Absorbs quickly, no greasy film. Will repurchase.",
		},
		{
			rating: ReviewRating.FOUR,
			title: "Lovely scent",
			body: "Subtle and natural. Shipping was fast within Morocco.",
		},
		{
			rating: ReviewRating.FIVE,
			title: "My salon clients ask for it",
			body: "Professional results on color-treated hair.",
		},
	] as const;

	let r = 0;
	for (const p of someProducts) {
		const spec = reviewBodies[r % reviewBodies.length];
		if (!spec) break;
		r += 1;
		await prisma.productReview.create({
			data: {
				productId: p.id,
				buyerName: r % 2 === 0 ? "Sara M." : "Amine K.",
				buyerEmail: `reviewer${r}@example.com`,
				rating: spec.rating,
				title: spec.title,
				body: spec.body,
				isVerifiedPurchase: r % 2 === 0,
			},
		});
	}

	console.log("✓ Seed complete");
	console.log(`  Admin:     ${ADMIN_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Partner:   ${PARTNER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Buyer:     ${BUYER_EMAIL} / ${SEED_PASSWORD}`);
	console.log(`  Org:       /artisans/${ORG_SLUG}`);
	console.log(`  Products:  ${productCount} APPROVED (with images; argan oil = homepage hero)`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
