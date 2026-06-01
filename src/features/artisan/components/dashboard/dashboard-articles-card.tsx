"use client";

import Link from "next/link";
import React from "react";
import { useArticles } from "../../hooks/use-articles";

function formatUpdated(d: Date): string {
	const date = new Date(d);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (days === 0) return "Updated today";
	if (days === 1) return "Updated yesterday";
	if (days < 7) return `Updated ${days} days ago`;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(date);
}

export function DashboardArticlesCard() {
	const { data: articles = [], isLoading, isError } = useArticles();
	const published = articles.filter((a) => a.status === "PUBLISHED").length;
	const recent = [...articles]
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		)
		.slice(0, 4);

	return (
		<div className="flex flex-col gap-0">
			<div
				className="flex items-center justify-between rounded-t-xl border-cream-dark border-b px-5 py-4"
				style={{ background: "white" }}
			>
				<div>
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Journal
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{articles.length} article{articles.length === 1 ? "" : "s"} ·{" "}
						{published} live on the site
					</p>
				</div>
				<div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center">
					<Link
						className="rounded-sm bg-forest-dark px-3 py-1.5 font-sans font-semibold text-white text-xs transition-colors"
						href="/artisan/articles/new"
					>
						New
					</Link>
					<Link
						className="rounded-sm px-4 py-2 font-medium font-sans text-sm transition-colors"
						href="/artisan/articles"
						style={{
							background: "var(--color-paper)",
							color: "var(--color-ink)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						View all
					</Link>
				</div>
			</div>
			<div
				className="overflow-hidden rounded-b-xl"
				style={{ background: "white" }}
			>
				{isLoading ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						Loading articles…
					</div>
				) : isError ? (
					<div className="px-5 py-8 font-sans text-[var(--color-danger)] text-sm">
						Failed to load articles.
					</div>
				) : recent.length === 0 ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						Share short stories and formulation notes — they appear in the
						public Journal when published.
					</div>
				) : (
					recent.map((a) => (
						<Link
							className="flex items-center gap-3 border-cream-dark border-t px-5 py-3 transition-colors first:border-t-0 hover:bg-cream/30"
							href={`/artisan/articles/${a.id}/edit`}
							key={a.id}
						>
							<div
								aria-hidden
								className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-cream-dark bg-cream-dark"
							>
								{a.coverImageUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										alt=""
										className="h-full w-full object-cover"
										src={a.coverImageUrl}
									/>
								) : (
									<div
										className="h-full w-full"
										style={{ background: a.coverGradient }}
									/>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-sans font-semibold text-sm text-text-dark leading-tight">
									{a.title}
								</p>
								<p className="mt-0.5 font-sans text-[12px] text-text-muted">
									{a.status === "PUBLISHED" ? "Live" : "Draft"} ·{" "}
									{formatUpdated(a.updatedAt)}
								</p>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
