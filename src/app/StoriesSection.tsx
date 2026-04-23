import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { listPublishedArticlesForHome } from "~/app/api/articles/actions";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

function formatStoryDate(d: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(d));
}

export default async function StoriesSection() {
	const articles = await listPublishedArticlesForHome(6);

	return (
		<section
			className="w-full py-28"
			style={{ background: "var(--color-paper)" }}
		>
			<AnimateOnScroll className="mx-auto max-w-7xl px-6" direction="up" scale>
				<div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
					<div>
						<p className="mb-2 font-sans text-forest-light text-xs uppercase tracking-[0.2em]">
							Journal
						</p>
						<h2
							className="font-bold font-display text-text-dark uppercase"
							style={{
								fontSize: "clamp(26px, 2.8vw, 36px)",
								letterSpacing: "0.06em",
							}}
						>
							Stories &amp; formulation
						</h2>
						<p className="mt-2 max-w-md font-sans text-base text-text-muted leading-relaxed">
							{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
								<>
									Notes from verified producers on nevali—ingredient spotlights, founder journeys, and how we keep
									the marketplace bio-minded.
								</>
							) : (
								<>
									Notes from our studio on nevali—ingredient spotlights, formulation diaries, and how we keep every
									batch bio-minded.
								</>
							)}
						</p>
					</div>
					<Link
						className="inline-flex shrink-0 items-center gap-2 border border-text-dark px-5 py-2.5 font-sans font-semibold text-sm text-text-dark uppercase tracking-widest transition-colors duration-200 hover:bg-text-dark hover:text-cream"
						href="/journal"
					>
						View all stories
						<span>→</span>
					</Link>
				</div>

				{articles.length === 0 ? (
					<div className="rounded-sm border border-cream-dark bg-white px-6 py-14 text-center">
						<p className="mx-auto max-w-lg font-sans text-sm text-text-muted leading-relaxed">
							{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
								<>
									Journal posts from our producers will appear here once published. Browse the catalog meanwhile, or
									open the full journal when stories go live.
								</>
							) : (
								<>
									Journal posts from {NEVALI_HOUSE_BRAND.legalName} will appear here once published. Browse the catalog
									meanwhile, or open the full journal when stories go live.
								</>
							)}
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<Link
								className="inline-flex items-center gap-2 border-forest-light border-b pb-0.5 font-sans font-semibold text-forest-light text-sm uppercase tracking-widest"
								href="/journal"
							>
								Journal
								<span>→</span>
							</Link>
							<Link
								className="inline-flex items-center gap-2 border-text-dark border-b pb-0.5 font-sans font-semibold text-sm text-text-dark uppercase tracking-widest"
								href="/products"
							>
								Shop
								<span>→</span>
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
						{articles.map((s) => (
							<Link
								className="group flex flex-col gap-4"
								href={`/journal/${s.id}`}
								key={s.id}
							>
								<div
									className="relative w-full overflow-hidden rounded-sm bg-cream-dark"
									style={{ height: "280px" }}
								>
									{s.coverImageUrl ? (
										<Image
											alt={s.title}
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											fill
											sizes="(max-width: 640px) 100vw, 33vw"
											src={s.coverImageUrl}
										/>
									) : (
										<div
											className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
											style={{ background: s.coverGradient }}
										/>
									)}
									<div
										className="pointer-events-none absolute inset-0 transition-opacity duration-300"
										style={{
											background:
												"linear-gradient(to top, color-mix(in srgb, var(--color-ink) 55%, transparent) 0%, transparent 55%)",
										}}
									/>
									<div className="absolute bottom-0 left-0 z-10 flex flex-wrap items-center gap-2 p-4">
										<span
											className="px-2 py-1 font-bold font-sans text-white text-xs uppercase tracking-widest"
											style={{ background: "var(--color-text-muted)" }}
										>
											{formatStoryDate(s.publishedAt)}
										</span>
										{s.tag && (
											<span
												className="px-2 py-1 font-bold font-sans text-white text-xs uppercase tracking-widest"
												style={{
													background:
														"color-mix(in srgb, var(--color-paper) 15%, transparent)",
													border:
														"1px solid color-mix(in srgb, var(--color-paper) 30%, transparent)",
												}}
											>
												{s.tag}
											</span>
										)}
									</div>
								</div>

								<p
									className="font-bold font-display text-base text-text-dark uppercase leading-snug transition-colors duration-200 group-hover:text-forest-light"
									style={{ letterSpacing: "0.03em" }}
								>
									{s.title}
								</p>

								<p className="font-sans text-text-muted text-xs uppercase tracking-wide">
									{s.organizationName}
								</p>

								<span className="inline-flex w-fit items-center gap-1.5 border-forest-light border-b pb-0.5 font-sans font-semibold text-forest-light text-sm uppercase tracking-widest transition-all duration-200 group-hover:gap-2.5">
									Read article <span>→</span>
								</span>
							</Link>
						))}
					</div>
				)}
			</AnimateOnScroll>
		</section>
	);
}
