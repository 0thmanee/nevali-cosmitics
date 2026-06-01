"use server";

import { getSession } from "~/app/api/auth/actions";
import {
	notifyOrganizationsOfShopOrder,
	notifyShopOrderBuyerConfirmation,
} from "~/lib/notifications";
import { cardPaymentsEnabled } from "~/lib/payments-config";
import { reportError } from "~/lib/report-error";
import { createShopOrderFromCheckout } from "./repo/shop-orders.repo";
import { submitShopOrderSchema } from "./schemas/shop-orders.schema";

export async function submitShopOrder(raw: unknown) {
	const parsed = submitShopOrderSchema.parse(raw);
	// Card is parked (payments-config.ts): COD is the only accepted method at launch.
	if (parsed.paymentMethod !== "COD" && !cardPaymentsEnabled) {
		throw new Error("Only cash on delivery is available.");
	}

	const session = await getSession();
	const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? "";
	const sessionRole = (session?.user as { role?: string } | undefined)?.role;
	const formEmail = parsed.buyerEmail.trim().toLowerCase();
	const buyerUserId =
		session?.user?.id &&
		sessionRole === "buyer" &&
		sessionEmail !== "" &&
		sessionEmail === formEmail
			? session.user.id
			: null;

	const result = await createShopOrderFromCheckout({
		buyerUserId,
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

	const { notification } = result;
	try {
		await notifyShopOrderBuyerConfirmation({
			to: notification.buyerEmail,
			toPhone: notification.buyerPhone,
			buyerName: notification.buyerName,
			orderId: result.orderId,
			totalMad: notification.totalMad,
			paymentMethod: notification.paymentMethod,
			lines: notification.lines.map((l) => ({
				productName: l.productName,
				variantName: l.variantName,
				quantity: l.quantity,
				lineTotalMad: l.lineTotalMad,
				imageUrl: l.imageUrl,
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
	} catch (err) {
		// Email is best-effort; order is already persisted. Surface for observability.
		reportError(err, {
			scope: "submitShopOrder.notify",
			orderId: result.orderId,
		});
	}
	return { orderId: result.orderId };
}
