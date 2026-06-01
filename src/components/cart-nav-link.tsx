"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useCart } from "~/features/cart/cart-context";

export function CartNavLink() {
	const { totalQuantity, ready } = useCart();
	const { t } = useI18n();

	const aria =
		totalQuantity > 0
			? t("cart.ariaWithItems", { count: totalQuantity })
			: t("cart.ariaEmpty");

	return (
		<Link
			aria-label={aria}
			className="group relative flex h-10 w-10 items-center justify-center rounded-sm border border-primary/15 bg-white text-primary transition-colors hover:border-primary/35 hover:bg-primary/6"
			href="/cart"
		>
			<svg
				aria-hidden
				className="transition-transform group-hover:scale-[1.03]"
				fill="none"
				height="17"
				viewBox="0 0 18 18"
				width="17"
			>
				<path
					d="M2.4 2h1.55l1.25 6.5h7.95l1.2-3.95H5.05"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.2"
				/>
				<circle cx="6.8" cy="13.9" fill="currentColor" r="0.85" />
				<circle cx="12.8" cy="13.9" fill="currentColor" r="0.85" />
			</svg>
			{ready && totalQuantity > 0 ? (
				<span className="absolute -inset-e-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-primary px-1 font-sans font-semibold text-[8px] text-white leading-none shadow-sm">
					{totalQuantity > 99 ? t("cart.overflowBadge") : totalQuantity}
				</span>
			) : null}
		</Link>
	);
}
