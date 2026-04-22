"use client";

import { useQuery } from "@tanstack/react-query";
import { listMyProductOrderStats } from "~/app/api/shop-orders/producer-actions";

export const producerProductOrderStatsQueryKey = [
  "producer",
  "shop-orders",
  "product-stats",
] as const;

export function useProducerProductOrderStats() {
  return useQuery({
    queryKey: producerProductOrderStatsQueryKey,
    queryFn: listMyProductOrderStats,
  });
}
