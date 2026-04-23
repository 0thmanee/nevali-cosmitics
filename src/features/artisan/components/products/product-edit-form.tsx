"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "../../hooks/use-products";
import { PRODUCT_STATUS_STYLES } from "../../constants";
import { PRODUCT_CATEGORIES } from "~/features/profile/config";
import {
  productFormInputBase,
  productFormInputStyle,
  productFormLabelClass,
} from "./product-form-styles";
import { ProductGalleryEditor } from "./product-gallery-editor";
import { ProductCertificationsSection } from "./product-certifications-section";
import {
  ProductVariantsFormBlock,
  emptyVariantDraft,
  variantDraftFromServer,
  type VariantDraft,
} from "./product-variants-form-block";

const cardStyle = {
  background: "white",
  border: "1px solid var(--color-cream-dark)",
} as const;

type Props = { productId: string };

export function ProductEditForm({ productId }: Props) {
  const router = useRouter();
  const { data: product, isLoading: loadingProduct, isError, error } = useProduct(productId);
  const updateMutation = useUpdateProduct();
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    capacity: "",
  });
  const [featuredOnHome, setFeaturedOnHome] = useState(false);
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariantDraft()]);
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
            minOrderQuantity: Number(v.minOrderQuantity) || 1,
            minOrderNote: v.minOrderNote.trim() || null,
            price: v.price.trim(),
            quantityOnHand: Math.max(0, Number(v.quantityOnHand) || 0),
            inStock: v.inStock,
            sortOrder: i,
          })),
        },
      },
      {
        onSuccess: () => router.push(`/artisan/products/${productId}`),
        onError: (err) =>
          setValidationError(err instanceof Error ? err.message : "Failed to update product."),
      },
    );
  };

  const isLoading = updateMutation.isPending;

  if (loadingProduct || !product) {
    return (
      <div
        className="rounded-sm overflow-hidden flex items-center justify-center py-20"
        style={cardStyle}
      >
        {isError ? (
          <div className="text-center px-6">
            <p className="font-sans text-sm text-[var(--color-danger)]">
              {error instanceof Error ? error.message : "Failed to load product."}
            </p>
            <Link
              href="/artisan/products"
              className="mt-3 inline-block font-sans text-sm font-medium text-text-dark underline"
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

  const statusStyle = PRODUCT_STATUS_STYLES[product.status] ?? PRODUCT_STATUS_STYLES.PENDING;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-text-dark leading-tight">
              Edit product
            </h1>
            <p className="font-sans text-[13px] text-text-muted mt-1">
              Update the details below. Status is managed by the admin team.
            </p>
            <p className="font-sans text-[12px] text-text-muted/80 mt-1">
              Current status:{" "}
              <span
                className="font-sans text-[11px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase"
                style={statusStyle}
              >
                {product.status}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/artisan/products/${productId}`}
              className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors"
              style={{ background: "var(--color-ink)", color: "white" }}
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {validationError && (
        <div
          className="rounded-sm overflow-hidden px-6 py-4"
          style={{ ...cardStyle, background: "color-mix(in srgb, var(--color-danger) 6%, transparent)", borderColor: "color-mix(in srgb, var(--color-danger) 30%, transparent)" }}
        >
          <p className="font-sans text-sm text-[var(--color-danger)]">{validationError}</p>
        </div>
      )}

      <ProductGalleryEditor
        productId={productId}
        images={product.images ?? []}
        variants={product.variants ?? []}
      />

      <ProductCertificationsSection
        productId={productId}
        productName={product.name}
        certifications={product.certifications ?? []}
      />

      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">Details</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="product-name" className={productFormLabelClass}>
                Product name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="e.g. Argan Oil Extra Virgin"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={200}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-category" className={productFormLabelClass}>
                Category <span className="text-[var(--color-danger)]">*</span>
              </label>
              <select
                id="product-category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className={productFormInputBase}
                style={productFormInputStyle}
                disabled={isLoading}
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
              <label htmlFor="product-capacity" className={productFormLabelClass}>
                Capacity <span className="text-text-muted/70">(optional)</span>
              </label>
              <input
                id="product-capacity"
                type="text"
                placeholder="e.g. 500 L/month"
                value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={100}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="product-description" className={productFormLabelClass}>
                Description <span className="text-text-muted/70">(optional)</span>
              </label>
              <textarea
                id="product-description"
                rows={4}
                placeholder="What buyers should know about this product…"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={productFormInputBase}
                style={productFormInputStyle}
                maxLength={20000}
                disabled={isLoading}
              />
            </div>
          </div>

          {product.status === "APPROVED" ? (
            <div
              id="homepage-hero-spotlight"
              className="mt-6 rounded-sm border border-cream-dark bg-[color-mix(in srgb, var(--color-paper) 75%, var(--color-cream))] px-4 py-4 sm:col-span-2"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded border-cream-dark"
                  checked={featuredOnHome}
                  onChange={(e) => setFeaturedOnHome(e.target.checked)}
                  disabled={isLoading}
                />
                <span>
                  <span className="font-sans text-sm font-semibold text-text-dark">Public homepage hero</span>
                  <span className="mt-1 block font-sans text-xs leading-relaxed text-text-muted">
                    When enabled, visitors see this approved listing as the featured product on the site
                    homepage. Only one SKU at a time—you can also use{" "}
                    <strong className="font-semibold text-text-dark/90">Show on homepage</strong> from the
                    products list.
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <p className="mt-4 font-sans text-xs text-text-muted">
              Homepage hero is available only for <strong>approved</strong> products. Current status:{" "}
              {product.status}.
            </p>
          )}

          <div className="mt-2 pt-6 border-t border-cream-dark">
            <h3 className="font-serif font-bold text-[14px] text-text-dark mb-3">Variants & pricing</h3>
            <ProductVariantsFormBlock variants={variants} onChange={setVariants} disabled={isLoading} />
          </div>
        </div>
      </div>

      <div
        className="rounded-sm overflow-hidden shadow-sm px-6 py-5 flex flex-wrap items-center gap-4"
        style={cardStyle}
      >
        <button
          type="submit"
          disabled={isLoading}
          className="font-sans font-semibold text-sm text-white rounded-sm px-6 py-3 transition-colors disabled:opacity-60 min-w-[140px]"
          style={{ background: "var(--color-ink)" }}
        >
          {isLoading ? "Saving…" : "Save changes"}
        </button>
        <Link
          href={`/artisan/products/${productId}`}
          className="font-sans text-sm font-medium text-text-muted hover:text-text-dark transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
