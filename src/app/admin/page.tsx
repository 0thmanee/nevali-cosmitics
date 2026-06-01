import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { getAdminDashboardData } from "~/app/api/admin/actions";
import { AdminDashboardOverview } from "~/features/admin/components/admin-dashboard-overview";

export default async function AdminDashboardPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["admin", "dashboard", "all"],
		queryFn: () => getAdminDashboardData(undefined),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminDashboardOverview />
		</HydrationBoundary>
	);
}
