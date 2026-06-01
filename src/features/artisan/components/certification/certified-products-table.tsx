"use client";

import Image from "next/image";
import React from "react";
import type { CertifiedProductListRow } from "~/app/api/products/schemas/products.schema";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
	PENDING: {
		bg: "color-mix(in srgb, var(--color-gold) 10%, transparent)",
		color: "var(--color-text-muted)",
		dot: "var(--color-text-muted)",
		label: "Pending",
	},
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-ink) 10%, transparent)",
		color: "var(--color-success)",
		dot: "var(--color-success-light)",
		label: "Approved",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 10%, transparent)",
		color: "var(--color-danger-dark)",
		dot: "var(--color-danger)",
		label: "Rejected",
	},
} as const;

// ── Product icon ──────────────────────────────────────────────────────────────

function ProductThumb({
	imageUrl,
	name,
	seed,
}: {
	imageUrl: string | null;
	name: string;
	seed: string;
}) {
	const src = imageUrl ?? productPlaceholderImageUrl(seed, 192);
	return (
		<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-cream">
			<Image alt={name} className="object-cover" fill sizes="48px" src={src} />
		</div>
	);
}

// ── Cert item ─────────────────────────────────────────────────────────────────

function CertItem({
	cert,
}: {
	cert: CertifiedProductListRow["certifications"][number];
}) {
	const s =
		STATUS_CONFIG[cert.status as keyof typeof STATUS_CONFIG] ??
		STATUS_CONFIG.PENDING;
	return (
		<div className="flex items-center gap-3 rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5">
			<svg
				className="shrink-0"
				fill="none"
				height="14"
				viewBox="0 0 16 16"
				width="14"
			>
				<path
					d="M4 2h6l3 3v9H4V2z"
					stroke="var(--color-text-muted)"
					strokeLinejoin="round"
					strokeWidth="1.3"
				/>
				<path
					d="M10 2v3h3"
					stroke="var(--color-text-muted)"
					strokeLinejoin="round"
					strokeWidth="1.3"
				/>
				<path
					d="M6 7h4M6 9.5h4M6 12h2"
					stroke="var(--color-text-muted)"
					strokeLinecap="round"
					strokeWidth="1.1"
				/>
			</svg>
			<span className="min-w-0 flex-1 truncate font-medium font-sans text-[13px] text-text-dark">
				{cert.name}
			</span>
			<div className="flex shrink-0 items-center gap-2">
				<span
					className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold font-sans text-[10px] tracking-wide"
					style={{ background: s.bg, color: s.color }}
				>
					<span
						className="inline-block h-1.5 w-1.5 rounded-full"
						style={{ background: s.dot }}
					/>
					{s.label}
				</span>
				<a
					className="rounded-sm border border-cream-dark bg-white px-2.5 py-1 font-medium font-sans text-[11px] text-text-dark transition-colors hover:bg-cream"
					href={cert.fileUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					View
				</a>
			</div>
		</div>
	);
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: CertifiedProductListRow }) {
	const certs = product.certifications ?? [];
	const approvedCount = certs.filter((c) => c.status === "APPROVED").length;

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			{/* Product header */}
			<div
				className="flex items-center gap-3.5 px-5 py-4"
				style={{
					borderBottom:
						certs.length > 0 ? "1px solid var(--color-cream-dark)" : "none",
				}}
			>
				<ProductThumb
					imageUrl={product.firstImageUrl}
					name={product.name}
					seed={`${product.id}:${product.category}`}
				/>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="truncate font-bold font-serif text-[15px] text-text-dark">
							{product.name}
						</span>
						<span
							className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-bold font-sans text-[10px] tracking-wide"
							style={{
								background:
									"color-mix(in srgb, var(--color-ink) 10%, transparent)",
								color: "var(--color-success)",
							}}
						>
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
							Approved
						</span>
					</div>
					<div className="mt-0.5 flex items-center gap-2">
						<span className="font-sans text-[12px] text-text-muted">
							{product.category}
						</span>
						{product.moq && (
							<>
								<span className="text-[var(--color-muted-light)]">·</span>
								<span className="font-sans text-[12px] text-text-muted">
									MOQ: {product.moq}
								</span>
							</>
						)}
					</div>
				</div>
				<div className="shrink-0 text-right">
					<p className="font-bold font-sans text-[22px] text-text-dark leading-none">
						{approvedCount}
					</p>
					<p className="mt-0.5 font-sans text-[10px] text-text-muted">
						cert{approvedCount !== 1 ? "s" : ""} approved
					</p>
				</div>
			</div>

			{/* Certifications list */}
			{certs.length > 0 && (
				<div className="flex flex-col gap-2 px-5 py-4">
					{certs.map((c) => (
						<CertItem cert={c} key={c.id} />
					))}
				</div>
			)}

			{certs.length === 0 && (
				<div className="px-5 py-4">
					<p className="font-sans text-[12px] text-text-muted">
						No certifications linked to this product yet. Go to the Documents
						tab to upload one.
					</p>
				</div>
			)}
		</div>
	);
}

// ── Main export ───────────────────────────────────────────────────────────────

export function CertifiedProductsTable() {
	const { data: products, isLoading, error } = useCertifiedProducts();

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center rounded-sm py-12"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-[13px] text-text-muted">
					Loading certified products…
				</p>
			</div>
		);
	}
	if (error) {
		return (
			<div
				className="rounded-sm px-5 py-6"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-[13px] text-red-500">
					Failed to load certified products.
				</p>
			</div>
		);
	}

	const list: CertifiedProductListRow[] = products ?? [];

	if (list.length === 0) {
		return (
			<div
				className="flex flex-col items-center justify-center gap-3 rounded-sm py-12"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<svg fill="none" height="36" viewBox="0 0 36 36" width="36">
					<rect
						height="18"
						rx="3"
						stroke="var(--color-muted-light)"
						strokeLinejoin="round"
						strokeWidth="1.4"
						width="30"
						x="3"
						y="14"
					/>
					<path
						d="M12 14v-3a6 6 0 0 1 12 0v3"
						stroke="var(--color-muted-light)"
						strokeLinecap="round"
						strokeWidth="1.4"
					/>
					<circle
						cx="18"
						cy="22"
						r="2.5"
						stroke="var(--color-muted-light)"
						strokeWidth="1.4"
					/>
				</svg>
				<p className="max-w-xs text-center font-sans text-[13px] text-text-muted">
					No approved products yet. Once an admin approves your products, they
					will appear here with their certifications.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{list.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
