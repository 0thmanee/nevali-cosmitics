"use client";

import React, { useState } from "react";
import { CertificationBanner } from "./certification-banner";
import { CertificationOverview } from "./certification-overview";
import { CertifiedProductsTable } from "./certified-products-table";
import { CertificationDocumentsSection } from "./certification-documents-section";
import { CertificationStandardsGrid } from "./certification-standards-grid";

const SECTIONS = [
  { key: "overview" as const, label: "Overview" },
  { key: "products" as const, label: "Certified Products" },
  { key: "documents" as const, label: "Documents" },
  { key: "standards" as const, label: "Standards" },
];

export type CertificationSection = "overview" | "products" | "documents" | "standards";

export function CertificationView() {
  const [activeSection, setActiveSection] = useState<CertificationSection>("overview");

  return (
    <div className="flex flex-col gap-4">
      <CertificationBanner />
      <div className="flex items-center gap-1 flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key)}
            className="font-sans text-[12px] font-semibold rounded-sm px-4 py-1.5 transition-colors"
            style={
              activeSection === s.key
                ? { background: "#000000", color: "white" }
                : {
                    background: "white",
                    color: "#727272",
                    border: "1px solid #d8d0c4",
                  }
            }
          >
            {s.label}
          </button>
        ))}
      </div>
      {activeSection === "overview" && <CertificationOverview />}
      {activeSection === "products" && <CertifiedProductsTable />}
      {activeSection === "documents" && <CertificationDocumentsSection />}
      {activeSection === "standards" && <CertificationStandardsGrid />}
    </div>
  );
}
