"use client";

import React from "react";
import { useAdminShopOrders } from "../../hooks/use-admin-shop-orders";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import { formatPriceMad } from "~/lib/format-price";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

function paymentLabel(method: string) {
  return method === "COD" ? "Cash on delivery" : method === "CARD" ? "Card" : method;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  CONFIRMED: { bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)", color: "var(--color-ink)", border: "1px solid color-mix(in srgb, var(--color-ink) 25%, transparent)" },
  PENDING_PAYMENT: { bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)", color: "var(--color-warning-dark)", border: "1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)" },
  PENDING: { bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)", color: "var(--color-warning-dark)", border: "1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)" },
  CANCELLED: { bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)" },
};

function statusBadge(status: string) {
  const s = STATUS_STYLES[status] ?? {
    bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
    color: "var(--color-warning-dark)",
    border: "1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)",
  };
  return (
    <span
      className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color, border: s.border }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ShopOrdersList() {
  const { selectedOrganizationId, selectedSlug } = useAdminOrganizationFilter();
  const { data: orders = [], isLoading, isError, error } = useAdminShopOrders(selectedOrganizationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-sm border border-cream-dark bg-white px-5 py-12">
        <p className="font-sans text-sm text-stone-500">Loading orders…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-cream-dark bg-white px-5 py-6">
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load orders."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-sm border border-cream-dark bg-white">
        <div className="border-b border-cream-dark px-5 py-4">
          <h2 className="font-serif text-[15px] font-bold text-text-dark">Catalog checkout orders</h2>
          <p className="mt-0.5 font-sans text-[11px] text-stone-500">
            {selectedSlug
              ? `Orders that include at least one product from the selected organization (${orders.length} shown).`
              : `${orders.length} order${orders.length !== 1 ? "s" : ""} from the public cart checkout.`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-sans text-sm text-stone-500">No orders yet for this filter.</p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-dark">
            {orders.map((order) => (
              <li className="flex flex-col gap-3 px-5 py-4" key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-all font-mono text-[11px] text-stone-500">{order.id}</p>
                    <p className="mt-1 font-sans text-sm font-semibold text-text-dark">{order.buyerName}</p>
                    <p className="font-sans text-[12px] text-stone-500">{order.buyerEmail}</p>
                    {order.buyerPhone ? (
                      <p className="font-sans text-[12px] text-stone-500">{order.buyerPhone}</p>
                    ) : null}
                    <div className="mt-2 space-y-0.5 font-sans text-[12px] text-stone-500">
                      <p className="font-semibold text-text-dark">Shipping address</p>
                      <p>{order.addressLine1}</p>
                      {order.addressLine2 ? <p>{order.addressLine2}</p> : null}
                      <p>
                        {order.postalCode} {order.city}
                      </p>
                      <p>{order.country}</p>
                    </div>
                    {order.notes ? (
                      <p className="mt-2 line-clamp-3 font-sans text-[12px] italic text-stone-500">
                        Note: {order.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {statusBadge(order.status)}
                    <span className="font-sans text-[11px] text-stone-500">{formatDate(order.createdAt)}</span>
                    <span className="font-sans text-[11px] font-medium text-text-dark">
                      {paymentLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 rounded-sm border border-cream-dark bg-cream px-3 py-2">
                  {order.lines.map((line) => (
                    <li
                      className="flex flex-wrap justify-between gap-2 font-sans text-[12px] text-text-dark"
                      key={line.id}
                    >
                      <span className="min-w-0">
                        <span className="font-medium">{line.productName}</span>
                        {line.variantName ? (
                          <span className="font-normal text-stone-500"> · {line.variantName}</span>
                        ) : null}
                        <span className="text-stone-500">
                          {" "}
                          × {line.quantity} · {line.organizationName}
                        </span>
                      </span>
                      <span className="shrink-0 text-stone-500">
                        {formatPriceMad(line.unitPrice)} / unit
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wide text-stone-500">
                    Order total
                  </span>
                  <span className="font-serif font-bold text-text-dark">
                    {formatPriceMad(order.totalMad)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
