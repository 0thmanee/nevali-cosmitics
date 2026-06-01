"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	approveUser,
	deletePartner,
	getPartner,
	listPartners,
	listPartnersPaginated,
	updatePartner,
} from "~/app/api/partners/actions";
import type { UpdatePartnerInput } from "~/app/api/partners/schemas/partners.schema";

export const adminPartnersQueryKey = ["admin", "partners"] as const;

export function adminPartnersPaginatedQueryKey(
	page: number,
	pageSize: number,
	organizationId?: string | null,
) {
	return [
		...adminPartnersQueryKey,
		"paginated",
		page,
		pageSize,
		organizationId ?? "all",
	] as const;
}

export function adminPartnerQueryKey(userId: string) {
	return [...adminPartnersQueryKey, "detail", userId] as const;
}

export function usePartners(organizationId?: string | null) {
	return useQuery({
		queryKey: [...adminPartnersQueryKey, organizationId ?? "all"] as const,
		queryFn: () =>
			listPartners({ organizationId: organizationId ?? undefined }),
	});
}

export function usePartnersPaginated(
	page: number,
	pageSize: number = 10,
	organizationId?: string | null,
) {
	return useQuery({
		queryKey: adminPartnersPaginatedQueryKey(page, pageSize, organizationId),
		queryFn: () =>
			listPartnersPaginated({
				page,
				pageSize,
				organizationId: organizationId ?? undefined,
			}),
		placeholderData: keepPreviousData,
	});
}

/** Single partner with full profile. Pass null to disable the query. */
export function usePartner(userId: string | null) {
	return useQuery({
		queryKey: adminPartnerQueryKey(userId ?? ""),
		queryFn: () => getPartner(userId!),
		enabled: !!userId,
	});
}

export function useApproveUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: approveUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminPartnersQueryKey });
		},
	});
}

export function useUpdatePartner() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			userId,
			data,
		}: {
			userId: string;
			data: UpdatePartnerInput;
		}) => updatePartner(userId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminPartnersQueryKey });
		},
	});
}

export function useDeletePartner() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePartner,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminPartnersQueryKey });
		},
	});
}
