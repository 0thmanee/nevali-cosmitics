"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminSalesAnalytics } from "~/app/api/admin/actions";

export const adminSalesAnalyticsQueryKey = (
	organizationId: string | null | undefined,
) => ["admin", "analytics", "sales", organizationId ?? "all"] as const;

export function useAdminSalesAnalytics(organizationId?: string | null) {
	return useQuery({
		queryKey: adminSalesAnalyticsQueryKey(organizationId),
		queryFn: () => getAdminSalesAnalytics(organizationId),
	});
}
