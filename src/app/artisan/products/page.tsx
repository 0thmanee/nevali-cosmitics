import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listMyProducts } from "~/app/api/products/actions";
import { ProductsPageClient } from "~/features/artisan/components/products/products-page-client";

export default async function ProductsPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "products"],
		queryFn: listMyProducts,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductsPageClient />
		</HydrationBoundary>
	);
}
