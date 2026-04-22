"use server";

import { completeShopOrderAfterStripePayment } from "~/lib/complete-shop-order-payment";
import {
	notifyOrganizationsOfShopOrder,
	notifyShopOrderBuyerConfirmation,
} from "~/lib/notifications";
import { getStripe, isStripeConfigured } from "~/lib/stripe-server";
import { createStripeCheckoutSessionForShopOrder } from "~/lib/stripe-shop-order";
import {
	createShopOrderFromCheckout,
	deleteShopOrderByIdRepo,
} from "./repo/shop-orders.repo";
import { submitShopOrderSchema } from "./schemas/shop-orders.schema";

export async function submitShopOrder(raw: unknown) {
	const parsed = submitShopOrderSchema.parse(raw);

	if (parsed.paymentMethod === "CARD" && !isStripeConfigured()) {
		throw new Error(
			"Card payment is not available right now. Choose cash on delivery or try again later.",
		);
	}

	const result = await createShopOrderFromCheckout({
		buyerName: parsed.buyerName,
		buyerEmail: parsed.buyerEmail,
		buyerPhone: parsed.buyerPhone,
		addressLine1: parsed.addressLine1,
		addressLine2: parsed.addressLine2,
		city: parsed.city,
		postalCode: parsed.postalCode,
		country: parsed.country,
		paymentMethod: parsed.paymentMethod,
		notes: parsed.notes,
		lines: parsed.lines,
	});

	if (parsed.paymentMethod === "COD") {
		const { notification } = result;
		try {
			await notifyShopOrderBuyerConfirmation({
				to: notification.buyerEmail,
				buyerName: notification.buyerName,
				orderId: result.orderId,
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
				orderId: result.orderId,
				buyerName: notification.buyerName,
				buyerEmail: notification.buyerEmail,
				buyerPhone: notification.buyerPhone,
				totalMad: notification.totalMad,
				paymentMethod: notification.paymentMethod,
				lines: notification.lines,
			});
		} catch {
			// Email is best-effort; order is already persisted.
		}
		return { orderId: result.orderId };
	}

	try {
		const checkoutUrl = await createStripeCheckoutSessionForShopOrder(
			result.orderId,
		);
		return { orderId: result.orderId, checkoutUrl };
	} catch (err) {
		try {
			await deleteShopOrderByIdRepo(result.orderId);
		} catch {
			/* ignore rollback failure */
		}
		throw err instanceof Error
			? err
			: new Error("Could not start card payment.");
	}
}

/**
 * Called from the success page after Stripe redirect to confirm payment if the webhook is delayed.
 */
export async function syncStripeCheckoutAfterRedirect(
	orderId: string,
	sessionId: string,
) {
	const stripe = getStripe();
	const session = await stripe.checkout.sessions.retrieve(sessionId);
	const metaOrderId = session.metadata?.shopOrderId;
	if (!metaOrderId || metaOrderId !== orderId) {
		throw new Error("Invalid checkout session.");
	}
	if (session.payment_status !== "paid") {
		return { ok: false as const, reason: "unpaid" as const };
	}
	const pi =
		typeof session.payment_intent === "string"
			? session.payment_intent
			: session.payment_intent && typeof session.payment_intent === "object"
				? session.payment_intent.id
				: null;
	await completeShopOrderAfterStripePayment({
		orderId,
		stripePaymentIntentId: pi,
	});
	return { ok: true as const };
}
