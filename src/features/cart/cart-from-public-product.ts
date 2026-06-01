import type { PublicProduct } from "~/components/public-product-types";
import { pickDefaultPublicVariant } from "~/lib/public-product-helpers";
import type { CartLine } from "./cart-types";

export function cartLineBaseFromPublicProduct(
	product: PublicProduct,
): Omit<CartLine, "quantity"> {
	const v = pickDefaultPublicVariant(product.variants);
	if (!v) {
		throw new Error("Product has no listing variant");
	}
	return {
		productId: product.id,
		productVariantId: v.id,
		variantName: v.name,
		organizationId: product.organizationId,
		organizationName: product.organizationName,
		name: product.name,
		category: product.category,
		price: v.price,
		unit: v.unit,
		minOrderQuantity: v.minOrderQuantity,
		minOrderNote: v.minOrderNote,
		firstImageUrl: product.firstImageUrl,
		paymentOption: product.paymentOption,
	};
}
