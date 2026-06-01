"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	addProductImage,
	clearMyHomepageHeroProduct,
	createProduct,
	getMyProduct,
	listMyCertifiedProducts,
	listMyProducts,
	removeProductImage,
	setMyHomepageHeroProduct,
	setProductImageVariant,
	updateProduct,
} from "~/app/api/products/actions";
import type {
	CreateProductInput,
	UpdateProductInput,
} from "~/app/api/products/schemas/products.schema";

export const producerProductsQueryKey = ["producer", "products"] as const;

export function producerProductQueryKey(id: string) {
	return [...producerProductsQueryKey, "detail", id] as const;
}

export function useProducts() {
	return useQuery({
		queryKey: producerProductsQueryKey,
		queryFn: listMyProducts,
		placeholderData: keepPreviousData,
	});
}

export const producerCertifiedProductsQueryKey = [
	"producer",
	"products",
	"certified",
] as const;

export function useCertifiedProducts() {
	return useQuery({
		queryKey: producerCertifiedProductsQueryKey,
		queryFn: listMyCertifiedProducts,
	});
}

export function useProduct(productId: string | null) {
	return useQuery({
		queryKey: producerProductQueryKey(productId ?? ""),
		queryFn: () => getMyProduct(productId!),
		enabled: !!productId,
	});
}

export function useCreateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProductInput) => createProduct(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			data,
		}: {
			productId: string;
			data: UpdateProductInput;
		}) => updateProduct(productId, data),
		onSuccess: (_, { productId }) => {
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
			queryClient.invalidateQueries({
				queryKey: producerProductQueryKey(productId),
			});
		},
	});
}

export function useSetHomepageHeroProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productId: string) => setMyHomepageHeroProduct(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
			queryClient.invalidateQueries({
				queryKey: [...producerProductsQueryKey, "detail"],
			});
		},
	});
}

export function useClearHomepageHeroProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => clearMyHomepageHeroProduct(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
			queryClient.invalidateQueries({
				queryKey: [...producerProductsQueryKey, "detail"],
			});
		},
	});
}

export function useAddProductImage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			url,
			variantId,
		}: {
			productId: string;
			url: string;
			variantId?: string | null;
		}) => addProductImage(productId, url, variantId),
		onSuccess: (_, { productId }) => {
			queryClient.invalidateQueries({
				queryKey: producerProductQueryKey(productId),
			});
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
		},
	});
}

export function useSetProductImageVariant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: {
			productId: string;
			imageId: string;
			variantId: string | null;
		}) => setProductImageVariant(input),
		onSuccess: (_, { productId }) => {
			queryClient.invalidateQueries({
				queryKey: producerProductQueryKey(productId),
			});
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
		},
	});
}

export function useRemoveProductImage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			imageId,
		}: {
			productId: string;
			imageId: string;
		}) => removeProductImage(productId, imageId),
		onSuccess: (_, { productId }) => {
			queryClient.invalidateQueries({
				queryKey: producerProductQueryKey(productId),
			});
			queryClient.invalidateQueries({ queryKey: producerProductsQueryKey });
		},
	});
}
