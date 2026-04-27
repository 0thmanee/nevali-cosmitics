"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { interpolate } from "~/lib/i18n/interpolate";
import {
  useProduct,
  useSetHomepageHeroProduct,
  useClearHomepageHeroProduct,
} from "../../hooks/use-products";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { artisanProductStatusLabel, formatProductUpdatedRelative } from "../../utils/format-product-updated-i18n";
import { ProductGallery } from "./product-gallery";
import { ProductCertificationsSection } from "./product-certifications-section";

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
        className="rounded-sm overflow-hidden flex items-center justify-center py-20"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-text-muted">{t("artisanProductDetail.loading")}</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        className="rounded-sm overflow-hidden px-6 py-12 text-center"
        style={cardStyle}
      >
        <p className="font-sans text-sm text-danger">
          {error instanceof Error ? error.message : t("artisanProductDetail.notFound")}
        </p>
        <Link
          href="/artisan/products"
          className="mt-4 inline-block font-sans text-sm font-medium text-text-dark underline"
        >
          {t("artisanProductDetail.backToProducts")}
        </Link>
      </div>
    );
  }

  const statusStyle = PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;
  const updatedRelative = formatProductUpdatedRelative(product.updatedAt, t);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-text-dark leading-tight">{product.name}</h1>
            <p className="font-sans text-[13px] text-text-muted mt-1">{product.category}</p>
            <p className="font-sans text-[12px] text-text-muted/80 mt-1">
              {interpolate(t("artisanProductDetail.updatedLine"), { relative: updatedRelative })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="font-sans text-[11px] font-bold tracking-wide rounded-full px-4 py-1.5 uppercase"
              style={statusStyle}
            >
              {artisanProductStatusLabel(product.status, t)}
            </span>
            <Link
              href={`/artisan/products/${productId}/edit`}
              className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors"
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
          <div className="border-t border-cream-dark px-6 py-4">
            {heroError ? (
              <p className="mb-2 font-sans text-xs text-danger">{heroError}</p>
            ) : null}
            {product.featuredOnHome ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-sm text-text-dark">
                  {t("artisanProductDetail.heroFeaturedPrefix")}{" "}
                  <span className="font-semibold">{t("artisanProductDetail.heroFeaturedTerm")}</span>
                  {t("artisanProductDetail.heroFeaturedSuffix")}
                </p>
                <button
                  type="button"
                  disabled={heroBusy}
                  className="w-fit font-sans text-xs font-medium text-text-muted underline-offset-2 hover:underline disabled:opacity-50"
                  onClick={() => {
                    setHeroError(null);
                    clearHero.mutate(undefined, {
                      onError: (e) =>
                        setHeroError(
                          e instanceof Error ? e.message : t("artisanProductsTable.updateHomepageError"),
                        ),
                    });
                  }}
                >
                  {t("artisanProductsTable.removeFromHomepage")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-sm text-text-muted">{t("artisanProductDetail.heroHint")}</p>
                <button
                  type="button"
                  disabled={heroBusy}
                  className="w-fit font-sans text-xs font-semibold uppercase tracking-wide text-text-dark underline-offset-2 hover:underline disabled:opacity-50"
                  onClick={() => {
                    setHeroError(null);
                    setHero.mutate(productId, {
                      onError: (e) =>
                        setHeroError(
                          e instanceof Error ? e.message : t("artisanProductsTable.updateHomepageError"),
                        ),
                    });
                  }}
                >
                  {t("artisanProductsTable.showOnHomepage")}
                </button>
              </div>
            )}
            <p className="mt-2 font-sans text-[11px] text-text-muted">
              <Link href={`/artisan/products/${productId}/edit#homepage-hero-spotlight`} className="underline">
                {t("artisanProductDetail.advancedEditLink")}
              </Link>
            </p>
          </div>
        ) : null}
      </div>

      <ProductGallery images={product.images ?? []} alt={product.name} />

      <ProductCertificationsSection
        productId={productId}
        productName={product.name}
        certifications={product.certifications ?? []}
      />

      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">{t("artisanProductDetail.sectionDetails")}</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-sm p-4"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
            >
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                {t("artisanProductDetail.moqLabel")}
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">{product.moq ?? t("common.dash")}</p>
            </div>
            <div
              className="rounded-sm p-4"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
            >
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                {t("artisanProductDetail.capacityLabel")}
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">
                {product.capacity ?? t("common.dash")}
              </p>
            </div>
          </div>
          {product.status === "REJECTED" && product.rejectionReason?.trim() && (
            <div
              className="rounded-sm px-4 py-3 flex flex-col gap-1"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
              }}
            >
              <p className="font-sans text-[11px] font-bold tracking-wide text-danger uppercase">
                {t("artisanProductDetail.rejectionReasonLabel")}
              </p>
              <p className="font-sans text-sm text-text-dark">{product.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">
            Internal product economics
          </h2>
          <p className="mt-0.5 font-sans text-[12px] text-text-muted">
            Variant-level internal costs, margin per item, and remaining potential net from current stock.
          </p>
        </div>
        <div className="p-6">
          {(product.variants?.length ?? 0) === 0 ? (
            <p className="font-sans text-sm text-text-muted">{t("common.dash")}</p>
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
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                        Total sold units
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold text-text-dark">
                        {totals.soldUnits}
                      </p>
                    </div>
                    <div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                        Realized revenue
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold text-text-dark">
                        {formatMad(totals.realizedRevenue.toFixed(2))}
                      </p>
                    </div>
                    <div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                        Realized net profit
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold text-text-dark">
                        {formatMad(totals.realizedNet.toFixed(2))}
                      </p>
                    </div>
                    <div className="rounded-sm border border-cream-dark bg-paper px-4 py-3">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                        Remaining potential net
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold text-text-dark">
                        {formatMad(totals.remainingPotentialNet.toFixed(2))}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-cream-dark bg-paper/70 font-sans text-[10px] uppercase tracking-[0.12em] text-text-muted">
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
                        className={idx > 0 ? "border-t border-cream-dark" : undefined}
                        key={v.id}
                      >
                        <td className="px-3 py-3">
                          <p className="font-sans text-sm font-semibold text-text-dark">{v.name}</p>
                          <p className="font-sans text-[11px] text-text-muted">{v.unit}</p>
                        </td>
                        <td className="px-3 py-3 font-sans text-sm text-text-muted">
                          {v.sourceName ?? t("common.dash")}
                        </td>
                        <td className="px-3 py-3 text-right font-sans text-sm text-text-dark">{formatMad(v.price)}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm text-text-dark">{formatMad(cogs.toFixed(2))}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm font-semibold text-text-dark">{formatMad(net.toFixed(2))}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm text-text-dark">{v.soldUnits}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm font-semibold text-text-dark">{formatMad(v.realizedNetMad)}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm text-text-dark">{v.quantityOnHand}</td>
                        <td className="px-3 py-3 text-right font-sans text-sm font-semibold text-text-dark">{formatMad(potentialNet.toFixed(2))}</td>
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
