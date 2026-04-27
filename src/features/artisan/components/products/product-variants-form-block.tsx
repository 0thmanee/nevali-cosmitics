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
  sourceName: string;
  minOrderQuantity: string;
  minOrderNote: string;
  price: string;
  unitCost: string;
  packagingCost: string;
  handlingCost: string;
  otherCost: string;
  quantityOnHand: string;
  inStock: boolean;
};

export function emptyVariantDraft(): VariantDraft {
  return {
    key: newKey(),
    name: "",
    unit: "item",
    sourceName: "",
    minOrderQuantity: "1",
    minOrderNote: "",
    price: "",
    unitCost: "0",
    packagingCost: "0",
    handlingCost: "0",
    otherCost: "0",
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
    sourceName: v.sourceName ?? "",
    minOrderQuantity: String(v.minOrderQuantity),
    minOrderNote: v.minOrderNote ?? "",
    price: v.price,
    unitCost: v.unitCost,
    packagingCost: v.packagingCost,
    handlingCost: v.handlingCost,
    otherCost: v.otherCost,
    quantityOnHand: String(v.quantityOnHand),
    inStock: v.inStock,
  };
}

function num(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
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
          className="shrink-0 inline-flex items-center gap-1 font-sans text-xs font-semibold text-text-dark border border-cream-dark rounded-sm px-3 py-1.5 hover:bg-paper disabled:opacity-50"
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
                className="p-1 rounded-sm text-danger hover:bg-red-50 disabled:opacity-40"
                aria-label={t("productVariantsForm.removeAria")}
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={productFormLabelClass}>
                {t("productVariantsForm.packagingName")} <span className="text-danger">*</span>
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
                {t("productVariantsForm.sourceName")}{" "}
                <span className="text-text-muted/70">{t("productVariantsForm.moqNoteOptional")}</span>
              </label>
              <input
                type="text"
                placeholder={t("productVariantsForm.sourcePlaceholder")}
                value={v.sourceName}
                onChange={(e) => update(v.key, { sourceName: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={200}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>
                {t("productVariantsForm.priceMad")} <span className="text-danger">*</span>
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
            <div className="sm:col-span-2 rounded-sm border border-cream-dark bg-white px-3 py-3">
              <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wide text-text-muted">
                {t("productVariantsForm.internalCosts")}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={productFormLabelClass}>{t("productVariantsForm.unitCost")}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={v.unitCost}
                    onChange={(e) => update(v.key, { unitCost: e.target.value })}
                    className={productFormInputBase}
                    style={productFormInputStyle}
                    disabled={disabled}
                    maxLength={20}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={productFormLabelClass}>{t("productVariantsForm.packagingCost")}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={v.packagingCost}
                    onChange={(e) => update(v.key, { packagingCost: e.target.value })}
                    className={productFormInputBase}
                    style={productFormInputStyle}
                    disabled={disabled}
                    maxLength={20}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={productFormLabelClass}>{t("productVariantsForm.handlingCost")}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={v.handlingCost}
                    onChange={(e) => update(v.key, { handlingCost: e.target.value })}
                    className={productFormInputBase}
                    style={productFormInputStyle}
                    disabled={disabled}
                    maxLength={20}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={productFormLabelClass}>{t("productVariantsForm.otherCost")}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={v.otherCost}
                    onChange={(e) => update(v.key, { otherCost: e.target.value })}
                    className={productFormInputBase}
                    style={productFormInputStyle}
                    disabled={disabled}
                    maxLength={20}
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(() => {
                  const cogs = num(v.unitCost) + num(v.packagingCost) + num(v.handlingCost) + num(v.otherCost);
                  const price = num(v.price);
                  const netPerItem = price - cogs;
                  const stock = Math.max(0, Number(v.quantityOnHand) || 0);
                  const potential = netPerItem * stock;
                  return (
                    <>
                      <p className="font-sans text-[12px] text-text-muted">
                        {t("productVariantsForm.cogsPerItem")}:{" "}
                        <span className="font-semibold text-text-dark">{cogs.toFixed(2)} MAD</span>
                      </p>
                      <p className="font-sans text-[12px] text-text-muted">
                        {t("productVariantsForm.netPerItem")}:{" "}
                        <span className="font-semibold text-text-dark">{netPerItem.toFixed(2)} MAD</span>
                      </p>
                      <p className="font-sans text-[12px] text-text-muted">
                        {t("productVariantsForm.potentialNet")}:{" "}
                        <span className="font-semibold text-text-dark">{potential.toFixed(2)} MAD</span>
                      </p>
                    </>
                  );
                })()}
              </div>
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
