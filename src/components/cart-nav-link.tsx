"use client";

import Link from "next/link";
import { useCart } from "~/features/cart/cart-context";

export function CartNavLink() {
  const { totalQuantity, ready } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-9 h-9 border border-text-dark/15 text-text-dark hover:bg-text-dark/5 transition-colors"
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
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-white font-sans text-[10px] font-bold flex items-center justify-center"
          style={{ background: "#000000" }}
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </Link>
  );
}
