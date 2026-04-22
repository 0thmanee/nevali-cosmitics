"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { listMySupportTickets, createSupportTicket, addProducerReply } from "~/app/api/support";
import type { CreateSupportTicketInput } from "~/app/api/support";
import { producerDashboardStatsQueryKey } from "./use-dashboard-stats";

export const producerSupportTicketsQueryKey = ["artisan", "support", "tickets"] as const;

export function useMySupportTickets() {
  return useQuery({
    queryKey: producerSupportTicketsQueryKey,
    queryFn: listMySupportTickets,
    placeholderData: keepPreviousData,
  });
}

export function useAddProducerReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, reply }: { ticketId: string; reply: string }) =>
      addProducerReply(ticketId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: producerSupportTicketsQueryKey });
    },
  });
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupportTicketInput) => createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: producerSupportTicketsQueryKey });
      queryClient.invalidateQueries({ queryKey: producerDashboardStatsQueryKey });
    },
  });
}
