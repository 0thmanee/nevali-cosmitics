import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listShopOrdersForAdmin } from "~/app/api/shop-orders/admin-actions";
import { ShopOrdersList } from "~/features/admin/components/shop-orders";

export default async function AdminOrdersPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["admin", "shop-orders", "all"] as const,
		queryFn: () => listShopOrdersForAdmin(undefined),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ShopOrdersList />
		</HydrationBoundary>
	);
}
