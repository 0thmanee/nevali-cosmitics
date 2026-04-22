import type Stripe from "stripe";
import { env } from "~/env";
import { completeShopOrderAfterStripePayment } from "~/lib/complete-shop-order-payment";
import { getStripe } from "~/lib/stripe-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	const secret = env.STRIPE_WEBHOOK_SECRET?.trim();
	if (!secret) {
		return new Response("Stripe webhooks are not configured.", { status: 501 });
	}

	const raw = await req.text();
	const sig = req.headers.get("stripe-signature");
	if (!sig) {
		return new Response("Missing stripe-signature", { status: 400 });
	}

	let event: Stripe.Event;
	try {
		const stripe = getStripe();
		event = stripe.webhooks.constructEvent(raw, sig, secret);
	} catch {
		return new Response("Invalid signature", { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const orderId = session.metadata?.shopOrderId;
		if (orderId && session.payment_status === "paid") {
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
		}
	}

	return new Response(null, { status: 200 });
}
