"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  listRfqsForAdmin,
  listContractsForAdmin,
  setRfqStatusAdmin,
  setContractStatusAdmin,
} from "~/app/api/contracts";
import type {
  ListRfqsForAdminFilters,
  ListContractsForAdminFilters,
  SetRfqStatusAdminInput,
  SetContractStatusAdminInput,
} from "~/app/api/contracts";

export const adminRfqsQueryKey = ["admin", "rfqs"] as const;
export const adminContractsQueryKey = ["admin", "contracts"] as const;

export function useAdminRfqs(filters: ListRfqsForAdminFilters = {}) {
  return useQuery({
    queryKey: [...adminRfqsQueryKey, filters.organizationId ?? "all", filters.status ?? "all"] as const,
    queryFn: () => listRfqsForAdmin(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAdminContracts(filters: ListContractsForAdminFilters = {}) {
  return useQuery({
    queryKey: [...adminContractsQueryKey, filters.organizationId ?? "all", filters.status ?? "all"] as const,
    queryFn: () => listContractsForAdmin(filters),
    placeholderData: keepPreviousData,
  });
}

export function useSetRfqStatusAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetRfqStatusAdminInput) => setRfqStatusAdmin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRfqsQueryKey });
    },
  });
}

export function useSetContractStatusAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetContractStatusAdminInput) => setContractStatusAdmin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminContractsQueryKey });
    },
  });
}
