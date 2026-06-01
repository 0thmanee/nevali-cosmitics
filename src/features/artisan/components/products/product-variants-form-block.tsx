"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ProductVariantRow } from "~/app/api/products/schemas/products.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";
import {
	productFormInputBase,
	productFormInputStyle,
	productFormLabelClass,
} from "./product-form-styles";

function newKey(): string {
	return (
		globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random()}`
	);
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

export function ProductVariantsFormBlock({
	variants,
	onChange,
	disabled,
}: Props) {
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
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p className="font-sans text-[13px] text-text-muted">
					{t("productVariantsForm.blurb")}
				</p>
				<button
					className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-cream-dark px-3 py-1.5 font-sans font-semibold text-text-dark text-xs hover:bg-paper disabled:opacity-50"
					disabled={disabled}
					onClick={add}
					type="button"
				>
					<Plus aria-hidden size={14} />
					{t("productVariantsForm.addVariant")}
				</button>
			</div>

			{variants.map((v, idx) => (
				<div
					className="flex flex-col gap-3 rounded-sm p-4"
					key={v.key}
					style={{
						background: "var(--color-paper)",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<div className="flex items-center justify-between gap-2">
						<span className="font-bold font-sans text-[11px] text-text-muted uppercase tracking-wide">
							{interpolate(t("productVariantsForm.variantNumber"), {
								n: idx + 1,
							})}
						</span>
						{variants.length > 1 ? (
							<button
								aria-label={t("productVariantsForm.removeAria")}
								className="rounded-sm p-1 text-danger hover:bg-red-50 disabled:opacity-40"
								disabled={disabled}
								onClick={() => remove(v.key)}
								type="button"
							>
								<Trash2 size={16} />
							</button>
						) : null}
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.packagingName")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								maxLength={200}
								onChange={(e) => update(v.key, { name: e.target.value })}
								placeholder={t("productVariantsForm.packagingPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={v.name}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.unit")}
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								maxLength={50}
								onChange={(e) => update(v.key, { unit: e.target.value })}
								placeholder={t("productVariantsForm.unitPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={v.unit}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.sourceName")}{" "}
								<span className="text-text-muted/70">
									{t("productVariantsForm.moqNoteOptional")}
								</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								maxLength={200}
								onChange={(e) => update(v.key, { sourceName: e.target.value })}
								placeholder={t("productVariantsForm.sourcePlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={v.sourceName}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.priceMad")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								inputMode="decimal"
								maxLength={20}
								onChange={(e) => update(v.key, { price: e.target.value })}
								placeholder={t("productVariantsForm.pricePlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={v.price}
							/>
						</div>
						<div className="rounded-sm border border-cream-dark bg-white px-3 py-3 sm:col-span-2">
							<p className="mb-2 font-bold font-sans text-[10px] text-text-muted uppercase tracking-wide">
								{t("productVariantsForm.internalCosts")}
							</p>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<label className={productFormLabelClass}>
										{t("productVariantsForm.unitCost")}
									</label>
									<input
										className={productFormInputBase}
										disabled={disabled}
										inputMode="decimal"
										maxLength={20}
										onChange={(e) =>
											update(v.key, { unitCost: e.target.value })
										}
										style={productFormInputStyle}
										type="text"
										value={v.unitCost}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className={productFormLabelClass}>
										{t("productVariantsForm.packagingCost")}
									</label>
									<input
										className={productFormInputBase}
										disabled={disabled}
										inputMode="decimal"
										maxLength={20}
										onChange={(e) =>
											update(v.key, { packagingCost: e.target.value })
										}
										style={productFormInputStyle}
										type="text"
										value={v.packagingCost}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className={productFormLabelClass}>
										{t("productVariantsForm.handlingCost")}
									</label>
									<input
										className={productFormInputBase}
										disabled={disabled}
										inputMode="decimal"
										maxLength={20}
										onChange={(e) =>
											update(v.key, { handlingCost: e.target.value })
										}
										style={productFormInputStyle}
										type="text"
										value={v.handlingCost}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className={productFormLabelClass}>
										{t("productVariantsForm.otherCost")}
									</label>
									<input
										className={productFormInputBase}
										disabled={disabled}
										inputMode="decimal"
										maxLength={20}
										onChange={(e) =>
											update(v.key, { otherCost: e.target.value })
										}
										style={productFormInputStyle}
										type="text"
										value={v.otherCost}
									/>
								</div>
							</div>
							<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
								{(() => {
									const cogs =
										num(v.unitCost) +
										num(v.packagingCost) +
										num(v.handlingCost) +
										num(v.otherCost);
									const price = num(v.price);
									const netPerItem = price - cogs;
									const stock = Math.max(0, Number(v.quantityOnHand) || 0);
									const potential = netPerItem * stock;
									return (
										<>
											<p className="font-sans text-[12px] text-text-muted">
												{t("productVariantsForm.cogsPerItem")}:{" "}
												<span className="font-semibold text-text-dark">
													{cogs.toFixed(2)} MAD
												</span>
											</p>
											<p className="font-sans text-[12px] text-text-muted">
												{t("productVariantsForm.netPerItem")}:{" "}
												<span className="font-semibold text-text-dark">
													{netPerItem.toFixed(2)} MAD
												</span>
											</p>
											<p className="font-sans text-[12px] text-text-muted">
												{t("productVariantsForm.potentialNet")}:{" "}
												<span className="font-semibold text-text-dark">
													{potential.toFixed(2)} MAD
												</span>
											</p>
										</>
									);
								})()}
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.minOrderUnits")}
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								min={1}
								onChange={(e) =>
									update(v.key, { minOrderQuantity: e.target.value })
								}
								style={productFormInputStyle}
								type="number"
								value={v.minOrderQuantity}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.moqNote")}{" "}
								<span className="text-text-muted/70">
									{t("productVariantsForm.moqNoteOptional")}
								</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								maxLength={500}
								onChange={(e) =>
									update(v.key, { minOrderNote: e.target.value })
								}
								placeholder={t("productVariantsForm.moqNotePlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={v.minOrderNote}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className={productFormLabelClass}>
								{t("productVariantsForm.qtyOnHand")}
							</label>
							<input
								className={productFormInputBase}
								disabled={disabled}
								min={0}
								onChange={(e) =>
									update(v.key, { quantityOnHand: e.target.value })
								}
								style={productFormInputStyle}
								type="number"
								value={v.quantityOnHand}
							/>
							<p className="font-sans text-[10px] text-text-muted/80">
								{t("productVariantsForm.qtyOnHandHint")}
							</p>
						</div>
						<label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-text-dark sm:col-span-2">
							<input
								checked={v.inStock}
								className="rounded border-cream-dark"
								disabled={disabled}
								onChange={(e) => update(v.key, { inStock: e.target.checked })}
								type="checkbox"
							/>
							{t("productVariantsForm.inStock")}
						</label>
					</div>
				</div>
			))}
		</div>
	);
}
