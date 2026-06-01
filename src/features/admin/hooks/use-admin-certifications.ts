"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getAdminCertificationCounts,
	listCertificationsForAdmin,
	setCertificationStatus,
} from "~/app/api/certifications/actions";
import type { SetCertificationStatusInput } from "~/app/api/certifications/schemas/certifications.schema";
import {
	adminProductQueryKey,
	adminProductsQueryKey,
} from "./use-admin-products";

export const adminCertificationsQueryKey = ["admin", "certifications"] as const;

export function adminCertificationsFilterKey(filters: {
	organizationId?: string | null;
	status?: "PENDING" | "APPROVED" | "REJECTED";
	productId?: string | null;
}) {
	return [
		...adminCertificationsQueryKey,
		filters.organizationId ?? "all",
		filters.status ?? "all",
		filters.productId ?? "all",
	] as const;
}

export function useAdminCertifications(
	filters: {
		organizationId?: string | null;
		status?: "PENDING" | "APPROVED" | "REJECTED";
		productId?: string | null;
	} = {},
) {
	return useQuery({
		queryKey: adminCertificationsFilterKey(filters),
		queryFn: () =>
			listCertificationsForAdmin({
				...filters,
				organizationId: filters.organizationId ?? undefined,
			}),
		placeholderData: keepPreviousData,
	});
}

export function useAdminCertificationCounts(organizationId?: string | null) {
	return useQuery({
		queryKey: [
			...adminCertificationsQueryKey,
			"counts",
			organizationId ?? "all",
		] as const,
		queryFn: () => getAdminCertificationCounts(organizationId),
		placeholderData: keepPreviousData,
	});
}

export function useSetCertificationStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: SetCertificationStatusInput) =>
			setCertificationStatus(input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: adminCertificationsQueryKey });
			queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
			// Invalidate specific product detail if we had productId (we don't have it in variables; cert id only)
			// So we invalidate all product details by invalidating admin products key
		},
	});
}
