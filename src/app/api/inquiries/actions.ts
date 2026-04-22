"use server";

export type InquiryInput = {
  organizationId: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  quantity: string;
  message?: string;
  type: "cart" | "b2b";
};

/**
 * Legacy inquiry system - deprecated.
 * Direct B2C orders are now handled through the cart + checkout system.
 */
export async function submitProductInquiry(input: InquiryInput) {
  // This function is no longer supported.
  // Products are ordered directly through the cart system.
  throw new Error("Product inquiries are no longer supported. Please use the cart to place your order.");
}

export type CartQuoteLineInput = {
  organizationId: string;
  organizationName: string;
  productName: string;
  /** Shown on the RFQ (e.g. requested units). */
  quantityLabel: string;
};

/** Creates one RFQ per cart line and sends a single buyer confirmation listing all lines. */
export async function submitCartQuoteRequests(input: {
  buyerName: string;
  buyerEmail: string;
  message?: string;
  lines: CartQuoteLineInput[];
}) {
  // This function is no longer supported.
  // Cart orders are now processed directly through checkout.
  throw new Error("Quote requests are no longer supported. Please use the cart to place your order.");
}
