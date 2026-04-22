"use client";

import React from "react";
import { formatPriceMad } from "~/lib/format-price";
import { useProducerProductOrderStats } from "../../hooks/use-producer-product-order-stats";

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function CatalogOrdersView() {
  const { data: stats = [], isLoading, isError, error } = useProducerProductOrderStats();

  const totalOrders = stats.reduce((sum, row) => sum + row.ordersCount, 0);
  const totalUnits = stats.reduce((sum, row) => sum + row.unitsSold, 0);
  const totalRevenue = stats
    .reduce((sum, row) => sum + Number(row.revenueMad), 0)
    .toFixed(2);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-cream-dark bg-white px-5 py-12">
        <p className="font-sans text-sm text-stone-500">Loading order stats…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-cream-dark bg-white px-5 py-6">
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load order stats."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            Total product-orders
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[#7B1F0A]">{totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            Units sold
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[#7B1F0A]">{totalUnits}</p>
        </div>
        <div className="rounded-2xl border border-cream-dark bg-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-stone-500">
            Revenue
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[#7B1F0A]">
            {formatPriceMad(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white">
        <div className="border-b border-cream-dark px-5 py-4">
          <h2 className="font-serif text-[15px] font-bold text-text-dark">Catalog orders by product</h2>
          <p className="mt-0.5 font-sans text-[11px] text-stone-500">
            Aggregated product-level data only. Customer identity and contact details are hidden.
          </p>
        </div>

        {stats.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-sans text-sm text-stone-500">
              No catalog orders yet. As buyers place orders, aggregated metrics will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-cream-dark bg-cream">
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    Product
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    Orders
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    Units sold
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    Revenue
                  </th>
                  <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-wide text-stone-500">
                    Last order
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr className="border-b border-cream-dark/80" key={row.productId}>
                    <td className="px-5 py-3 font-sans text-sm text-text-dark">{row.productName}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">{row.ordersCount}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">{row.unitsSold}</td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">
                      {formatPriceMad(row.revenueMad)}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-stone-600">
                      {formatDate(row.lastOrderedAt)}
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
