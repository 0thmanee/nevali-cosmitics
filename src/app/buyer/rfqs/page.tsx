import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { listMyBuyerRfqs } from "~/app/api/contracts";
import {
	BuyerRfqsView,
	buyerRfqsQueryKey,
} from "~/features/buyer/components/buyer-rfqs-view";

export default async function BuyerRfqsPage() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: buyerRfqsQueryKey,
		queryFn: listMyBuyerRfqs,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense
				fallback={
					<p className="font-sans text-sm text-text-muted">Loading inquiries…</p>
				}
			>
				<BuyerRfqsView />
			</Suspense>
		</HydrationBoundary>
	);
}
