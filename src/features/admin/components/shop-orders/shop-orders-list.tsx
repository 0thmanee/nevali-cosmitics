"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { interpolate } from "~/lib/i18n/interpolate";
import {
  formatShopOrderListDate,
  shopOrderLinesPreview,
  ShopOrderStatusBadge,
} from "~/features/shop-orders/shop-order-ui";
import { useAdminShopOrders } from "../../hooks/use-admin-shop-orders";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";

export function ShopOrdersList() {
  const { locale, t } = useI18n();
  const { formatMad, paymentLabel } = useFormatPrice();
  const { selectedOrganizationId, selectedSlug } = useAdminOrganizationFilter();
  const { data: orders = [], isLoading, isError, error } = useAdminShopOrders(selectedOrganizationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-sm border border-cream-dark bg-white px-5 py-12">
        <p className="font-sans text-sm text-stone-500">{t("adminShopOrders.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-cream-dark bg-white px-5 py-6">
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : t("adminShopOrders.failedLoad")}
        </p>
      </div>
    );
  }

  const subtitle = selectedSlug
    ? interpolate(t("adminShopOrders.subtitleFiltered"), { count: orders.length })
    : orders.length === 1
      ? interpolate(t("adminShopOrders.subtitleAll"), { count: orders.length })
      : interpolate(t("adminShopOrders.subtitleAllPlural"), { count: orders.length });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-sm border border-cream-dark bg-white">
        <div className="border-b border-cream-dark px-5 py-4">
          <h2 className="font-serif text-[15px] font-bold text-text-dark">{t("adminShopOrders.title")}</h2>
          <p className="mt-0.5 font-sans text-[11px] text-stone-500">{subtitle}</p>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-sans text-sm text-stone-500">{t("adminShopOrders.emptyFilter")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-dark">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  title={t("adminShopOrders.openDetailTitle")}
                  className="flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-cream/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest-mid/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-all font-mono text-[10px] text-stone-500">{order.id}</p>
                      <p className="mt-0.5 font-sans text-sm font-semibold text-text-dark">{order.buyerName}</p>
                      <p className="mt-0.5 line-clamp-1 font-sans text-[11px] text-stone-500">{shopOrderLinesPreview(order)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <ShopOrderStatusBadge status={order.status} t={t} />
                      <span className="font-sans text-[11px] text-stone-500">{formatShopOrderListDate(order.createdAt, locale)}</span>
                      <span className="font-serif text-sm font-bold text-text-dark">{formatMad(order.totalMad)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream-dark/60 pt-2">
                    <span className="font-sans text-[11px] text-stone-500">{paymentLabel(order.paymentMethod)}</span>
                    <span className="font-sans text-[11px] font-semibold text-forest-mid">{t("adminShopOrders.rowCta")} →</span>
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
