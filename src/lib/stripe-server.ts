import Stripe from "stripe";
import { env } from "~/env";

let stripe: Stripe | null = null;

/** Server-only Stripe client. Throws if `STRIPE_SECRET_KEY` is not set. */
export function getStripe(): Stripe {
	const key = env.STRIPE_SECRET_KEY?.trim();
	if (!key) {
		throw new Error("Stripe is not configured (missing STRIPE_SECRET_KEY).");
	}
	if (!stripe) {
		stripe = new Stripe(key, {
			typescript: true,
		});
	}
	return stripe;
}

export function isStripeConfigured(): boolean {
	return Boolean(env.STRIPE_SECRET_KEY?.trim());
}
