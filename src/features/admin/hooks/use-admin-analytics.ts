"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminShopOrderAnalytics } from "~/app/api/shop-orders/admin-actions";

export const adminShopOrderAnalyticsQueryKey = (
	organizationId: string | null | undefined,
) => ["admin", "analytics", "shop-orders", organizationId ?? "all"] as const;

export function useAdminShopOrderAnalytics(organizationId?: string | null) {
	return useQuery({
		queryKey: adminShopOrderAnalyticsQueryKey(organizationId),
		queryFn: () => getAdminShopOrderAnalytics(organizationId),
	});
}
