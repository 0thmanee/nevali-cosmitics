"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createContractFromRfqBuyer,
	listMyBuyerRfqs,
} from "~/app/api/contracts";

export const buyerRfqsQueryKey = ["buyer", "rfqs"] as const;

export function useBuyerRfqs() {
	return useQuery({
		queryKey: buyerRfqsQueryKey,
		queryFn: listMyBuyerRfqs,
		placeholderData: keepPreviousData,
	});
}

export function useCreateContractFromRfqBuyer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createContractFromRfqBuyer,
		onSettled: () => {
			void qc.invalidateQueries({ queryKey: buyerRfqsQueryKey });
		},
	});
}
