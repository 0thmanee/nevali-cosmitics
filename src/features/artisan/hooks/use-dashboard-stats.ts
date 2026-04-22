"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducerDashboardStats } from "~/app/api/dashboard/actions";

export const producerDashboardStatsQueryKey = ["artisan", "dashboard", "stats"] as const;

export function useArtisanDashboardStats() {
  return useQuery({
    queryKey: producerDashboardStatsQueryKey,
    queryFn: getProducerDashboardStats,
    placeholderData: keepPreviousData,
  });
}
