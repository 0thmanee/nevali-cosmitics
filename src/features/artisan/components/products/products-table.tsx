"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { useClearHomepageHeroProduct, useSetHomepageHeroProduct } from "../../hooks/use-products";
import { artisanProductStatusLabel, formatProductUpdatedRelative } from "../../utils/format-product-updated-i18n";
import type { ProductListRow } from "~/app/api/products/schemas/products.schema";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";

export type ProductsTableProps = {
  products: ProductListRow[];
};

function ProductThumb({ firstImageUrl, seed }: { firstImageUrl: string | null; seed: string }) {
  const src = firstImageUrl ?? productPlaceholderImageUrl(seed, 144);
  return (
    <img src={src} alt="" className="w-9 h-9 rounded-sm object-cover shrink-0 bg-cream" />
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
        className="rounded-sm overflow-hidden flex flex-col items-center justify-center py-16 gap-4"
        style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect
            x="8"
            y="6"
            width="24"
            height="28"
            rx="4"
            stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
            strokeWidth="2"
          />
          <line
            x1="14"
            y1="15"
            x2="26"
            y2="15"
            stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="21"
            x2="22"
            y2="21"
            stroke="color-mix(in srgb, var(--color-gold) 45%, var(--color-cream-dark))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-sans text-sm text-text-muted">{t("artisanProductsTable.empty")}</p>
        <Link
          href="/artisan/products/new"
          className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors"
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
      className="rounded-sm overflow-hidden"
      style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}
    >
      {heroError ? (
        <p className="border-b border-cream-dark bg-[color-mix(in_srgb,var(--color-danger)_8%,white)] px-5 py-2 font-sans text-xs text-[var(--color-danger)]">
          {heroError}
        </p>
      ) : null}
      <div
        className="grid px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-text-muted uppercase"
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
        const statusStyle = PRODUCT_STATUS_STYLES[p.status] ?? PRODUCT_STATUS_STYLES.PENDING;
        return (
          <div
            key={p.id}
            className="grid items-center px-5 py-3.5"
            style={{
              gridTemplateColumns: "auto 2fr 1fr 1fr 1fr auto",
              borderTop: i > 0 ? "1px solid var(--color-cream-dark)" : "none",
            }}
          >
            <div className="px-4 py-3">
              <ProductThumb firstImageUrl={p.firstImageUrl} seed={`${p.id}:${p.category}`} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <p className="font-sans font-semibold text-sm text-text-dark leading-tight truncate">
                  {p.name}
                </p>
                <p className="font-sans text-[11px] text-text-muted mt-0.5">
                  {p.category} · {formatProductUpdatedRelative(p.updatedAt, t)}
                </p>
                {p.status === "APPROVED" && p.featuredOnHome ? (
                  <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dark">
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
                className="font-sans text-[10px] font-bold tracking-wide rounded-full px-3 py-1 uppercase w-fit"
                style={statusStyle}
              >
                {artisanProductStatusLabel(p.status, t)}
              </span>
              {p.status === "REJECTED" && p.rejectionReason?.trim() && (
                <span className="font-sans text-[11px] text-[var(--color-danger)]/80 max-w-[180px] truncate" title={p.rejectionReason}>
                  {p.rejectionReason}
                </span>
              )}
            </div>
            <div className="flex flex-col items-stretch gap-1.5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/artisan/products/${p.id}/edit`}
                  className="font-sans text-[12px] font-medium rounded-sm px-3 py-1.5 transition-colors inline-block text-center"
                  style={{
                    background: "var(--color-paper)",
                    color: "var(--color-ink)",
                    border: "1px solid var(--color-cream-dark)",
                  }}
                >
                  {t("artisanProductsTable.edit")}
                </Link>
                <Link
                  href={`/artisan/products/${p.id}`}
                  className="font-sans text-[12px] font-medium rounded-sm px-3 py-1.5 transition-colors inline-block text-center"
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
                    type="button"
                    disabled={heroBusy}
                    className="font-sans text-[11px] font-medium text-text-muted underline-offset-2 hover:underline disabled:opacity-50"
                    onClick={() => {
                      setHeroError(null);
                      clearHero.mutate(undefined, {
                        onError: (e) =>
                          setHeroError(e instanceof Error ? e.message : t("artisanProductsTable.updateHomepageError")),
                      });
                    }}
                  >
                    {t("artisanProductsTable.removeFromHomepage")}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={heroBusy}
                    className="font-sans text-[11px] font-medium text-text-dark underline-offset-2 hover:underline disabled:opacity-50"
                    onClick={() => {
                      setHeroError(null);
                      setHero.mutate(p.id, {
                        onError: (e) =>
                          setHeroError(e instanceof Error ? e.message : t("artisanProductsTable.updateHomepageError")),
                      });
                    }}
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
