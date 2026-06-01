"use client";

import Link from "next/link";
import React from "react";

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
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div
				className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
				style={{ borderColor: "var(--color-cream-dark)" }}
			>
				<div>
					<h3 className="font-bold font-serif text-[15px] text-text-dark">
						Public business profile
					</h3>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Shown to buyers on your public nevali page. Add a story, markets,
						and what makes you stand out.
					</p>
				</div>
				{publicProfilePath && (
					<Link
						className="shrink-0 rounded-sm px-3 py-1.5 font-sans font-semibold text-[11px] transition-colors hover:opacity-90"
						href={publicProfilePath}
						rel="noopener noreferrer"
						style={{ background: "var(--color-ink)", color: "white" }}
						target="_blank"
					>
						View public page →
					</Link>
				)}
			</div>
			<div className="flex flex-col gap-4 p-5">
				{!hasContent && (
					<p className="font-sans text-[12px] text-text-muted">
						You have not added a public description yet. Edit your profile to
						add a headline, about text, and export markets — it helps buyers
						trust you before they request a quote.
					</p>
				)}
				{publicTagline?.trim() && (
					<div>
						<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Headline
						</p>
						<p className="font-sans font-semibold text-sm text-text-dark">
							{publicTagline}
						</p>
					</div>
				)}
				{businessDescription?.trim() && (
					<div>
						<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							About your business
						</p>
						<p className="whitespace-pre-wrap font-sans text-sm text-text-dark leading-relaxed">
							{businessDescription}
						</p>
					</div>
				)}
				{exportMarkets?.trim() && (
					<div>
						<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Export markets
						</p>
						<p className="font-sans text-sm text-text-dark">{exportMarkets}</p>
					</div>
				)}
				{valuesHighlight?.trim() && (
					<div>
						<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Values & practices
						</p>
						<p className="font-sans text-sm text-text-dark">
							{valuesHighlight}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
