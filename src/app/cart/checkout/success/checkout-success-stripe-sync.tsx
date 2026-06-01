"use client";

import { useEffect, useState } from "react";
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
		if (!orderId) return;
		clearCart();
		setNote(null);
	}, [orderId, clearCart, sessionId]);

	if (!note) return null;
	return <p className="max-w-md font-sans text-amber-900 text-sm">{note}</p>;
}
