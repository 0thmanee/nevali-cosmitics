"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useArticles } from "../../hooks/use-articles";

function statusStyle(status: string): {
	bg: string;
	color: string;
	border: string;
} {
	if (status === "PUBLISHED") {
		return {
			bg: "color-mix(in srgb, var(--color-forest-dark) 10%, transparent)",
			color: "var(--color-forest-dark)",
			border: "color-mix(in srgb, var(--color-forest-dark) 25%, transparent)",
		};
	}
	return {
		bg: "var(--color-paper)",
		color: "var(--color-text-muted)",
		border: "var(--color-cream-dark)",
	};
}

function formatUpdated(d: Date): string {
	const date = new Date(d);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export function ArticlesPageClient() {
	const { t } = useI18n();
	const [search, setSearch] = useState("");
	const { data: articles = [], isLoading, isError } = useArticles();

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return articles;
		return articles.filter(
			(a) =>
				a.title.toLowerCase().includes(q) ||
				(a.tag?.toLowerCase().includes(q) ?? false) ||
				(a.excerpt?.toLowerCase().includes(q) ?? false),
		);
	}, [articles, search]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<input
					className="w-full rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm text-text-dark placeholder:text-text-muted sm:max-w-xs"
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t("producerArticlesUi.searchPlaceholder")}
					type="search"
					value={search}
				/>
				<Link
					className="shrink-0 rounded-sm bg-forest-dark px-4 py-2 text-center font-sans font-semibold text-sm text-white transition-colors"
					href="/artisan/articles/new"
				>
					{t("producerArticlesUi.newArticle")}
				</Link>
			</div>

			<div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
				{isLoading ? (
					<div className="px-5 py-12 text-center font-sans text-sm text-text-muted">
						{t("producerArticlesUi.loading")}
					</div>
				) : isError ? (
					<div className="px-5 py-12 text-center font-sans text-red-600 text-sm">
						{t("producerArticlesUi.loadError")}
					</div>
				) : filtered.length === 0 ? (
					<div className="px-5 py-12 text-center font-sans text-sm text-text-muted">
						{articles.length === 0
							? t("producerArticlesUi.emptyNoArticles")
							: t("producerArticlesUi.emptyNoMatch")}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[560px] font-sans text-sm">
							<thead>
								<tr className="border-cream-dark border-b bg-paper/80 text-left font-bold text-[11px] text-text-muted uppercase tracking-wide">
									<th
										aria-label={t("producerArticlesUi.colCover")}
										className="w-14 px-4 py-3"
									/>
									<th className="px-4 py-3">
										{t("producerArticlesUi.colTitle")}
									</th>
									<th className="w-[110px] px-4 py-3">
										{t("producerArticlesUi.colStatus")}
									</th>
									<th className="w-[120px] px-4 py-3">
										{t("producerArticlesUi.colUpdated")}
									</th>
									<th className="w-[100px] px-4 py-3 text-right">
										{t("producerArticlesUi.colActions")}
									</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((a) => {
									const st = statusStyle(a.status);
									return (
										<tr
											className="border-cream-dark border-b last:border-b-0 hover:bg-cream/40"
											key={a.id}
										>
											<td className="px-4 py-3 align-middle">
												<div
													aria-hidden
													className="h-9 w-12 overflow-hidden rounded-sm border border-cream-dark bg-cream-dark"
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
											</td>
											<td className="px-4 py-3">
												<p className="font-semibold text-text-dark leading-tight">
													{a.title}
												</p>
												{a.tag && (
													<p className="mt-0.5 text-[12px] text-text-muted">
														{a.tag}
													</p>
												)}
											</td>
											<td className="px-4 py-3">
												<span
													className="inline-block rounded-full border px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wide"
													style={{
														background: st.bg,
														color: st.color,
														borderColor: st.border,
													}}
												>
													{a.status === "PUBLISHED"
														? t("producerArticlesUi.statusLive")
														: t("producerArticlesUi.statusDraft")}
												</span>
											</td>
											<td className="px-4 py-3 text-[12px] text-text-muted">
												{formatUpdated(a.updatedAt)}
											</td>
											<td className="px-4 py-3 text-right">
												<Link
													className="font-medium text-primary-dark hover:underline"
													href={`/artisan/articles/${a.id}/edit`}
												>
													{t("producerArticlesUi.edit")}
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
