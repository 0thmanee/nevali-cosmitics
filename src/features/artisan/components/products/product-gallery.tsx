"use client";

import React, { useState } from "react";
import type { ProductImageItem } from "~/app/api/products/schemas/products.schema";

const cardStyle = {
  background: "white",
  border: "1px solid var(--color-cream-dark)",
} as const;

type Props = {
  images: ProductImageItem[];
  alt?: string;
};

export function ProductGallery({ images, alt = "Product" }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const main = images[selectedIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div
        className="rounded-sm overflow-hidden flex flex-col items-center justify-center py-16 gap-3"
        style={cardStyle}
      >
        <div
          className="w-24 h-24 rounded-sm flex items-center justify-center"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="text-text-muted/50"
          >
            <rect x="6" y="8" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="14" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 26l8-6 6 4 10-8 4 4v6H6v-0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-sans text-sm text-text-muted">No images yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
      <div className="px-6 py-4 border-b border-cream-dark">
        <h2 className="font-serif font-bold text-[15px] text-text-dark">Gallery</h2>
      </div>
      <div className="p-6 flex flex-col gap-4">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className="w-auto h-48 rounded-sm overflow-hidden shrink-0 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/30"
                style={{
                  border: selectedIndex === i ? "2px solid var(--color-ink)" : "1px solid var(--color-cream-dark)",
                  opacity: selectedIndex === i ? 1 : 0.85,
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
