"use client";

import { useQuery } from "@tanstack/react-query";
import { listMyShopOrders } from "~/app/api/shop-orders/producer-actions";

export const producerShopOrdersQueryKey = ["producer", "shop-orders", "list"] as const;

export function useProducerShopOrders() {
  return useQuery({
    queryKey: producerShopOrdersQueryKey,
    queryFn: listMyShopOrders,
  });
}
