import { Prisma } from "@prisma/client";
import { cache } from "react";
import type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";
import { prisma } from "~/lib/db";
import { buildPublicProductListRow } from "~/lib/public-product-mapper";
import type {
	CertifiedProductListRow,
	HomeHeroFeaturedProduct,
	ProductAdminListRow,
	ProductAdminRow,
	ProductImageRow,
	ProductListRow,
	ProductPaymentOptionValue,
	ProductRow,
	ProductRowWithImages,
	ProductVariantRow,
	PublicProductDetail,
} from "../schemas/products.schema";

type VariantDbCore = {
	id: string;
	productId: string;
	name: string;
	unit: string;
	sourceName: string | null;
	minOrderQuantity: number;
	minOrderNote: string | null;
	price: Prisma.Decimal;
	unitCost: Prisma.Decimal;
	packagingCost: Prisma.Decimal;
	handlingCost: Prisma.Decimal;
	otherCost: Prisma.Decimal;
	quantityOnHand: number;
	inStock: boolean;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
};

function toVariantRow(v: VariantDbCore): ProductVariantRow {
	return {
		...v,
		price: v.price.toFixed(2),
		unitCost: v.unitCost.toFixed(2),
		packagingCost: v.packagingCost.toFixed(2),
		handlingCost: v.handlingCost.toFixed(2),
		otherCost: v.otherCost.toFixed(2),
		soldUnits: 0,
		realizedRevenueMad: "0.00",
		realizedNetMad: "0.00",
	};
}

type VariantSalesStats = { soldUnits: number; realizedRevenue: number };

async function getVariantSalesStatsForProduct(
	productId: string,
): Promise<Map<string, VariantSalesStats>> {
	const lines = await prisma.shopOrderLine.findMany({
		where: {
			productId,
			productVariantId: { not: null },
			order: { status: { in: ["NEW", "CONFIRMED", "SHIPPED"] } },
		},
		select: {
			productVariantId: true,
			quantity: true,
			unitPrice: true,
		},
	});
	const byVariant = new Map<string, VariantSalesStats>();
	for (const l of lines) {
		const variantId = l.productVariantId;
		if (!variantId) continue;
		const prev = byVariant.get(variantId) ?? {
			soldUnits: 0,
			realizedRevenue: 0,
		};
		const unitPrice = Number(l.unitPrice);
		prev.soldUnits += l.quantity;
		prev.realizedRevenue +=
			(Number.isFinite(unitPrice) ? unitPrice : 0) * l.quantity;
		byVariant.set(variantId, prev);
	}
	return byVariant;
}

function fromPriceFromVariants(
	variants: { price: Prisma.Decimal }[],
): string | null {
	if (variants.length === 0) return null;
	let min = Number(variants[0]!.price);
	for (let i = 1; i < variants.length; i++) {
		const n = Number(variants[i]!.price);
		if (Number.isFinite(n) && n < min) min = n;
	}
	return Number.isFinite(min) ? min.toFixed(2) : null;
}

type HeroVariantPick = {
	name: string;
	unit: string;
	price: Prisma.Decimal;
	inStock: boolean;
};

function heroVariantsSortedByPrice(variants: HeroVariantPick[]) {
	return [...variants].sort((a, b) => Number(a.price) - Number(b.price));
}

function toPaymentOptionValue(
	v: "CARD" | "COD" | "BOTH" | null,
): ProductPaymentOptionValue | null {
	if (v === null) return null;
	return v;
}

