import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { getPublishedArticle } from "~/app/api/articles/actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { JournalArticleView } from "~/components/journal/journal-article-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const article = await getPublishedArticle(id);
	if (!article) return { title: "Journal — nevali" };
	const desc =
		article.excerpt?.trim().slice(0, 155) ||
		`${article.title} — ${article.organization.name} on nevali.`;
	return {
		title: `${article.title} — nevali`,
		description: desc,
		openGraph: {
			title: article.title,
			description: desc,
			type: "article",
			publishedTime: article.publishedAt.toISOString(),
			images: article.coverImageUrl
				? [{ url: article.coverImageUrl }]
				: undefined,
		},
	};
}

export default async function JournalArticlePage({ params }: Props) {
	const { id } = await params;
	const article = await getPublishedArticle(id);
	if (!article) notFound();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<Navbar />
			<AnimateOnScroll direction="up" scale>
				<JournalArticleView article={article} />
			</AnimateOnScroll>
			<Footer />
		</main>
	);
}
