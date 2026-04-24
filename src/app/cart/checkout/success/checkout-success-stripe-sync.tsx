"use client";

import { useEffect, useState } from "react";
import { syncStripeCheckoutAfterRedirect } from "~/app/api/shop-orders/actions";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useCart } from "~/features/cart/cart-context";

type Props = {
	orderId: string | undefined;
	sessionId: string | undefined;
};

/**
 * After Stripe redirects back, confirm payment server-side (covers webhook delay) and clear the cart.
 */
export function CheckoutSuccessStripeSync({ orderId, sessionId }: Props) {
	const { t } = useI18n();
	const { clearCart } = useCart();
	const [note, setNote] = useState<string | null>(null);

	useEffect(() => {
		if (!orderId || !sessionId) return;
		let cancelled = false;
		void (async () => {
			try {
				const r = await syncStripeCheckoutAfterRedirect(orderId, sessionId);
				if (cancelled) return;
				if (r.ok) {
					clearCart();
				} else {
					setNote(t("checkoutSuccess.stripeProcessing"));
				}
			} catch (e) {
				if (!cancelled) {
					setNote(
						e instanceof Error ? e.message : t("checkoutSuccess.stripeVerifyFallback"),
					);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [orderId, sessionId, clearCart, t]);

	if (!note) return null;
	return (
		<p className="max-w-md font-sans text-amber-900 text-sm">
			{note}
		</p>
	);
}
