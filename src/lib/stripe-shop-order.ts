// PARKED: card payments are off by design (see src/lib/payments-config.ts). This
// module is fully wired but not reachable from the COD-only storefront. Kept so card
// checkout can be switched on later without rebuilding the Stripe integration.
import { env } from "~/env";
import { prisma } from "~/lib/db";
import { getStripe } from "~/lib/stripe-server";

/** Moroccan dirham: Stripe uses the minor unit (1.00 MAD = 100). */
export function madToStripeMinorUnits(amountMad: number): number {
	if (!Number.isFinite(amountMad) || amountMad < 0) return 0;
	return Math.round(amountMad * 100);
}

function appOrigin(): string {
	return env.BETTER_AUTH_URL.replace(/\/$/, "");
}

/**
 * Creates a Stripe Checkout Session for a shop order awaiting card payment,
 * stores `stripeCheckoutSessionId` on the order, and returns the hosted URL.
 */
export async function createStripeCheckoutSessionForShopOrder(
	orderId: string,
): Promise<string> {
	const order = await prisma.shopOrder.findFirst({
		where: {
			id: orderId,
			status: "PENDING_PAYMENT",
			paymentMethod: "CARD",
		},
		include: {
			lines: { orderBy: { id: "asc" } },
		},
	});

	if (!order) {
		throw new Error("Order not found or not awaiting card payment.");
	}

	if (order.lines.length === 0) {
		throw new Error("Order has no lines.");
	}

	let totalMinor = 0;
	const lineItems: {
		quantity: number;
		price_data: {
			currency: "mad";
			unit_amount: number;
			product_data: { name: string };
		};
	}[] = [];

	for (const line of order.lines) {
		const unit = Number(line.unitPrice);
		if (!Number.isFinite(unit) || unit < 0) {
			throw new Error("Invalid line item price.");
		}
		const unitMinor = madToStripeMinorUnits(unit);
		const lineTotalMinor = unitMinor * line.quantity;
		totalMinor += lineTotalMinor;

		lineItems.push({
			quantity: line.quantity,
			price_data: {
				currency: "mad",
				unit_amount: unitMinor,
				product_data: {
					name: `${line.productName} (${line.variantName ?? "variant"})`,
				},
			},
		});
	}

	if (totalMinor <= 0) {
		throw new Error("Order total must be greater than zero for card payment.");
	}

	if (order.stripeCheckoutSessionId) {
		const stripe = getStripe();
		try {
			const existing = await stripe.checkout.sessions.retrieve(
				order.stripeCheckoutSessionId,
			);
			if (existing.status === "open" && existing.url) {
				return existing.url;
			}
		} catch {
			/* session expired — create a new one */
		}
	}

	const stripe = getStripe();
	const base = appOrigin();

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		client_reference_id: orderId,
		customer_email: order.buyerEmail,
		metadata: {
			shopOrderId: orderId,
		},
		line_items: lineItems,
		success_url: `${base}/cart/checkout/success?orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${base}/cart/checkout?cancelled=1`,
	});

	if (!session.url) {
		throw new Error("Stripe did not return a checkout URL.");
	}

	await prisma.shopOrder.update({
		where: { id: orderId },
		data: { stripeCheckoutSessionId: session.id },
	});

	return session.url;
}
