const STORAGE_KEY = "crafthouse:lastCheckout";

export type LastCheckoutConfirmationPayload = {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
};

export function persistLastCheckoutConfirmation(payload: LastCheckoutConfirmationPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

/** If stored payload matches `orderId`, returns it and clears storage; otherwise null. */
export function consumeLastCheckoutConfirmation(orderId: string): LastCheckoutConfirmationPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastCheckoutConfirmationPayload;
    if (!parsed || typeof parsed !== "object" || parsed.orderId !== orderId) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return parsed;
  } catch {
    return null;
  }
}
