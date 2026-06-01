import {
	buildShopOrderNotificationPayload,
	tryFinalizePendingShopOrderRepo,
} from "~/app/api/shop-orders/repo/shop-orders.repo";
import {
	notifyOrganizationsOfShopOrder,
	notifyShopOrderBuyerConfirmation,
} from "~/lib/notifications";
import { reportError } from "~/lib/report-error";

/**
 * Idempotent: confirms a card order after Stripe reports success and sends emails once.
 */
export async function completeShopOrderAfterStripePayment(params: {
	orderId: string;
	stripePaymentIntentId?: string | null;
}): Promise<{ newlyConfirmed: boolean }> {
	const didConfirm = await tryFinalizePendingShopOrderRepo(
		params.orderId,
		params.stripePaymentIntentId,
	);

	if (!didConfirm) {
		return { newlyConfirmed: false };
	}

	const notification = await buildShopOrderNotificationPayload(params.orderId);
	if (!notification) {
		return { newlyConfirmed: true };
	}

	try {
		await notifyShopOrderBuyerConfirmation({
			to: notification.buyerEmail,
			buyerName: notification.buyerName,
			orderId: params.orderId,
			totalMad: notification.totalMad,
			paymentMethod: notification.paymentMethod,
			lines: notification.lines.map((l) => ({
				productName: l.productName,
				variantName: l.variantName,
				quantity: l.quantity,
				lineTotalMad: l.lineTotalMad,
			})),
		});
		await notifyOrganizationsOfShopOrder({
			orderId: params.orderId,
			buyerName: notification.buyerName,
			buyerEmail: notification.buyerEmail,
			buyerPhone: notification.buyerPhone,
			totalMad: notification.totalMad,
			paymentMethod: notification.paymentMethod,
			lines: notification.lines,
		});
	} catch (err) {
		// best-effort — order is confirmed in DB; surface for observability
		reportError(err, {
			scope: "completeShopOrderAfterStripePayment.notify",
			orderId: params.orderId,
		});
	}

	return { newlyConfirmed: true };
}
