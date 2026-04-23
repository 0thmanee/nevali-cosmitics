"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";
import { useAdminProduct, useSetProductStatus } from "../../hooks/use-admin-products";
import { useSetCertificationStatus } from "../../hooks/use-admin-certifications";
import { RejectProductModal } from "./reject-product-modal";
import { ApproveProductModal } from "./approve-product-modal";
import { paymentOptionLabel } from "~/lib/format-price";
import { RejectCertificationModal } from "../certifications/reject-certification-modal";
import { ProductGallery } from "~/features/artisan/components/products/product-gallery";

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  PENDING: { bg: "color-mix(in srgb, var(--color-gold) 20%, transparent)", color: "var(--color-gold)", border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)" },
  APPROVED: { bg: "color-mix(in srgb, var(--color-ink) 80%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)" },
  REJECTED: { bg: "color-mix(in srgb, var(--color-danger-dark) 20%, transparent)", color: "var(--color-danger)", border: "1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)" },
};

const cardStyle = { background: "white", border: "1px solid var(--color-cream-dark)" } as const;

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function AdminProductDetailView() {
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : null;
  const { data: product, isLoading, isError, error } = useAdminProduct(productId);
  const setStatusMutation = useSetProductStatus();
  const setCertStatusMutation = useSetCertificationStatus();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectingCert, setRejectingCert] = useState<CertificationRow | null>(null);

  const handleApproveConfirm = useCallback(
    (paymentOption: ProductPaymentOptionValue) => {
      if (productId) {
        setStatusMutation.mutate(
          { productId, status: "APPROVED", paymentOption },
          { onSuccess: () => setShowApproveModal(false) },
        );
      }
    },
    [productId, setStatusMutation],
  );

  const handleRejectConfirm = useCallback(
    (rejectionReason: string) => {
      if (productId)
        setStatusMutation.mutate(
          {
            productId,
            status: "REJECTED",
            rejectionReason: rejectionReason || undefined,
          },
          { onSuccess: () => setShowRejectModal(false) }
        );
    },
    [productId, setStatusMutation]
  );

  const handleCertApprove = useCallback(
    (certId: string) => {
      setCertStatusMutation.mutate({ certificationId: certId, status: "APPROVED" });
    },
    [setCertStatusMutation]
  );

  const handleCertRejectConfirm = useCallback(
    (rejectionReason: string) => {
      if (!rejectingCert) return;
      setCertStatusMutation.mutate(
        {
          certificationId: rejectingCert.id,
          status: "REJECTED",
          rejectionReason: rejectionReason || undefined,
        },
        { onSuccess: () => setRejectingCert(null) }
      );
    },
    [rejectingCert, setCertStatusMutation]
  );

  if (!productId) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-sm overflow-hidden px-6 py-12 text-center" style={cardStyle}>
          <p className="font-sans text-sm text-[var(--color-danger)]">Invalid product.</p>
          <Link href="/admin/products" className="mt-4 inline-block font-sans text-sm font-medium text-text-dark underline">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-sm overflow-hidden flex items-center justify-center py-20" style={cardStyle}>
          <p className="font-sans text-sm text-text-muted">Loading product…</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-sm overflow-hidden px-6 py-12 text-center" style={cardStyle}>
          <p className="font-sans text-sm text-[var(--color-danger)]">
            {error instanceof Error ? error.message : "Product not found."}
          </p>
          <Link href="/admin/products" className="mt-4 inline-block font-sans text-sm font-medium text-text-dark underline">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  const style = statusStyles[product.status] ?? statusStyles.PENDING;

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-text-dark leading-tight">
              {product.name}
            </h1>
            <p className="font-sans text-[13px] text-text-muted mt-1">{product.category}</p>
            <p className="font-sans text-[12px] text-text-muted mt-1">
              {product.organizationName} · Updated {formatDate(product.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="font-sans text-[11px] font-bold tracking-wide rounded-full px-4 py-1.5 uppercase"
              style={style}
            >
              {product.status}
            </span>
            {product.status === "PENDING" && productId && (
              <>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(true)}
                  disabled={setStatusMutation.isPending}
                  className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
                  style={{ background: "var(--color-ink)", color: "white" }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  disabled={setStatusMutation.isPending}
                  className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
                  style={{
                    background: "color-mix(in srgb, var(--color-danger-dark) 12%, transparent)",
                    color: "var(--color-danger-dark)",
                    border: "1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent)",
                  }}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ProductGallery images={product.images ?? []} alt={product.name} />

      {(product.variants?.length ?? 0) > 0 && (
        <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
          <div className="px-6 py-4 border-b border-cream-dark">
            <h2 className="font-serif font-bold text-[15px] text-text-dark">Variants & pricing</h2>
          </div>
          <ul className="p-6 flex flex-col gap-2">
            {(product.variants ?? []).map((v) => (
              <li
                key={v.id}
                className="font-sans text-sm text-text-dark rounded-sm px-4 py-3 flex flex-wrap justify-between gap-2"
                style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
              >
                <span className="font-semibold">{v.name}</span>
                <span className="text-text-muted">
                  {v.price} MAD · MOQ {v.minOrderQuantity}
                  {v.quantityOnHand > 0 ? ` · Stock ${v.quantityOnHand}` : ""}
                  {!v.inStock ? " · Out of stock" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">Certifications</h2>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">
            The producer adds certifications on the product detail page. Approve or reject each certification here—separately from the product status.
          </p>
        </div>
        <div className="p-6">
          {(product.certifications?.length ?? 0) === 0 ? (
            <p className="font-sans text-sm text-text-muted">
              No certifications for this product yet. The producer can add documents (PDF or image) on their product detail page; they will appear here for review.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {(product.certifications ?? []).map((c: CertificationRow) => {
                const certStyle = statusStyles[c.status] ?? statusStyles.PENDING;
                return (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-3"
                    style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}
                  >
                    <div className="min-w-0">
                      <a
                        href={c.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-semibold text-sm text-text-dark hover:underline block truncate"
                      >
                        {c.name}
                      </a>
                      {c.status === "REJECTED" && c.rejectionReason && (
                        <p className="font-sans text-[11px] text-[var(--color-danger)] mt-0.5">{c.rejectionReason}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1 uppercase"
                        style={certStyle}
                      >
                        {c.status}
                      </span>
                      <a
                        href={c.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[12px] font-medium text-text-dark hover:underline"
                      >
                        View
                      </a>
                      {c.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCertApprove(c.id)}
                            disabled={setCertStatusMutation.isPending}
                            className="font-sans text-[11px] font-semibold rounded-sm px-2.5 py-1.5 transition-colors disabled:opacity-60"
                            style={{ background: "var(--color-ink)", color: "white", border: "1px solid var(--color-ink)" }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingCert(c)}
                            disabled={setCertStatusMutation.isPending}
                            className="font-sans text-[11px] font-semibold rounded-sm px-2.5 py-1.5 transition-colors disabled:opacity-60"
                            style={{ background: "color-mix(in srgb, var(--color-danger-dark) 12%, transparent)", color: "var(--color-danger-dark)", border: "1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent)" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-[15px] text-text-dark">Details</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-sm p-4" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                Minimum order quantity
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">{product.moq ?? "—"}</p>
            </div>
            <div className="rounded-sm p-4" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                Capacity
              </p>
              <p className="font-sans text-[15px] font-semibold text-text-dark">{product.capacity ?? "—"}</p>
            </div>
            {product.status === "APPROVED" && (
              <div className="rounded-sm p-4 sm:col-span-2" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
                <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase mb-1">
                  Checkout payment options
                </p>
                <p className="font-sans text-[15px] font-semibold text-text-dark">
                  {paymentOptionLabel(product.paymentOption)}
                </p>
              </div>
            )}
          </div>
          {product.status === "REJECTED" && product.rejectionReason?.trim() && (
            <div
              className="rounded-sm px-4 py-3 flex flex-col gap-1"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
              }}
            >
              <p className="font-sans text-[11px] font-bold tracking-wide text-[var(--color-danger)] uppercase">
                Rejection reason
              </p>
              <p className="font-sans text-sm text-text-dark">{product.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      <Link
        href="/admin/products"
        className="font-sans text-sm font-medium text-text-muted hover:text-text-dark transition-colors w-fit"
      >
        ← Back to products
      </Link>

      {showApproveModal && (
        <ApproveProductModal
          productName={product.name}
          onConfirm={handleApproveConfirm}
          onCancel={() => setShowApproveModal(false)}
          isSubmitting={setStatusMutation.isPending}
        />
      )}
      {showRejectModal && (
        <RejectProductModal
          productId={product.id}
          productName={product.name}
          onConfirm={handleRejectConfirm}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
      {rejectingCert && (
        <RejectCertificationModal
          certificationName={rejectingCert.name}
          onConfirm={handleCertRejectConfirm}
          onCancel={() => setRejectingCert(null)}
        />
      )}
    </div>
  );
}
