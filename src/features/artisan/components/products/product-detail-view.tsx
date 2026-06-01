"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { interpolate } from "~/lib/i18n/interpolate";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import {
	useClearHomepageHeroProduct,
	useProduct,
	useSetHomepageHeroProduct,
} from "../../hooks/use-products";
import {
	artisanProductStatusLabel,
	formatProductUpdatedRelative,
} from "../../utils/format-product-updated-i18n";
import { ProductCertificationsSection } from "./product-certifications-section";
import { ProductGallery } from "./product-gallery";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

type Props = { productId: string };

function toNumber(v: string): number {
	const n = Number(v.replace(",", "."));
	return Number.isFinite(n) ? n : 0;
}

export function ProductDetailView({ productId }: Props) {
	const { t } = useI18n();
	const { formatMad } = useFormatPrice();
	const { data: product, isLoading, isError, error } = useProduct(productId);
	const setHero = useSetHomepageHeroProduct();
	const clearHero = useClearHomepageHeroProduct();
	const [heroError, setHeroError] = useState<string | null>(null);
	const heroBusy = setHero.isPending || clearHero.isPending;

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center overflow-hidden rounded-sm py-20"
				style={cardStyle}
			>
				<p className="font-sans text-sm text-text-muted">
					{t("artisanProductDetail.loading")}
				</p>
			</div>
		);
	}

	if (isError || !product) {
		return (
			<div
				className="overflow-hidden rounded-sm px-6 py-12 text-center"
				style={cardStyle}
			>
				<p className="font-sans text-danger text-sm">
					{error instanceof Error
						? error.message
						: t("artisanProductDetail.notFound")}
				</p>
				<Link
					className="mt-4 inline-block font-medium font-sans text-sm text-text-dark underline"
					href="/artisan/products"
				>
					{t("artisanProductDetail.backToProducts")}
				</Link>
			</div>
		);
	}

	const statusStyle =
		PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;
	const updatedRelative = formatProductUpdatedRelative(product.updatedAt, t);

	return (
		<div className="flex flex-col gap-6">
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							{product.name}
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							{product.category}
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted/80">
							{interpolate(t("artisanProductDetail.updatedLine"), {
								relative: updatedRelative,
							})}
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<span
							className="rounded-full px-4 py-1.5 font-bold font-sans text-[11px] uppercase tracking-wide"
							style={statusStyle}
						>
							{artisanProductStatusLabel(product.status, t)}
						</span>
						<Link
							className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors"
							href={`/artisan/products/${productId}/edit`}
							style={{
								background: "var(--color-ink)",
								color: "white",
							}}
						>
							{t("artisanProductDetail.edit")}
						</Link>
					</div>
				</div>
				{product.status === "APPROVED" ? (
					<div className="border-cream-dark border-t px-6 py-4">
						{heroError ? (
							<p className="mb-2 font-sans text-danger text-xs">{heroError}</p>
						) : null}
						{product.featuredOnHome ? (
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<p className="font-sans text-sm text-text-dark">
									{t("artisanProductDetail.heroFeaturedPrefix")}{" "}
									<span className="font-semibold">
										{t("artisanProductDetail.heroFeaturedTerm")}
									</span>
									{t("artisanProductDetail.heroFeaturedSuffix")}
								</p>
								<button
									className="w-fit font-medium font-sans text-text-muted text-xs underline-offset-2 hover:underline disabled:opacity-50"
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
							</div>
						) : (
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<p className="font-sans text-sm text-text-muted">
									{t("artisanProductDetail.heroHint")}
								</p>
								<button
									className="w-fit font-sans font-semibold text-text-dark text-xs uppercase tracking-wide underline-offset-2 hover:underline disabled:opacity-50"
									disabled={heroBusy}
									onClick={() => {
										setHeroError(null);
										setHero.mutate(productId, {
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
							</div>
						)}
						<p className="mt-2 font-sans text-[11px] text-text-muted">
							<Link
								className="underline"
								href={`/artisan/products/${productId}/edit#homepage-hero-spotlight`}
							>
								{t("artisanProductDetail.advancedEditLink")}
							</Link>
						</p>
					</div>
				) : null}
			</div>

			<ProductGallery alt={product.name} images={product.images ?? []} />

			<ProductCertificationsSection
				certifications={product.certifications ?? []}
				productId={productId}
				productName={product.name}
			/>

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("artisanProductDetail.sectionDetails")}
					</h2>
				</div>
				<div className="flex flex-col gap-4 p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div
							className="rounded-sm p-4"
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								{t("artisanProductDetail.moqLabel")}
							</p>
							<p className="font-sans font-semibold text-[15px] text-text-dark">
								{product.moq ?? t("common.dash")}
							</p>
						</div>
						<div
							className="rounded-sm p-4"
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							<p className="mb-1 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								{t("artisanProductDetail.capacityLabel")}
							</p>
							<p className="font-sans font-semibold text-[15px] text-text-dark">
								{product.capacity ?? t("common.dash")}
							</p>
						</div>
					</div>
					{product.status === "REJECTED" && product.rejectionReason?.trim() && (
						<div
							className="flex flex-col gap-1 rounded-sm px-4 py-3"
							style={{
								background:
									"color-mix(in srgb, var(--color-danger) 8%, transparent)",
								border:
									"1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
							}}
						>
							<p className="font-bold font-sans text-[11px] text-danger uppercase tracking-wide">
								{t("artisanProductDetail.rejectionReasonLabel")}
							</p>
							<p className="font-sans text-sm text-text-dark">
								{product.rejectionReason}
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Internal product economics
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						Variant-level internal costs, margin per item, and remaining
						potential net from current stock.
					</p>
				</div>
				<div className="p-6">
					{(product.variants?.length ?? 0) === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							{t("common.dash")}
						</p>
					) : (
						<>
							{(() => {
								const totals = product.variants.reduce(
									(acc, v) => {
										const price = toNumber(v.price);
										const cogs =
											toNumber(v.unitCost) +
											toNumber(v.packagingCost) +
											toNumber(v.handlingCost) +
											toNumber(v.otherCost);
										const netPerItem = price - cogs;
										acc.soldUnits += v.soldUnits;
										acc.realizedRevenue += toNumber(v.realizedRevenueMad);
										acc.realizedNet += toNumber(v.realizedNetMad);
										acc.remainingPotentialNet += netPerItem * v.quantityOnHand;
										return acc;
									},
									{
										soldUnits: 0,
										realizedRevenue: 0,
										realizedNet: 0,
										remainingPotentialNet: 0,
									},
								);
								return (
									<div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
										<div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
											<p className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
												Total sold units
											</p>
											<p className="mt-1 font-bold font-serif text-text-dark text-xl">
												{totals.soldUnits}
											</p>
										</div>
										<div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
											<p className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
												Realized revenue
											</p>
											<p className="mt-1 font-bold font-serif text-text-dark text-xl">
												{formatMad(totals.realizedRevenue.toFixed(2))}
											</p>
										</div>
										<div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
											<p className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
												Realized net profit
											</p>
											<p className="mt-1 font-bold font-serif text-text-dark text-xl">
												{formatMad(totals.realizedNet.toFixed(2))}
											</p>
										</div>
										<div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
											<p className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
												Remaining potential net
											</p>
											<p className="mt-1 font-bold font-serif text-text-dark text-xl">
												{formatMad(totals.remainingPotentialNet.toFixed(2))}
											</p>
										</div>
									</div>
								);
							})()}

							<div className="overflow-x-auto">
								<table className="min-w-full border-collapse">
									<thead>
										<tr className="border-cream-dark border-b bg-paper/70 font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
											<th className="px-3 py-2 text-left">Variant</th>
											<th className="px-3 py-2 text-left">Source</th>
											<th className="px-3 py-2 text-right">Price</th>
											<th className="px-3 py-2 text-right">COGS/item</th>
											<th className="px-3 py-2 text-right">Net/item</th>
											<th className="px-3 py-2 text-right">Sold</th>
											<th className="px-3 py-2 text-right">Realized net</th>
											<th className="px-3 py-2 text-right">Qty</th>
											<th className="px-3 py-2 text-right">Potential net</th>
										</tr>
									</thead>
									<tbody>
										{product.variants.map((v, idx) => {
											const price = toNumber(v.price);
											const cogs =
												toNumber(v.unitCost) +
												toNumber(v.packagingCost) +
												toNumber(v.handlingCost) +
												toNumber(v.otherCost);
											const net = price - cogs;
											const potentialNet = net * v.quantityOnHand;
											return (
												<tr
													className={
														idx > 0 ? "border-cream-dark border-t" : undefined
													}
													key={v.id}
												>
													<td className="px-3 py-3">
														<p className="font-sans font-semibold text-sm text-text-dark">
															{v.name}
														</p>
														<p className="font-sans text-[11px] text-text-muted">
															{v.unit}
														</p>
													</td>
													<td className="px-3 py-3 font-sans text-sm text-text-muted">
														{v.sourceName ?? t("common.dash")}
													</td>
													<td className="px-3 py-3 text-right font-sans text-sm text-text-dark">
														{formatMad(v.price)}
													</td>
													<td className="px-3 py-3 text-right font-sans text-sm text-text-dark">
														{formatMad(cogs.toFixed(2))}
													</td>
													<td className="px-3 py-3 text-right font-sans font-semibold text-sm text-text-dark">
														{formatMad(net.toFixed(2))}
													</td>
													<td className="px-3 py-3 text-right font-sans text-sm text-text-dark">
														{v.soldUnits}
													</td>
													<td className="px-3 py-3 text-right font-sans font-semibold text-sm text-text-dark">
														{formatMad(v.realizedNetMad)}
													</td>
													<td className="px-3 py-3 text-right font-sans text-sm text-text-dark">
														{v.quantityOnHand}
													</td>
													<td className="px-3 py-3 text-right font-sans font-semibold text-sm text-text-dark">
														{formatMad(potentialNet.toFixed(2))}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
