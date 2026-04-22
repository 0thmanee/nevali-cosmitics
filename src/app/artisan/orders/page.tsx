import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listMyProductOrderStats } from "~/app/api/shop-orders/producer-actions";
import { CatalogOrdersView } from "~/features/artisan/components/catalog-orders";
import { producerProductOrderStatsQueryKey } from "~/features/artisan/hooks/use-producer-product-order-stats";

export default async function ArtisanCatalogOrdersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: producerProductOrderStatsQueryKey,
    queryFn: listMyProductOrderStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogOrdersView />
    </HydrationBoundary>
  );
}
