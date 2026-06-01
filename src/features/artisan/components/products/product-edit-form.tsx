"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "~/features/profile/config";
import { PRODUCT_STATUS_STYLES } from "../../constants";
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError(null);
		if (!form.name.trim()) {
			setValidationError("Product name is required.");
			return;
		}
		if (!form.category.trim()) {
			setValidationError("Category is required.");
			return;
		}
		for (let i = 0; i < variants.length; i++) {
			const v = variants[i]!;
			if (!v.name.trim()) {
				setValidationError(`Variant ${i + 1}: packaging name is required.`);
				return;
			}
			if (!v.price.trim()) {
				setValidationError(`Variant ${i + 1}: price is required.`);
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
				onSuccess: () => router.push(`/artisan/products/${productId}`),
				onError: (err) =>
					setValidationError(
						err instanceof Error ? err.message : "Failed to update product.",
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
								: "Failed to load product."}
						</p>
						<Link
							className="mt-3 inline-block font-medium font-sans text-sm text-text-dark underline"
							href="/artisan/products"
						>
							← Back to products
						</Link>
					</div>
				) : (
					<p className="font-sans text-sm text-text-muted">Loading product…</p>
				)}
			</div>
		);
	}

	const statusStyle =
		PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;

	return (
		<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							Edit product
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							Update the details below. Status is managed by the admin team.
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted/80">
							Current status:{" "}
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
							View
						</Link>
					</div>
				</div>
			</div>

			{validationError && (
				<div
					className="overflow-hidden rounded-sm px-6 py-4"
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
						Details
					</h2>
				</div>
				<div className="flex flex-col gap-4 p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label className={productFormLabelClass} htmlFor="product-name">
								Product name <span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={isLoading}
								id="product-name"
								maxLength={200}
								onChange={(e) =>
									setForm((p) => ({ ...p, name: e.target.value }))
								}
								placeholder="e.g. Argan Oil Extra Virgin"
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
								Category <span className="text-danger">*</span>
							</label>
							<select
								className={productFormInputBase}
								disabled={isLoading}
								id="product-category"
								onChange={(e) =>
									setForm((p) => ({ ...p, category: e.target.value }))
								}
								style={productFormInputStyle}
								value={form.category}
							>
								<option value="">Select category</option>
								{PRODUCT_CATEGORIES.map((c) => (
									<option key={c.label} value={c.label}>
										{c.label}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								className={productFormLabelClass}
								htmlFor="product-capacity"
							>
								Capacity <span className="text-text-muted/70">(optional)</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={isLoading}
								id="product-capacity"
								maxLength={100}
								onChange={(e) =>
									setForm((p) => ({ ...p, capacity: e.target.value }))
								}
								placeholder="e.g. 500 L/month"
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
								Description{" "}
								<span className="text-text-muted/70">(optional)</span>
							</label>
							<textarea
								className={productFormInputBase}
								disabled={isLoading}
								id="product-description"
								maxLength={20000}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								placeholder="What buyers should know about this product…"
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
										Public homepage hero
									</span>
									<span className="mt-1 block font-sans text-text-muted text-xs leading-relaxed">
										When enabled, visitors see this approved listing as the
										featured product on the site homepage. Only one SKU at a
										time—you can also use{" "}
										<strong className="font-semibold text-text-dark/90">
											Show on homepage
										</strong>{" "}
										from the products list.
									</span>
								</span>
							</label>
						</div>
					) : (
						<p className="mt-4 font-sans text-text-muted text-xs">
							Homepage hero is available only for <strong>approved</strong>{" "}
							products. Current status: {product.status}.
						</p>
					)}

					<div className="mt-2 border-cream-dark border-t pt-6">
						<h3 className="mb-3 font-bold font-serif text-[14px] text-text-dark">
							Variants & pricing
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
					{isLoading ? "Saving…" : "Save changes"}
				</button>
				<Link
					className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href={`/artisan/products/${productId}`}
				>
					Cancel
				</Link>
			</div>
		</form>
	);
}
