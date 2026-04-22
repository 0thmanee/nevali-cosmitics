import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listPartnersPaginated } from "~/app/api/partners/actions";
import { UsersList } from "~/features/admin/components/users";

export default async function AdminUsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin", "partners", "paginated", 1, 10, "all"],
    queryFn: () => listPartnersPaginated({ page: 1, pageSize: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList />
    </HydrationBoundary>
  );
}
