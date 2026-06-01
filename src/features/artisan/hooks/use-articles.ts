"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createArticle,
	deleteArticle,
	getMyArticle,
	listMyArticles,
	updateArticle,
} from "~/app/api/articles/actions";
import type {
	CreateProducerArticleInput,
	UpdateProducerArticleInput,
} from "~/app/api/articles/schemas/article.schema";

export const producerArticlesQueryKey = ["producer", "articles"] as const;

export function producerArticleQueryKey(id: string) {
	return [...producerArticlesQueryKey, "detail", id] as const;
}

export function useArticles() {
	return useQuery({
		queryKey: producerArticlesQueryKey,
		queryFn: listMyArticles,
		placeholderData: keepPreviousData,
	});
}

export function useArticle(articleId: string | null) {
	return useQuery({
		queryKey: producerArticleQueryKey(articleId ?? ""),
		queryFn: () => getMyArticle(articleId!),
		enabled: !!articleId,
	});
}

export function useCreateArticle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProducerArticleInput) => createArticle(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: producerArticlesQueryKey });
		},
	});
}

export function useUpdateArticle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateProducerArticleInput) => updateArticle(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: producerArticlesQueryKey });
			queryClient.invalidateQueries({
				queryKey: producerArticleQueryKey(variables.id),
			});
		},
	});
}

export function useDeleteArticle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteArticle(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: producerArticlesQueryKey });
		},
	});
}
