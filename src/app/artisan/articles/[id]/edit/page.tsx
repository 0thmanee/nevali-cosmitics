import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getMyArticle } from "~/app/api/articles/actions";
import { ArticleForm } from "~/features/artisan/components/articles";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
	const { id } = await params;
	const queryClient = new QueryClient();

	const article = await getMyArticle(id);
	if (!article) notFound();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "articles", "detail", id],
		queryFn: () => getMyArticle(id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ArticleForm article={article} mode="edit" />
		</HydrationBoundary>
	);
}
