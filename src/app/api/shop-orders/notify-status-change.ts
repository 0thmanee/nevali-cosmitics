import "server-only";

import {
	notifyShopOrderStatusChange,
	type ShopOrderStatusChangeKind,
} from "~/lib/notifications";
import { reportError } from "~/lib/report-error";
import type { ShopOrderStatusValue } from "~/lib/shop-order-statuses";
import { getShopOrderByIdForAdminRepo } from "./repo/shop-orders.repo";

const BUYER_NOTIFIED_STATUSES: ReadonlySet<ShopOrderStatusValue> = new Set([
	"SHIPPED",
	"CANCELED",
	"RETURNED",
]);

/**
 * Best-effort buyer notification after a fulfillment status change. No-ops for
 * statuses that don't warrant a buyer email (NEW/CONFIRMED). Never throws — the
 * status update has already been persisted by the caller.
 */
export async function notifyShopOrderStatusChangeForOrder(
	orderId: string,
	status: ShopOrderStatusValue,
): Promise<void> {
	if (!BUYER_NOTIFIED_STATUSES.has(status)) return;
	try {
		const order = await getShopOrderByIdForAdminRepo(orderId);
		if (!order) return;
		await notifyShopOrderStatusChange({
			to: order.buyerEmail,
			toPhone: order.buyerPhone,
			buyerName: order.buyerName,
			orderId: order.id,
			status: status as ShopOrderStatusChangeKind,
		});
	} catch (err) {
		reportError(err, { scope: "notifyShopOrderStatusChangeForOrder", orderId });
	}
}
