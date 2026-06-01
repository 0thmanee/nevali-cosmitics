"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import {
	formatShopOrderListDate,
	ShopOrderStatusBadge,
	shopOrderLinesPreview,
} from "~/features/shop-orders/shop-order-ui";
import type { AppLocale } from "~/lib/i18n/config";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import { useProducerProductOrderStats } from "../../hooks/use-producer-product-order-stats";
import { useProducerShopOrders } from "../../hooks/use-producer-shop-orders";

function formatDateShort(d: Date | null, locale: AppLocale, dash: string) {
	if (!d) return dash;
	const tag = INTL_LOCALE_TAG[locale] ?? INTL_LOCALE_TAG.en;
	return new Intl.DateTimeFormat(tag, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(d));
}

export function CatalogOrdersView() {
	const { locale, t } = useI18n();
	const { formatMad, paymentLabel } = useFormatPrice();
	const {
		data: stats = [],
		isLoading,
		isError,
		error,
	} = useProducerProductOrderStats();
	const {
		data: shopOrders = [],
		isLoading: ordersLoading,
		isError: ordersError,
		error: ordersErr,
	} = useProducerShopOrders();

	const totalOrders = stats.reduce((sum, row) => sum + row.ordersCount, 0);
	const totalUnits = stats.reduce((sum, row) => sum + row.unitsSold, 0);
	const totalRevenue = stats
		.reduce((sum, row) => sum + Number(row.revenueMad), 0)
		.toFixed(2);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center rounded-sm border border-cream-dark bg-white px-5 py-12">
				<p className="font-sans text-sm text-stone-500">
					{t("catalogOrdersView.loading")}
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-sm border border-cream-dark bg-white px-5 py-6">
				<p className="font-sans text-red-600 text-sm">
					{error instanceof Error
						? error.message
						: t("catalogOrdersView.failedLoad")}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div className="rounded-sm border border-cream-dark bg-white p-4">
					<p className="font-bold font-sans text-[10px] text-stone-500 uppercase tracking-wide">
						{t("catalogOrdersView.totalProductOrders")}
					</p>
					<p className="mt-1 font-bold font-serif text-2xl text-text-dark">
						{totalOrders}
					</p>
				</div>
				<div className="rounded-sm border border-cream-dark bg-white p-4">
					<p className="font-bold font-sans text-[10px] text-stone-500 uppercase tracking-wide">
						{t("catalogOrdersView.unitsSold")}
					</p>
					<p className="mt-1 font-bold font-serif text-2xl text-text-dark">
						{totalUnits}
					</p>
				</div>
				<div className="rounded-sm border border-cream-dark bg-white p-4">
					<p className="font-bold font-sans text-[10px] text-stone-500 uppercase tracking-wide">
						{t("catalogOrdersView.revenue")}
					</p>
					<p className="mt-1 font-bold font-serif text-2xl text-text-dark">
						{formatMad(totalRevenue)}
					</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-sm border border-cream-dark bg-white">
				<div className="border-cream-dark border-b px-5 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("catalogOrdersView.ordersSectionTitle")}
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-stone-500">
						{t("catalogOrdersView.ordersSectionSubtitle")}
					</p>
				</div>

				{ordersLoading ? (
					<div className="flex items-center justify-center px-5 py-12">
						<p className="font-sans text-sm text-stone-500">
							{t("catalogOrdersView.ordersLoading")}
						</p>
					</div>
				) : ordersError ? (
					<div className="px-5 py-6">
						<p className="font-sans text-red-600 text-sm">
							{ordersErr instanceof Error
								? ordersErr.message
								: t("catalogOrdersView.ordersFailedLoad")}
						</p>
					</div>
				) : shopOrders.length === 0 ? (
					<div className="px-5 py-14 text-center">
						<p className="font-sans text-sm text-stone-500">
							{t("catalogOrdersView.ordersEmpty")}
						</p>
					</div>
				) : (
					<ul className="divide-y divide-cream-dark">
						{shopOrders.map((order) => (
							<li key={order.id}>
								<Link
									className="flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-cream/60 focus-visible:outline-2 focus-visible:outline-forest-mid/40 focus-visible:-outline-offset-2"
									href={`/artisan/orders/${encodeURIComponent(order.id)}`}
									title={t("catalogOrdersView.openOrderDetailTitle")}
								>
									<div className="flex flex-wrap items-start justify-between gap-2">
										<div className="min-w-0">
											<p className="break-all font-mono text-[10px] text-stone-500">
												{order.id}
											</p>
											<p className="mt-0.5 font-sans font-semibold text-sm text-text-dark">
												{order.buyerName}
											</p>
											<p className="mt-0.5 line-clamp-1 font-sans text-[11px] text-stone-500">
												{shopOrderLinesPreview(order)}
											</p>
										</div>
										<div className="flex shrink-0 flex-col items-end gap-1">
											<ShopOrderStatusBadge status={order.status} t={t} />
											<span className="font-sans text-[11px] text-stone-500">
												{formatShopOrderListDate(order.createdAt, locale)}
											</span>
											<span className="font-bold font-serif text-sm text-text-dark">
												{formatMad(order.totalMad)}
											</span>
										</div>
									</div>
									<div className="flex flex-wrap items-center justify-between gap-2 border-cream-dark/60 border-t pt-2">
										<span className="font-sans text-[11px] text-stone-500">
											{paymentLabel(order.paymentMethod)}
										</span>
										<span className="font-sans font-semibold text-[11px] text-forest-mid">
											{t("catalogOrdersView.rowCta")} →
										</span>
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
