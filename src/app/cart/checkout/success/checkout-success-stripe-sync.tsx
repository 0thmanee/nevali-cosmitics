"use client";

import { useEffect, useState } from "react";
import { syncStripeCheckoutAfterRedirect } from "~/app/api/shop-orders/actions";
import { useCart } from "~/features/cart/cart-context";

type Props = {
	orderId: string | undefined;
	sessionId: string | undefined;
};

/**
 * After Stripe redirects back, confirm payment server-side (covers webhook delay) and clear the cart.
 */
export function CheckoutSuccessStripeSync({ orderId, sessionId }: Props) {
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
					setNote(
						"Payment is still processing. If you completed checkout, you will receive a confirmation email shortly.",
					);
				}
			} catch (e) {
				if (!cancelled) {
					setNote(
						e instanceof Error
							? e.message
							: "Could not verify payment immediately. Check your email for confirmation.",
					);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [orderId, sessionId, clearCart]);

	if (!note) return null;
	return (
		<p className="max-w-md font-sans text-amber-900 text-sm">
			{note}
		</p>
	);
}
