"use client";

import Link from "next/link";
import React from "react";
import type { ProductRow } from "~/app/api/products/schemas/products.schema";
import { PRODUCT_STATUS_STYLES, STATUS_DOT_COLORS } from "../../constants";
import { useProducts } from "../../hooks/use-products";

function formatUpdatedAt(date: Date): string {
	const d = new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (days === 0) return "Updated today";
	if (days === 1) return "Updated yesterday";
	if (days < 7) return `Updated ${days} days ago`;
	if (days < 14) return "Updated 1 week ago";
	return `Updated ${Math.floor(days / 7)} weeks ago`;
}

function ProductRowItem({ p }: { p: ProductRow }) {
	const statusStyle =
		PRODUCT_STATUS_STYLES[p.status] ?? PRODUCT_STATUS_STYLES.PENDING;
	const dotColor = STATUS_DOT_COLORS[p.status] ?? "var(--color-gold)";
	return (
		<div className="flex items-center gap-4 border-cream-dark border-t px-5 py-3 first:border-t-0">
			<div
				className="h-2.5 w-2.5 shrink-0 rounded-full"
				style={{ background: dotColor }}
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate font-sans font-semibold text-sm text-text-dark leading-tight">
					{p.name}
				</p>
				<p className="mt-0.5 font-sans text-[12px] text-text-muted">
					{p.category} · {formatUpdatedAt(p.updatedAt)}
				</p>
			</div>
			<span
				className="shrink-0 rounded-full px-3 py-1 font-bold font-sans text-[10px] uppercase tracking-wide"
				style={statusStyle}
			>
				{p.status}
			</span>
		</div>
	);
}

export function DashboardProductList() {
	const { data: products = [], isLoading, isError } = useProducts();
	const approvedCount = products.filter((p) => p.status === "APPROVED").length;
	const rejected = products.find((p) => p.status === "REJECTED");

	return (
		<div className="flex flex-col gap-0">
			<div
				className="flex items-center justify-between rounded-t-xl border-cream-dark border-b px-5 py-4"
				style={{ background: "white" }}
			>
				<div>
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						My Products
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{products.length} listings · {approvedCount} approved
					</p>
				</div>
				<Link
					className="rounded-sm px-4 py-2 font-medium font-sans text-sm transition-colors"
					href="/artisan/products"
					style={{
						background: "var(--color-paper)",
						color: "var(--color-ink)",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					View all
				</Link>
			</div>
			<div
				className="overflow-hidden rounded-b-xl"
				style={{ background: "white" }}
			>
				{isLoading ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						Loading products…
					</div>
				) : isError ? (
					<div className="px-5 py-8 font-sans text-[var(--color-danger)] text-sm">
						Failed to load products.
					</div>
				) : products.length === 0 ? (
					<div className="px-5 py-8 font-sans text-sm text-text-muted">
						No products yet. Add products from the Products page.
					</div>
				) : (
					products.slice(0, 5).map((p) => <ProductRowItem key={p.id} p={p} />)
				)}
				{rejected && (
					<div
						className="mx-4 mt-1 mb-3 flex items-start gap-3 rounded-sm px-4 py-2.5"
						style={{
							background:
								"color-mix(in srgb, var(--color-danger) 8%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
						}}
					>
						<svg
							className="mt-0.5 shrink-0"
							fill="none"
							height="16"
							viewBox="0 0 16 16"
							width="16"
						>
							<path
								d="M8 2L1.5 13h13L8 2z"
								stroke="var(--color-danger)"
								strokeLinejoin="round"
								strokeWidth="1.3"
							/>
							<line
								stroke="var(--color-danger)"
								strokeLinecap="round"
								strokeWidth="1.3"
								x1="8"
								x2="8"
								y1="7"
								y2="10"
							/>
							<circle cx="8" cy="12" fill="var(--color-danger)" r="0.6" />
						</svg>
						<div>
							<p className="font-sans font-semibold text-[var(--color-danger)] text-sm leading-tight">
								Action required — {rejected.name}
							</p>
							<p className="mt-0.5 font-sans text-[12px] text-[var(--color-danger)]/70">
								Your listing was rejected. Review feedback and resubmit if
								needed.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
