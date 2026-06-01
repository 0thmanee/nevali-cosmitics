import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listMySupportTickets } from "~/app/api/support";
import { SupportView } from "~/features/artisan/components/support";

export default async function SupportPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "support", "tickets"],
		queryFn: listMySupportTickets,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SupportView />
		</HydrationBoundary>
	);
}
