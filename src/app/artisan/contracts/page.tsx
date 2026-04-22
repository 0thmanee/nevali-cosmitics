import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { listMyRfqs, listMyActiveContracts, listMyCompletedContracts } from "~/app/api/contracts";
import { ContractsView } from "~/features/artisan/components/contracts";

export default async function ContractsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["producer", "rfqs"],
      queryFn: listMyRfqs,
    }),
    queryClient.prefetchQuery({
      queryKey: ["producer", "contracts", "active"],
      queryFn: listMyActiveContracts,
    }),
    queryClient.prefetchQuery({
      queryKey: ["producer", "contracts", "completed"],
      queryFn: listMyCompletedContracts,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <p className="font-sans text-sm text-text-muted">Loading contracts…</p>
        }
      >
        <ContractsView />
      </Suspense>
    </HydrationBoundary>
  );
}
