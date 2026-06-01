"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducerDashboardStats } from "~/app/api/dashboard/actions";

export const producerDashboardStatsQueryKey = [
	"producer",
	"dashboard",
	"stats",
] as const;

export function useArtisanDashboardStats() {
	return useQuery({
		queryKey: producerDashboardStatsQueryKey,
		queryFn: getProducerDashboardStats,
		placeholderData: keepPreviousData,
	});
}
