"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	addCertification,
	listMyCertifications,
	removeCertification,
} from "~/app/api/certifications/actions";
import type { AddCertificationInput } from "~/app/api/certifications/schemas/certifications.schema";
import {
	producerProductQueryKey,
	producerProductsQueryKey,
} from "./use-products";

export const producerCertificationsQueryKey = [
	"artisan",
	"certifications",
] as const;

export function producerCertificationsFilterKey(productId: string | null) {
	return [...producerCertificationsQueryKey, productId ?? "all"] as const;
}

/** List certifications. productId: null = global only, string = for that product, undefined = all. */
export function useCertifications(options: { productId?: string | null } = {}) {
	return useQuery({
		queryKey: producerCertificationsFilterKey(options.productId ?? null),
		queryFn: () => listMyCertifications(options),
		placeholderData: keepPreviousData,
	});
}

export function useAddCertification() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: AddCertificationInput) => addCertification(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: producerCertificationsQueryKey,
			});
			if (variables.productId) {
				queryClient.invalidateQueries({
					queryKey: producerProductQueryKey(variables.productId),
				});
				queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
			}
		},
	});
}

export function useRemoveCertification() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (certificationId: string) =>
			removeCertification(certificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: producerCertificationsQueryKey,
			});
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
		},
	});
}
