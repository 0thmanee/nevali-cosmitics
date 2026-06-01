"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { CartLine } from "./cart-types";
import { cartLineKey } from "./cart-types";

const STORAGE_KEY = "nevali-cosmetics-cart-v2";

type CartContextValue = {
	lines: CartLine[];
	ready: boolean;
	addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
	setQuantity: (
		productId: string,
		productVariantId: string,
		quantity: number,
	) => void;
	removeLine: (productId: string, productVariantId: string) => void;
	clearCart: () => void;
	totalQuantity: number;
	/** Sum of line totals from `price` (B2B listings are typically 0). */
	subtotalMad: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseLines(raw: unknown): CartLine[] {
	if (!Array.isArray(raw)) return [];
	return raw
		.filter(
			(x): x is Record<string, unknown> =>
				typeof x === "object" &&
				x !== null &&
				typeof (x as CartLine).productId === "string" &&
				typeof (x as CartLine).productVariantId === "string",
		)
		.map((x) => {
			const price = x.price;
			const qty = x.quantity;
			if (typeof price !== "string" || typeof qty !== "number") return null;
			const minOrderQuantity =
				typeof x.minOrderQuantity === "number" &&
				Number.isFinite(x.minOrderQuantity)
					? x.minOrderQuantity
					: 1;
			const po = x.paymentOption;
			const paymentOption =
				po === "CARD" || po === "COD" || po === "BOTH" ? po : null;
			return {
				productId: x.productId as string,
				productVariantId: x.productVariantId as string,
				variantName: String(x.variantName ?? "Standard"),
				organizationId: String(x.organizationId ?? ""),
				organizationName: String(x.organizationName ?? ""),
				name: String(x.name ?? ""),
				category: String(x.category ?? ""),
				price,
				unit: String(x.unit ?? "item"),
				minOrderQuantity,
				minOrderNote: x.minOrderNote == null ? null : String(x.minOrderNote),
				firstImageUrl: x.firstImageUrl == null ? null : String(x.firstImageUrl),
				paymentOption,
				quantity: qty,
			} satisfies CartLine;
		})
		.filter((x): x is CartLine => x != null);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [lines, setLines] = useState<CartLine[]>([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setLines(parseLines(JSON.parse(raw)));
		} catch {
			/* ignore */
		}
		setReady(true);
	}, []);

	useEffect(() => {
		if (!ready) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
		} catch {
			/* ignore */
		}
	}, [lines, ready]);

	const addLine = useCallback(
		(line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
			const qty = Math.min(999, Math.max(1, line.quantity ?? 1));
			const key = cartLineKey(line);
			setLines((prev) => {
				const i = prev.findIndex((l) => cartLineKey(l) === key);
				if (i >= 0) {
					return prev.map((l, idx) =>
						idx === i ? { ...l, quantity: Math.min(999, l.quantity + qty) } : l,
					);
				}
				return [...prev, { ...line, quantity: qty }];
			});
		},
		[],
	);

	const setQuantity = useCallback(
		(productId: string, productVariantId: string, quantity: number) => {
			const q = Number.isFinite(quantity)
				? Math.min(999, Math.max(1, Math.floor(quantity)))
				: 1;
			const key = cartLineKey({ productId, productVariantId });
			setLines((prev) =>
				prev.map((l) => (cartLineKey(l) === key ? { ...l, quantity: q } : l)),
			);
		},
		[],
	);

	const removeLine = useCallback(
		(productId: string, productVariantId: string) => {
			const key = cartLineKey({ productId, productVariantId });
			setLines((prev) => prev.filter((l) => cartLineKey(l) !== key));
		},
		[],
	);

	const clearCart = useCallback(() => setLines([]), []);

	const totalQuantity = useMemo(
		() => lines.reduce((s, l) => s + l.quantity, 0),
		[lines],
	);

	const subtotalMad = useMemo(
		() =>
			lines.reduce((s, l) => {
				const n = Number(l.price.replace(",", "."));
				return s + (Number.isFinite(n) ? n * l.quantity : 0);
			}, 0),
		[lines],
	);

	const value = useMemo(
		() => ({
			lines,
			ready,
			addLine,
			setQuantity,
			removeLine,
			clearCart,
			totalQuantity,
			subtotalMad,
		}),
		[
			lines,
			ready,
			addLine,
			setQuantity,
			removeLine,
			clearCart,
			totalQuantity,
			subtotalMad,
		],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart must be used within CartProvider");
	}
	return ctx;
}
