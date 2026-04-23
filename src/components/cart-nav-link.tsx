"use client";

import Link from "next/link";
import { useCart } from "~/features/cart/cart-context";

export function CartNavLink() {
  const { totalQuantity, ready } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-primary/25 text-primary transition-colors hover:bg-primary/10"
      aria-label={totalQuantity > 0 ? `Cart, ${totalQuantity} items` : "Cart"}
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
        <span
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center bg-primary px-1 font-sans text-[10px] font-bold text-white"
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </Link>
  );
}
