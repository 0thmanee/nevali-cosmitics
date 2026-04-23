"use client";

import { Plus, Trash2 } from "lucide-react";
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
        <p className="font-sans text-[13px] text-[#727272]">
          Packaging / SKUs: each line has its own price, stock, and minimum order. Buyers pick a variant when adding to cart.
        </p>
        <button
          type="button"
          onClick={add}
          disabled={disabled}
          className="shrink-0 inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#000000] border border-[#d8d0c4] rounded-lg px-3 py-1.5 hover:bg-[#ffffff] disabled:opacity-50"
        >
          <Plus size={14} aria-hidden />
          Add variant
        </button>
      </div>

      {variants.map((v, idx) => (
        <div
          key={v.key}
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-[11px] font-bold text-[#727272] uppercase tracking-wide">
              Variant {idx + 1}
            </span>
            {variants.length > 1 ? (
              <button
                type="button"
                onClick={() => remove(v.key)}
                disabled={disabled}
                className="p-1 rounded-lg text-[#f87171] hover:bg-red-50 disabled:opacity-40"
                aria-label="Remove variant"
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={productFormLabelClass}>
                Packaging name <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5 L jug, 1 kg bag"
                value={v.name}
                onChange={(e) => update(v.key, { name: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={200}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>Unit</label>
              <input
                type="text"
                placeholder="item, kg, L, case…"
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
                Price (MAD) <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 120.00"
                value={v.price}
                onChange={(e) => update(v.key, { price: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={20}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>Min. order (units)</label>
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
                MOQ note <span className="text-[#727272]/70">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Min 50 L — full description for buyers"
                value={v.minOrderNote}
                onChange={(e) => update(v.key, { minOrderNote: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={500}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={productFormLabelClass}>Quantity on hand</label>
              <input
                type="number"
                min={0}
                value={v.quantityOnHand}
                onChange={(e) => update(v.key, { quantityOnHand: e.target.value })}
                className={productFormInputBase}
                style={productFormInputStyle}
                disabled={disabled}
              />
              <p className="font-sans text-[10px] text-[#727272]/80">
                Use 0 to skip a hard cap; when &gt; 0, checkout cannot exceed this quantity.
              </p>
            </div>
            <label className="flex items-center gap-2 font-sans text-sm text-[#000000] sm:col-span-2 cursor-pointer">
              <input
                type="checkbox"
                checked={v.inStock}
                onChange={(e) => update(v.key, { inStock: e.target.checked })}
                disabled={disabled}
                className="rounded border-[#d8d0c4]"
              />
              In stock (buyers can add this variant to cart)
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
