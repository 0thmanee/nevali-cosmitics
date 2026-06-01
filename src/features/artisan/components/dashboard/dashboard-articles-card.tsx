"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import type { Translator } from "~/lib/i18n/create-translator";
import { useArticles } from "../../hooks/use-articles";

function formatUpdated(t: Translator, d: Date): string {
	const date = new Date(d);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (days === 0) return t("producerDashboard.updatedToday");
	if (days === 1) return t("producerDashboard.updatedYesterday");
	if (days < 7) return t("producerDashboard.updatedDaysAgo", { days });
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(date);
}

export function DashboardArticlesCard() {
	const { t } = useI18n();
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
						{t("producerDashboard.journal")}
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{t("producerDashboard.articlesSummary", {
							count: articles.length,
							published,
						})}
					</p>
				</div>
				<div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center">
					<Link
						className="rounded-sm bg-forest-dark px-3 py-1.5 font-sans font-semibold text-white text-xs transition-colors"
						href="/artisan/articles/new"
					>
						{t("producerDashboard.new")}
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
						{t("producerDashboard.viewAll")}
					</Link>
				</div>
			</div>
			<div
				className="overflow-hidden rounded-b-xl"
				style={{ background: "white" }}
			>
				{isLoading ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						{t("producerDashboard.loadingArticles")}
					</div>
				) : isError ? (
					<div className="px-5 py-8 font-sans text-[var(--color-danger)] text-sm">
						{t("producerDashboard.failedArticles")}
					</div>
				) : recent.length === 0 ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						{t("producerDashboard.noArticles")}
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
									{a.status === "PUBLISHED"
										? t("producerDashboard.live")
										: t("producerDashboard.draft")}{" "}
									· {formatUpdated(t, a.updatedAt)}
								</p>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
