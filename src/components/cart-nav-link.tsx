"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useCart } from "~/features/cart/cart-context";

export function CartNavLink() {
  const { totalQuantity, ready } = useCart();
  const { t } = useI18n();

  const aria =
    totalQuantity > 0 ? t("cart.ariaWithItems", { count: totalQuantity }) : t("cart.ariaEmpty");

  return (
    <Link
      href="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-primary/25 text-primary transition-colors hover:bg-primary/10"
      aria-label={aria}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M1.5 1.5h2l1.5 7.5h9l1.5-5H5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="15" r="1" fill="currentColor" />
        <circle cx="14" cy="15" r="1" fill="currentColor" />
      </svg>
      {ready && totalQuantity > 0 ? (
        <span className="absolute end-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center bg-primary px-1 font-sans text-[10px] font-bold text-white">
          {totalQuantity > 99 ? t("cart.overflowBadge") : totalQuantity}
        </span>
      ) : null}
    </Link>
  );
}
