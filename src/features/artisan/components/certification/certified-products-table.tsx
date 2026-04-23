"use client";

import React from "react";
import Image from "next/image";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";
import type { CertifiedProductListRow } from "~/app/api/products/schemas/products.schema";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:  { bg: "rgba(201,145,61,0.10)", color: "#727272", dot: "#727272",  label: "Pending" },
  APPROVED: { bg: "rgba(0,0,0,0.10)",   color: "#16a34a", dot: "#4ade80",  label: "Approved" },
  REJECTED: { bg: "rgba(180,30,30,0.10)",  color: "#dc2626", dot: "#f87171",  label: "Rejected" },
} as const;

// ── Product icon ──────────────────────────────────────────────────────────────

function ProductThumb({
  imageUrl,
  name,
  seed,
}: {
  imageUrl: string | null;
  name: string;
  seed: string;
}) {
  const src = imageUrl ?? productPlaceholderImageUrl(seed, 192);
  return (
    <div className="relative w-12 h-12 rounded-sm shrink-0 overflow-hidden bg-cream">
      <Image src={src} alt={name} fill className="object-cover" sizes="48px" />
    </div>
  );
}

// ── Cert item ─────────────────────────────────────────────────────────────────

function CertItem({ cert }: { cert: CertifiedProductListRow["certifications"][number] }) {
  const s = STATUS_CONFIG[cert.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
  return (
    <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-sm bg-[#ffffff] border border-[#d8d0c4]">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <path d="M4 2h6l3 3v9H4V2z" stroke="#727272" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M10 2v3h3" stroke="#727272" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6 7h4M6 9.5h4M6 12h2" stroke="#727272" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[13px] font-medium text-[#000000] flex-1 min-w-0 truncate">
        {cert.name}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1 flex items-center gap-1.5"
          style={{ background: s.bg, color: s.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: s.dot }} />
          {s.label}
        </span>
        <a
          href={cert.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] font-medium text-[#000000] bg-white border border-[#d8d0c4] rounded-sm px-2.5 py-1 hover:bg-cream transition-colors"
        >
          View
        </a>
      </div>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: CertifiedProductListRow }) {
  const certs = product.certifications ?? [];
  const approvedCount = certs.filter((c) => c.status === "APPROVED").length;

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
      {/* Product header */}
      <div className="flex items-center gap-3.5 px-5 py-4" style={{ borderBottom: certs.length > 0 ? "1px solid #d8d0c4" : "none" }}>
        <ProductThumb
          imageUrl={product.firstImageUrl}
          name={product.name}
          seed={`${product.id}:${product.category}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif font-bold text-[15px] text-[#000000] truncate">{product.name}</span>
            <span
              className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1 flex items-center gap-1.5 shrink-0"
              style={{ background: "rgba(0,0,0,0.10)", color: "#16a34a" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Approved
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-sans text-[12px] text-[#727272]">{product.category}</span>
            {product.moq && (
              <>
                <span className="text-[#CBD5CC]">·</span>
                <span className="font-sans text-[12px] text-[#727272]">MOQ: {product.moq}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-[22px] font-bold text-[#000000] leading-none">{approvedCount}</p>
          <p className="font-sans text-[10px] text-[#727272] mt-0.5">cert{approvedCount !== 1 ? "s" : ""} approved</p>
        </div>
      </div>

      {/* Certifications list */}
      {certs.length > 0 && (
        <div className="px-5 py-4 flex flex-col gap-2">
          {certs.map((c) => (
            <CertItem key={c.id} cert={c} />
          ))}
        </div>
      )}

      {certs.length === 0 && (
        <div className="px-5 py-4">
          <p className="font-sans text-[12px] text-[#727272]">
            No certifications linked to this product yet. Go to the Documents tab to upload one.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function CertifiedProductsTable() {
  const { data: products, isLoading, error } = useCertifiedProducts();

  if (isLoading) {
    return (
      <div className="rounded-sm py-12 flex items-center justify-center" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <p className="font-sans text-[13px] text-[#727272]">Loading certified products…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-sm py-6 px-5" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <p className="font-sans text-[13px] text-red-500">Failed to load certified products.</p>
      </div>
    );
  }

  const list: CertifiedProductListRow[] = products ?? [];

  if (list.length === 0) {
    return (
      <div className="rounded-sm py-12 flex flex-col items-center justify-center gap-3" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="3" y="14" width="30" height="18" rx="3" stroke="#CBD5CC" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 14v-3a6 6 0 0 1 12 0v3" stroke="#CBD5CC" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="18" cy="22" r="2.5" stroke="#CBD5CC" strokeWidth="1.4" />
        </svg>
        <p className="font-sans text-[13px] text-[#727272] text-center max-w-xs">
          No approved products yet. Once an admin approves your products, they will appear here with their certifications.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {list.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
