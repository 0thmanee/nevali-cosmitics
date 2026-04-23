"use client";

import React from "react";
import Link from "next/link";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { useCertifiedProducts } from "~/features/artisan/hooks/use-products";

export function CertificationBanner() {
  const { data: certifications = [], isLoading: certLoading } = useCertifications();
  const { data: certifiedProducts = [], isLoading: productsLoading } = useCertifiedProducts();

  const approvedCount = certifications.filter((c) => c.status === "APPROVED").length;
  const certifiedCount = certifiedProducts.length;
  const isLoading = certLoading || productsLoading;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#000000" }}>
      <div
        className="h-1"
        style={{
          background: "linear-gradient(90deg, #727272 0%, #727272 50%, #727272 100%)",
        }}
      />
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#7272721A", border: "1px solid #72727233" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
                stroke="#727272"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-serif font-bold text-[18px] text-white leading-tight">
                Partner certificate
              </span>
              <span
                className="font-sans text-[9px] font-bold tracking-wider rounded-full px-2.5 py-1 uppercase"
                style={{
                  background: "#7272721A",
                  color: "#727272",
                  border: "1px solid #72727233",
                }}
              >
                Verified
              </span>
            </div>
            <p className="font-sans text-[12px] text-white/80">
              Your verified partner certificate — the same document you can download from your profile.
            </p>
            {!isLoading && (certifiedCount > 0 || approvedCount > 0) && (
              <p className="font-sans text-[11px] text-white/50 mt-1">
                {certifiedCount} certified product{certifiedCount !== 1 ? "s" : ""} · {approvedCount} approved certification{approvedCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/api/certificate"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors inline-block"
            style={{
              background: "rgba(200,150,60,0.12)",
              color: "#727272",
              border: "1px solid rgba(200,150,60,0.2)",
            }}
          >
            Download PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
