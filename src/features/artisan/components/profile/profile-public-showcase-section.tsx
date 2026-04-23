"use client";

import React from "react";
import Link from "next/link";

type Props = {
  publicTagline: string | null;
  businessDescription: string | null;
  exportMarkets: string | null;
  valuesHighlight: string | null;
  publicProfilePath: string | null;
};

export function ProfilePublicShowcaseSection({
  publicTagline,
  businessDescription,
  exportMarkets,
  valuesHighlight,
  publicProfilePath,
}: Props) {
  const hasContent =
    (publicTagline?.trim() ?? "") !== "" ||
    (businessDescription?.trim() ?? "") !== "" ||
    (exportMarkets?.trim() ?? "") !== "" ||
    (valuesHighlight?.trim() ?? "") !== "";

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
      <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3" style={{ borderColor: "var(--color-cream-dark)" }}>
        <div>
          <h3 className="font-serif font-bold text-[15px] text-text-dark">Public business profile</h3>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">
            Shown to buyers on your public nevali page. Add a story, markets, and what makes you stand out.
          </p>
        </div>
        {publicProfilePath && (
          <Link
            href={publicProfilePath}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] font-semibold shrink-0 rounded-sm px-3 py-1.5 transition-colors hover:opacity-90"
            style={{ background: "var(--color-ink)", color: "white" }}
          >
            View public page →
          </Link>
        )}
      </div>
      <div className="p-5 flex flex-col gap-4">
        {!hasContent && (
          <p className="font-sans text-[12px] text-text-muted">
            You have not added a public description yet. Edit your profile to add a headline, about text, and export markets — it helps buyers trust you before they request a quote.
          </p>
        )}
        {publicTagline?.trim() && (
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">Headline</p>
            <p className="font-sans text-sm font-semibold text-text-dark">{publicTagline}</p>
          </div>
        )}
        {businessDescription?.trim() && (
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">About your business</p>
            <p className="font-sans text-sm text-text-dark leading-relaxed whitespace-pre-wrap">{businessDescription}</p>
          </div>
        )}
        {exportMarkets?.trim() && (
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">Export markets</p>
            <p className="font-sans text-sm text-text-dark">{exportMarkets}</p>
          </div>
        )}
        {valuesHighlight?.trim() && (
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">Values & practices</p>
            <p className="font-sans text-sm text-text-dark">{valuesHighlight}</p>
          </div>
        )}
      </div>
    </div>
  );
}
