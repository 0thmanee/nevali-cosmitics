/** Allowed values for `ShopOrder.status` when set via admin or partner tools. */
export const SHOP_ORDER_STATUSES = [
	"NEW",
	"CONFIRMED",
	"SHIPPED",
	"CANCELED",
	"RETURNED",
] as const;
export type ShopOrderStatusValue = (typeof SHOP_ORDER_STATUSES)[number];

export function isShopOrderStatus(
	value: string,
): value is ShopOrderStatusValue {
	return (SHOP_ORDER_STATUSES as readonly string[]).includes(value);
}

/**
 * Allowed fulfillment transitions. Keyed by current status; values are the statuses
 * an operator may move to. Same→same is always allowed (idempotent). An unknown or
 * internal source status (e.g. PENDING_PAYMENT) may only move to CONFIRMED or CANCELED.
 */
const ALLOWED_SHOP_ORDER_TRANSITIONS: Record<string, ShopOrderStatusValue[]> = {
	NEW: ["CONFIRMED", "CANCELED"],
	CONFIRMED: ["SHIPPED", "CANCELED", "RETURNED"],
	SHIPPED: ["RETURNED", "CANCELED"],
	CANCELED: ["CONFIRMED"],
	RETURNED: ["CONFIRMED"],
};

export function isAllowedShopOrderTransition(
	from: string,
	to: ShopOrderStatusValue,
): boolean {
	if (from === to) return true;
	const allowed = ALLOWED_SHOP_ORDER_TRANSITIONS[from];
	if (!allowed) return to === "CONFIRMED" || to === "CANCELED";
	return allowed.includes(to);
}
