"use client";

import React from "react";

const standards = [
  { label: "EU Organic Regulation", region: "European Union", code: "EC 2018/848" },
  { label: "Gulf Standard GSO", region: "Gulf Region", code: "GSO 2055-1" },
  { label: "USDA NOP", region: "North America", code: "7 CFR Part 205" },
  { label: "UK Organic", region: "United Kingdom", code: "UK 2018/848" },
];

export function CertificationStandardsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {standards.map((s) => (
        <div
          key={s.code}
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: "white", border: "1px solid #f0e8dc" }}
        >
          <div>
            <p className="font-sans font-semibold text-sm text-[#2a0f05] leading-tight">{s.label}</p>
            <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">{s.region}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: "#F5F0E8" }}>
            <span className="font-sans text-[11px] font-mono text-[#7a4d38]">{s.code}</span>
          </div>
          <p className="font-sans text-[11px] text-[#7a4d38]">
            Reference standard. Upload supporting documents in the Documents tab.
          </p>
        </div>
      ))}
    </div>
  );
}