/** Approved product flagged for the homepage hero (cached for a single RSC tree). */
export const getFeaturedHomeHeroProductRepo = cache(
	async (): Promise<HomeHeroFeaturedProduct | null> => {
		const row = await prisma.product.findFirst({
			where: { status: "APPROVED", featuredOnHome: true },
			orderBy: { updatedAt: "desc" },
			select: {
				id: true,
				name: true,
				category: true,
				description: true,
				capacity: true,
				cosmeticsCategory: true,
				ingredients: true,
				paymentOption: true,
				images: {
					take: 1,
					orderBy: { sortOrder: "asc" },
					select: { url: true },
				},
				organization: {
					select: { name: true, slug: true },
				},
				variants: {
					select: {
						name: true,
						unit: true,
						price: true,
						inStock: true,
						sortOrder: true,
					},
					orderBy: { sortOrder: "asc" },
				},
			},
		});
		if (!row) return null;
		const from = fromPriceFromVariants(row.variants);
		const sorted = heroVariantsSortedByPrice(row.variants);
		const variantsPreview = sorted.slice(0, 3).map((v) => ({
			name: v.name,
			unit: v.unit,
			priceMad: v.price.toFixed(2),
			inStock: v.inStock,
		}));
		return {
			id: row.id,
			name: row.name,
			category: row.category,
			description: row.description,
			capacity: row.capacity,
			imageUrl: row.images[0]?.url ?? null,
			fromPriceMad: from ?? "0.00",
			organizationName: row.organization.name,
			organizationSlug: row.organization.slug,
			cosmeticsCategory: row.cosmeticsCategory,
			ingredients: row.ingredients,
			paymentOption: toPaymentOptionValue(row.paymentOption),
			variantsPreview,
			variantCount: row.variants.length,
		};
	},
);

type VariantUpsertInput = {
	id?: string;
	name: string;
	unit: string;
	sourceName?: string | null;
	minOrderQuantity: number;
	minOrderNote?: string | null;
	price: string;
	unitCost?: string;
	packagingCost?: string;
	handlingCost?: string;
	otherCost?: string;
	quantityOnHand: number;
	inStock: boolean;
	sortOrder?: number;
};

async function syncProductVariantsTx(
	tx: Prisma.TransactionClient,
	productId: string,
	variants: VariantUpsertInput[],
): Promise<void> {
	const existing = await tx.productVariant.findMany({
		where: { productId },
		select: { id: true },
	});
	const existingIds = new Set(existing.map((e) => e.id));
	const incomingWithId = variants.filter(
		(v): v is typeof v & { id: string } => !!v.id,
	);
	const incomingIds = new Set(incomingWithId.map((v) => v.id));

	for (let i = 0; i < variants.length; i++) {
		const v = variants[i]!;
		if (v.id && !existingIds.has(v.id)) {
			throw new Error(`Unknown variant id for this product: ${v.id}`);
		}
		const priceNorm = v.price.trim().replace(",", ".");
		const unitCostNorm = (v.unitCost ?? "0").trim().replace(",", ".");
		const packagingCostNorm = (v.packagingCost ?? "0").trim().replace(",", ".");
		const handlingCostNorm = (v.handlingCost ?? "0").trim().replace(",", ".");
		const otherCostNorm = (v.otherCost ?? "0").trim().replace(",", ".");
		const sortOrder = v.sortOrder ?? i;
		if (v.id && existingIds.has(v.id)) {
			await tx.productVariant.update({
				where: { id: v.id },
				data: {
					name: v.name,
					unit: v.unit || "item",
					sourceName: v.sourceName?.trim() || null,
					minOrderQuantity: v.minOrderQuantity,
					minOrderNote: v.minOrderNote ?? null,
					price: new Prisma.Decimal(priceNorm),
					unitCost: new Prisma.Decimal(unitCostNorm),
					packagingCost: new Prisma.Decimal(packagingCostNorm),
					handlingCost: new Prisma.Decimal(handlingCostNorm),
					otherCost: new Prisma.Decimal(otherCostNorm),
					quantityOnHand: v.quantityOnHand,
					inStock: v.inStock,
					sortOrder,
				},
			});
		} else {
			await tx.productVariant.create({
				data: {
					productId,
					name: v.name,
					unit: v.unit || "item",
					sourceName: v.sourceName?.trim() || null,
					minOrderQuantity: v.minOrderQuantity,
					minOrderNote: v.minOrderNote ?? null,
					price: new Prisma.Decimal(priceNorm),
					unitCost: new Prisma.Decimal(unitCostNorm),
					packagingCost: new Prisma.Decimal(packagingCostNorm),
					handlingCost: new Prisma.Decimal(handlingCostNorm),
					otherCost: new Prisma.Decimal(otherCostNorm),
					quantityOnHand: v.quantityOnHand,
					inStock: v.inStock,
					sortOrder,
				},
			});
		}
	}

	const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
	if (toDelete.length > 0) {
		await tx.productVariant.deleteMany({
			where: { productId, id: { in: toDelete } },
		});
	}
}

