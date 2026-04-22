import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listSupportTicketsForAdmin, getAdminSupportTicketCounts } from "~/app/api/support";
import { SupportTicketsList } from "~/features/admin/components/support";

export default async function AdminSupportPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin", "support", "tickets", "all", "all"],
      queryFn: () => listSupportTicketsForAdmin({}),
    }),
    queryClient.prefetchQuery({
      queryKey: ["admin", "support", "tickets", "counts", "all"],
      queryFn: () => getAdminSupportTicketCounts(undefined),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SupportTicketsList />
    </HydrationBoundary>
  );
}
