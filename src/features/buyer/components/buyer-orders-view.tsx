"use client";

import Link from "next/link";
import { useBuyerShopOrders } from "../hooks/use-buyer-shop-orders";

function statusLabel(status: string) {
	switch (status) {
		case "CONFIRMED":
			return "Confirmed";
		case "PENDING_PAYMENT":
			return "Awaiting payment";
		case "CANCELLED":
			return "Cancelled";
		default:
			return status;
	}
}

export function BuyerOrdersView() {
	const { data: orders = [], isLoading, isError, error } = useBuyerShopOrders();

	if (isLoading) {
		return (
			<p className="font-sans text-sm text-text-muted">Loading your orders…</p>
		);
	}
	if (isError) {
		return (
			<p className="font-sans text-sm text-red-600">
				{error instanceof Error ? error.message : "Could not load orders."}
			</p>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="max-w-xl space-y-4 rounded-sm border border-cream-dark bg-white p-6">
				<p className="font-sans text-sm text-text-muted leading-relaxed">
					You have no orders linked to this account yet. Guest checkout never requires sign-in;
					if you already bought as a guest, use the same email here so we can match history, or
					start a new order from the catalog.
				</p>
				<Link
					className="inline-flex rounded-sm bg-forest-mid px-5 py-2.5 font-medium font-sans text-sm text-white transition-opacity hover:opacity-90"
					href="/products"
				>
					Browse cosmetics
				</Link>
			</div>
		);
	}

	return (
		<ul className="space-y-3">
			{orders.map((o) => (
				<li key={o.id}>
					<Link
						className="block rounded-sm border border-cream-dark bg-white p-4 transition-colors hover:border-forest-mid/30"
						href={`/cart/checkout/success?orderId=${encodeURIComponent(o.id)}`}
					>
						<div className="flex flex-wrap items-baseline justify-between gap-2">
							<span className="font-semibold font-sans text-sm text-text-dark">
								Order {o.id.slice(0, 8)}…
							</span>
							<span className="font-sans text-sm text-text-muted">
								{new Date(o.createdAt).toLocaleString()}
							</span>
						</div>
						<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-text-muted">
							<span>{statusLabel(o.status)}</span>
							<span className="capitalize">{o.paymentMethod.toLowerCase()}</span>
							<span>
								{o.lineCount} line{o.lineCount === 1 ? "" : "s"} · {o.totalMad} MAD
							</span>
						</div>
						{o.previewProductNames.length > 0 ? (
							<p className="mt-2 font-sans text-xs text-stone-500">
								{o.previewProductNames.join(" · ")}
								{o.lineCount > o.previewProductNames.length ? " · …" : ""}
							</p>
						) : null}
					</Link>
				</li>
			))}
		</ul>
	);
}
