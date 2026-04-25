"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminShopOrderListRow } from "~/app/api/shop-orders/repo/shop-orders.repo";
import { updateShopOrderStatusForAdmin } from "~/app/api/shop-orders/admin-actions";
import { updateMyShopOrderStatus } from "~/app/api/shop-orders/producer-actions";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { interpolate } from "~/lib/i18n/interpolate";
import { SHOP_ORDER_STATUSES } from "~/lib/shop-order-statuses";
import { normalizePhoneForWhatsAppDigits } from "~/lib/whatsapp-phone-normalize";
import { producerShopOrdersQueryKey } from "~/features/artisan/hooks/use-producer-shop-orders";
import { formatShopOrderListDate, shopOrderStatusLabel, shopOrderStatusSelectValue } from "./shop-order-ui";

function lineSubtotalMad(unitPrice: string, quantity: number): string {
  const u = Number(unitPrice);
  const sub = (Number.isFinite(u) ? u : 0) * quantity;
  return sub.toFixed(2);
}

function normalizeOrderDates(order: AdminShopOrderListRow): AdminShopOrderListRow {
  return {
    ...order,
    createdAt: order.createdAt instanceof Date ? order.createdAt : new Date(String(order.createdAt)),
  };
}

function ShopOrderStatusDropdown({
  orderId,
  status,
  mode,
}: {
  orderId: string;
  status: string;
  mode: "admin" | "producer";
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const selectValue = shopOrderStatusSelectValue(status);

  const mutation = useMutation({
    mutationFn: async (next: string) => {
      if (mode === "admin") await updateShopOrderStatusForAdmin({ orderId, status: next });
      else await updateMyShopOrderStatus({ orderId, status: next });
    },
    onSuccess: async () => {
      if (mode === "admin") await queryClient.invalidateQueries({ queryKey: ["admin", "shop-orders"] });
      else await queryClient.invalidateQueries({ queryKey: producerShopOrdersQueryKey });
      router.refresh();
    },
  });

  return (
    <select
      value={selectValue}
      onChange={(e) => {
        const next = e.currentTarget.value;
        if (next === selectValue) return;
        mutation.mutate(next);
      }}
      disabled={mutation.isPending}
      aria-label={t("adminShopOrders.statusSelectAria")}
      className="min-h-[44px] w-full min-w-[200px] max-w-full cursor-pointer rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm font-medium text-text-dark shadow-sm transition-colors hover:border-forest-mid/35 disabled:cursor-wait disabled:opacity-60 sm:min-w-[240px]"
    >
      {SHOP_ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(`adminShopOrders.status.${s}`)}
        </option>
      ))}
    </select>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-sm border border-cream-dark bg-white p-5 lg:p-6 ${className}`}
      style={{ boxShadow: "0 1px 0 color-mix(in srgb, var(--color-ink) 4%, transparent)" }}
    >
      {children}
    </section>
  );
}

export type ShopOrderDetailPanelProps = {
  order: AdminShopOrderListRow;
  backHref: string;
  backLabelKey: string;
  breadcrumbParentLabelKey: string;
  statusEditMode: "none" | "admin" | "producer";
};

export function ShopOrderDetailPanel({
  order: rawOrder,
  backHref,
  backLabelKey,
  breadcrumbParentLabelKey,
  statusEditMode,
}: ShopOrderDetailPanelProps) {
  const { locale, t } = useI18n();
  const { formatMad, paymentLabel } = useFormatPrice();
  const order = useMemo(() => normalizeOrderDates(rawOrder), [rawOrder]);

  const waDigits = order.buyerPhone ? normalizePhoneForWhatsAppDigits(order.buyerPhone) : null;
  const whatsAppBody = interpolate(t("adminShopOrders.whatsappPrefill"), {
    name: order.buyerName,
    orderId: order.id,
  });
  const waHref =
    waDigits != null
      ? `https://wa.me/${encodeURIComponent(waDigits)}?text=${encodeURIComponent(whatsAppBody)}`
      : null;

  const emailTrim = order.buyerEmail?.trim() ?? "";
  const emailSubject = interpolate(t("adminShopOrders.emailSubject"), { orderId: order.id });
  const emailBody = interpolate(t("adminShopOrders.emailBody"), {
    name: order.buyerName,
    orderId: order.id,
  });
  const mailtoHref =
    emailTrim.length > 0
      ? `mailto:${encodeURIComponent(emailTrim)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : null;

  return (
    <div className="flex w-full flex-col gap-6 pb-12 lg:p-8 lg:pb-16">
      <nav className="flex flex-wrap items-center gap-2 font-sans text-sm text-text-muted">
        <Link href={backHref} className="transition-colors hover:text-text-dark">
          {t(breadcrumbParentLabelKey)}
        </Link>
        <span className="text-text-muted/60" aria-hidden>
          /
        </span>
        <span className="font-medium text-text-dark">{t("common.orderDetailCurrent")}</span>
      </nav>

      <header className="flex flex-col gap-6 border-b border-cream-dark pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark sm:text-4xl">
            {t("adminShopOrders.detailTitle")}
          </h1>
          <p className="break-all font-mono text-xs text-stone-500 sm:text-sm">{order.id}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-2 font-sans text-sm text-stone-600">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                {t("adminShopOrders.detailPlaced")}
              </dt>
              <dd className="mt-0.5 text-text-dark">{formatShopOrderListDate(order.createdAt, locale)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                {t("adminShopOrders.detailPayment")}
              </dt>
              <dd className="mt-0.5 text-text-dark">{paymentLabel(order.paymentMethod)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                {t("adminShopOrders.orderTotal")}
              </dt>
              <dd className="mt-0.5 font-serif text-lg font-bold text-text-dark">{formatMad(order.totalMad)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:max-w-sm lg:w-72">
          <label className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            {t("adminShopOrders.detailStatus")}
          </label>
          {statusEditMode === "admin" || statusEditMode === "producer" ? (
            <ShopOrderStatusDropdown orderId={order.id} status={order.status} mode={statusEditMode} />
          ) : (
            <p className="rounded-sm border border-cream-dark bg-cream px-3 py-2.5 font-sans text-sm font-medium text-text-dark">
              {shopOrderStatusLabel(order.status, t)}
            </p>
          )}
          <Link
            href={backHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-cream-dark bg-white px-4 font-sans text-sm font-semibold text-text-dark transition-colors hover:bg-cream"
          >
            {t(backLabelKey)}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <h2 className="font-serif text-lg font-bold text-text-dark">{t("adminShopOrders.detailLines")}</h2>
            <div className="mt-4 overflow-x-auto rounded-sm border border-cream-dark">
              <table className="min-w-full divide-y divide-cream-dark font-sans text-sm">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-stone-500">
                      {t("adminShopOrders.thLineProduct")}
                    </th>
                    <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-stone-500 sm:table-cell">
                      {t("adminShopOrders.thLineSeller")}
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-stone-500">
                      {t("adminShopOrders.thLineQty")}
                    </th>
                    <th className="hidden px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-stone-500 md:table-cell">
                      {t("adminShopOrders.thLineUnit")}
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-stone-500">
                      {t("adminShopOrders.thLineSubtotal")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark bg-white">
                  {order.lines.map((line) => {
                    const sub = lineSubtotalMad(line.unitPrice, line.quantity);
                    return (
                      <tr key={line.id}>
                        <td className="max-w-[200px] px-4 py-3 align-top text-text-dark">
                          <span className="font-medium">{line.productName}</span>
                          {line.variantName ? (
                            <span className="block text-xs font-normal text-stone-500">{line.variantName}</span>
                          ) : null}
                          <span className="mt-1 block text-xs text-stone-500 sm:hidden">{line.organizationName}</span>
                        </td>
                        <td className="hidden px-4 py-3 align-top text-stone-600 sm:table-cell">{line.organizationName}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right align-top text-stone-700">×{line.quantity}</td>
                        <td className="hidden whitespace-nowrap px-4 py-3 text-right align-top text-stone-600 md:table-cell">
                          {formatMad(line.unitPrice)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right align-top font-medium text-text-dark">
                          {formatMad(sub)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-cream-dark pt-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wide text-stone-500">
                {t("adminShopOrders.orderTotal")}
              </span>
              <span className="font-serif text-xl font-bold text-text-dark">{formatMad(order.totalMad)}</span>
            </div>
          </Card>

          {order.notes ? (
            <Card>
              <h2 className="font-serif text-lg font-bold text-text-dark">{t("adminShopOrders.notePrefix")}</h2>
              <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone-700">{order.notes}</p>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card>
            <h2 className="font-serif text-lg font-bold text-text-dark">{t("adminShopOrders.detailBuyer")}</h2>
            <div className="mt-4 space-y-2 font-sans text-sm">
              <p className="text-lg font-semibold text-text-dark">{order.buyerName}</p>
              <p className="text-stone-600">{order.buyerEmail || t("common.dash")}</p>
              {order.buyerPhone ? <p className="text-stone-600">{order.buyerPhone}</p> : <p className="text-stone-500">{t("common.dash")}</p>}
            </div>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-bold text-text-dark">{t("adminShopOrders.shippingAddress")}</h2>
            <address className="mt-4 space-y-1 font-sans text-sm not-italic leading-relaxed text-stone-700">
              <p>{order.addressLine1}</p>
              {order.addressLine2 ? <p>{order.addressLine2}</p> : null}
              <p>
                {order.postalCode} {order.city}
              </p>
              <p>{order.country}</p>
            </address>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-bold text-text-dark">{t("adminShopOrders.contactClient")}</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-sm bg-[#25D366] px-5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:min-w-[140px]"
                >
                  {t("adminShopOrders.whatsappClient")}
                </a>
              ) : (
                <span className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-sm border border-cream-dark bg-cream px-4 font-sans text-xs text-stone-500 sm:min-w-[140px]">
                  {t("adminShopOrders.whatsappUnavailable")}
                </span>
              )}
              {mailtoHref ? (
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-sm border border-cream-dark bg-white px-5 font-sans text-sm font-semibold text-text-dark transition-colors hover:bg-cream sm:min-w-[140px]"
                >
                  {t("adminShopOrders.emailClient")}
                </a>
              ) : (
                <span className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-sm border border-cream-dark bg-cream px-4 font-sans text-xs text-stone-500 sm:min-w-[140px]">
                  {t("adminShopOrders.emailUnavailable")}
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
