"use client";

import React, { useState } from "react";
import { CertificationBanner } from "./certification-banner";
import { CertificationDocumentsSection } from "./certification-documents-section";
import { CertificationOverview } from "./certification-overview";
import { CertificationStandardsGrid } from "./certification-standards-grid";
import { CertifiedProductsTable } from "./certified-products-table";

const SECTIONS = [
	{ key: "overview" as const, label: "Overview" },
	{ key: "products" as const, label: "Certified Products" },
	{ key: "documents" as const, label: "Documents" },
	{ key: "standards" as const, label: "Standards" },
];

export type CertificationSection =
	| "overview"
	| "products"
	| "documents"
	| "standards";

export function CertificationView() {
	const [activeSection, setActiveSection] =
		useState<CertificationSection>("overview");

	return (
		<div className="flex flex-col gap-4">
			<CertificationBanner />
			<div className="flex flex-wrap items-center gap-1">
				{SECTIONS.map((s) => (
					<button
						className="rounded-sm px-4 py-1.5 font-sans font-semibold text-[12px] transition-colors"
						key={s.key}
						onClick={() => setActiveSection(s.key)}
						style={
							activeSection === s.key
								? { background: "var(--color-ink)", color: "white" }
								: {
										background: "white",
										color: "var(--color-text-muted)",
										border: "1px solid var(--color-cream-dark)",
									}
						}
						type="button"
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
