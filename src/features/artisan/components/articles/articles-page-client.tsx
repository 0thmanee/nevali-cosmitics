"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useArticles } from "../../hooks/use-articles";

function statusStyle(status: string): { bg: string; color: string; border: string } {
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
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function ArticlesPageClient() {
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
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
          className="w-full sm:max-w-xs rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm text-text-dark placeholder:text-text-muted"
        />
        <Link
          href="/artisan/articles/new"
          className="shrink-0 font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors bg-forest-dark text-white text-center"
        >
          New article
        </Link>
      </div>

      <div className="rounded-xl border border-cream-dark bg-white overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-12 font-sans text-sm text-text-muted text-center">Loading articles…</div>
        ) : isError ? (
          <div className="px-5 py-12 font-sans text-sm text-red-600 text-center">Failed to load articles.</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 font-sans text-sm text-text-muted text-center">
            {articles.length === 0
              ? "No articles yet. Write a short journal post for buyers on the homepage."
              : "No articles match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] font-sans text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-paper/80 text-left text-[11px] font-bold uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 w-14" aria-label="Cover" />
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 w-[110px]">Status</th>
                  <th className="px-4 py-3 w-[120px]">Updated</th>
                  <th className="px-4 py-3 w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const st = statusStyle(a.status);
                  return (
                    <tr key={a.id} className="border-b border-cream-dark last:border-b-0 hover:bg-cream/40">
                      <td className="px-4 py-3 align-middle">
                        <div
                          className="h-9 w-12 overflow-hidden rounded-sm border border-cream-dark bg-cream-dark"
                          aria-hidden
                        >
                          {a.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.coverImageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full" style={{ background: a.coverGradient }} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-text-dark leading-tight">{a.title}</p>
                        {a.tag && <p className="text-[12px] text-text-muted mt-0.5">{a.tag}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: st.bg, color: st.color, borderColor: st.border }}
                        >
                          {a.status === "PUBLISHED" ? "Live" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-[12px]">{formatUpdated(a.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/artisan/articles/${a.id}/edit`}
                          className="font-medium text-primary-dark hover:underline"
                        >
                          Edit
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
