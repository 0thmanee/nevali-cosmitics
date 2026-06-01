import Image from "next/image";
import Link from "next/link";
import type { ProducerArticlePublicView } from "~/app/api/articles/articles.types";
import { ArticleMarkdown } from "~/components/article-markdown";
import { getTranslator } from "~/lib/i18n/server";

function formatStoryDate(d: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(d));
}

type Props = { article: ProducerArticlePublicView };

export async function JournalArticleView({ article }: Props) {
	const t = await getTranslator();
	const heroHeightClass = "min-h-[38vh] max-h-[560px] h-[min(48vh,560px)]";

	return (
		<article className="w-full">
			<div className="border-cream-dark border-b bg-paper">
				<div className="mx-auto max-w-4xl px-4 py-5 sm:px-8">
					<nav
						aria-label={t("journalArticle.breadcrumbAria")}
						className="font-sans text-[11px] text-text-muted uppercase tracking-[0.12em]"
					>
						<Link
							className="transition-colors hover:text-text-dark"
							href="/journal"
						>
							{t("journal.title")}
						</Link>
						<span className="mx-2 text-cream-dark">/</span>
						<Link
							className="transition-colors hover:text-text-dark"
							href={`/artisans/${article.organization.slug}`}
						>
							{article.organization.name}
						</Link>
						<span className="mx-2 text-cream-dark">/</span>
						<span className="text-text-dark">{article.title}</span>
					</nav>
				</div>
			</div>

			<header className={`relative w-full overflow-hidden ${heroHeightClass}`}>
				{article.coverImageUrl ? (
					<Image
						alt={article.title}
						className="object-cover"
						fill
						priority
						sizes="100vw"
						src={article.coverImageUrl}
					/>
				) : (
					<div
						aria-hidden
						className="absolute inset-0"
						style={{ background: article.coverGradient }}
					/>
				)}
				<div
					aria-hidden
					className="absolute inset-0 bg-linear-to-t from-black/82 via-black/35 to-transparent"
				/>
				<div className="absolute inset-0 flex flex-col justify-end">
					<div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-10 sm:px-8 sm:pb-14">
						<div className="flex flex-wrap items-center gap-2 font-bold text-[11px] text-white/90 uppercase tracking-[0.14em]">
							<time dateTime={article.publishedAt.toISOString()}>
								{formatStoryDate(article.publishedAt)}
							</time>
							{article.tag && (
								<>
									<span className="text-white/40">·</span>
									<span className="rounded-sm border border-white/25 bg-white/10 px-2 py-0.5 text-white">
										{article.tag}
									</span>
								</>
							)}
						</div>
						<h1 className="mt-4 max-w-4xl font-bold font-display text-3xl text-white uppercase leading-[1.12] tracking-[0.04em] sm:text-4xl md:text-[2.65rem]">
							{article.title}
						</h1>
						<p className="mt-3 font-sans text-sm text-white/85">
							{t("journalArticle.by")}{" "}
							<Link
								className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
								href={`/artisans/${article.organization.slug}`}
							>
								{article.organization.name}
							</Link>
						</p>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
				<div className="grid gap-10 lg:grid-cols-12">
					<div className="lg:col-span-8">
						{article.excerpt && (
							<p className="font-serif text-text-muted text-xl leading-relaxed sm:text-[1.35rem]">
								{article.excerpt}
							</p>
						)}
						<div
							className={`rounded-sm border border-cream-dark bg-white p-5 shadow-sm sm:p-7 ${article.excerpt ? "mt-8" : ""}`}
						>
							<ArticleMarkdown markdown={article.body} />
						</div>

						<footer className="mt-10 border-cream-dark border-t pt-8">
							<p className="font-sans text-sm text-text-muted">
								{t("journalArticle.writtenBy")}{" "}
								<Link
									className="font-semibold text-forest-dark underline-offset-2 hover:underline"
									href={`/artisans/${article.organization.slug}`}
								>
									{article.organization.name}
								</Link>
								{t("journalArticle.exploreMorePrefix")}{" "}
								<Link
									className="font-semibold text-forest-dark underline-offset-2 hover:underline"
									href="/journal"
								>
									{t("journalArticle.nevaliJournal")}
								</Link>
								{t("journalArticle.exploreMoreSuffix")}
							</p>
						</footer>
					</div>

					<aside className="space-y-4 lg:col-span-4 lg:pl-4">
						<div className="rounded-sm border border-cream-dark bg-white p-5 shadow-sm">
							<p className="font-sans text-[11px] text-text-muted uppercase tracking-[0.14em]">
								Article details
							</p>
							<dl className="mt-4 space-y-3 font-sans text-sm">
								<div>
									<dt className="font-bold text-[10px] text-text-muted uppercase tracking-wide">
										Published
									</dt>
									<dd className="mt-1 text-text-dark">
										{formatStoryDate(article.publishedAt)}
									</dd>
								</div>
								{article.tag ? (
									<div>
										<dt className="font-bold text-[10px] text-text-muted uppercase tracking-wide">
											Topic
										</dt>
										<dd className="mt-1">
											<span className="rounded-sm border border-cream-dark bg-paper px-2 py-1 font-semibold text-forest-dark text-xs">
												{article.tag}
											</span>
										</dd>
									</div>
								) : null}
								<div>
									<dt className="font-bold text-[10px] text-text-muted uppercase tracking-wide">
										By producer
									</dt>
									<dd className="mt-1 text-text-dark">
										{article.organization.name}
									</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-sm border border-cream-dark bg-paper p-5">
							<p className="font-bold font-serif text-lg text-text-dark">
								Explore more stories
							</p>
							<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
								Find more practical reads on ingredients, compliance, and
								producer know-how in the journal.
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								<Link
									className="rounded-sm bg-ink px-4 py-2 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
									href="/journal"
								>
									Back to Journal
								</Link>
								<Link
									className="rounded-sm border border-cream-dark bg-white px-4 py-2 font-sans font-semibold text-sm text-text-dark transition-colors hover:bg-cream"
									href={`/artisans/${article.organization.slug}`}
								>
									View Producer
								</Link>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</article>
	);
}
