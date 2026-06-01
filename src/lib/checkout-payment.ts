import type { ProductPaymentOption } from "@prisma/client";
import { cardPaymentsEnabled } from "~/lib/payments-config";

/** Whether a product's admin-set option allows this checkout method. */
export function paymentOptionAllowsCheckout(
	productOption: ProductPaymentOption | null | undefined,
	method: "CARD" | "COD",
): boolean {
	if (method === "COD") return true;
	// Card is parked until cardPaymentsEnabled is flipped on (see payments-config.ts).
	return cardPaymentsEnabled;
}

/** Intersection of allowed methods across cart lines (client + server should match). */
export function allowedCheckoutMethodsForLines(
	productOptions: (ProductPaymentOption | null | undefined)[],
): ("CARD" | "COD")[] {
	if (productOptions.length === 0) return [];
	return cardPaymentsEnabled ? ["CARD", "COD"] : ["COD"];
}
