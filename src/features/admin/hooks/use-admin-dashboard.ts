"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardData } from "~/app/api/admin/actions";

export function useAdminDashboard(organizationId?: string | null) {
	return useQuery({
		queryKey: ["admin", "dashboard", organizationId ?? "all"] as const,
		queryFn: () => getAdminDashboardData(organizationId),
	});
}
