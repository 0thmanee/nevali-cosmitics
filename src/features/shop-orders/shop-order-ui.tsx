"use client";

import React from "react";
import type { AdminShopOrderListRow } from "~/app/api/shop-orders/repo/shop-orders.repo";
import type { AppLocale } from "~/lib/i18n/config";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import type { Translator } from "~/lib/i18n/create-translator";

export function formatShopOrderListDate(d: Date, locale: AppLocale) {
	const tag = INTL_LOCALE_TAG[locale] ?? INTL_LOCALE_TAG.en;
	return new Intl.DateTimeFormat(tag, {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(d));
}

/** Value used in status `<select>` (maps legacy DB values to editable statuses). */
export function shopOrderStatusSelectValue(status: string): string {
	if (status === "PENDING" || status === "PENDING_PAYMENT") return "NEW";
	if (status === "CANCELLED") return "CANCELED";
	return status;
}

/** Labels shop order status for admin + partner UIs (maps legacy checkout statuses). */
export function shopOrderStatusLabel(status: string, t: Translator): string {
	const normalized = shopOrderStatusSelectValue(status);
	const key = `adminShopOrders.status.${normalized}`;
	const label = t(key);
	return label === key ? normalized.replace(/_/g, " ") : label;
}

const STATUS_STYLES: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	CONFIRMED: {
		bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)",
		color: "var(--color-ink)",
		border: "1px solid color-mix(in srgb, var(--color-ink) 25%, transparent)",
	},
	SHIPPED: {
		bg: "color-mix(in srgb, var(--color-forest-mid) 14%, transparent)",
		color: "var(--color-forest-mid)",
		border:
			"1px solid color-mix(in srgb, var(--color-forest-mid) 35%, transparent)",
	},
	NEW: {
		bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
		color: "var(--color-warning-dark)",
		border:
			"1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)",
	},
	PENDING_PAYMENT: {
		bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
		color: "var(--color-warning-dark)",
		border:
			"1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)",
	},
	PENDING: {
		bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
		color: "var(--color-warning-dark)",
		border:
			"1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)",
	},
	CANCELED: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		border:
			"1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
	},
	CANCELLED: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		border:
			"1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
	},
	RETURNED: {
		bg: "color-mix(in srgb, var(--color-gold) 18%, transparent)",
		color: "var(--color-ink)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 38%, transparent)",
	},
};

export function ShopOrderStatusBadge({
	status,
	t,
}: {
	status: string;
	t: Translator;
}) {
	const s = STATUS_STYLES[status] ?? {
		bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
		color: "var(--color-warning-dark)",
		border:
			"1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)",
	};
	return (
		<span
			className="rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
			style={{ background: s.bg, color: s.color, border: s.border }}
		>
			{shopOrderStatusLabel(status, t)}
		</span>
	);
}

export function shopOrderLinesPreview(
	order: AdminShopOrderListRow,
	max = 2,
): string {
	const names = order.lines.slice(0, max).map((l) => l.productName);
	const more = order.lines.length > max ? ` +${order.lines.length - max}` : "";
	return names.join(" · ") + more;
}
