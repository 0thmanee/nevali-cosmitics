"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";
import { useProducts } from "~/features/artisan/hooks/use-products";
import {
  ProductsFilterBar,
  ProductsTable,
  RejectedWarning,
  type ProductsTab,
} from ".";

export function ProductsPageClient() {
  const [activeTab, setActiveTab] = useState<ProductsTab>("All");
  const [search, setSearch] = useState("");

  const { data: allProducts = [], isLoading, isError } = useProducts();

  const { filtered, counts } = useMemo(() => {
    const tabStatus =
      activeTab === "All"
        ? null
        : (activeTab.toUpperCase() as "APPROVED" | "PENDING" | "REJECTED");
    const filtered = allProducts.filter((p) => {
      const matchTabFilter = !tabStatus || p.status === tabStatus;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchTabFilter && matchSearch;
    });
    const counts = {
      All: allProducts.length,
      Approved: allProducts.filter((p) => p.status === "APPROVED").length,
      Pending: allProducts.filter((p) => p.status === "PENDING").length,
      Rejected: allProducts.filter((p) => p.status === "REJECTED").length,
    };
    return { filtered, counts };
  }, [allProducts, activeTab, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Approved" value={counts.Approved} icon={<CheckCircle size={20} color={STAT_ICON_COLOR.green} />} variant="green" />
        <StatCard label="Pending Review" value={counts.Pending} icon={<Clock size={20} color={STAT_ICON_COLOR.amber} />} variant="amber" />
        <StatCard label="Rejected" value={counts.Rejected} icon={<XCircle size={20} color={counts.Rejected > 0 ? STAT_ICON_COLOR.red : STAT_ICON_COLOR.neutral} />} variant={counts.Rejected > 0 ? "red" : "neutral"} />
      </div>
      <ProductsFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        counts={counts}
        action={
          <Link
            href="/artisan/products/new"
            className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors bg-forest-dark text-white"
          >
            Add product
          </Link>
        }
      />
      {isLoading ? (
        <div className="bg-white border border-[#d8d0c4] rounded-sm py-12 text-center font-sans text-sm text-text-muted">
          Loading products…
        </div>
      ) : isError ? (
        <div className="bg-white border border-[#d8d0c4] rounded-sm py-12 text-center font-sans text-sm text-red-500">
          Failed to load products.
        </div>
      ) : (
        <ProductsTable products={filtered} />
      )}
      {(activeTab === "All" || activeTab === "Rejected") && (
        <RejectedWarning
          count={counts.Rejected}
          rejectedProducts={allProducts.filter((p) => p.status === "REJECTED")}
        />
      )}
    </div>
  );
}
