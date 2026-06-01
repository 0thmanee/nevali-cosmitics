import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticle } from "~/app/api/articles/actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { JournalArticleView } from "~/components/journal/journal-article-view";
import { absoluteUrl } from "~/lib/site-url";

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
		alternates: { canonical: `/journal/${id}` },
		openGraph: {
			title: article.title,
			description: desc,
			type: "article",
			url: `/journal/${id}`,
			publishedTime: article.publishedAt.toISOString(),
			images: article.coverImageUrl
				? [{ url: article.coverImageUrl }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: desc,
			images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
		},
	};
}

export default async function JournalArticlePage({ params }: Props) {
	const { id } = await params;
	const article = await getPublishedArticle(id);
	if (!article) notFound();

	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		datePublished: article.publishedAt.toISOString(),
		image: article.coverImageUrl ? [article.coverImageUrl] : undefined,
		author: { "@type": "Organization", name: article.organization.name },
		publisher: { "@type": "Organization", name: "nevali" },
		mainEntityOfPage: absoluteUrl(`/journal/${id}`),
	};

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
				type="application/ld+json"
			/>
			<Navbar />
			<AnimateOnScroll direction="up" scale>
				<JournalArticleView article={article} />
			</AnimateOnScroll>
			<Footer />
		</main>
	);
}
