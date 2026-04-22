"use client";

import { useQuery } from "@tanstack/react-query";
import { listMyShopOrdersForBuyer } from "~/app/api/shop-orders/buyer-actions";

export const buyerShopOrdersQueryKey = ["buyer", "shop-orders"] as const;

export function useBuyerShopOrders() {
	return useQuery({
		queryKey: buyerShopOrdersQueryKey,
		queryFn: listMyShopOrdersForBuyer,
	});
}
