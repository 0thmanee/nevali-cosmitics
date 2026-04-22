"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminPartnerStats } from "~/app/api/admin/actions";

export function useAdminPartnerStats(organizationId?: string | null) {
  return useQuery({
    queryKey: ["admin", "partner-stats", organizationId ?? "all"] as const,
    queryFn: () => getAdminPartnerStats(organizationId),
  });
}
