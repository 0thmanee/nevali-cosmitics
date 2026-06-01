import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import {
	getAdminProductCounts,
	listProductsForAdmin,
} from "~/app/api/products/actions";
import { ProductsList } from "~/features/admin/components/products";

export default async function AdminProductsPage() {
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["admin", "products", "all", "all"],
			queryFn: () => listProductsForAdmin({}),
		}),
		queryClient.prefetchQuery({
			queryKey: ["admin", "products", "counts", "all"],
			queryFn: () => getAdminProductCounts(undefined),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductsList />
		</HydrationBoundary>
	);
}
