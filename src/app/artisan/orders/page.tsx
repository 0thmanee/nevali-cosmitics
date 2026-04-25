import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listMyProductOrderStats, listMyShopOrders } from "~/app/api/shop-orders/producer-actions";
import { CatalogOrdersView } from "~/features/artisan/components/catalog-orders";
import { producerProductOrderStatsQueryKey } from "~/features/artisan/hooks/use-producer-product-order-stats";
import { producerShopOrdersQueryKey } from "~/features/artisan/hooks/use-producer-shop-orders";

export default async function ArtisanCatalogOrdersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: producerProductOrderStatsQueryKey,
    queryFn: listMyProductOrderStats,
  });

  await queryClient.prefetchQuery({
    queryKey: producerShopOrdersQueryKey,
    queryFn: listMyShopOrders,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogOrdersView />
    </HydrationBoundary>
  );
}
