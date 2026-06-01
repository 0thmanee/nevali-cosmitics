import type {
	PublicProductImage,
	PublicProductVariant,
} from "~/app/api/products/schemas/products.schema";
import { getCategoryGradient } from "~/lib/public-product-gradient";

export { getCategoryGradient };

export function publicVariantOrderHint(v: PublicProductVariant): string {
	const note = v.minOrderNote?.trim();
	if (note) return note;
	return `Min. ${v.minOrderQuantity} ${v.unit}`;
}

export function pickDefaultPublicVariant(
	variants: PublicProductVariant[],
): PublicProductVariant | null {
	if (variants.length === 0) return null;
	return variants.find((v) => v.inStock) ?? variants[0] ?? null;
}

export type OrderedImagesForVariantOptions = {
	validVariantIds: Set<string>;
};

export function orderedImagesForPublicVariant(
	images: PublicProductImage[],
	variantId: string | null,
	options?: OrderedImagesForVariantOptions,
): PublicProductImage[] {
	const valid = options?.validVariantIds;
	const normalized: PublicProductImage[] = images.map((img) => {
		const vid = img.variantId;
		if (vid == null) return img;
		if (valid && !valid.has(vid)) {
			return { ...img, variantId: null };
		}
		return img;
	});

	const sorted = [...normalized].sort((a, b) => {
		if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
		return a.id.localeCompare(b.id);
	});

	const shared = sorted.filter((i) => i.variantId === null);

	const selectionOk = variantId != null && (!valid || valid.has(variantId));
	if (!selectionOk) {
		return shared;
	}

	const specific = sorted.filter((i) => i.variantId === variantId);
	if (specific.length > 0) {
		return [...specific, ...shared];
	}
	return shared;
}
