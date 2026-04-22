import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getProducerDashboardStats } from "~/app/api/dashboard/actions";
import { listMyProducts } from "~/app/api/products/actions";
import {
  DashboardStats,
  DashboardProductList,
  TrainingProgressCard,
  RecentRFQsCard,
} from "~/features/artisan/components/dashboard";

export default async function ProducerDashboard() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["producer", "dashboard", "stats"],
      queryFn: getProducerDashboardStats,
    }),
    queryClient.prefetchQuery({
      queryKey: ["producer", "products"],
      queryFn: listMyProducts,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <DashboardStats />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <DashboardProductList />
          <div className="flex flex-col gap-4">
            <TrainingProgressCard />
            <RecentRFQsCard />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
