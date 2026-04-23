"use client";

import React, { useRef, useState } from "react";
import { CERTIFICATION_ACCEPT, CERTIFICATION_ALLOWED_MIMES } from "~/app/api/media/schemas/media.schema";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import { uploadMedia } from "~/lib/media";
import { useAddCertification, useRemoveCertification } from "../../hooks/use-certifications";
import { producerProductQueryKey } from "../../hooks/use-products";
import { useQueryClient } from "@tanstack/react-query";

const cardStyle = { background: "white", border: "1px solid #d8d0c4" } as const;
const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  PENDING: { bg: "rgba(201,145,61,0.2)", color: "#E8B84B", border: "1px solid rgba(201,145,61,0.3)" },
  APPROVED: { bg: "rgba(0,0,0,0.8)", color: "#727272", border: "1px solid rgba(200,150,60,0.25)" },
  REJECTED: { bg: "rgba(180,30,30,0.2)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" },
};

const ALLOWED_SET = new Set<string>(CERTIFICATION_ALLOWED_MIMES);

type Props = {
  productId: string;
  productName: string;
  certifications: CertificationRow[];
};

export function ProductCertificationsSection({ productId, productName, certifications }: Props) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const addMutation = useAddCertification();
  const removeMutation = useRemoveCertification();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setFileError(null);
    if (!file) return;
    if (!name.trim()) {
      setFileError("Enter a document name first.");
      return;
    }
    if (!ALLOWED_SET.has(file.type)) {
      setFileError("Only PDF and images (JPEG, PNG, WebP) are allowed.");
      return;
    }
    try {
      const { url } = await uploadMedia(file, "certificationDocuments");
      addMutation.mutate(
        { name: name.trim(), fileUrl: url, productId },
        {
          onSuccess: () => {
            setName("");
            queryClient.invalidateQueries({ queryKey: producerProductQueryKey(productId) });
          },
        }
      );
    } catch {
      addMutation.reset();
    }
  };

  return (
    <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
      <div className="px-6 py-4 border-b border-[#d8d0c4] flex flex-col gap-1">
        <h2 className="font-serif font-bold text-[15px] text-[#000000]">Certifications</h2>
        <p className="font-sans text-[11px] text-[#727272]">
          Add documents (PDF or image) for this product. Each certification is reviewed by admin separately and will show as PENDING until approved.
        </p>
      </div>
      <div className="px-6 py-4 border-b border-[#d8d0c4] flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={CERTIFICATION_ACCEPT}
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="text"
              placeholder="Document name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFileError(null);
              }}
              className="font-sans text-sm rounded-sm px-3 py-2 border border-[#d8d0c4] w-40"
            />
            <button
              type="button"
              onClick={() => {
                setFileError(null);
                inputRef.current?.click();
              }}
              disabled={addMutation.isPending}
              className="font-sans text-sm font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
              style={{ background: "#000000", color: "white" }}
            >
              {addMutation.isPending ? "Uploading…" : "Upload certification"}
            </button>
          </div>
          <p className="font-sans text-[11px] text-[#727272]">PDF or image only (JPEG, PNG, WebP). Max 10 MB.</p>
          {fileError && (
            <p className="font-sans text-[12px] text-[#f87171]" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">
        {certifications.length === 0 ? (
          <p className="font-sans text-sm text-[#727272]">
            No certifications linked to this product yet. Add a document (PDF or image) above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {certifications.map((c) => {
              const style = statusStyles[c.status] ?? statusStyles.PENDING;
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-3"
                  style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
                >
                  <div className="min-w-0">
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans font-semibold text-sm text-[#000000] hover:underline block truncate"
                    >
                      {c.name}
                    </a>
                    {c.status === "REJECTED" && c.rejectionReason && (
                      <p className="font-sans text-[11px] text-[#f87171] mt-0.5">{c.rejectionReason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1 uppercase"
                      style={style}
                    >
                      {c.status}
                    </span>
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[12px] font-medium text-[#000000] hover:underline"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(c.id)}
                      disabled={removeMutation.isPending}
                      className="font-sans text-[12px] font-medium text-[#f87171] hover:underline disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
