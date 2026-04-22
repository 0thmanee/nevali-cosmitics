"use client";

import React from "react";
import { Package, AlertCircle } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";
import { useProducts } from "../../hooks/use-products";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";

export function DashboardStats() {
  const { data: products = [] } = useProducts();
  const { data: stats } = useArtisanDashboardStats();
  const activeCount = products.filter((p) => p.status === "APPROVED").length;
  const openSupportTickets = stats?.openSupportTickets ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      <StatCard
        label="Active Products"
        value={activeCount}
        icon={<Package size={20} color={STAT_ICON_COLOR.neutral} />}
        variant="neutral"
      />
      <StatCard
        label="Open Support Tickets"
        value={openSupportTickets}
        icon={<AlertCircle size={20} color={STAT_ICON_COLOR.amber} />}
        variant="amber"
      />
    </div>
  );
}
