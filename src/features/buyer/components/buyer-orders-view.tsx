"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import { interpolate } from "~/lib/i18n/interpolate";
import type { Translator } from "~/lib/i18n/create-translator";
import { useBuyerShopOrders } from "../hooks/use-buyer-shop-orders";

function buyerOrderStatusLabel(status: string, t: Translator): string {
	const key = `buyerOrders.status.${status}`;
	const label = t(key);
	return label === key ? status.replace(/_/g, " ") : label;
}

export function BuyerOrdersView() {
	const { locale, t } = useI18n();
	const { formatMad, paymentLabel } = useFormatPrice();
	const { data: orders = [], isLoading, isError, error } = useBuyerShopOrders();

	const dateTag = INTL_LOCALE_TAG[locale] ?? INTL_LOCALE_TAG.en;

	if (isLoading) {
		return <p className="font-sans text-sm text-text-muted">{t("buyerOrders.loading")}</p>;
	}
	if (isError) {
		return (
			<p className="font-sans text-sm text-red-600">
				{error instanceof Error ? error.message : t("buyerOrders.couldNotLoad")}
			</p>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="max-w-xl space-y-4 rounded-sm border border-cream-dark bg-white p-6">
				<p className="font-sans text-sm text-text-muted leading-relaxed">{t("buyerOrders.emptyBody")}</p>
				<Link
					className="inline-flex rounded-sm bg-forest-mid px-5 py-2.5 font-medium font-sans text-sm text-white transition-opacity hover:opacity-90"
					href="/products"
				>
					{t("buyerOrders.browseCosmetics")}
				</Link>
			</div>
		);
	}

	return (
		<ul className="space-y-3">
			{orders.map((o) => {
				const totalStr = formatMad(o.totalMad);
				const linesSummary =
					o.lineCount === 1
						? interpolate(t("buyerOrders.linesSummary"), { count: o.lineCount, total: totalStr })
						: interpolate(t("buyerOrders.linesSummaryPlural"), { count: o.lineCount, total: totalStr });
				const payment = paymentLabel(String(o.paymentMethod ?? "").toUpperCase());
				return (
					<li key={o.id}>
						<Link
							className="block rounded-sm border border-cream-dark bg-white p-4 transition-colors hover:border-forest-mid/30"
							href={`/cart/checkout/success?orderId=${encodeURIComponent(o.id)}`}
						>
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<span className="font-semibold font-sans text-sm text-text-dark">
									{interpolate(t("buyerOrders.orderShort"), { id: o.id.slice(0, 8) })}
								</span>
								<span className="font-sans text-sm text-text-muted">
									{new Date(o.createdAt).toLocaleString(dateTag, { dateStyle: "medium", timeStyle: "short" })}
								</span>
							</div>
							<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-text-muted">
								<span>{buyerOrderStatusLabel(o.status, t)}</span>
								<span>{payment}</span>
								<span>{linesSummary}</span>
							</div>
							{o.previewProductNames.length > 0 ? (
								<p className="mt-2 font-sans text-xs text-stone-500">
									{o.previewProductNames.join(" · ")}
									{o.lineCount > o.previewProductNames.length ? t("buyerOrders.previewEllipsis") : ""}
								</p>
							) : null}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
