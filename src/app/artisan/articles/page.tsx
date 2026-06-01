import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listMyArticles } from "~/app/api/articles/actions";
import { ArticlesPageClient } from "~/features/artisan/components/articles";

export default async function ProducerArticlesPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "articles"],
		queryFn: listMyArticles,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ArticlesPageClient />
		</HydrationBoundary>
	);
}
