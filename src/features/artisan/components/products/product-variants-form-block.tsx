"use client";

import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";
import {
  productFormInputBase,
  productFormInputStyle,
  productFormLabelClass,
} from "./product-form-styles";
import type { ProductVariantRow } from "~/app/api/products/schemas/products.schema";

function newKey(): string {
  return globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random()}`;
}

export type VariantDraft = {
  key: string;
  serverId?: string;
  name: string;
  unit: string;
  minOrderQuantity: string;
  minOrderNote: string;
  price: string;
  quantityOnHand: string;
  inStock: boolean;
};

export function emptyVariantDraft(): VariantDraft {
  return {
    key: newKey(),
    name: "",
    unit: "item",
    minOrderQuantity: "1",
    minOrderNote: "",
    price: "",
    quantityOnHand: "0",
    inStock: true,
  };
}

export function variantDraftFromServer(v: ProductVariantRow): VariantDraft {
  return {
    key: v.id,
    serverId: v.id,
    name: v.name,
    unit: v.unit,
    minOrderQuantity: String(v.minOrderQuantity),
    minOrderNote: v.minOrderNote ?? "",
    price: v.price,
    quantityOnHand: String(v.quantityOnHand),
    inStock: v.inStock,
  };
}

type Props = {
  variants: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  disabled?: boolean;
};

export function ProductVariantsFormBlock({ variants, onChange, disabled }: Props) {
  const { t } = useI18n();

  const update = (key: string, patch: Partial<VariantDraft>) => {
    onChange(variants.map((v) => (v.key === key ? { ...v, ...patch } : v)));
  };

  const add = () => onChange([...variants, emptyVariantDraft()]);

  const remove = (key: string) => {
    if (variants.length <= 1) return;
    onChange(variants.filter((v) => v.key !== key));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-sans text-[13px] text-text-muted">{t("productVariantsForm.blurb")}</p>
        <button
          type="button"
          onClick={add}
          disabled={disabled}
          className="shrink-0 inline-flex items-center gap-1 font-sans text-xs font-semibold text-text-dark border border-cream-dark rounded-sm px-3 py-1.5 hover:bg-[var(--color-paper)] disabled:opacity-50"
        >
          <Plus size={14} aria-hidden />
          {t("productVariantsForm.addVariant")}
        </button>
      </div>

      {variants.map((v, idx) => (
        <div
          key={v.key}
          className="rounded-sm p-4 flex flex-col gap-3"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wide">
              {interpolate(t("productVariantsForm.variantNumber"), { n: idx + 1 })}
            </span>
            {variants.length > 1 ? (
              <button
                type="button"
                onClick={() => remove(v.key)}
                disabled={disabled}
                className="p-1 rounded-sm text-[var(--color-danger)] hover:bg-red-50 disabled:opacity-40"
                aria-label={t("productVariantsForm.removeAria")}
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={productFormLabelClass}>
                {t("productVariantsForm.packagingName")} <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                placeholder={t("productVariantsForm.packagingPlaceholder")}
                value={v.name}
                onChange={(e) => update(v.key, { name: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={200}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>{t("productVariantsForm.unit")}</label>
              <input
                type="text"
                placeholder={t("productVariantsForm.unitPlaceholder")}
                value={v.unit}
                onChange={(e) => update(v.key, { unit: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={50}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>
                {t("productVariantsForm.priceMad")} <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={t("productVariantsForm.pricePlaceholder")}
                value={v.price}
                onChange={(e) => update(v.key, { price: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={20}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>{t("productVariantsForm.minOrderUnits")}</label>
              <input
                type="number"
                min={1}
                value={v.minOrderQuantity}
                onChange={(e) => update(v.key, { minOrderQuantity: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>
                {t("productVariantsForm.moqNote")}{" "}
                <span className="text-text-muted/70">{t("productVariantsForm.moqNoteOptional")}</span>
              </label>
              <input
                type="text"
                placeholder={t("productVariantsForm.moqNotePlaceholder")}
                value={v.minOrderNote}
                onChange={(e) => update(v.key, { minOrderNote: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={500}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>{t("productVariantsForm.qtyOnHand")}</label>
              <input
                type="number"
                min={0}
                value={v.quantityOnHand}
                onChange={(e) => update(v.key, { quantityOnHand: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                disabled={disabled}
              />
              <p className="font-sans text-[10px] text-text-muted/80">{t("productVariantsForm.qtyOnHandHint")}</p>
            </div>
            <label className="flex items-center gap-2 font-sans text-sm text-text-dark sm:col-span-2 cursor-pointer">
              <input
                type="checkbox"
                checked={v.inStock}
                onChange={(e) => update(v.key, { inStock: e.target.checked })}
                disabled={disabled}
                className="rounded border-cream-dark"
              />
              {t("productVariantsForm.inStock")}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
