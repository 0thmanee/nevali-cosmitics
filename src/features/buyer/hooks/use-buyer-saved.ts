"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addProductToBuyerSavedList,
	createBuyerSavedList,
	deleteBuyerSavedList,
	listMySavedListsForPicker,
	listMySavedListsWithItems,
	removeProductFromBuyerSavedList,
	renameBuyerSavedList,
} from "~/app/api/buyer-saved/actions";

export const buyerSavedListsQueryKey = ["buyer", "saved-lists"] as const;
export const buyerSavedListsPickerQueryKey = [
	"buyer",
	"saved-lists",
	"picker",
] as const;

export function useBuyerSavedLists() {
	return useQuery({
		queryKey: buyerSavedListsQueryKey,
		queryFn: listMySavedListsWithItems,
	});
}

export function useBuyerSavedListsPicker(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: buyerSavedListsPickerQueryKey,
		queryFn: listMySavedListsForPicker,
		/** When false, skips the server action (which redirects guests to login). */
		enabled: options?.enabled ?? true,
	});
}

function invalidateSaved(qc: ReturnType<typeof useQueryClient>) {
	void qc.invalidateQueries({ queryKey: buyerSavedListsQueryKey });
	void qc.invalidateQueries({ queryKey: buyerSavedListsPickerQueryKey });
}

export function useCreateBuyerSavedList() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (name: string) => createBuyerSavedList(name),
		onSettled: () => invalidateSaved(qc),
	});
}

export function useRenameBuyerSavedList() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ listId, name }: { listId: string; name: string }) =>
			renameBuyerSavedList(listId, name),
		onSettled: () => invalidateSaved(qc),
	});
}

export function useDeleteBuyerSavedList() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (listId: string) => deleteBuyerSavedList(listId),
		onSettled: () => invalidateSaved(qc),
	});
}

export function useAddProductToSavedList() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			listId,
			productId,
		}: {
			listId: string;
			productId: string;
		}) => addProductToBuyerSavedList(listId, productId),
		onSettled: () => invalidateSaved(qc),
	});
}

export function useRemoveProductFromSavedList() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			listId,
			productId,
		}: {
			listId: string;
			productId: string;
		}) => removeProductFromBuyerSavedList(listId, productId),
		onSettled: () => invalidateSaved(qc),
	});
}
