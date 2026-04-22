"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createProduct } from "~/app/api/products/actions";
import { addProductImage } from "~/app/api/products/actions";
import { addCertification } from "~/app/api/certifications/actions";
import { uploadMedia } from "~/lib/media";
import { PRODUCT_CATEGORIES } from "~/features/profile/config";
import { CERTIFICATION_ACCEPT, CERTIFICATION_ALLOWED_MIMES } from "~/app/api/media/schemas/media.schema";
import {
  productFormInputBase,
  productFormInputStyle,
  productFormLabelClass,
} from "./product-form-styles";
import {
  ProductVariantsFormBlock,
  emptyVariantDraft,
  type VariantDraft,
} from "./product-variants-form-block";

const cardStyle = { background: "white", border: "1px solid #f0e8dc" } as const;
const CERT_ALLOWED = new Set<string>(CERTIFICATION_ALLOWED_MIMES);

type StagedImage = { id: string; file: File; preview: string };
type StagedCert = { id: string; name: string; file: File };

export function ProductCreateForm() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", category: "", description: "", capacity: "" });
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariantDraft()]);
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [stagedCerts, setStagedCerts] = useState<StagedCert[]>([]);
  const [certName, setCertName] = useState("");
  const [certError, setCertError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      stagedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages: StagedImage[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));
    setStagedImages((prev) => [...prev, ...newImages]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, []);

  const removeImage = (id: string) => {
    setStagedImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleCertFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setCertError(null);
    if (!file) return;
    if (!certName.trim()) { setCertError("Enter a document name first."); return; }
    if (!CERT_ALLOWED.has(file.type)) { setCertError("Only PDF, JPEG, PNG or WebP allowed."); return; }
    setStagedCerts((prev) => [...prev, { id: crypto.randomUUID(), name: certName.trim(), file }]);
    setCertName("");
  };

  const removeCert = (id: string) => setStagedCerts((prev) => prev.filter((c) => c.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.category.trim()) { setError("Category is required."); return; }
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i]!;
      if (!v.name.trim()) {
        setError(`Variant ${i + 1}: packaging name is required.`);
        return;
      }
      if (!v.price.trim()) {
        setError(`Variant ${i + 1}: price is required.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1 — create product
      setUploadStatus("Creating product…");
      const product = await createProduct({
        name: form.name.trim(),
        category: form.category.trim(),
        capacity: form.capacity.trim() || undefined,
        description: form.description.trim() || null,
        variants: variants.map((v, i) => ({
          name: v.name.trim(),
          unit: v.unit.trim() || "item",
          minOrderQuantity: Number(v.minOrderQuantity) || 1,
          minOrderNote: v.minOrderNote.trim() || null,
          price: v.price.trim(),
          quantityOnHand: Math.max(0, Number(v.quantityOnHand) || 0),
          inStock: v.inStock,
          sortOrder: i,
        })),
      });
      const productId = product.id;

      // 2 — upload images in parallel
      if (stagedImages.length > 0) {
        setUploadStatus(`Uploading ${stagedImages.length} image${stagedImages.length > 1 ? "s" : ""}…`);
        await Promise.all(
          stagedImages.map(async (img) => {
            const { url } = await uploadMedia(img.file, "productImages");
            await addProductImage(productId, url);
          })
        );
      }

      // 3 — upload certifications in parallel
      if (stagedCerts.length > 0) {
        setUploadStatus(`Uploading ${stagedCerts.length} certification${stagedCerts.length > 1 ? "s" : ""}…`);
        await Promise.all(
          stagedCerts.map(async (cert) => {
            const { url } = await uploadMedia(cert.file, "certificationDocuments");
            await addCertification({ name: cert.name, fileUrl: url, productId });
          })
        );
      }

      router.push("/artisan/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadStatus(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header card */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-[#2a0f05] leading-tight">Add new product</h1>
            <p className="font-sans text-[13px] text-[#7a4d38] mt-1">
              Fill in the details, add images and certifications, then submit for review.
            </p>
            <p className="font-sans text-[12px] text-[#7a4d38]/80 mt-1">
              Products are reviewed by the admin team. You'll be notified once approved.
            </p>
          </div>
          <span
            className="font-sans text-[11px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase shrink-0 h-fit"
            style={{ background: "rgba(201,145,61,0.2)", color: "#E8B84B", border: "1px solid rgba(201,145,61,0.3)" }}
          >
            PENDING
          </span>
        </div>
      </div>

      {error && (
        <div
          className="rounded-2xl px-6 py-4"
          style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.3)" }}
        >
          <p className="font-sans text-sm text-[#f87171]">{error}</p>
        </div>
      )}

      {/* Details */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#f0e8dc]">
          <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="product-name" className={productFormLabelClass}>
                Product name <span className="text-[#f87171]">*</span>
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
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-category" className={productFormLabelClass}>
                Category <span className="text-[#f87171]">*</span>
              </label>
              <select
                id="product-category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className={productFormInputBase}
                style={productFormInputStyle}
                disabled={submitting}
              >
                <option value="">Select category</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-capacity" className={productFormLabelClass}>
                Capacity <span className="text-[#7a4d38]/70">(optional)</span>
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
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="product-description" className={productFormLabelClass}>
                Description <span className="text-[#7a4d38]/70">(optional)</span>
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
                disabled={submitting}
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#f0e8dc]">
            <h3 className="font-serif font-bold text-[14px] text-[#2a0f05] mb-3">Variants & pricing</h3>
            <ProductVariantsFormBlock variants={variants} onChange={setVariants} disabled={submitting} />
          </div>
        </div>
      </div>

      {/* Product images */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#f0e8dc] flex items-center justify-between gap-3">
          <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Product images</h2>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleImageFiles(e.target.files)}
            disabled={submitting}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={submitting}
            className="font-sans text-sm font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
            style={{ background: "#1a0500", color: "white" }}
          >
            Add image
          </button>
        </div>
        <div className="p-6">
          {stagedImages.length === 0 ? (
            <p className="font-sans text-sm text-[#7a4d38]">
              No images yet. Click "Add image" to upload (JPEG, PNG or WebP).
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {stagedImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-xl overflow-hidden shrink-0"
                  style={{ width: 120, height: 120, border: "1px solid #f0e8dc" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    disabled={submitting}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                    style={{ background: "rgba(0,0,0,0.65)" }}
                  >
                    <X size={12} color="white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#f0e8dc]">
          <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Certifications</h2>
          <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">
            Add product-level certification documents (PDF or image). Each will be submitted for admin review.
          </p>
        </div>
        <div className="px-6 py-4 border-b border-[#f0e8dc]">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Document name"
              value={certName}
              onChange={(e) => { setCertName(e.target.value); setCertError(null); }}
              disabled={submitting}
              className="font-sans text-sm rounded-xl px-3 py-2 border border-[#f0e8dc] w-44 disabled:opacity-60"
              style={{ background: "#FAFAF8" }}
            />
            <input
              ref={certInputRef}
              type="file"
              accept={CERTIFICATION_ACCEPT}
              className="hidden"
              onChange={handleCertFile}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => { setCertError(null); certInputRef.current?.click(); }}
              disabled={submitting}
              className="font-sans text-sm font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
              style={{ background: "#1a0500", color: "white" }}
            >
              Upload certification
            </button>
          </div>
          <p className="font-sans text-[11px] text-[#7a4d38] mt-1.5">PDF or image only (JPEG, PNG, WebP). Max 10 MB.</p>
          {certError && <p className="font-sans text-[12px] text-[#f87171] mt-1" role="alert">{certError}</p>}
        </div>
        <div className="p-6">
          {stagedCerts.length === 0 ? (
            <p className="font-sans text-sm text-[#7a4d38]">No certifications added yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stagedCerts.map((cert) => (
                <li
                  key={cert.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#F5F0E8", border: "1px solid #f0e8dc" }}
                >
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-sm text-[#2a0f05] truncate">{cert.name}</p>
                    <p className="font-sans text-[11px] text-[#7a4d38] truncate">{cert.file.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCert(cert.id)}
                    disabled={submitting}
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors disabled:opacity-60"
                    style={{ background: "rgba(248,113,113,0.12)" }}
                  >
                    <X size={12} color="#f87171" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm px-6 py-5 flex flex-wrap items-center gap-4"
        style={cardStyle}
      >
        <button
          type="submit"
          disabled={submitting}
          className="font-sans font-semibold text-sm text-white rounded-xl px-6 py-3 transition-colors disabled:opacity-60 min-w-[160px]"
          style={{ background: "#1a0500" }}
        >
          {uploadStatus ?? "Create product"}
        </button>
        <Link
          href="/artisan/products"
          className="font-sans text-sm font-medium text-[#7a4d38] hover:text-[#2a0f05] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
