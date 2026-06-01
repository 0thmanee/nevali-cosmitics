"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type {
	UpdateSupportTicketAdminNotesInput,
	UpdateSupportTicketStatusInput,
} from "~/app/api/support";
import {
	getAdminSupportTicketCounts,
	getSupportTicketForAdmin,
	listSupportTicketsForAdmin,
	updateSupportTicketAdminNotes,
	updateSupportTicketStatus,
} from "~/app/api/support";
import { adminNavStatsQueryKey } from "./use-admin-nav-stats";

export const adminSupportTicketsQueryKey = [
	"admin",
	"support",
	"tickets",
] as const;

export function adminSupportTicketsFilterKey(
	status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "ALL",
	organizationId?: string | null,
) {
	return [
		...adminSupportTicketsQueryKey,
		status === "ALL" ? "all" : status,
		organizationId ?? "all",
	] as const;
}

export function useAdminSupportTickets(
	status?: "OPEN" | "IN_REVIEW" | "RESOLVED",
	organizationId?: string | null,
) {
	return useQuery({
		queryKey: adminSupportTicketsFilterKey(status ?? "ALL", organizationId),
		queryFn: () =>
			listSupportTicketsForAdmin(
				status
					? { status, organizationId: organizationId ?? undefined }
					: { organizationId: organizationId ?? undefined },
			),
		placeholderData: keepPreviousData,
	});
}

export function useUpdateSupportTicketStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateSupportTicketStatusInput) =>
			updateSupportTicketStatus(input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: adminSupportTicketsQueryKey });
			queryClient.invalidateQueries({ queryKey: adminNavStatsQueryKey });
			queryClient.invalidateQueries({
				queryKey: adminSupportTicketDetailQueryKey(variables.ticketId),
			});
		},
	});
}

export function useAdminSupportTicketCounts(organizationId?: string | null) {
	return useQuery({
		queryKey: [
			...adminSupportTicketsQueryKey,
			"counts",
			organizationId ?? "all",
		] as const,
		queryFn: () => getAdminSupportTicketCounts(organizationId),
		placeholderData: keepPreviousData,
	});
}

export function adminSupportTicketDetailQueryKey(ticketId: string | null) {
	return [...adminSupportTicketsQueryKey, "detail", ticketId ?? ""] as const;
}

export function useAdminSupportTicketDetail(ticketId: string | null) {
	return useQuery({
		queryKey: adminSupportTicketDetailQueryKey(ticketId),
		queryFn: () => getSupportTicketForAdmin(ticketId!),
		enabled: !!ticketId,
	});
}

export function useUpdateSupportTicketAdminNotes() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateSupportTicketAdminNotesInput) =>
			updateSupportTicketAdminNotes(input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: adminSupportTicketsQueryKey });
			queryClient.invalidateQueries({
				queryKey: adminSupportTicketDetailQueryKey(variables.ticketId),
			});
		},
	});
}
