"use client";

import React, { useRef, useState } from "react";
import { CERTIFICATION_ACCEPT, CERTIFICATION_ALLOWED_MIMES } from "~/app/api/media/schemas/media.schema";
import { uploadMedia } from "~/lib/media";
import { useCertifications, useAddCertification, useRemoveCertification } from "../../hooks/use-certifications";
import { useProducts } from "../../hooks/use-products";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";

// ── Shared atoms ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:  { bg: "rgba(201,145,61,0.10)", color: "#727272", dot: "#727272",  label: "Pending review" },
  APPROVED: { bg: "rgba(0,0,0,0.10)",   color: "#16a34a", dot: "#4ade80",  label: "Approved" },
  REJECTED: { bg: "rgba(180,30,30,0.10)",  color: "#dc2626", dot: "#f87171",  label: "Rejected" },
} as const;

const ALLOWED_SET = new Set<string>(CERTIFICATION_ALLOWED_MIMES);

function CertRow({
  cert,
  onRemove,
  removing,
}: {
  cert: CertificationRow;
  onRemove: () => void;
  removing: boolean;
}) {
  const s = STATUS_CONFIG[cert.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white group">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(0,0,0,0.07)" }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 2h6l3 3v9H4V2z" stroke="#000000" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M10 2v3h3" stroke="#000000" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M6 7h4M6 9.5h4M6 12h2" stroke="#000000" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-[13px] text-[#000000] truncate">{cert.name}</p>
        {cert.status === "REJECTED" && cert.rejectionReason && (
          <p className="font-sans text-[11px] text-red-500 mt-0.5 truncate">{cert.rejectionReason}</p>
        )}
      </div>

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
          className="font-sans text-[11px] font-medium text-[#000000] bg-[#F5F7F5] border border-[#d8d0c4] rounded-lg px-2.5 py-1 hover:bg-[#EEF2EE] transition-colors"
        >
          View
        </a>
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="font-sans text-[11px] font-medium text-[#9BB0A0] hover:text-red-500 disabled:opacity-50 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ── Inline upload form ────────────────────────────────────────────────────────

function InlineUploadForm({
  productId,
  onSuccess,
}: {
  productId: string | null;
  onSuccess?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const addMutation = useAddCertification();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setFileError(null);
    if (!file) return;
    if (!name.trim()) { setFileError("Enter a certificate name first."); return; }
    if (!ALLOWED_SET.has(file.type)) { setFileError("Only PDF and images (JPEG, PNG, WebP) are accepted."); return; }
    try {
      const { url } = await uploadMedia(file, "certificationDocuments");
      addMutation.mutate(
        { name: name.trim(), fileUrl: url, productId },
        {
          onSuccess: () => {
            setName("");
            onSuccess?.();
          },
        }
      );
    } catch {
      addMutation.reset();
      setFileError("Upload failed. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3 rounded-xl"
      style={{ background: "rgba(0,0,0,0.04)", border: "1px dashed rgba(0,0,0,0.18)" }}
    >
      <p className="font-sans text-[11px] font-semibold text-[#000000] uppercase tracking-wide">
        New certificate
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <input ref={inputRef} type="file" accept={CERTIFICATION_ACCEPT} onChange={handleFileChange} className="hidden" />
        <input
          type="text"
          placeholder="Certificate name (e.g. ISO 22000, Bio Certificate…)"
          value={name}
          onChange={(e) => { setName(e.target.value); setFileError(null); }}
          className="font-sans text-[13px] rounded-xl px-3.5 py-2 border border-[#d8d0c4] bg-white flex-1 min-w-[200px] focus:outline-none focus:border-[#000000] transition-colors"
        />
        <button
          type="button"
          onClick={() => { setFileError(null); inputRef.current?.click(); }}
          disabled={addMutation.isPending}
          className="font-sans text-[13px] font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60 flex items-center gap-2 shrink-0"
          style={{ background: "#000000", color: "white" }}
        >
          {addMutation.isPending ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.4" strokeOpacity="0.3" />
                <path d="M6.5 1.5A5 5 0 0 1 11.5 6.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 4l3-3 3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 10.5h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Upload file
            </>
          )}
        </button>
      </div>
      <p className="font-sans text-[11px] text-[#727272]">PDF, JPEG, PNG or WebP — max 10 MB</p>
      {fileError && <p className="font-sans text-[12px] text-red-500" role="alert">{fileError}</p>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
      <div className="flex items-center gap-2 mb-0.5">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,0,0,0.10)" }}
        >
          {icon}
        </div>
        <h3 className="font-serif font-bold text-[15px] text-[#000000]">{title}</h3>
        {count !== undefined && count > 0 && (
          <span
            className="font-sans text-[10px] font-semibold rounded-full px-2 py-0.5"
            style={{ background: "rgba(0,0,0,0.10)", color: "#000000" }}
          >
            {count}
          </span>
        )}
      </div>
      <p className="font-sans text-[12px] text-[#727272]">{description}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CertificationDocumentsSection() {
  const { data: certifications = [], isLoading, isError } = useCertifications();
  const { data: products = [] }                           = useProducts();
  const removeMutation                                    = useRemoveCertification();

  // Which product's inline upload form is currently open
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  // Whether the org-level upload form is open
  const [orgFormOpen, setOrgFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl py-12 flex items-center justify-center" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <p className="font-sans text-[13px] text-[#727272]">Loading certifications…</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-xl py-6 px-5" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <p className="font-sans text-[13px] text-red-500">Failed to load certifications.</p>
      </div>
    );
  }

  const globalCerts  = certifications.filter((c) => !c.productId);
  const productCerts = certifications.filter((c) => !!c.productId);

  const certsByProduct = new Map<string, CertificationRow[]>();
  for (const c of productCerts) {
    if (!c.productId) continue;
    if (!certsByProduct.has(c.productId)) certsByProduct.set(c.productId, []);
    certsByProduct.get(c.productId)!.push(c);
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Section 1: Organization Certifications ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <SectionHeader
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1.4 3.5H11L8.3 6.7l1 3.3L6 8.2l-3.3 1.8 1-3.3L1 4.5h3.6L6 1z" stroke="#000000" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          }
          title="Organization Certifications"
          description="ISO, BIO, organic, export licenses and other organization-wide certifications."
          count={globalCerts.length}
        />

        <div className="p-5 flex flex-col gap-3">
          {/* Existing certs */}
          {globalCerts.length > 0 && (
            <div className="flex flex-col gap-2">
              {globalCerts.map((c) => (
                <CertRow
                  key={c.id}
                  cert={c}
                  onRemove={() => removeMutation.mutate(c.id)}
                  removing={removeMutation.isPending}
                />
              ))}
            </div>
          )}

          {/* Add button / inline form */}
          {orgFormOpen ? (
            <InlineUploadForm
              productId={null}
              onSuccess={() => setOrgFormOpen(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setOrgFormOpen(true)}
              className="flex items-center gap-2 font-sans text-[13px] font-semibold rounded-xl px-4 py-2.5 self-start transition-colors"
              style={{ background: "rgba(0,0,0,0.06)", color: "#000000", border: "1px solid rgba(0,0,0,0.14)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add certificate
            </button>
          )}

          {globalCerts.length === 0 && !orgFormOpen && (
            <p className="font-sans text-[12px] text-[#727272]">
              No organization certificates yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Section 2: Product Certifications ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
        <SectionHeader
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="4" width="10" height="7" rx="1.5" stroke="#000000" strokeWidth="1.2" />
              <path d="M4 4V3a2 2 0 0 1 4 0v1" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="7.5" r="1" fill="#000000" />
            </svg>
          }
          title="Product Certifications"
          description="Certifications linked to a specific product — each product can have multiple."
          count={productCerts.length}
        />

        {products.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="font-sans text-[13px] text-[#727272]">
              No products yet. Add products from My Products first.
            </p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-3">
            {products.map((product) => {
              const certs = certsByProduct.get(product.id) ?? [];
              const isOpen = openProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="rounded-xl overflow-hidden flex flex-col gap-0"
                  style={{ border: "1px solid #d8d0c4", background: "#ffffff" }}
                >
                <div className="px-4 py-3.5 flex flex-col gap-3">
                  {/* Product row */}
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-sans font-semibold text-[13px] text-[#000000] truncate">
                        {product.name}
                      </span>
                      <span
                        className="font-sans text-[10px] font-semibold rounded-md px-1.5 py-0.5 shrink-0"
                        style={{ background: "rgba(0,0,0,0.07)", color: "#727272" }}
                      >
                        {product.category}
                      </span>
                      {certs.length > 0 && (
                        <span
                          className="font-sans text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0"
                          style={{ background: "rgba(0,0,0,0.10)", color: "#000000" }}
                        >
                          {certs.length} cert{certs.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenProductId(isOpen ? null : product.id)}
                      className="flex items-center gap-1.5 font-sans text-[12px] font-semibold rounded-xl px-3 py-1.5 shrink-0 transition-colors"
                      style={
                        isOpen
                          ? { background: "rgba(0,0,0,0.10)", color: "#000000" }
                          : { background: "rgba(0,0,0,0.06)", color: "#000000", border: "1px solid rgba(0,0,0,0.14)" }
                      }
                    >
                      {isOpen ? (
                        <>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          Cancel
                        </>
                      ) : (
                        <>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          Add cert
                        </>
                      )}
                    </button>
                  </div>

                  {/* Inline upload form */}
                  {isOpen && (
                    <InlineUploadForm
                      key={product.id}
                      productId={product.id}
                      onSuccess={() => setOpenProductId(null)}
                    />
                  )}
                </div>

                {/* Existing certs — flush bottom of card with a top border */}
                {certs.length > 0 && (
                  <div
                    className="flex flex-col gap-0 border-t"
                    style={{ borderColor: "#d8d0c4" }}
                  >
                    {certs.map((c, i) => (
                      <div
                        key={c.id}
                        style={{ borderTop: i > 0 ? "1px solid #d8d0c4" : "none" }}
                      >
                        <CertRow
                          cert={c}
                          onRemove={() => removeMutation.mutate(c.id)}
                          removing={removeMutation.isPending}
                        />
                      </div>
                    ))}
                  </div>
                )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
