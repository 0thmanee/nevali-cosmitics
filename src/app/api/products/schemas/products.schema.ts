import { z } from "zod";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";

const productVariantUpsertBaseSchema = z.object({
	id: z.string().cuid().optional(),
	name: z.string().min(1).max(200),
	unit: z.string().max(50).optional().default("item"),
	sourceName: z.string().max(200).optional().nullable(),
	minOrderQuantity: z.number().int().min(1),
	minOrderNote: z.string().max(500).nullable().optional(),
	price: z.string().min(1).max(20),
	unitCost: z.string().max(20).optional().default("0"),
	packagingCost: z.string().max(20).optional().default("0"),
	handlingCost: z.string().max(20).optional().default("0"),
	otherCost: z.string().max(20).optional().default("0"),
	quantityOnHand: z.number().int().min(0),
	inStock: z.boolean(),
	sortOrder: z.number().int().min(0).optional(),
});

export const createProductSchema = z.object({
	name: z.string().min(1, "Product name is required").max(200),
	category: z.string().min(1, "Category is required").max(100),
	moq: z.string().max(100).optional().nullable(),
	capacity: z.string().max(100).optional().nullable(),
	description: z.string().max(20000).optional().nullable(),
	variants: z
		.array(productVariantUpsertBaseSchema.omit({ id: true }))
		.optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
	name: z.string().min(1).max(200),
	category: z.string().min(1).max(100),
	moq: z.string().max(100).optional().nullable(),
	capacity: z.string().max(100).optional().nullable(),
	description: z.string().max(20000).optional().nullable(),
	/** When true, clears other org products and sets this one as the homepage hero. */
	featuredOnHome: z.boolean().optional(),
	variants: z.array(productVariantUpsertBaseSchema).min(1),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const setProductStatusSchema = z.object({
	productId: z.string().cuid(),
	status: z.enum(["APPROVED", "REJECTED"]),
	rejectionReason: z.string().max(500).optional().nullable(),
	/** When approving, admin selects how buyers may pay (defaults to BOTH in repo if omitted). */
	paymentOption: z.enum(["CARD", "COD", "BOTH"]).optional(),
});

export type SetProductStatusInput = z.infer<typeof setProductStatusSchema>;

export const setProductImageVariantSchema = z.object({
	productId: z.string().cuid(),
	imageId: z.string().cuid(),
	variantId: z.string().cuid().nullable(),
});

export type SetProductImageVariantInput = z.infer<
	typeof setProductImageVariantSchema
>;

// —— Row / API response types (single source of truth) ——

/** Aligns with Prisma `ProductPaymentOption` for storefront checkout rules. */
export type ProductPaymentOptionValue = "CARD" | "COD" | "BOTH";

export type ProductRow = {
	id: string;
	name: string;
	category: string;
	status: string;
	rejectionReason: string | null;
	moq: string | null;
	capacity: string | null;
	description: string | null;
	featuredOnHome: boolean;
	paymentOption: ProductPaymentOptionValue | null;
	createdAt: Date;
	updatedAt: Date;
};

/** Approved product selected for the marketing homepage hero. */
/** Up to three lowest-priced variants for homepage hero preview. */
export type HomeHeroVariantPreview = {
	name: string;
	unit: string;
	priceMad: string;
	inStock: boolean;
};

export type HomeHeroFeaturedProduct = {
	id: string;
	name: string;
	category: string;
	description: string | null;
	capacity: string | null;
	imageUrl: string | null;
	/** Lowest variant price, decimal string MAD e.g. "189.00". */
	fromPriceMad: string;
	organizationName: string;
	organizationSlug: string;
	/** Prisma `ProductCategory` enum value, e.g. SKINCARE; null if unset. */
	cosmeticsCategory: string | null;
	ingredients: string | null;
	paymentOption: ProductPaymentOptionValue | null;
	variantsPreview: HomeHeroVariantPreview[];
	variantCount: number;
};

/** Full variant row returned to producer/admin UIs (price as decimal string). */
export type ProductVariantRow = {
	id: string;
	productId: string;
	name: string;
	unit: string;
	sourceName: string | null;
	minOrderQuantity: number;
	minOrderNote: string | null;
	price: string;
	unitCost: string;
	packagingCost: string;
	handlingCost: string;
	otherCost: string;
	soldUnits: number;
	realizedRevenueMad: string;
	realizedNetMad: string;
	quantityOnHand: number;
	inStock: boolean;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
};

export type ProductImageRow = {
	id: string;
	url: string;
	sortOrder: number;
	variantId: string | null;
};

export type ProductRowWithImages = ProductRow & {
	images: ProductImageRow[];
	variants: ProductVariantRow[];
	certifications: CertificationRow[];
};

export type ProductAdminRow = ProductRow & {
	organizationId: string;
	organizationName: string;
};

/** Product row for list views, with optional first image URL. */
export type ProductListRow = ProductRow & {
	firstImageUrl: string | null;
	/** Lowest variant price (MAD), for list column. */
	fromPrice: string | null;
	variantCount: number;
};

/** Approved product with first image and certifications (certified products list). */
export type CertifiedProductListRow = ProductRow & {
	firstImageUrl: string | null;
	certifications: CertificationRow[];
	variants: ProductVariantRow[];
};

/** Admin product row for list views, with optional first image URL and certification count. */
export type ProductAdminListRow = ProductAdminRow & {
	firstImageUrl: string | null;
	certificationsCount: number;
	fromPrice: string | null;
	variantCount: number;
};

/** Alias for UI components (gallery, editor). */
export type ProductImageItem = ProductImageRow;

// —— Public storefront (cards + PDP) ——

/** Public catalog variant (subset for storefront / cart). */
export type PublicProductVariant = {
	id: string;
	name: string;
	unit: string;
	minOrderQuantity: number;
	minOrderNote: string | null;
	/** Decimal string e.g. "120.00"; B2B listings use "0.00" until quoted. */
	price: string;
	quantityOnHand: number;
	inStock: boolean;
	sortOrder: number;
};

/** Gallery image on the public product detail page. */
export type PublicProductImage = {
	id: string;
	url: string;
	sortOrder: number;
	variantId: string | null;
};

/** Approved product for public grid (cards, landing). */
export type PublicProductListRow = {
	id: string;
	name: string;
	description: string | null;
	category: string;
	paymentOption: ProductPaymentOptionValue | null;
	organizationId: string;
	organizationName: string;
	firstImageUrl: string | null;
	images: PublicProductImage[];
	variants: PublicProductVariant[];
};

/** Approved certification shown on the public PDP (trust). */
export type PublicProductCertification = {
	id: string;
	name: string;
	fileUrl: string;
	/** Linked to this SKU vs partner-wide lab / facility doc. */
	kind: "product" | "partner";
};

/** Single approved product for public PDP. */
export type PublicProductDetail = PublicProductListRow & {
	organizationSlug: string;
	/** Production capacity label when present. */
	capacity: string | null;
	/** Legacy / mirrored MOQ note when present. */
	moq: string | null;
	ingredients: string | null;
	skinTypes: string | null;
	/** Prisma `ProductCategory` enum value when set. */
	cosmeticsCategory: string | null;
	certifications: PublicProductCertification[];
	/** Partner logo URL when set (brand strip on PDP). */
	organizationLogo: string | null;
};
