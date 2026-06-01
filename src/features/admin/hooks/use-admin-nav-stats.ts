"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminNavStats } from "~/app/api/admin/actions";

export const adminNavStatsQueryKey = ["admin", "nav-stats"] as const;

export function useAdminNavStats(organizationId?: string | null) {
	return useQuery({
		queryKey: [...adminNavStatsQueryKey, organizationId ?? "all"] as const,
		queryFn: () => getAdminNavStats(organizationId),
	});
}
