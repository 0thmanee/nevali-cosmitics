"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { COSMETICS_CATEGORY_SUGGESTIONS } from "~/features/profile/config";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { useFormDraft } from "../../hooks/use-form-draft";
import { useProduct, useUpdateProduct } from "../../hooks/use-products";
import { ProductCertificationsSection } from "./product-certifications-section";
import {
	productFormInputBase,
	productFormInputStyle,
	productFormLabelClass,
} from "./product-form-styles";
import { ProductGalleryEditor } from "./product-gallery-editor";
import {
	emptyVariantDraft,
	ProductVariantsFormBlock,
	type VariantDraft,
	variantDraftFromServer,
} from "./product-variants-form-block";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

type Props = { productId: string };

export function ProductEditForm({ productId }: Props) {
	const router = useRouter();
	const { t } = useI18n();
	const {
		data: product,
		isLoading: loadingProduct,
		isError,
		error,
	} = useProduct(productId);
	const updateMutation = useUpdateProduct();
	const [form, setForm] = useState({
		name: "",
		category: "",
		description: "",
		capacity: "",
	});
	const [featuredOnHome, setFeaturedOnHome] = useState(false);
	const [variants, setVariants] = useState<VariantDraft[]>([
		emptyVariantDraft(),
	]);
	const [validationError, setValidationError] = useState<string | null>(null);
	const errorRef = useRef<HTMLDivElement>(null);

	// Bring the validation message into view so it isn't missed mid-form.
	useEffect(() => {
		if (validationError) {
			errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [validationError]);

	useEffect(() => {
		if (product) {
			setForm({
				name: product.name,
				category: product.category,
				description: product.description ?? "",
				capacity: product.capacity ?? "",
			});
			setFeaturedOnHome(product.featuredOnHome ?? false);
			setVariants(
				product.variants?.length
					? product.variants.map(variantDraftFromServer)
					: [emptyVariantDraft()],
			);
		}
	}, [product]);

	// Autosave edits (not staged files); only once the product has loaded.
	const stripKey = ({ key: _key, ...rest }: VariantDraft) => rest;
	const draft = useFormDraft({
		storageKey: `nevali:product-draft:edit:${productId}`,
		enabled: !!product,
		current: { form, variants: variants.map(stripKey) },
		base: product
			? {
					form: {
						name: product.name,
						category: product.category,
						description: product.description ?? "",
						capacity: product.capacity ?? "",
					},
					variants: (product.variants?.length
						? product.variants.map(variantDraftFromServer)
						: [emptyVariantDraft()]
					).map(stripKey),
				}
			: {
					form: { name: "", category: "", description: "", capacity: "" },
					variants: [stripKey(emptyVariantDraft())],
				},
		apply: (data) => {
			setForm(data.form);
			setVariants(data.variants.map((v) => ({ ...emptyVariantDraft(), ...v })));
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError(null);
		if (!form.name.trim()) {
			setValidationError(t("producerProducts.productNameRequired"));
			return;
		}
		if (!form.category.trim()) {
			setValidationError(t("producerProducts.categoryRequired"));
			return;
		}
		for (let i = 0; i < variants.length; i++) {
			const v = variants[i]!;
			if (!v.name.trim()) {
				setValidationError(
					t("producerProducts.variantPackagingNameRequired", { n: i + 1 }),
				);
				return;
			}
			if (!v.price.trim()) {
				setValidationError(
					t("producerProducts.variantPriceRequired", { n: i + 1 }),
				);
				return;
			}
		}
		updateMutation.mutate(
			{
				productId,
				data: {
					name: form.name.trim(),
					category: form.category.trim(),
					description: form.description.trim() || null,
					capacity: form.capacity.trim() || undefined,
					...(product?.status === "APPROVED" ? { featuredOnHome } : {}),
					variants: variants.map((v, i) => ({
						id: v.serverId,
						name: v.name.trim(),
						unit: v.unit.trim() || "item",
						sourceName: v.sourceName.trim() || null,
						minOrderQuantity: Number(v.minOrderQuantity) || 1,
						minOrderNote: v.minOrderNote.trim() || null,
						price: v.price.trim(),
						unitCost: v.unitCost.trim() || "0",
						packagingCost: v.packagingCost.trim() || "0",
						handlingCost: v.handlingCost.trim() || "0",
						otherCost: v.otherCost.trim() || "0",
						quantityOnHand: Math.max(0, Number(v.quantityOnHand) || 0),
						inStock: v.inStock,
						sortOrder: i,
					})),
				},
			},
			{
				onSuccess: () => {
					draft.clear();
					router.push(`/artisan/products/${productId}`);
				},
				onError: (err) =>
					setValidationError(
						err instanceof Error
							? err.message
							: t("producerProducts.failedToUpdateProduct"),
					),
			},
		);
	};

	const isLoading = updateMutation.isPending;

	if (loadingProduct || !product) {
		return (
			<div
				className="flex items-center justify-center overflow-hidden rounded-sm py-20"
				style={cardStyle}
			>
				{isError ? (
					<div className="px-6 text-center">
						<p className="font-sans text-danger text-sm">
							{error instanceof Error
								? error.message
								: t("producerProducts.failedToLoadProduct")}
						</p>
						<Link
							className="mt-3 inline-block font-medium font-sans text-sm text-text-dark underline"
							href="/artisan/products"
						>
							← {t("producerProducts.backToProducts")}
						</Link>
					</div>
				) : (
					<p className="font-sans text-sm text-text-muted">
						{t("producerProducts.loadingProduct")}
					</p>
				)}
			</div>
		);
	}

	const statusStyle =
		PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;

	return (
		<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
			{draft.recovered && (
				<div
					className="flex items-start justify-between gap-3 rounded-sm px-4 py-3"
					style={{
						background:
							"color-mix(in srgb, var(--color-gold) 14%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-gold) 40%, transparent)",
					}}
				>
					<div className="min-w-0">
						<p className="font-sans font-semibold text-sm text-text-dark">
							{t("producerProducts.draftRecovered")}
						</p>
						<p className="mt-0.5 font-sans text-[12px] text-text-muted">
							{t("producerProducts.draftRecoveredHint")}
						</p>
					</div>
					<button
						className="shrink-0 font-sans font-semibold text-[12px] text-text-muted underline-offset-2 hover:text-text-dark hover:underline"
						onClick={() => draft.discard()}
						type="button"
					>
						{t("producerProducts.draftDiscard")}
					</button>
				</div>
			)}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							{t("producerProducts.editProduct")}
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							{t("producerProducts.editProductSubtitle")}
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted/80">
							{t("producerProducts.currentStatus")}{" "}
							<span
								className="rounded-full px-2.5 py-0.5 font-bold font-sans text-[11px] uppercase tracking-wide"
								style={statusStyle}
							>
								{product.status}
							</span>
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<Link
							className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors"
							href={`/artisan/products/${productId}`}
							style={{ background: "var(--color-ink)", color: "white" }}
						>
							{t("producerProducts.view")}
						</Link>
					</div>
				</div>
			</div>

			{validationError && (
				<div
					className="overflow-hidden rounded-sm px-6 py-4"
					ref={errorRef}
					style={{
						...cardStyle,
						background:
							"color-mix(in srgb, var(--color-danger) 6%, transparent)",
						borderColor:
							"color-mix(in srgb, var(--color-danger) 30%, transparent)",
					}}
				>
					<p className="font-sans text-danger text-sm">{validationError}</p>
				</div>
			)}

			<ProductGalleryEditor
				images={product.images ?? []}
				productId={productId}
				variants={product.variants ?? []}
			/>

			<ProductCertificationsSection
				certifications={product.certifications ?? []}
				productId={productId}
				productName={product.name}
			/>

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("producerProducts.details")}
					</h2>
				</div>
				<div className="flex flex-col gap-4 p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label className={productFormLabelClass} htmlFor="product-name">
								{t("producerProducts.productName")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={isLoading}
								id="product-name"
								maxLength={200}
								onChange={(e) =>
									setForm((p) => ({ ...p, name: e.target.value }))
								}
								placeholder={t("producerProducts.productNamePlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.name}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								className={productFormLabelClass}
								htmlFor="product-category"
							>
								{t("producerProducts.category")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={isLoading}
								id="product-category"
								list="cosmetics-category-suggestions"
								onChange={(e) =>
									setForm((p) => ({ ...p, category: e.target.value }))
								}
								placeholder={t("producerProducts.categoryPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.category}
							/>
							<datalist id="cosmetics-category-suggestions">
								{COSMETICS_CATEGORY_SUGGESTIONS.map((c) => (
									<option key={c} value={c} />
								))}
							</datalist>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								className={productFormLabelClass}
								htmlFor="product-capacity"
							>
								{t("producerProducts.capacity")}{" "}
								<span className="text-text-muted/70">
									{t("producerProducts.optional")}
								</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={isLoading}
								id="product-capacity"
								maxLength={100}
								onChange={(e) =>
									setForm((p) => ({ ...p, capacity: e.target.value }))
								}
								placeholder={t("producerProducts.capacityPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.capacity}
							/>
						</div>
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label
								className={productFormLabelClass}
								htmlFor="product-description"
							>
								{t("producerProducts.description")}{" "}
								<span className="text-text-muted/70">
									{t("producerProducts.optional")}
								</span>
							</label>
							<textarea
								className={productFormInputBase}
								disabled={isLoading}
								id="product-description"
								maxLength={20000}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								placeholder={t("producerProducts.descriptionPlaceholder")}
								rows={4}
								style={productFormInputStyle}
								value={form.description}
							/>
						</div>
					</div>

					{product.status === "APPROVED" ? (
						<div
							className="srgb, var(--color-paper) 75%, var(--color-cream))] mt-6 rounded-sm border border-cream-dark bg-[color-mix(in px-4 py-4 sm:col-span-2"
							id="homepage-hero-spotlight"
						>
							<label className="flex cursor-pointer items-start gap-3">
								<input
									checked={featuredOnHome}
									className="mt-1 h-4 w-4 shrink-0 rounded border-cream-dark"
									disabled={isLoading}
									onChange={(e) => setFeaturedOnHome(e.target.checked)}
									type="checkbox"
								/>
								<span>
									<span className="font-sans font-semibold text-sm text-text-dark">
										{t("producerProducts.publicHomepageHero")}
									</span>
									<span className="mt-1 block font-sans text-text-muted text-xs leading-relaxed">
										{t("producerProducts.publicHomepageHeroDescPrefix")}{" "}
										<strong className="font-semibold text-text-dark/90">
											{t("producerProducts.showOnHomepage")}
										</strong>{" "}
										{t("producerProducts.publicHomepageHeroDescSuffix")}
									</span>
								</span>
							</label>
						</div>
					) : (
						<p className="mt-4 font-sans text-text-muted text-xs">
							{t("producerProducts.homepageHeroApprovedOnlyPrefix")}{" "}
							<strong>{t("producerProducts.approved")}</strong>{" "}
							{t("producerProducts.homepageHeroApprovedOnlySuffix", {
								status: product.status,
							})}
						</p>
					)}

					<div className="mt-2 border-cream-dark border-t pt-6">
						<h3 className="mb-3 font-bold font-serif text-[14px] text-text-dark">
							{t("producerProducts.variantsAndPricing")}
						</h3>
						<ProductVariantsFormBlock
							disabled={isLoading}
							onChange={setVariants}
							variants={variants}
						/>
					</div>
				</div>
			</div>

			<div
				className="flex flex-wrap items-center gap-4 overflow-hidden rounded-sm px-6 py-5 shadow-sm"
				style={cardStyle}
			>
				<button
					className="min-w-[140px] rounded-sm px-6 py-3 font-sans font-semibold text-sm text-white transition-colors disabled:opacity-60"
					disabled={isLoading}
					style={{ background: "var(--color-ink)" }}
					type="submit"
				>
					{isLoading
						? t("producerProducts.saving")
						: t("producerProducts.saveChanges")}
				</button>
				<Link
					className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href={`/artisan/products/${productId}`}
				>
					{t("producerProducts.cancel")}
				</Link>
			</div>
		</form>
	);
}
