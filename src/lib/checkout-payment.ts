import type { ProductPaymentOption } from "@prisma/client";

/** Whether a product's admin-set option allows this checkout method. */
export function paymentOptionAllowsCheckout(
  productOption: ProductPaymentOption | null | undefined,
  method: "CARD" | "COD",
): boolean {
  // Store policy: checkout is COD-only.
  if (method === "COD") return true;
  return false;
}

/** Intersection of allowed methods across cart lines (client + server should match). */
export function allowedCheckoutMethodsForLines(
  productOptions: (ProductPaymentOption | null | undefined)[],
): ("CARD" | "COD")[] {
  if (productOptions.length === 0) return [];
  return ["COD"];
}
