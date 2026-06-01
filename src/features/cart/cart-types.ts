import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";

export type CartLine = {
	productId: string;
	productVariantId: string;
	/** Packaging / listing label shown in cart and checkout. */
	variantName: string;
	organizationId: string;
	organizationName: string;
	name: string;
	category: string;
	/** Decimal string; B2B catalogue listings use "0.00" until a quote exists. */
	price: string;
	unit: string;
	minOrderQuantity: number;
	minOrderNote: string | null;
	firstImageUrl: string | null;
	/** From approved product; drives allowed checkout payment methods. */
	paymentOption: ProductPaymentOptionValue | null;
	quantity: number;
};

export function cartLineKey(
	line: Pick<CartLine, "productId" | "productVariantId">,
): string {
	return `${line.productId}:${line.productVariantId}`;
}
