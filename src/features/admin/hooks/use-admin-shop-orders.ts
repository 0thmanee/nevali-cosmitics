"use client";

import { useQuery } from "@tanstack/react-query";
import { listShopOrdersForAdmin } from "~/app/api/shop-orders/admin-actions";

export const adminShopOrdersQueryKey = ["admin", "shop-orders"] as const;

export function useAdminShopOrders(organizationId?: string | null) {
	return useQuery({
		queryKey: [...adminShopOrdersQueryKey, organizationId ?? "all"] as const,
		queryFn: () => listShopOrdersForAdmin(organizationId),
	});
}
