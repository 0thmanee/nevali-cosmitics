"use client";

import Link from "next/link";
import React, { useState } from "react";
import type { ProductListRow } from "~/app/api/products/schemas/products.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import {
	useClearHomepageHeroProduct,
	useSetHomepageHeroProduct,
} from "../../hooks/use-products";
import {
	artisanProductStatusLabel,
	formatProductUpdatedRelative,
} from "../../utils/format-product-updated-i18n";

export type ProductsTableProps = {
	products: ProductListRow[];
};

function ProductThumb({
	firstImageUrl,
	seed,
}: {
	firstImageUrl: string | null;
	seed: string;
}) {
	const src = firstImageUrl ?? productPlaceholderImageUrl(seed, 144);
	return (
		<img
			alt=""
			className="h-9 w-9 shrink-0 rounded-sm bg-cream object-cover"
			src={src}
		/>
	);
}

export function ProductsTable({ products }: ProductsTableProps) {
	const { t } = useI18n();
	const { formatMad } = useFormatPrice();
	const setHero = useSetHomepageHeroProduct();
	const clearHero = useClearHomepageHeroProduct();
	const [heroError, setHeroError] = useState<string | null>(null);

	if (products.length === 0) {
		return (
			<div
				className="flex flex-col items-center justify-center gap-4 overflow-hidden rounded-sm py-16"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<svg fill="none" height="40" viewBox="0 0 40 40" width="40">
					<rect
						height="28"
						rx="4"
						stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
						strokeWidth="2"
						width="24"
						x="8"
						y="6"
					/>
					<line
						stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
						strokeLinecap="round"
						strokeWidth="2"
						x1="14"
						x2="26"
						y1="15"
						y2="15"
					/>
					<line
						stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
						strokeLinecap="round"
						strokeWidth="2"
						x1="14"
						x2="22"
						y1="21"
						y2="21"
					/>
				</svg>
				<p className="font-sans text-sm text-text-muted">
					{t("artisanProductsTable.empty")}
				</p>
				<Link
					className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors"
					href="/artisan/products/new"
					style={{ background: "var(--color-ink)", color: "white" }}
				>
					{t("artisanProductsTable.addNew")}
				</Link>
			</div>
		);
	}

	const heroBusy = setHero.isPending || clearHero.isPending;

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			{heroError ? (
				<p className="border-cream-dark border-b bg-[color-mix(in_srgb,var(--color-danger)_8%,white)] px-5 py-2 font-sans text-[var(--color-danger)] text-xs">
					{heroError}
				</p>
			) : null}
			<div
				className="grid px-5 py-3 font-bold text-[10px] text-text-muted uppercase tracking-[0.14em]"
				style={{
					gridTemplateColumns: "auto 2fr 1fr 1fr 1fr auto",
					borderBottom: "1px solid var(--color-cream-dark)",
					background: "var(--color-paper)",
				}}
			>
				<span className="w-9">{t("artisanProductsTable.thImage")}</span>
				<span>{t("artisanProductsTable.thProduct")}</span>
				<span>{t("artisanProductsTable.thVariants")}</span>
				<span>{t("artisanProductsTable.thFromPrice")}</span>
				<span>{t("artisanProductsTable.thStatus")}</span>
				<span>{t("artisanProductsTable.thActions")}</span>
			</div>
			{products.map((p, i) => {
				const statusStyle =
					PRODUCT_STATUS_STYLES[p.status] ?? PRODUCT_STATUS_STYLES.PENDING;
				return (
					<div
						className="grid items-center px-5 py-3.5"
						key={p.id}
						style={{
							gridTemplateColumns: "auto 2fr 1fr 1fr 1fr auto",
							borderTop: i > 0 ? "1px solid var(--color-cream-dark)" : "none",
						}}
					>
						<div className="px-4 py-3">
							<ProductThumb
								firstImageUrl={p.firstImageUrl}
								seed={`${p.id}:${p.category}`}
							/>
						</div>
						<div className="flex min-w-0 items-center gap-3">
							<div className="min-w-0">
								<p className="truncate font-sans font-semibold text-sm text-text-dark leading-tight">
									{p.name}
								</p>
								<p className="mt-0.5 font-sans text-[11px] text-text-muted">
									{p.category} · {formatProductUpdatedRelative(p.updatedAt, t)}
								</p>
								{p.status === "APPROVED" && p.featuredOnHome ? (
									<p className="mt-1 font-sans font-semibold text-[10px] text-text-dark uppercase tracking-[0.12em]">
										{t("artisanProductsTable.heroBadge")}
									</p>
								) : null}
							</div>
						</div>
						<span className="font-sans text-sm text-text-dark">
							{p.variantCount}
						</span>
						<span className="font-sans text-sm text-text-dark">
							{p.fromPrice ? formatMad(p.fromPrice) : t("common.dash")}
						</span>
						<div className="flex flex-col gap-0.5">
							<span
								className="w-fit rounded-full px-3 py-1 font-bold font-sans text-[10px] uppercase tracking-wide"
								style={statusStyle}
							>
								{artisanProductStatusLabel(p.status, t)}
							</span>
							{p.status === "REJECTED" && p.rejectionReason?.trim() && (
								<span
									className="max-w-[180px] truncate font-sans text-[11px] text-[var(--color-danger)]/80"
									title={p.rejectionReason}
								>
									{p.rejectionReason}
								</span>
							)}
						</div>
						<div className="flex flex-col items-stretch gap-1.5">
							<div className="flex items-center gap-2">
								<Link
									className="inline-block rounded-sm px-3 py-1.5 text-center font-medium font-sans text-[12px] transition-colors"
									href={`/artisan/products/${p.id}/edit`}
									style={{
										background: "var(--color-paper)",
										color: "var(--color-ink)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									{t("artisanProductsTable.edit")}
								</Link>
								<Link
									className="inline-block rounded-sm px-3 py-1.5 text-center font-medium font-sans text-[12px] transition-colors"
									href={`/artisan/products/${p.id}`}
									style={{
										background: "var(--color-paper)",
										color: "var(--color-ink)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									{t("artisanProductsTable.view")}
								</Link>
							</div>
							{p.status === "APPROVED" ? (
								p.featuredOnHome ? (
									<button
										className="font-medium font-sans text-[11px] text-text-muted underline-offset-2 hover:underline disabled:opacity-50"
										disabled={heroBusy}
										onClick={() => {
											setHeroError(null);
											clearHero.mutate(undefined, {
												onError: (e) =>
													setHeroError(
														e instanceof Error
															? e.message
															: t("artisanProductsTable.updateHomepageError"),
													),
											});
										}}
										type="button"
									>
										{t("artisanProductsTable.removeFromHomepage")}
									</button>
								) : (
									<button
										className="font-medium font-sans text-[11px] text-text-dark underline-offset-2 hover:underline disabled:opacity-50"
										disabled={heroBusy}
										onClick={() => {
											setHeroError(null);
											setHero.mutate(p.id, {
												onError: (e) =>
													setHeroError(
														e instanceof Error
															? e.message
															: t("artisanProductsTable.updateHomepageError"),
													),
											});
										}}
										type="button"
									>
										{t("artisanProductsTable.showOnHomepage")}
									</button>
								)
							) : null}
						</div>
					</div>
				);
			})}
		</div>
	);
}
