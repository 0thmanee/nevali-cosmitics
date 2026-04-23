"use client";

import React from "react";
import Link from "next/link";
import { useArticles } from "../../hooks/use-articles";

function formatUpdated(d: Date): string {
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function DashboardArticlesCard() {
  const { data: articles = [], isLoading, isError } = useArticles();
  const published = articles.filter((a) => a.status === "PUBLISHED").length;
  const recent = [...articles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);

  return (
    <div className="flex flex-col gap-0">
      <div
        className="rounded-t-xl px-5 py-4 flex items-center justify-between border-b border-cream-dark"
        style={{ background: "white" }}
      >
        <div>
          <h2 className="font-serif font-bold text-[15px] text-text-dark">Journal</h2>
          <p className="font-sans text-[12px] text-text-muted mt-0.5">
            {articles.length} article{articles.length === 1 ? "" : "s"} · {published} live on the site
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center">
          <Link
            href="/artisan/articles/new"
            className="font-sans text-xs font-semibold rounded-sm px-3 py-1.5 transition-colors bg-forest-dark text-white"
          >
            New
          </Link>
          <Link
            href="/artisan/articles"
            className="font-sans text-sm font-medium rounded-sm px-4 py-2 transition-colors"
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
      <div className="rounded-b-xl overflow-hidden" style={{ background: "white" }}>
        {isLoading ? (
          <div className="px-5 py-8 font-sans text-sm text-text-muted">Loading articles…</div>
        ) : isError ? (
          <div className="px-5 py-8 font-sans text-sm text-[var(--color-danger)]">Failed to load articles.</div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-8 font-sans text-sm text-text-muted">
            Share short stories and formulation notes — they appear in the public Journal when published.
          </div>
        ) : (
          recent.map((a) => (
            <Link
              key={a.id}
              href={`/artisan/articles/${a.id}/edit`}
              className="flex items-center gap-3 px-5 py-3 border-t border-cream-dark first:border-t-0 hover:bg-cream/30 transition-colors"
            >
              <div
                className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-cream-dark bg-cream-dark"
                aria-hidden
              >
                {a.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.coverImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: a.coverGradient }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-sm text-text-dark leading-tight truncate">{a.title}</p>
                <p className="font-sans text-[12px] text-text-muted mt-0.5">
                  {a.status === "PUBLISHED" ? "Live" : "Draft"} · {formatUpdated(a.updatedAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
