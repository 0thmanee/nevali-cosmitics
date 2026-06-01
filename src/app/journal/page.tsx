import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listPublishedArticlesForHome } from "~/app/api/articles/actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";

export const metadata: Metadata = {
	title: "Journal — nevali",
	description:
		"Stories and formulation notes from Nevali — Moroccan beauty, our studio.",
};

function formatStoryDate(d: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(d));
}

export default async function JournalIndexPage() {
	const articles = await listPublishedArticlesForHome(48);
	const [featured, ...rest] = articles;
	const latest = rest.slice(0, 6);

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<Navbar />
			<AnimateOnScroll
				className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6"
				direction="up"
				scale
			>
				<p className="mb-2 font-sans text-forest-light text-xs uppercase tracking-[0.2em]">
					Journal
				</p>
				<h1 className="font-bold font-display text-3xl text-text-dark uppercase tracking-wide sm:text-4xl">
					Stories &amp; formulation
				</h1>
				<p className="mt-3 max-w-2xl font-sans text-base text-text-muted leading-relaxed">
					Longer reads from Nevali—compliance notes, ingredient spotlights, and
					how our products are made.
				</p>

				{articles.length === 0 ? (
					<p className="mt-12 font-sans text-sm text-text-muted">
						No published articles yet. Check back soon.
					</p>
				) : (
					<div className="mt-12 flex flex-col gap-12">
						{featured ? (
							<Link
								className="group grid gap-0 overflow-hidden rounded-sm border border-cream-dark bg-white shadow-sm lg:grid-cols-2"
								href={`/journal/${featured.id}`}
							>
								<div className="relative min-h-[260px] bg-cream-dark">
									{featured.coverImageUrl ? (
										<Image
											alt={featured.title}
											className="object-cover transition-transform duration-700 group-hover:scale-105"
											fill
											priority
											sizes="(max-width: 1024px) 100vw, 50vw"
											src={featured.coverImageUrl}
										/>
									) : (
										<div
											className="absolute inset-0"
											style={{ background: featured.coverGradient }}
										/>
									)}
								</div>
								<div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
									<p className="font-bold font-sans text-[11px] text-forest-dark uppercase tracking-[0.16em]">
										Featured story
									</p>
									<h2 className="font-bold font-serif text-3xl text-text-dark leading-tight">
										{featured.title}
									</h2>
									<p className="font-sans text-sm text-text-muted leading-relaxed">
										Open the full story for ingredient notes, producer insights,
										and practical formulation context.
									</p>
									<div className="flex flex-wrap items-center gap-3 font-sans text-text-muted text-xs uppercase tracking-wide">
										<span>{formatStoryDate(featured.publishedAt)}</span>
										{featured.tag ? (
											<span className="text-forest-dark">{featured.tag}</span>
										) : null}
										<span>{featured.organizationName}</span>
									</div>
								</div>
							</Link>
						) : null}

						<section className="space-y-4">
							<div className="flex items-end justify-between gap-4">
								<div>
									<p className="font-bold font-sans text-[11px] text-text-muted uppercase tracking-[0.16em]">
										Latest
									</p>
									<h3 className="mt-1 font-bold font-serif text-2xl text-text-dark">
										Recent journal entries
									</h3>
								</div>
							</div>
							<ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
								{latest.map((a) => (
									<li key={a.id}>
										<Link
											className="group flex flex-col gap-3"
											href={`/journal/${a.id}`}
										>
											<div className="relative aspect-4/3 w-full overflow-hidden rounded-sm border border-cream-dark bg-cream-dark">
												{a.coverImageUrl ? (
													<Image
														alt={a.title}
														className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
														fill
														sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
														src={a.coverImageUrl}
													/>
												) : (
													<div
														className="absolute inset-0"
														style={{ background: a.coverGradient }}
													/>
												)}
											</div>
											<div className="flex flex-wrap gap-2 font-bold text-[11px] text-text-muted uppercase tracking-wide">
												<span>{formatStoryDate(a.publishedAt)}</span>
												{a.tag && (
													<span className="text-forest-dark">{a.tag}</span>
												)}
											</div>
											<h4 className="font-bold font-serif text-lg text-text-dark group-hover:text-forest-light">
												{a.title}
											</h4>
											<p className="line-clamp-2 font-sans text-sm text-text-muted">
												Read the full article for the complete story.
											</p>
											<p className="font-sans text-text-muted text-xs">
												{a.organizationName}
											</p>
										</Link>
									</li>
								))}
							</ul>
						</section>

						{rest.length > latest.length ? (
							<section className="space-y-4 border-cream-dark border-t pt-10">
								<h3 className="font-bold font-serif text-text-dark text-xl">
									More from the journal
								</h3>
								<ul className="grid gap-4 sm:grid-cols-2">
									{rest.slice(latest.length).map((a) => (
										<li key={a.id}>
											<Link
												className="group flex items-start justify-between gap-4 rounded-sm border border-cream-dark bg-white px-4 py-4 transition-colors hover:bg-paper"
												href={`/journal/${a.id}`}
											>
												<div className="min-w-0">
													<p className="font-sans text-[11px] text-text-muted uppercase tracking-wide">
														{formatStoryDate(a.publishedAt)}
													</p>
													<p className="mt-1 font-bold font-serif text-lg text-text-dark group-hover:text-forest-light">
														{a.title}
													</p>
													<p className="mt-1 font-sans text-text-muted text-xs">
														{a.organizationName}
													</p>
												</div>
												<span className="font-sans font-semibold text-forest-dark text-xs uppercase tracking-wide">
													Read
												</span>
											</Link>
										</li>
									))}
								</ul>
							</section>
						) : null}
					</div>
				)}
			</AnimateOnScroll>
			<Footer />
		</main>
	);
}
