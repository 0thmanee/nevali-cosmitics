/**
 * CraftHouse seed: admin, artisan partners (orgs + users + profiles), craft products, certifications,
 * training programs + modules + enrollments, RFQs (including a threaded NEGOTIATING demo),
 * RfqMessage + UserNotification samples, contracts, support tickets + status events.
 * Partner copy and product categories follow the public site (Moroccan crafts: carpets, pottery,
 * leather, metal lanterns, etc.). Media (product images, training program media) are left to upload later.
 * Certification `fileUrl` may use placeholder hosts; replace with Supabase/CDN URLs in production.
 *
 * Schema coverage:
 *   User, Profile, Account — admin + demo buyer + partners (`notificationPrefs` optional)
 *   Organization, Member — partner orgs
 *   Product — 3 per org + 1 ProductImage each (Unsplash URLs; Next.js allows images.unsplash.com)
 *   Certification — 1–2 per org (placeholder fileUrl)
 *   TrainingProgram, TrainingModule, TrainingEnrollment — 3 programs, modules, all orgs
 *   Rfq — 3 per org (NEW, QUOTED, CANCELLED) + buyer-linked demo on first org (NEGOTIATING + `negotiationTurn` + thread)
 *   RfqMessage — sample thread on buyer-linked demo RFQ
 *   UserNotification — unread RFQ thread alerts for demo buyer + first partner (relative `linkHref`, `contextRfqId`)
 *   Contract — 2 per org (ACTIVE, COMPLETED)
 *   SupportTicket — 3 per org (OPEN, IN_REVIEW, RESOLVED; some adminNotes)
 *   SupportTicketStatusEvent — 1 per ticket
 *   RfqMessageAttachment, RfqThreadEmailThrottle — not seeded (runtime / uploads only)
 *   Session, Verification, Invitation, TrainingProgramMedia — not seeded
 *
 * Run: pnpm prisma db seed
 * Default password for all seeded users: Password123!
 * Admin login: admin@crafthouse.local
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
	log: ["error"],
});

const SEED_PASSWORD = " ";
const ADMIN_EMAIL = "admin@crafthouse.local";
const DEMO_THREAD_RFQ_ID = "seed-rfq-buyer-demo-linked";

async function main() {
	const hashedPassword = await hashPassword(SEED_PASSWORD);

	// —— 1. Admin user (no org, no profile) ——
	const admin = await prisma.user.upsert({
		where: { email: ADMIN_EMAIL },
		update: {
			name: "CraftHouse Admin",
			role: "superadmin",
			status: "enabled",
			profileCompleted: true,
		},
		create: {
			name: "CraftHouse Admin",
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
	if (adminAccount) {
		await prisma.account.update({
			where: { id: adminAccount.id },
			data: { password: hashedPassword },
		});
	} else {
		await prisma.account.create({
			data: {
				userId: admin.id,
				providerId: "credential",
				accountId: admin.email,
				password: hashedPassword,
			},
		});
	}

	console.log("Admin:", admin.email);

	// —— 2. Partner organizations + users + profiles + members ——
	const partners: {
		orgName: string;
		slug: string;
		userEmail: string;
		userName: string;
	}[] = [
		{
			orgName: "Coopérative Tissages Berbères Atlas",
			slug: "tissages-berberes-atlas",
			userEmail: "contact@tissages-berberes.demo.ma",
			userName: "Rachid El Amrani",
		},
		{
			orgName: "Atelier Fassi de Poterie & Zellige",
			slug: "poterie-zellige-fes",
			userEmail: "studio@poterie-fes.demo.ma",
			userName: "Fatima Bennani",
		},
		{
			orgName: "Maroquinerie Médina Fès",
			slug: "cuir-medina-fes",
			userEmail: "atelier@cuir-fes.demo.ma",
			userName: "Mohammed Idrissi",
		},
		{
			orgName: "Lanternes & Laiton Marrakech",
			slug: "lanternes-marrakech",
			userEmail: "forge@lanternes-marrakech.demo.ma",
			userName: "Khadija Tazi",
		},
	];

	/** Public artisan page content (/artisans/[slug]) — Moroccan craft / heritage positioning. */
	const partnerPublicProfileBySlug: Record<
		string,
		{
			publicTagline: string;
			businessDescription: string;
			exportMarkets: string;
			valuesHighlight: string;
			website?: string;
			yearEstablished?: string;
			annualCapacity?: string;
			exportExperience?: string;
			registrationNumber?: string;
			region: string;
			city: string;
			categories: string[];
		}
	> = {
		"tissages-berberes-atlas": {
			publicTagline:
				"Zrabd & Berber carpets — hand-knotted wool, patterns from the High Atlas",
			businessDescription:
				"Our cooperative brings together weavers from villages around Ouarzazate and the Todra. We specialise in Beni Ourain–style rugs, flatweaves, and custom dimensions for hospitality and retail. Natural undyed wool and vegetable dyes on request; each piece is finished and inspected before export crating.",
			exportMarkets:
				"European Union, United Kingdom, United States, Gulf (UAE, Qatar)",
			valuesHighlight:
				"Women-led weaving ateliers · Traceable wool lots · Fair compensation · Heritage motifs documented per piece",
			website: "www.tissages-berberes-atlas.ma",
			yearEstablished: "2006",
			annualCapacity: "~400 m² carpets / year (custom & series)",
			exportExperience: "5+ years",
			registrationNumber: "RC-12345-OUA",
			region: "Drâa-Tafilalet",
			city: "Ouarzazate",
			categories: ["Carpets (Zrabd)", "Berber Textiles"],
		},
		"poterie-zellige-fes": {
			publicTagline:
				"Fez ceramics & zellige — hand-cut tile, tableware, and architectural panels",
			businessDescription:
				"We work from a workshop in the Fez medina with master cutters and kiln operators trained in Fassi traditions. Orders range from restoration zellige for hotels to dinnerware and decorative pieces. Lead times scale with complexity; we provide technical sheets and glaze composition on request.",
			exportMarkets: "France, Germany, Netherlands, Canada, Middle East",
			valuesHighlight:
				"Hand-cut zellige · Mineral glazes · Small-batch firing · B2B samples on request",
			website: "www.poterie-zellige-fes.ma",
			yearEstablished: "2012",
			annualCapacity: "~2,500 m² zellige equivalent / year (mixed formats)",
			exportExperience: "3–5 years",
			registrationNumber: "RC-88990-FES",
			region: "Fès-Meknès",
			city: "Fès",
			categories: ["Pottery & Ceramics", "Zellige"],
		},
		"cuir-medina-fes": {
			publicTagline:
				"Vegetable-tanned leather — babouches, bags, and belts from the Fez tanneries",
			businessDescription:
				"We partner with tannery families in Fez for full-grain hides finished with traditional vegetable tanning. Our workshop stitches babouches, tote bags, and belts for boutiques and private label. English and French for export paperwork; we can supply care instructions and composition labels for EU retail.",
			exportMarkets: "EU, UK, Japan, North America",
			valuesHighlight:
				"Vegetable tanning · Hand-stitched finishing · Batch traceability · Plastic-free packaging options",
			website: "www.cuir-medina-fes.ma",
			yearEstablished: "2009",
			annualCapacity: "~8,000 pairs & small leather goods / year",
			exportExperience: "5+ years",
			registrationNumber: "RC-44556-FES",
			region: "Fès-Meknès",
			city: "Fès",
			categories: ["Leather Goods", "Babouches"],
		},
		"lanternes-marrakech": {
			publicTagline:
				"Hammered brass & copper lanterns — medina metalwork for interiors and hospitality",
			businessDescription:
				"Our smiths and chisellers in Marrakech produce pierced brass and copper lanterns, pendants, and sconces with Islamic geometric patterns. We work with interior designers on custom sizes and patinas, and pack for sea or air freight with reinforced crates.",
			exportMarkets: "EU, Gulf, United States",
			valuesHighlight:
				"Hand-hammered metalwork · Patina options · Hospitality references on request · Crated export",
			website: "www.lanternes-marrakech.ma",
			yearEstablished: "2015",
			annualCapacity: "~3,500 lanterns & fixtures / year",
			exportExperience: "1–3 years",
			registrationNumber: "RC-22110-RAK",
			region: "Marrakech-Safi",
			city: "Marrakech",
			categories: ["Metal Lanterns", "Brasswork"],
		},
	};

	const orgIds: string[] = [];
	for (const p of partners) {
		const org = await prisma.organization.upsert({
			where: { slug: p.slug },
			update: {},
			create: { name: p.orgName, slug: p.slug },
		});
		orgIds.push(org.id);

		const user = await prisma.user.upsert({
			where: { email: p.userEmail },
			update: {},
			create: {
				name: p.userName,
				email: p.userEmail,
				emailVerified: true,
				role: "partner",
				status: "enabled",
				profileCompleted: true,
			},
		});

		const partnerAccount = await prisma.account.findFirst({
			where: {
				userId: user.id,
				providerId: "credential",
				accountId: user.email,
			},
		});
		if (partnerAccount) {
			await prisma.account.update({
				where: { id: partnerAccount.id },
				data: { password: hashedPassword },
			});
		} else {
			await prisma.account.create({
				data: {
					userId: user.id,
					providerId: "credential",
					accountId: user.email,
					password: hashedPassword,
				},
			});
		}

		await prisma.member.upsert({
			where: {
				organizationId_userId: { organizationId: org.id, userId: user.id },
			},
			update: {},
			create: {
				organizationId: org.id,
				userId: user.id,
				role: "owner",
			},
		});

		const pub = partnerPublicProfileBySlug[p.slug];
		if (!pub)
			throw new Error(`Missing public profile blueprint for slug: ${p.slug}`);

		await prisma.profile.upsert({
			where: { userId: user.id },
			update: {
				entityName: p.orgName,
				region: pub.region,
				city: pub.city,
				categories: pub.categories,
				website: pub.website ?? null,
				yearEstablished: pub.yearEstablished ?? null,
				annualCapacity: pub.annualCapacity ?? null,
				exportExperience: pub.exportExperience ?? null,
				registrationNumber: pub.registrationNumber ?? null,
				publicTagline: pub.publicTagline,
				businessDescription: pub.businessDescription,
				exportMarkets: pub.exportMarkets,
				valuesHighlight: pub.valuesHighlight,
			},
			create: {
				userId: user.id,
				firstName: p.userName.split(" ")[0] ?? p.userName,
				lastName: p.userName.split(" ").slice(1).join(" ") || "—",
				phone: "+212 6XX XXX XXX",
				entityType:
					p.slug === "poterie-zellige-fes" ? "Company / SARL" : "Cooperative",
				entityName: p.orgName,
				registrationNumber: pub.registrationNumber ?? null,
				region: pub.region,
				city: pub.city,
				yearEstablished: pub.yearEstablished ?? null,
				website: pub.website ?? null,
				categories: pub.categories,
				annualCapacity: pub.annualCapacity ?? null,
				exportExperience: pub.exportExperience ?? null,
				publicTagline: pub.publicTagline,
				businessDescription: pub.businessDescription,
				exportMarkets: pub.exportMarkets,
				valuesHighlight: pub.valuesHighlight,
				agreeTerms: true,
				agreeMarketing: false,
			},
		});
	}
	console.log(
		"Partners:",
		partners.length,
		"orgs with users, profiles, and public producer copy",
	);

	// —— 2b. Demo buyer (sign in → /buyer; seed includes one linked RFQ) ——
	const demoBuyer = await prisma.user.upsert({
		where: { email: "buyer.demo@craft-house.local" },
		update: {
			role: "buyer",
			status: "enabled",
			profileCompleted: true,
			signupSource: "buyer",
		},
		create: {
			name: "Demo Buyer",
			email: "buyer.demo@craft-house.local",
			emailVerified: true,
			role: "buyer",
			status: "enabled",
			profileCompleted: true,
			signupSource: "buyer",
		},
	});
	const buyerAccount = await prisma.account.findFirst({
		where: {
			userId: demoBuyer.id,
			providerId: "credential",
			accountId: demoBuyer.email,
		},
	});
	if (buyerAccount) {
		await prisma.account.update({
			where: { id: buyerAccount.id },
			data: { password: hashedPassword },
		});
	} else {
		await prisma.account.create({
			data: {
				userId: demoBuyer.id,
				providerId: "credential",
				accountId: demoBuyer.email,
				password: hashedPassword,
			},
		});
	}
	console.log("Demo buyer:", demoBuyer.email);

	// —— 3. Products + hero images (Unsplash — license: unsplash.com/license; URLs verified HTTP 200)
	const productData: {
		organizationId: string;
		name: string;
		category: string;
		moq?: string;
		capacity?: string;
		imageUrl: string;
		/** Wholesale unit price in MAD (demo catalog). */
		unitPriceMad: number;
		variantUnit: string;
	}[] = [];
	/** One craft vertical per seeded org (order matches `partners` / orgIds). */
	const craftCatalogByOrgIndex: {
		category: string;
		items: {
			name: string;
			moq: string;
			capacity: string;
			imageUrl: string;
			unitPriceMad: number;
			/** Billing unit for the default variant (e.g. m² for zellige). */
			variantUnit?: string;
		}[];
	}[] = [
		{
			category: "Carpets (Zrabd)",
			items: [
				{
					name: "Tapis Beni Ourain — laine naturelle (sur commande)",
					moq: "1 piece (min. 12 m² series)",
					capacity: "120 m² / year series",
					imageUrl:
						"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 12_800,
				},
				{
					name: "Kilim berbère — bandes et losanges",
					moq: "4 pieces",
					capacity: "80 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1572123979839-3749e9973aba?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 3_400,
				},
				{
					name: "Tapis Zrabd — motifs atlas (échantillon atelier)",
					moq: "1 piece",
					capacity: "—",
					imageUrl:
						"https://images.unsplash.com/photo-1606885118474-c8baf907e998?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 950,
				},
			],
		},
		{
			category: "Pottery & Ceramics",
			items: [
				{
					name: "Service à thé Fassi — 12 couverts peint main",
					moq: "25 sets",
					capacity: "400 sets / year",
					imageUrl:
						"https://images.unsplash.com/photo-1710982280568-d8e035597b3e?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 2_450,
				},
				{
					name: "Zellige 10×10 — lot restauration (couleurs classiques)",
					moq: "80 m²",
					capacity: "1,200 m² / year",
					imageUrl:
						"https://images.unsplash.com/photo-1762380371774-33cf970e5e8e?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 385,
					variantUnit: "m²",
				},
				{
					name: "Plats et tagines émaillés — série hôtellerie",
					moq: "120 pieces",
					capacity: "2,000 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1557509959-69ef137d9339?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 195,
				},
			],
		},
		{
			category: "Leather Goods",
			items: [
				{
					name: "Babouches homme / femme — cuir tanné végétal",
					moq: "48 pairs",
					capacity: "4,000 pairs / year",
					imageUrl:
						"https://images.unsplash.com/photo-1761416182630-9a5a974e3fca?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 165,
					variantUnit: "pair",
				},
				{
					name: "Sac cabas médina — grand format",
					moq: "24 pieces",
					capacity: "600 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1585818464690-e94affafa7ac?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 485,
				},
				{
					name: "Ceintures et porte-monnaie — série boutique",
					moq: "100 pieces",
					capacity: "3,500 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1637868796504-32f45a96d5a0?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 78,
				},
			],
		},
		{
			category: "Metal Lanterns",
			items: [
				{
					name: "Lanterne suspendue laiton ajouré — grand modèle",
					moq: "12 pieces",
					capacity: "600 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1760727467204-981086f6adfc?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 1_720,
				},
				{
					name: "Applique murale cuivre — motif géométrique",
					moq: "20 pieces",
					capacity: "800 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1774853672959-1a6a6e0f8b5d?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 920,
				},
				{
					name: "Photophore table — série spa / riad",
					moq: "36 pieces",
					capacity: "1,200 pieces / year",
					imageUrl:
						"https://images.unsplash.com/photo-1760727466999-2a525d96ce6b?auto=format&fit=crop&w=1600&q=85",
					unitPriceMad: 265,
				},
			],
		},
	];
	/*
	 * Image picks (Unsplash): interior/wool rug · large patterned rug · woven textile detail;
	 * Moroccan-style tea set on tray · geometric mosaic/zellige · stacked clay tagines;
	 * colorful babouches in souk · leather shoulder bags on rack · leather belt/wallet/shoes flat lay;
	 * hanging brass lanterns · pierced lantern on textured wall · glowing colored lanterns at night.
	 */
	for (let i = 0; i < orgIds.length; i++) {
		const orgId = orgIds[i]!;
		const vertical = craftCatalogByOrgIndex[i] ?? craftCatalogByOrgIndex[0]!;
		for (const item of vertical.items) {
			productData.push({
				organizationId: orgId,
				name: item.name,
				category: vertical.category,
				moq: item.moq,
				capacity: item.capacity,
				imageUrl: item.imageUrl,
				unitPriceMad: item.unitPriceMad,
				variantUnit: item.variantUnit ?? "item",
			});
		}
	}

	const existingProducts = await prisma.product.count();
	if (existingProducts === 0) {
		for (const p of productData) {
			await prisma.product.create({
				data: {
					organizationId: p.organizationId,
					name: p.name,
					category: p.category,
					status: "APPROVED",
					moq: p.moq ?? null,
					capacity: p.capacity ?? null,
					paymentOption: "BOTH",
					variants: {
						create: {
							name: "Standard",
							unit: p.variantUnit,
							minOrderQuantity: 1,
							minOrderNote: p.moq?.trim() || null,
							price: p.unitPriceMad,
							quantityOnHand: 0,
							inStock: true,
							sortOrder: 0,
						},
					},
					images: {
						create: {
							url: p.imageUrl,
							sortOrder: 0,
						},
					},
				},
			});
		}
		console.log(
			"Products:",
			productData.length,
			"created with 1 Unsplash image each (see seed comments for license)",
		);
	} else {
		console.log("Products: already exist, skipping");
	}

	// —— 4. Certifications (placeholder fileUrl; some global, some linked to product) ——
	const existingCerts = await prisma.certification.count();
	if (existingCerts === 0) {
		for (let o = 0; o < orgIds.length; o++) {
			const orgId = orgIds[o]!;
			const firstProduct = await prisma.product.findFirst({
				where: { organizationId: orgId },
				select: { id: true },
			});
			await prisma.certification.create({
				data: {
					organizationId: orgId,
					productId: null,
					name: "Artisan cooperative — export readiness dossier",
					fileUrl: "https://example.com/placeholder-cert.pdf",
					status: o === 0 ? "PENDING" : "APPROVED",
				},
			});
			if (firstProduct) {
				await prisma.certification.create({
					data: {
						organizationId: orgId,
						productId: firstProduct.id,
						name: "Listing — composition & origin declaration",
						fileUrl: "https://example.com/placeholder-product-cert.pdf",
						status: "PENDING",
					},
				});
			}
		}
		console.log("Certifications: 1–2 per org (placeholder fileUrl)");
	} else {
		console.log("Certifications: already exist, skipping");
	}

	// —— 5. Training programs + modules (no media — upload later) ——
	const program1 = await prisma.trainingProgram.upsert({
		where: { id: "seed-program-export" },
		update: { provider: "CraftHouse Academy" },
		create: {
			id: "seed-program-export",
			name: "Export Documentation Mastery",
			description:
				"Learn how to prepare export documents, customs, and certifications for international buyers.",
			provider: "CraftHouse Academy",
			category: "Export & Trade",
			durationLabel: "8 modules · ~4 hours",
			level: "BEGINNER",
			status: "PUBLISHED",
		},
	});

	const program2 = await prisma.trainingProgram.upsert({
		where: { id: "seed-program-market" },
		update: { provider: "CraftHouse Academy" },
		create: {
			id: "seed-program-market",
			name: "Market Access & Buyers Requirements",
			description:
				"Understand buyer requirements, quality standards, and how to access European and other markets.",
			provider: "CraftHouse Academy",
			category: "Market Access",
			durationLabel: "6 modules · ~3 hours",
			level: "INTERMEDIATE",
			status: "PUBLISHED",
		},
	});

	const program3 = await prisma.trainingProgram.upsert({
		where: { id: "seed-program-quality" },
		update: { provider: "CraftHouse Academy" },
		create: {
			id: "seed-program-quality",
			name: "Quality & Traceability",
			description:
				"Implement quality checks and batch traceability for handmade craft exports and buyer audits.",
			provider: "CraftHouse Academy",
			category: "Quality",
			durationLabel: "5 modules · ~2.5 hours",
			level: "ADVANCED",
			status: "PUBLISHED",
		},
	});

	const programModules: {
		programId: string;
		title: string;
		sortOrder: number;
		description?: string;
	}[] = [
		{
			programId: program1.id,
			title: "Introduction to export documentation",
			sortOrder: 0,
		},
		{
			programId: program1.id,
			title: "Commercial invoice & packing list",
			sortOrder: 1,
		},
		{ programId: program1.id, title: "Certificates of origin", sortOrder: 2 },
		{
			programId: program1.id,
			title: "Customs & HS classification (handicrafts)",
			sortOrder: 3,
		},
		{
			programId: program2.id,
			title: "Buyer expectations & standards",
			sortOrder: 0,
		},
		{
			programId: program2.id,
			title: "EU market: safety & labelling for handmade goods",
			sortOrder: 1,
		},
		{
			programId: program2.id,
			title: "Finding and approaching buyers",
			sortOrder: 2,
		},
		{
			programId: program3.id,
			title: "Quality management basics",
			sortOrder: 0,
		},
		{ programId: program3.id, title: "Traceability systems", sortOrder: 1 },
	];

	for (const m of programModules) {
		await prisma.trainingModule.upsert({
			where: { id: `seed-mod-${m.programId}-${m.sortOrder}` },
			update: {},
			create: {
				id: `seed-mod-${m.programId}-${m.sortOrder}`,
				programId: m.programId,
				title: m.title,
				sortOrder: m.sortOrder,
				description: m.description ?? null,
			},
		});
	}
	console.log(
		"Training: 3 programs,",
		programModules.length,
		"modules (no media — upload in admin)",
	);

	// —— 6. Enrollments (assign programs to some orgs) ——
	const programs = [program1, program2, program3];
	for (const orgId of orgIds) {
		for (const program of programs) {
			await prisma.trainingEnrollment.upsert({
				where: {
					organizationId_programId: {
						organizationId: orgId,
						programId: program.id,
					},
				},
				update: {},
				create: {
					organizationId: orgId,
					programId: program.id,
					status: "NOT_STARTED",
					progress: 0,
					modulesCompleted: 0,
				},
			});
		}
	}
	console.log(
		"Training enrollments: all partner orgs assigned to all 3 programs",
	);

	// —— 7. RFQs (per org; mixed statuses including CANCELLED) ——
	const rfqStatuses = [
		"NEW",
		"QUOTED",
		"NEGOTIATING",
		"DECLINED",
		"CANCELLED",
	] as const;
	const rfqSeed: {
		id: string;
		organizationId: string;
		buyerName: string;
		product: string;
		quantity: string;
		status: (typeof rfqStatuses)[number];
		message?: string;
		estimatedValue?: string;
	}[] = [];
	const rfqProductLines = [
		{
			newP: "Berber carpet — custom dimensions",
			newQ: "35 m²",
			quotedP: "Kilim series — retail display",
			quotedQ: "40 pieces",
			cancelP: "Sample rug",
			cancelQ: "1 piece",
		},
		{
			newP: "Zellige panels — hotel renovation",
			newQ: "95 m²",
			quotedP: "Ceramic tableware — private label",
			quotedQ: "180 sets",
			cancelP: "Glaze sample set",
			cancelQ: "1 lot",
		},
		{
			newP: "Babouches — boutique chain",
			newQ: "200 pairs",
			quotedP: "Leather tote bags",
			quotedQ: "90 pieces",
			cancelP: "Swatch set",
			cancelQ: "1 kit",
		},
		{
			newP: "Brass lanterns — hospitality fit-out",
			newQ: "48 pieces",
			quotedP: "Wall sconces — geometric series",
			quotedQ: "120 pieces",
			cancelP: "Finish samples",
			cancelQ: "1 box",
		},
	] as const;
	for (let o = 0; o < orgIds.length; o++) {
		const line = rfqProductLines[o] ?? rfqProductLines[0]!;
		rfqSeed.push(
			{
				id: `seed-rfq-${o}-0`,
				organizationId: orgIds[o]!,
				buyerName: "Maison Décoration EU",
				product: line.newP,
				quantity: line.newQ,
				status: "NEW",
				message: "Looking for a recurring craft order with stable lead times.",
			},
			{
				id: `seed-rfq-${o}-1`,
				organizationId: orgIds[o]!,
				buyerName: "Import France SARL",
				product: line.quotedP,
				quantity: line.quotedQ,
				status: "QUOTED",
				estimatedValue: "~€8,200",
			},
			{
				id: `seed-rfq-${o}-2`,
				organizationId: orgIds[o]!,
				buyerName: "Cancelled buyer",
				product: line.cancelP,
				quantity: line.cancelQ,
				status: "CANCELLED",
			},
		);
	}
	for (const r of rfqSeed) {
		await prisma.rfq.upsert({
			where: { id: r.id },
			update: {},
			create: {
				id: r.id,
				organizationId: r.organizationId,
				buyerName: r.buyerName,
				buyerLocation: null,
				product: r.product,
				quantity: r.quantity,
				message: r.message ?? null,
				status: r.status,
				estimatedValue: r.estimatedValue ?? null,
				deadlineAt: null,
			},
		});
	}

	const firstOrgId = orgIds[0];
	if (firstOrgId) {
		await prisma.rfq.upsert({
			where: { id: DEMO_THREAD_RFQ_ID },
			update: {
				buyerUserId: demoBuyer.id,
				organizationId: firstOrgId,
				buyerName: "Demo Buyer",
				buyerLocation: "buyer.demo@craft-house.local",
				product:
					"[B2B Quote Request] Handwoven carpet line — wholesale (seed, linked account)",
				quantity: "1 crate (12 pieces)",
				message: "Seeded row for buyer portal QA — includes thread + alerts.",
				status: "NEGOTIATING",
				negotiationTurn: "PARTNER",
				estimatedValue: "~€4,200",
			},
			create: {
				id: DEMO_THREAD_RFQ_ID,
				organizationId: firstOrgId,
				buyerUserId: demoBuyer.id,
				buyerName: "Demo Buyer",
				buyerLocation: "buyer.demo@craft-house.local",
				product:
					"[B2B Quote Request] Handwoven carpet line — wholesale (seed, linked account)",
				quantity: "1 crate (12 pieces)",
				message: "Seeded row for buyer portal QA — includes thread + alerts.",
				status: "NEGOTIATING",
				negotiationTurn: "PARTNER",
				estimatedValue: "~€4,200",
				deadlineAt: null,
			},
		});
	}
	console.log(
		"RFQs:",
		rfqSeed.length + (firstOrgId ? 1 : 0),
		"(per-org rows + buyer-linked demo with thread)",
	);

	// —— 7b. Demo RFQ thread + in-app notifications (CraftHouse alerts / RFQ messages) ——
	if (firstOrgId) {
		const firstPartnerMembership = await prisma.member.findFirst({
			where: { organizationId: firstOrgId },
			select: { userId: true },
		});
		const firstPartnerUserId = firstPartnerMembership?.userId;
		if (firstPartnerUserId) {
			await prisma.rfqMessage.upsert({
				where: { id: "seed-rfq-msg-demo-1" },
				update: {},
				create: {
					id: "seed-rfq-msg-demo-1",
					rfqId: DEMO_THREAD_RFQ_ID,
					authorUserId: firstPartnerUserId,
					authorRole: "PARTNER",
					body: "Thanks for your inquiry — we can ship one crate next month. Preferred Incoterm?",
				},
			});
			await prisma.rfqMessage.upsert({
				where: { id: "seed-rfq-msg-demo-2" },
				update: {},
				create: {
					id: "seed-rfq-msg-demo-2",
					rfqId: DEMO_THREAD_RFQ_ID,
					authorUserId: demoBuyer.id,
					authorRole: "BUYER",
					body: "FOB Casablanca works. Please confirm the earliest ship week.",
				},
			});

			const buyerThreadHref = `/buyer/rfqs?thread=${encodeURIComponent(DEMO_THREAD_RFQ_ID)}`;
			const artisanThreadHref = `/artisan/contracts?thread=${encodeURIComponent(DEMO_THREAD_RFQ_ID)}`;

			await prisma.userNotification.upsert({
				where: { id: "seed-notif-demo-buyer" },
				update: {
					linkHref: buyerThreadHref,
					contextRfqId: DEMO_THREAD_RFQ_ID,
				},
				create: {
					id: "seed-notif-demo-buyer",
					userId: demoBuyer.id,
					kind: "RFQ_THREAD_MESSAGE",
					title: "New message on your inquiry",
					body: "Thanks for your inquiry — we can ship one crate next month. Preferred Incoterm?",
					linkHref: buyerThreadHref,
					contextRfqId: DEMO_THREAD_RFQ_ID,
				},
			});
			await prisma.userNotification.upsert({
				where: { id: "seed-notif-demo-partner" },
				update: {
					linkHref: artisanThreadHref,
					contextRfqId: DEMO_THREAD_RFQ_ID,
				},
				create: {
					id: "seed-notif-demo-partner",
					userId: firstPartnerUserId,
					kind: "RFQ_THREAD_MESSAGE",
					title: "New buyer message",
					body: "FOB Casablanca works. Please confirm the earliest ship week.",
					linkHref: artisanThreadHref,
					contextRfqId: DEMO_THREAD_RFQ_ID,
				},
			});
			console.log(
				"RFQ thread: 2 messages + 2 unread UserNotification rows on",
				DEMO_THREAD_RFQ_ID,
			);
		}
	}

	// —— 8. Contracts (per org; ACTIVE and COMPLETED) ——
	const now = new Date();
	const nextYear = new Date(
		now.getFullYear() + 1,
		now.getMonth(),
		now.getDate(),
	);
	const lastMonth = new Date(
		now.getFullYear(),
		now.getMonth() - 1,
		now.getDate(),
	);
	const contractSeed: {
		id: string;
		organizationId: string;
		rfqId: string | null;
		buyerName: string;
		buyerLocation: string | null;
		product: string;
		quantityLabel: string;
		valueLabel: string;
		valueCents: number | null;
		status: "ACTIVE" | "COMPLETED";
		startedAt: Date;
		expiresAt: Date;
	}[] = [];
	for (let o = 0; o < orgIds.length; o++) {
		const rfqForContract = await prisma.rfq.findFirst({
			where: { organizationId: orgIds[o]!, status: "QUOTED" },
			select: { id: true },
		});
		contractSeed.push(
			{
				id: `seed-contract-${o}-0`,
				organizationId: orgIds[o]!,
				rfqId: rfqForContract?.id ?? null,
				buyerName: "Import France SARL",
				buyerLocation: "Lyon, France",
				product: "Handmade craft supply (standing order)",
				quantityLabel: "Rolling quarterly shipments",
				valueLabel: "€8,200 / quarter",
				valueCents: 820_00,
				status: "ACTIVE",
				startedAt: now,
				expiresAt: nextYear,
			},
			{
				id: `seed-contract-${o}-1`,
				organizationId: orgIds[o]!,
				rfqId: null,
				buyerName: "Past buyer",
				buyerLocation: null,
				product: "One-off artisan order",
				quantityLabel: "80 pieces",
				valueLabel: "€2,500",
				valueCents: 250_00,
				status: "COMPLETED",
				startedAt: lastMonth,
				expiresAt: now,
			},
		);
	}
	for (const c of contractSeed) {
		await prisma.contract.upsert({
			where: { id: c.id },
			update: {},
			create: {
				id: c.id,
				organizationId: c.organizationId,
				rfqId: c.rfqId,
				buyerName: c.buyerName,
				buyerLocation: c.buyerLocation,
				product: c.product,
				quantityLabel: c.quantityLabel,
				valueLabel: c.valueLabel,
				valueCents: c.valueCents,
				status: c.status,
				startedAt: c.startedAt,
				expiresAt: c.expiresAt,
				progress: c.status === "COMPLETED" ? 100 : 0,
				deliveriesTotal: 0,
				deliveriesCompleted: 0,
			},
		});
	}
	console.log("Contracts:", contractSeed.length, "(ACTIVE, COMPLETED)");

	// —— 9. Support tickets (per org; OPEN, IN_REVIEW, RESOLVED; some with adminNotes) ——
	const supportSeed: {
		id: string;
		organizationId: string;
		subject: string;
		category: string;
		priority: string;
		status: "OPEN" | "IN_REVIEW" | "RESOLVED";
		message: string;
		adminNotes: string | null;
	}[] = [];
	for (let o = 0; o < orgIds.length; o++) {
		supportSeed.push(
			{
				id: `seed-ticket-${o}-0`,
				organizationId: orgIds[o]!,
				subject: "Catalogue photos & listing update",
				category: "Certification",
				priority: "MEDIUM",
				status: "OPEN",
				message:
					"I need help uploading new product photos for our approved listings.",
				adminNotes: null,
			},
			{
				id: `seed-ticket-${o}-1`,
				organizationId: orgIds[o]!,
				subject: "Export packaging & labelling (EU)",
				category: "Export",
				priority: "HIGH",
				status: "IN_REVIEW",
				message:
					"Which labels are expected for handmade goods shipped to the EU?",
				adminNotes: "Sent link to Export Documentation training module.",
			},
			{
				id: `seed-ticket-${o}-2`,
				organizationId: orgIds[o]!,
				subject: "Resolved: account access",
				category: "Account",
				priority: "LOW",
				status: "RESOLVED",
				message: "Password reset request.",
				adminNotes: "User reset via email link.",
			},
		);
	}
	for (const t of supportSeed) {
		await prisma.supportTicket.upsert({
			where: { id: t.id },
			update: {},
			create: {
				id: t.id,
				organizationId: t.organizationId,
				subject: t.subject,
				category: t.category,
				priority: t.priority,
				status: t.status,
				message: t.message,
				adminNotes: t.adminNotes,
			},
		});
	}
	console.log(
		"Support tickets:",
		supportSeed.length,
		"(OPEN, IN_REVIEW, RESOLVED)",
	);

	// —— 10. Support ticket status events (one per ticket so history exists) ——
	for (const t of supportSeed) {
		const eventId = `seed-event-${t.id}`;
		const existing = await prisma.supportTicketStatusEvent.findUnique({
			where: { id: eventId },
		});
		if (!existing) {
			await prisma.supportTicketStatusEvent.create({
				data: {
					id: eventId,
					supportTicketId: t.id,
					status: t.status,
					userId: null,
				},
			});
		}
	}
	console.log("Support ticket status events: 1 per ticket");

	console.log("\nDone. Seeded users password:", SEED_PASSWORD);
	console.log("Admin:", ADMIN_EMAIL);
	console.log(
		"Demo buyer: buyer.demo@craft-house.local → /buyer/rfqs (NEGOTIATING demo + thread + alerts on first org)",
	);
	console.log(
		"Partners: see emails above. Product listings include Unsplash hero images; add more from the app. Upload training media in admin.",
	);
}

main()
	.then(() => prisma.$disconnect())
	.catch((e) => {
		console.error(e);
		prisma.$disconnect();
		process.exit(1);
	});
