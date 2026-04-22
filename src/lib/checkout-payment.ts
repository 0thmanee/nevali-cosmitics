import type { ProductPaymentOption } from "@prisma/client";

/** Whether a product's admin-set option allows this checkout method. */
export function paymentOptionAllowsCheckout(
  productOption: ProductPaymentOption | null | undefined,
  method: "CARD" | "COD",
): boolean {
  if (productOption == null) return true;
  if (productOption === "BOTH") return true;
  return productOption === method;
}

/** Intersection of allowed methods across cart lines (client + server should match). */
export function allowedCheckoutMethodsForLines(
  productOptions: (ProductPaymentOption | null | undefined)[],
): ("CARD" | "COD")[] {
  const cardOk = productOptions.every((o) => paymentOptionAllowsCheckout(o, "CARD"));
  const codOk = productOptions.every((o) => paymentOptionAllowsCheckout(o, "COD"));
  const out: ("CARD" | "COD")[] = [];
  if (cardOk) out.push("CARD");
  if (codOk) out.push("COD");
  return out;
}
