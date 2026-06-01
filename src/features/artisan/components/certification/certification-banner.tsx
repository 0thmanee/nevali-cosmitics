"use client";

import Link from "next/link";
import React from "react";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";

export function CertificationBanner() {
	const { data: certifications = [], isLoading: certLoading } =
		useCertifications();
	const { data: certifiedProducts = [], isLoading: productsLoading } =
		useCertifiedProducts();

	const approvedCount = certifications.filter(
		(c) => c.status === "APPROVED",
	).length;
	const certifiedCount = certifiedProducts.length;
	const isLoading = certLoading || productsLoading;

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{ background: "var(--color-ink)" }}
		>
			<div
				className="h-1"
				style={{
					background:
						"linear-gradient(90deg, var(--color-text-muted) 0%, var(--color-text-muted) 50%, var(--color-text-muted) 100%)",
				}}
			/>
			<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<div
						className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm"
						style={{
							background: "var(--color-text-muted)1A",
							border: "1px solid var(--color-text-muted)33",
						}}
					>
						<svg fill="none" height="22" viewBox="0 0 22 22" width="22">
							<path
								d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
								stroke="var(--color-text-muted)"
								strokeLinejoin="round"
								strokeWidth="1.6"
							/>
						</svg>
					</div>
					<div>
						<div className="mb-0.5 flex items-center gap-2">
							<span className="font-bold font-serif text-[18px] text-white leading-tight">
								Partner certificate
							</span>
							<span
								className="rounded-full px-2.5 py-1 font-bold font-sans text-[9px] uppercase tracking-wider"
								style={{
									background: "var(--color-text-muted)1A",
									color: "var(--color-text-muted)",
									border: "1px solid var(--color-text-muted)33",
								}}
							>
								Verified
							</span>
						</div>
						<p className="font-sans text-[12px] text-white/80">
							Your verified partner certificate — the same document you can
							download from your profile.
						</p>
						{!isLoading && (certifiedCount > 0 || approvedCount > 0) && (
							<p className="mt-1 font-sans text-[11px] text-white/50">
								{certifiedCount} certified product
								{certifiedCount !== 1 ? "s" : ""} · {approvedCount} approved
								certification{approvedCount !== 1 ? "s" : ""}
							</p>
						)}
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Link
						className="inline-block rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors"
						href="/api/certificate"
						rel="noopener noreferrer"
						style={{
							background:
								"color-mix(in srgb, var(--color-gold) 12%, transparent)",
							color: "var(--color-text-muted)",
							border:
								"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
						}}
						target="_blank"
					>
						Download PDF
					</Link>
				</div>
			</div>
		</div>
	);
}
