"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getAdminProductCounts,
	getProductForAdmin,
	listProductsForAdmin,
	setProductStatus,
} from "~/app/api/products/actions";
import type { SetProductStatusInput } from "~/app/api/products/schemas/products.schema";

export const adminProductsQueryKey = ["admin", "products"] as const;

export function adminProductsFilterQueryKey(
	status: "PENDING" | "APPROVED" | "REJECTED" | "ALL",
	organizationId?: string | null,
) {
	return [
		...adminProductsQueryKey,
		status === "ALL" ? "all" : status,
		organizationId ?? "all",
	] as const;
}

export function useAdminProducts(
	status: "PENDING" | "APPROVED" | "REJECTED" | "ALL" = "PENDING",
	organizationId?: string | null,
) {
	return useQuery({
		queryKey: adminProductsFilterQueryKey(status, organizationId),
		queryFn: () =>
			listProductsForAdmin(
				status === "ALL"
					? { organizationId: organizationId ?? undefined }
					: { status, organizationId: organizationId ?? undefined },
			),
		placeholderData: keepPreviousData,
	});
}

export function useAdminProductCounts(organizationId?: string | null) {
	return useQuery({
		queryKey: [
			...adminProductsQueryKey,
			"counts",
			organizationId ?? "all",
		] as const,
		queryFn: () => getAdminProductCounts(organizationId),
		placeholderData: keepPreviousData,
	});
}

export function adminProductQueryKey(productId: string | null) {
	return [...adminProductsQueryKey, "detail", productId] as const;
}

export function useAdminProduct(productId: string | null) {
	return useQuery({
		queryKey: adminProductQueryKey(productId),
		queryFn: () => getProductForAdmin(productId!),
		enabled: !!productId,
	});
}

export function useSetProductStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: SetProductStatusInput) => setProductStatus(input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
			queryClient.invalidateQueries({
				queryKey: adminProductQueryKey(variables.productId),
			});
		},
	});
}