/**
 * All product reads/writes for producers are scoped by organizationId.
 * Products are always linked to one Organization; partners get products
 * via their Member.organizationId. See docs/INVESTIGATION-ORGANIZATION-PRODUCTS.md.
 */

const productSelect = {
	id: true,
	name: true,
	category: true,
	status: true,
	rejectionReason: true,
	moq: true,
	capacity: true,
	description: true,
	featuredOnHome: true,
	paymentOption: true,
	createdAt: true,
	updatedAt: true,
} as const;

const variantSelect = {
	id: true,
	productId: true,
	name: true,
	unit: true,
	sourceName: true,
	minOrderQuantity: true,
	minOrderNote: true,
	price: true,
	unitCost: true,
	packagingCost: true,
	handlingCost: true,
	otherCost: true,
	quantityOnHand: true,
	inStock: true,
	sortOrder: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function getProductsByOrganizationId(
	organizationId: string,
): Promise<ProductListRow[]> {
	const rows = await prisma.product.findMany({
		where: { organizationId },
		orderBy: { updatedAt: "desc" },
		select: {
			...productSelect,
			images: {
				take: 1,
				orderBy: { sortOrder: "asc" },
				select: { url: true },
			},
			variants: {
				select: { price: true, inStock: true, quantityOnHand: true },
				orderBy: { sortOrder: "asc" },
			},
		},
	});
	return rows.map(({ images, variants, ...r }) => ({
		...r,
		firstImageUrl: images[0]?.url ?? null,
		fromPrice: fromPriceFromVariants(variants),
		variantCount: variants.length,
		anyInStock: variants.some((v) => v.inStock),
		totalStock: variants.reduce((n, v) => n + (v.quantityOnHand ?? 0), 0),
	}));
}

/** Set inStock on every variant of a product the org owns. Returns rows affected. */
export async function setProductStockStateForOrgRepo(
	organizationId: string,
	productId: string,
	inStock: boolean,
): Promise<number> {
	const res = await prisma.productVariant.updateMany({
		where: { productId, product: { id: productId, organizationId } },
		data: { inStock },
	});
	return res.count;
}

export async function getProductByIdForOrgRepo(
	productId: string,
	organizationId: string,
): Promise<ProductRow | null> {
	const row = await prisma.product.findFirst({
		where: { id: productId, organizationId },
		select: productSelect,
	});
	return row;
}

/** Duplicate a product (fields + variants, not images/certs) as a new PENDING draft. */
export async function duplicateProductForOrgRepo(
	productId: string,
	organizationId: string,
): Promise<{ id: string } | null> {
	const src = await prisma.product.findFirst({
		where: { id: productId, organizationId },
		select: {
			name: true,
			category: true,
			cosmeticsCategory: true,
			description: true,
			ingredients: true,
			capacity: true,
			moq: true,
			paymentOption: true,
			variants: { orderBy: { sortOrder: "asc" }, select: variantSelect },
		},
	});
	if (!src) return null;
	return prisma.product.create({
		data: {
			organizationId,
			name: `${src.name} (copy)`,
			category: src.category,
			cosmeticsCategory: src.cosmeticsCategory,
			description: src.description,
			ingredients: src.ingredients,
			capacity: src.capacity,
			moq: src.moq,
			paymentOption: src.paymentOption,
			status: "PENDING",
			featuredOnHome: false,
			variants: {
				create: src.variants.map((v, i) => ({
					name: v.name,
					unit: v.unit,
					sourceName: v.sourceName,
					minOrderQuantity: v.minOrderQuantity,
					minOrderNote: v.minOrderNote,
					price: v.price,
					unitCost: v.unitCost,
					packagingCost: v.packagingCost,
					handlingCost: v.handlingCost,
					otherCost: v.otherCost,
					quantityOnHand: v.quantityOnHand,
					inStock: v.inStock,
					sortOrder: i,
				})),
			},
		},
		select: { id: true },
	});
}

const certificationSelect = {
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

/** Single product with images and certifications (for detail/edit). */
export async function getProductWithImagesByOrgRepo(
	productId: string,
	organizationId: string,
): Promise<ProductRowWithImages | null> {
	const row = await prisma.product.findFirst({
		where: { id: productId, organizationId },
		select: {
			...productSelect,
			images: {
				orderBy: { sortOrder: "asc" },
				select: { id: true, url: true, sortOrder: true, variantId: true },
			},
			variants: {
				orderBy: { sortOrder: "asc" },
				select: variantSelect,
			},
			certifications: {
				orderBy: { createdAt: "desc" },
				select: certificationSelect,
			},
		},
	});
	if (!row) return null;
	const salesStats = await getVariantSalesStatsForProduct(productId);
	const { images, certifications, variants, ...rest } = row;
	return {
		...rest,
		images,
		variants: variants.map((v) => {
			const base = toVariantRow(v as VariantDbCore);
			const stat = salesStats.get(v.id) ?? { soldUnits: 0, realizedRevenue: 0 };
			const cogsPerItem =
				Number(base.unitCost) +
				Number(base.packagingCost) +
				Number(base.handlingCost) +
				Number(base.otherCost);
			const realizedNet = stat.realizedRevenue - cogsPerItem * stat.soldUnits;
			return {
				...base,
				soldUnits: stat.soldUnits,
				realizedRevenueMad: stat.realizedRevenue.toFixed(2),
				realizedNetMad: realizedNet.toFixed(2),
			};
		}),
		certifications,
	};
}

/** Single product with images and certifications for admin (no org scope). */
export async function getProductWithImagesForAdminRepo(
	productId: string,
): Promise<
	| (ProductRowWithImages & {
			organizationId: string;
			organizationName: string;
	  })
	| null
> {
	const row = await prisma.product.findFirst({
		where: { id: productId },
		select: {
			...productSelect,
			organizationId: true,
			organization: { select: { name: true } },
			images: {
				orderBy: { sortOrder: "asc" },
				select: { id: true, url: true, sortOrder: true, variantId: true },
			},
			variants: {
				orderBy: { sortOrder: "asc" },
				select: variantSelect,
			},
			certifications: {
				orderBy: { createdAt: "desc" },
				select: certificationSelect,
			},
		},
	});
	if (!row) return null;
	const salesStats = await getVariantSalesStatsForProduct(productId);
	const { organization, images, certifications, variants, ...rest } = row;
	return {
		...rest,
		organizationName: organization.name,
		images,
		variants: variants.map((v) => {
			const base = toVariantRow(v as VariantDbCore);
			const stat = salesStats.get(v.id) ?? { soldUnits: 0, realizedRevenue: 0 };
			const cogsPerItem =
				Number(base.unitCost) +
				Number(base.packagingCost) +
				Number(base.handlingCost) +
				Number(base.otherCost);
			const realizedNet = stat.realizedRevenue - cogsPerItem * stat.soldUnits;
			return {
				...base,
				soldUnits: stat.soldUnits,
				realizedRevenueMad: stat.realizedRevenue.toFixed(2),
				realizedNetMad: realizedNet.toFixed(2),
			};
		}),
		certifications,
	};
}

/** Approved products with first image URL and certifications (for producer certified products list). */
export async function listApprovedProductsWithCertificationsByOrgRepo(
	organizationId: string,
): Promise<CertifiedProductListRow[]> {
	const rows = await prisma.product.findMany({
		where: { organizationId, status: "APPROVED" },
		orderBy: { updatedAt: "desc" },
		select: {
			...productSelect,
			images: {
				take: 1,
				orderBy: { sortOrder: "asc" },
				select: { url: true },
			},
			variants: {
				orderBy: { sortOrder: "asc" },
				select: variantSelect,
			},
			certifications: {
				orderBy: { createdAt: "desc" },
				select: certificationSelect,
			},
		},
	});
	return rows.map(({ images, certifications, variants, ...r }) => ({
		...r,
		firstImageUrl: images[0]?.url ?? null,
		variants: variants.map((v) => toVariantRow(v as VariantDbCore)),
		certifications,
	}));
}

export async function createProductImageRepo(
	productId: string,
	organizationId: string,
	url: string,
	sortOrder: number,
	variantId?: string | null,
): Promise<ProductImageRow> {
	const product = await prisma.product.findFirst({
		where: { id: productId, organizationId },
		select: { id: true },
	});
	if (!product)
		throw new Error(
			"Product not found or does not belong to your organization.",
		);
	if (variantId) {
		const v = await prisma.productVariant.findFirst({
			where: { id: variantId, productId },
			select: { id: true },
		});
		if (!v) throw new Error("Variant not found for this product.");
	}
	const created = await prisma.productImage.create({
		data: {
			productId,
			url,
			sortOrder,
			variantId: variantId ?? null,
		},
		select: { id: true, url: true, sortOrder: true, variantId: true },
	});
	return created;
}

export async function updateProductImageVariantRepo(
	productId: string,
	imageId: string,
	organizationId: string,
	variantId: string | null,
): Promise<ProductImageRow> {
	const image = await prisma.productImage.findFirst({
		where: { id: imageId, productId, product: { organizationId } },
		select: { id: true },
	});
	if (!image)
		throw new Error("Image not found or does not belong to your product.");
	if (variantId) {
		const v = await prisma.productVariant.findFirst({
			where: { id: variantId, productId },
			select: { id: true },
		});
		if (!v) throw new Error("Variant not found for this product.");
	}
	const updated = await prisma.productImage.update({
		where: { id: imageId },
		data: { variantId },
		select: { id: true, url: true, sortOrder: true, variantId: true },
	});
	return updated;
}

export async function deleteProductImageRepo(
	productId: string,
	imageId: string,
	organizationId: string,
): Promise<void> {
	const image = await prisma.productImage.findFirst({
		where: { id: imageId, productId, product: { organizationId } },
		select: { id: true },
	});
	if (!image)
		throw new Error("Image not found or does not belong to your product.");
	await prisma.productImage.delete({ where: { id: imageId } });
}

/** Mark one approved product as the public homepage hero; clears the flag on all other SKUs in the same org. */
export async function setOrganizationHomepageHeroProductRepo(
	productId: string,
	organizationId: string,
): Promise<void> {
	const ok = await prisma.product.findFirst({
		where: { id: productId, organizationId, status: "APPROVED" },
		select: { id: true },
	});
	if (!ok) {
		throw new Error(
			"Product not found, not approved, or does not belong to your organization.",
		);
	}
	await prisma.$transaction([
		prisma.product.updateMany({
			where: { organizationId },
			data: { featuredOnHome: false },
		}),
		prisma.product.update({
			where: { id: productId },
			data: { featuredOnHome: true },
		}),
	]);
}

/** Remove homepage hero for every product in the org (site falls back to the default marketing hero). */
export async function clearOrganizationHomepageHeroRepo(
	organizationId: string,
): Promise<void> {
	await prisma.product.updateMany({
		where: { organizationId },
		data: { featuredOnHome: false },
	});
}

/**
 * Update a product. Enforces that the product belongs to the given organization
 * (defense in depth: only update products of that org).
 */
export async function updateProductRepo(
	productId: string,
	organizationId: string,
	data: {
		name: string;
		category: string;
		moq?: string | null;
		capacity?: string | null;
		description?: string | null;
		featuredOnHome?: boolean;
		variants: VariantUpsertInput[];
	},
): Promise<ProductRowWithImages> {
	const existing = await prisma.product.findFirst({
		where: { id: productId, organizationId },
		select: { id: true },
	});
	if (!existing) {
		throw new Error(
			"Product not found or does not belong to your organization.",
		);
	}

	await prisma.$transaction(async (tx) => {
		if (data.featuredOnHome === true) {
			await tx.product.updateMany({
				where: { organizationId },
				data: { featuredOnHome: false },
			});
		}
		await tx.product.update({
			where: { id: productId },
			data: {
				name: data.name,
				category: data.category,
				moq: data.moq ?? null,
				capacity: data.capacity ?? null,
				description: data.description ?? null,
				...(data.featuredOnHome !== undefined
					? { featuredOnHome: data.featuredOnHome }
					: {}),
			},
		});
		await syncProductVariantsTx(tx, productId, data.variants);
		const first = await tx.productVariant.findFirst({
			where: { productId },
			orderBy: { sortOrder: "asc" },
			select: { minOrderNote: true },
		});
		await tx.product.update({
			where: { id: productId },
			data: { moq: first?.minOrderNote ?? data.moq ?? null },
		});
	});

	const full = await getProductWithImagesByOrgRepo(productId, organizationId);
	if (!full) throw new Error("Product not found after update.");
	return full;
}

export async function listProductsForAdminRepo(filters: {
	organizationId?: string;
	status?: "PENDING" | "APPROVED" | "REJECTED";
}): Promise<ProductAdminListRow[]> {
	const where: { organizationId?: string; status?: string } = {};
	if (filters.organizationId) where.organizationId = filters.organizationId;
	if (filters.status) where.status = filters.status;
	const rows = await prisma.product.findMany({
		where,
		orderBy: { updatedAt: "desc" },
		select: {
			...productSelect,
			organizationId: true,
			organization: { select: { name: true } },
			images: {
				take: 1,
				orderBy: { sortOrder: "asc" },
				select: { url: true },
			},
			variants: {
				select: { price: true },
				orderBy: { sortOrder: "asc" },
			},
			_count: { select: { certifications: true } },
		},
	});
	return rows.map(({ organization, images, variants, _count, ...r }) => ({
		...r,
		organizationName: organization.name,
		firstImageUrl: images[0]?.url ?? null,
		certificationsCount: _count.certifications,
		fromPrice: fromPriceFromVariants(variants),
		variantCount: variants.length,
	}));
}

export async function createProductRepo(data: {
	organizationId: string;
	name: string;
	category: string;
	moq?: string | null;
	capacity?: string | null;
	description?: string | null;
	variants?: Omit<VariantUpsertInput, "id">[];
}): Promise<ProductRow> {
	const variantCreates: Omit<VariantUpsertInput, "id">[] =
		data.variants && data.variants.length > 0
			? data.variants
			: [
					{
						name: "Standard",
						unit: "item",
						minOrderQuantity: 1,
						minOrderNote: data.moq?.trim() || null,
						price: "0",
						quantityOnHand: 0,
						inStock: true,
						sortOrder: 0,
					},
				];

	const created = await prisma.$transaction(async (tx) => {
		const product = await tx.product.create({
			data: {
				organizationId: data.organizationId,
				name: data.name,
				category: data.category,
				status: "PENDING",
				moq: data.moq ?? null,
				capacity: data.capacity ?? null,
				description: data.description ?? null,
				variants: {
					create: variantCreates.map((v, i) => {
						const priceNorm = v.price.trim().replace(",", ".");
						return {
							name: v.name,
							unit: v.unit || "item",
							minOrderQuantity: v.minOrderQuantity,
							minOrderNote: v.minOrderNote ?? null,
							price: new Prisma.Decimal(priceNorm),
							quantityOnHand: v.quantityOnHand,
							inStock: v.inStock,
							sortOrder: v.sortOrder ?? i,
						};
					}),
				},
			},
			select: { id: true },
		});
		const first = await tx.productVariant.findFirst({
			where: { productId: product.id },
			orderBy: { sortOrder: "asc" },
			select: { minOrderNote: true },
		});
		await tx.product.update({
			where: { id: product.id },
			data: { moq: first?.minOrderNote ?? data.moq ?? null },
		});
		return tx.product.findUniqueOrThrow({
			where: { id: product.id },
			select: productSelect,
		});
	});
	return created;
}

/** All unique categories for APPROVED products (public). */
export async function listApprovedProductCategoriesRepo(): Promise<string[]> {
	const rows = await prisma.product.findMany({
		where: { status: "APPROVED" },
		select: { category: true },
		distinct: ["category"],
		orderBy: { category: "asc" },
	});
	return rows.map((r) => r.category);
}

/** Paginated APPROVED products with optional category filter + text search (public). */
export async function listApprovedProductsForPublicPaginatedRepo(params: {
	page: number;
	pageSize: number;
	category?: string;
	search?: string;
}) {
	const q = params.search?.trim();
	const where: Prisma.ProductWhereInput = {
		status: "APPROVED",
		...(params.category ? { category: params.category } : {}),
		...(q
			? {
					OR: [
						{ name: { contains: q, mode: "insensitive" } },
						{ description: { contains: q, mode: "insensitive" } },
						{ ingredients: { contains: q, mode: "insensitive" } },
						{ category: { contains: q, mode: "insensitive" } },
					],
				}
			: {}),
	};
	const skip = (params.page - 1) * params.pageSize;
	const [rows, total] = await Promise.all([
		prisma.product.findMany({
			where,
			orderBy: { updatedAt: "desc" },
			skip,
			take: params.pageSize,
			select: {
				id: true,
				name: true,
				category: true,
				moq: true,
				description: true,
				paymentOption: true,
				organizationId: true,
				organization: { select: { name: true } },
				images: {
					orderBy: { sortOrder: "asc" },
					select: { id: true, url: true, sortOrder: true, variantId: true },
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
		}),
		prisma.product.count({ where }),
	]);
	return {
		products: rows.map(({ organization, images, variants, ...r }) =>
			buildPublicProductListRow({
				...r,
				organizationName: organization.name,
				firstImageUrl: images[0]?.url ?? null,
				gallery: images.map((i) => ({
					id: i.id,
					url: i.url,
					sortOrder: i.sortOrder,
					variantId: i.variantId,
				})),
				variants,
			}),
		),
		total,
		totalPages: Math.ceil(total / params.pageSize) || 1,
	};
}

/** Single APPROVED product for public detail page — no auth required. */
export async function getApprovedProductForPublicByIdRepo(
	productId: string,
): Promise<PublicProductDetail | null> {
	const row = await prisma.product.findFirst({
		where: { id: productId, status: "APPROVED" },
		select: {
			id: true,
			name: true,
			category: true,
			moq: true,
			capacity: true,
			description: true,
			ingredients: true,
			skinTypes: true,
			cosmeticsCategory: true,
			paymentOption: true,
			organizationId: true,
			organization: {
				select: {
					name: true,
					slug: true,
					logo: true,
					certifications: {
						where: { status: "APPROVED", productId: null },
						orderBy: { updatedAt: "desc" },
						select: { id: true, name: true, fileUrl: true },
					},
				},
			},
			certifications: {
				where: { status: "APPROVED" },
				orderBy: { updatedAt: "desc" },
				select: { id: true, name: true, fileUrl: true },
			},
			images: {
				orderBy: { sortOrder: "asc" },
				select: { id: true, url: true, sortOrder: true, variantId: true },
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
	});
	if (!row) return null;
	const gallery = row.images.map((i) => ({
		id: i.id,
		url: i.url,
		sortOrder: i.sortOrder,
		variantId: i.variantId,
	}));
	const base = buildPublicProductListRow({
		id: row.id,
		name: row.name,
		description: row.description,
		category: row.category,
		moq: row.moq,
		organizationId: row.organizationId,
		organizationName: row.organization.name,
		firstImageUrl: gallery[0]?.url ?? null,
		paymentOption: row.paymentOption,
		gallery,
		variants: row.variants,
	});
	const productCerts = row.certifications.map((c) => ({
		id: c.id,
		name: c.name,
		fileUrl: c.fileUrl,
		kind: "product" as const,
	}));
	const partnerCertIds = new Set(productCerts.map((c) => c.id));
	const partnerCerts = row.organization.certifications
		.filter((c) => !partnerCertIds.has(c.id))
		.map((c) => ({
			id: c.id,
			name: c.name,
			fileUrl: c.fileUrl,
			kind: "partner" as const,
		}));
	const certifications = [...productCerts, ...partnerCerts];
	return {
		...base,
		organizationSlug: row.organization.slug,
		capacity: row.capacity,
		moq: row.moq,
		ingredients: row.ingredients,
		skinTypes: row.skinTypes,
		cosmeticsCategory: row.cosmeticsCategory,
		certifications,
		organizationLogo: row.organization.logo,
	};
}

/** All APPROVED products for the public landing page — no auth required. */
export async function listApprovedProductsForPublicRepo(
	limit = 8,
	opts?: { excludeIds?: string[] },
) {
	const rows = await prisma.product.findMany({
		where: {
			status: "APPROVED",
			...(opts?.excludeIds?.length ? { id: { notIn: opts.excludeIds } } : {}),
		},
		orderBy: { updatedAt: "desc" },
		take: limit,
		select: {
			id: true,
			name: true,
			category: true,
			moq: true,
			description: true,
			paymentOption: true,
			organizationId: true,
			organization: { select: { name: true } },
			images: {
				orderBy: { sortOrder: "asc" },
				select: { id: true, url: true, sortOrder: true, variantId: true },
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
	});
	return rows.map(({ organization, images, variants, ...r }) =>
		buildPublicProductListRow({
			...r,
			organizationName: organization.name,
			firstImageUrl: images[0]?.url ?? null,
			gallery: images.map((i) => ({
				id: i.id,
				url: i.url,
				sortOrder: i.sortOrder,
				variantId: i.variantId,
			})),
			variants,
		}),
	);
}

/** Homepage featured category tabs: first approved listing per slot (keyword match on category + name). */
const FEATURED_HOME_CATEGORY_SPECS = [
	{
		id: "argan-oils",
		keywords: [
			"argan",
			"amlou",
			"oil",
			"huile",
			"prickly",
			"barbary",
			"figue de barbarie",
			"botanical oil",
		],
	},
	{
		id: "skincare",
		keywords: [
			"cream",
			"crème",
			"serum",
			"sérum",
			"face",
			"visage",
			"skincare",
			"moistur",
			"spf",
			"mask",
			"masque",
			"lotion",
		],
	},
	{
		id: "hammam-body",
		keywords: [
			"ghassoul",
			"rassoul",
			"soap",
			"savon",
			"beldi",
			"black soap",
			"hammam",
			"scrub",
			"gant",
			"kessa",
			"body",
			"corps",
		],
	},
	{
		id: "hair-fragrance",
		keywords: [
			"hair",
			"cheveux",
			"shampoo",
			"shampoing",
			"conditioner",
			"après-shampooing",
			"parfum",
			"fragrance",
			"eau de",
			"oud",
			"rose water",
			"eau de rose",
			"jasmine",
		],
	},
] as const;

export type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";

/** Keys align with `FeaturedCategorySectionClient` tab ids. */
export async function listFeaturedHomeProductSamplesByCategoryRepo(): Promise<
	Record<string, FeaturedHomeProductSample | null>
> {
	const rows = await prisma.product.findMany({
		where: { status: "APPROVED" },
		orderBy: { updatedAt: "desc" },
		take: 250,
		select: {
			id: true,
			name: true,
			category: true,
			variants: {
				select: { price: true },
			},
			images: {
				take: 1,
				orderBy: { sortOrder: "asc" },
				select: { url: true },
			},
		},
	});

	const products: FeaturedHomeProductSample[] = rows.map(
		({ images, variants, ...r }) => {
			const nums = variants
				.map((v) => Number(v.price))
				.filter((n) => Number.isFinite(n));
			const fromPriceMad =
				nums.length === 0 ? "0.00" : Math.min(...nums).toFixed(2);
			return {
				...r,
				firstImageUrl: images[0]?.url ?? null,
				fromPriceMad,
			};
		},
	);

	const out: Record<string, FeaturedHomeProductSample | null> = {};
	const assigned = new Set<string>();

	for (const spec of FEATURED_HOME_CATEGORY_SPECS) {
		const hit = products.find(
			(p) =>
				!assigned.has(p.id) &&
				spec.keywords.some((kw) => {
					const blob = `${p.category} ${p.name}`.toLowerCase();
					return blob.includes(kw.toLowerCase());
				}),
		);
		if (hit) assigned.add(hit.id);
		out[spec.id] = hit ?? null;
	}

	return out;
}

export async function updateProductStatusRepo(
	productId: string,
	status: "APPROVED" | "REJECTED",
	rejectionReason?: string | null,
	paymentOption?: ProductPaymentOptionValue | null,
): Promise<ProductRow> {
	const updated = await prisma.product.update({
		where: { id: productId },
		data: {
			status,
			rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
			...(status === "APPROVED"
				? { paymentOption: paymentOption ?? "BOTH" }
				: {}),
			...(status === "REJECTED" ? { featuredOnHome: false } : {}),
		},
		select: productSelect,
	});
	return updated;
}

/** Lightweight list of approved product ids + last update for sitemap generation. */
export async function listApprovedProductsForSitemapRepo(): Promise<
	{ id: string; updatedAt: Date }[]
> {
	return prisma.product.findMany({
		where: { status: "APPROVED" },
		select: { id: true, updatedAt: true },
		orderBy: { updatedAt: "desc" },
		take: 5000,
	});
}
