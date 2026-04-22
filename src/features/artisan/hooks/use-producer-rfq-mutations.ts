"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitProducerRfqQuote,
  updateProducerRfqQuote,
  transitionProducerRfq,
  createContractFromRfqProducer,
} from "~/app/api/contracts";
import {
  producerRfqsQueryKey,
  producerActiveContractsQueryKey,
  producerCompletedContractsQueryKey,
} from "./use-contracts";
import { producerDashboardStatsQueryKey } from "./use-dashboard-stats";

function invalidateProducerContractQueries(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: producerRfqsQueryKey });
  void qc.invalidateQueries({ queryKey: producerActiveContractsQueryKey });
  void qc.invalidateQueries({ queryKey: producerCompletedContractsQueryKey });
  void qc.invalidateQueries({ queryKey: producerDashboardStatsQueryKey });
}

export function useSubmitProducerRfqQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitProducerRfqQuote,
    onSettled: () => invalidateProducerContractQueries(qc),
  });
}

export function useUpdateProducerRfqQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProducerRfqQuote,
    onSettled: () => invalidateProducerContractQueries(qc),
  });
}

export function useTransitionProducerRfq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transitionProducerRfq,
    onSettled: () => invalidateProducerContractQueries(qc),
  });
}

export function useCreateContractFromRfqProducer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createContractFromRfqProducer,
    onSettled: () => invalidateProducerContractQueries(qc),
  });
}
