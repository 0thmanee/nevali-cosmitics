import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listRfqsForAdmin, listContractsForAdmin } from "~/app/api/contracts";
import { AdminContractsList } from "~/features/admin/components/contracts";

export default async function AdminContractsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin", "rfqs", "all", "all"],
      queryFn: () => listRfqsForAdmin({}),
    }),
    queryClient.prefetchQuery({
      queryKey: ["admin", "contracts", "all", "all"],
      queryFn: () => listContractsForAdmin({}),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminContractsList />
    </HydrationBoundary>
  );
}
