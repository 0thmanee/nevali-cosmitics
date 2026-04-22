"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  listMyRfqs,
  listMyActiveContracts,
  listMyCompletedContracts,
} from "~/app/api/contracts";

/** Aligned with `artisan/contracts` page prefetch keys. */
export const producerRfqsQueryKey = ["producer", "rfqs"] as const;
export const producerActiveContractsQueryKey = ["producer", "contracts", "active"] as const;
export const producerCompletedContractsQueryKey = ["producer", "contracts", "completed"] as const;

export function useMyRfqs() {
  return useQuery({
    queryKey: producerRfqsQueryKey,
    queryFn: listMyRfqs,
    placeholderData: keepPreviousData,
  });
}

export function useMyActiveContracts() {
  return useQuery({
    queryKey: producerActiveContractsQueryKey,
    queryFn: listMyActiveContracts,
    placeholderData: keepPreviousData,
  });
}

export function useMyCompletedContracts() {
  return useQuery({
    queryKey: producerCompletedContractsQueryKey,
    queryFn: listMyCompletedContracts,
    placeholderData: keepPreviousData,
  });
}
