"use client";

import React, { useRef } from "react";
import { uploadMedia } from "~/lib/media";
import { useAddProductImage, useRemoveProductImage, useSetProductImageVariant } from "../../hooks/use-products";
import type { ProductImageItem, ProductVariantRow } from "~/app/api/products/schemas/products.schema";

const cardStyle = {
  background: "white",
  border: "1px solid var(--color-cream-dark)",
} as const;

type Props = {
  productId: string;
  images: ProductImageItem[];
  variants: ProductVariantRow[];
};

export function ProductGalleryEditor({ productId, images, variants }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const addMutation = useAddProductImage();
  const removeMutation = useRemoveProductImage();
  const variantMutation = useSetProductImageVariant();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const { url } = await uploadMedia(file, "productImages");
      addMutation.mutate({ productId, url });
    } catch {
      addMutation.reset();
    }
  };

  const handleRemove = (imageId: string) => {
    removeMutation.mutate({ productId, imageId });
  };

  const variantOptions = [
    { value: "", label: "All variants (default)" },
    ...variants.map((v) => ({ value: v.id, label: v.name })),
  ];

  return (
    <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
      <div className="px-6 py-4 border-b border-cream-dark flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif font-bold text-[15px] text-text-dark">Product images</h2>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={addMutation.isPending}
          className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
          style={{ background: "var(--color-ink)", color: "white" }}
        >
          {addMutation.isPending ? "Uploading…" : "Add image"}
        </button>
      </div>
      <div className="p-6">
        {images.length === 0 && !addMutation.isPending ? (
          <p className="font-sans text-sm text-text-muted">
            No images yet. Click &quot;Add image&quot; to upload (JPEG, PNG or WebP, max 5MB).
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {variants.length > 0 ? (
              <p className="font-sans text-[12px] text-text-muted">
                Optionally link each image to a variant so the storefront can highlight the right packaging.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex flex-col gap-2"
                  style={{ width: 200, maxWidth: "100%" }}
                >
                  <div
                    className="relative group rounded-sm overflow-hidden"
                    style={{ width: "100%", height: 120, border: "1px solid var(--color-cream-dark)" }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemove(img.id)}
                      disabled={removeMutation.isPending}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity font-sans text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                  {variants.length > 0 ? (
                    <label className="flex flex-col gap-1 font-sans text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                      Show for variant
                      <select
                        value={img.variantId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          variantMutation.mutate({
                            productId,
                            imageId: img.id,
                            variantId: v === "" ? null : v,
                          });
                        }}
                        disabled={variantMutation.isPending}
                        className="font-sans text-[11px] font-medium normal-case tracking-normal rounded-sm border border-cream-dark px-2 py-1.5 text-text-dark bg-white"
                      >
                        {variantOptions.map((o) => (
                          <option key={o.value || "all"} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
