"use client";

import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import type { AppLocale } from "~/lib/i18n/config";
import { useProducerProductOrderStats } from "../../hooks/use-producer-product-order-stats";

function formatDate(d: Date | null, locale: AppLocale, dash: string) {
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
  const { formatMad } = useFormatPrice();
  const { data: stats = [], isLoading, isError, error } = useProducerProductOrderStats();

  const totalOrders = stats.reduce((sum, row) => sum + row.ordersCount, 0);
  const totalUnits = stats.reduce((sum, row) => sum + row.unitsSold, 0);
  const totalRevenue = stats.reduce((sum, row) => sum + Number(row.revenueMad), 0).toFixed(2);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-sm border border-cream-dark bg-white px-5 py-12">
        <p className="font-sans text-sm text-stone-500">{t("catalogOrdersView.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-cream-dark bg-white px-5 py-6">
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : t("catalogOrdersView.failedLoad")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-sm border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            {t("catalogOrdersView.totalProductOrders")}
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-text-dark">{totalOrders}</p>
        </div>
        <div className="rounded-sm border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            {t("catalogOrdersView.unitsSold")}
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-text-dark">{totalUnits}</p>
        </div>
        <div className="rounded-sm border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            {t("catalogOrdersView.revenue")}
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-text-dark">{formatMad(totalRevenue)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-cream-dark bg-white">
        <div className="border-b border-cream-dark px-5 py-4">
          <h2 className="font-serif text-[15px] font-bold text-text-dark">{t("catalogOrdersView.title")}</h2>
          <p className="mt-0.5 font-sans text-[11px] text-stone-500">{t("catalogOrdersView.subtitle")}</p>
        </div>

        {stats.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-sans text-sm text-stone-500">{t("catalogOrdersView.empty")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-cream-dark bg-cream">
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    {t("catalogOrdersView.thProduct")}
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    {t("catalogOrdersView.thOrders")}
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    {t("catalogOrdersView.thUnitsSold")}
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    {t("catalogOrdersView.thRevenue")}
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    {t("catalogOrdersView.thLastOrder")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr className="border-b border-cream-dark/80" key={row.productId}>
                    <td className="px-5 py-3 font-sans text-sm text-text-dark">{row.productName}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">{row.ordersCount}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">{row.unitsSold}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">{formatMad(row.revenueMad)}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">
                      {formatDate(row.lastOrderedAt, locale, t("common.dash"))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
