import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { getAdminSalesAnalytics } from "~/app/api/admin/actions";
import { AdminAnalyticsView } from "~/features/admin/components/admin-analytics-view";

export default async function AdminAnalyticsPage() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["admin", "analytics", "sales", "all"],
		queryFn: () => getAdminSalesAnalytics(undefined),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminAnalyticsView />
		</HydrationBoundary>
	);
}
