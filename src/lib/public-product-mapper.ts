import type { Prisma } from "@prisma/client";
import type {
	ProductPaymentOptionValue,
	PublicProductImage,
	PublicProductListRow,
	PublicProductVariant,
} from "~/app/api/products/schemas/products.schema";

function toPaymentOption(
	v: Prisma.ProductGetPayload<{
		select: { paymentOption: true };
	}>["paymentOption"],
): ProductPaymentOptionValue | null {
	if (v === "CARD" || v === "COD" || v === "BOTH") return v;
	return null;
}

function mapVariantRow(v: {
	id: string;
	name: string;
	unit: string;
	minOrderQuantity: number;
	minOrderNote: string | null;
	price: Prisma.Decimal;
	quantityOnHand: number;
	inStock: boolean;
	sortOrder: number;
}): PublicProductVariant {
	return {
		id: v.id,
		name: v.name,
		unit: v.unit,
		minOrderQuantity: v.minOrderQuantity,
		minOrderNote: v.minOrderNote,
		price: v.price.toFixed(2),
		quantityOnHand: v.quantityOnHand,
		inStock: v.inStock,
		sortOrder: v.sortOrder,
	};
}

/** Fallback when legacy data has no variants (should not happen after migration). */
export function syntheticListingVariants(
	moq: string | null,
): PublicProductVariant[] {
	return [
		{
			id: "legacy-default",
			name: "Standard listing",
			unit: "item",
			minOrderQuantity: 1,
			minOrderNote: moq?.trim() || null,
			price: "0.00",
			quantityOnHand: 0,
			inStock: true,
			sortOrder: 0,
		},
	];
}

export function buildPublicProductListRow(input: {
	id: string;
	name: string;
	description: string | null;
	category: string;
	moq: string | null;
	organizationId: string;
	organizationName: string;
	firstImageUrl: string | null;
	paymentOption: Prisma.ProductGetPayload<{
		select: { paymentOption: true };
	}>["paymentOption"];
	gallery?: {
		id: string;
		url: string;
		sortOrder: number;
		variantId: string | null;
	}[];
	variants: Array<{
		id: string;
		name: string;
		unit: string;
		minOrderQuantity: number;
		minOrderNote: string | null;
		price: Prisma.Decimal;
		quantityOnHand: number;
		inStock: boolean;
		sortOrder: number;
	}>;
}): PublicProductListRow {
	const images: PublicProductImage[] = (input.gallery ?? []).map((img) => ({
		id: img.id,
		url: img.url,
		sortOrder: img.sortOrder,
		variantId: img.variantId,
	}));
	if (images.length === 0 && input.firstImageUrl) {
		images.push({
			id: `legacy-${input.id}`,
			url: input.firstImageUrl,
			sortOrder: 0,
			variantId: null,
		});
	}
	const variants =
		input.variants.length > 0
			? [...input.variants]
					.sort((a, b) => a.sortOrder - b.sortOrder)
					.map(mapVariantRow)
			: syntheticListingVariants(input.moq);
	return {
		id: input.id,
		name: input.name,
		description: input.description,
		category: input.category,
		paymentOption: toPaymentOption(input.paymentOption),
		organizationId: input.organizationId,
		organizationName: input.organizationName,
		firstImageUrl: input.firstImageUrl,
		images,
		variants,
	};
}
