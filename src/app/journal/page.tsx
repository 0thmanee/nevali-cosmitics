import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { listPublishedArticlesForHome } from "~/app/api/articles/actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";

export const metadata: Metadata = {
	title: "Journal — nevali",
	description:
		"Stories and formulation notes from Moroccan beauty producers on nevali.",
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

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<Navbar />
			<AnimateOnScroll className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6" direction="up" scale>
				<p className="mb-2 font-sans text-forest-light text-xs uppercase tracking-[0.2em]">
					Journal
				</p>
				<h1 className="font-bold font-display text-3xl text-text-dark uppercase tracking-wide sm:text-4xl">
					Stories &amp; formulation
				</h1>
				<p className="mt-3 max-w-2xl font-sans text-base text-text-muted leading-relaxed">
					Longer reads from verified producers—compliance notes, ingredient
					spotlights, and how products are made.
				</p>

				{articles.length === 0 ? (
					<p className="mt-12 font-sans text-sm text-text-muted">
						No published articles yet. Check back soon.
					</p>
				) : (
					<ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{articles.map((a) => (
							<li key={a.id}>
								<Link
									className="group flex flex-col gap-3"
									href={`/journal/${a.id}`}
								>
									<div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-cream-dark bg-cream-dark transition-transform duration-500 group-hover:scale-[1.02]">
										{a.coverImageUrl ? (
											<Image
												alt={a.title}
												className="object-cover"
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
										{a.tag && <span className="text-forest-dark">{a.tag}</span>}
									</div>
									<h2 className="font-bold font-serif text-lg text-text-dark group-hover:text-forest-light">
										{a.title}
									</h2>
									<p className="font-sans text-text-muted text-xs">
										{a.organizationName}
									</p>
								</Link>
							</li>
						))}
					</ul>
				)}
			</AnimateOnScroll>
			<Footer />
		</main>
	);
}
