"use client";

import React from "react";

const standards = [
	{
		label: "EU Organic Regulation",
		region: "European Union",
		code: "EC 2018/848",
	},
	{ label: "Gulf Standard GSO", region: "Gulf Region", code: "GSO 2055-1" },
	{ label: "USDA NOP", region: "North America", code: "7 CFR Part 205" },
	{ label: "UK Organic", region: "United Kingdom", code: "UK 2018/848" },
];

export function CertificationStandardsGrid() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{standards.map((s) => (
				<div
					className="flex flex-col gap-3 rounded-sm p-5"
					key={s.code}
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<div>
						<p className="font-sans font-semibold text-sm text-text-dark leading-tight">
							{s.label}
						</p>
						<p className="mt-0.5 font-sans text-[11px] text-text-muted">
							{s.region}
						</p>
					</div>
					<div
						className="rounded-sm px-3 py-2"
						style={{ background: "var(--color-paper)" }}
					>
						<span className="font-mono font-sans text-[11px] text-text-muted">
							{s.code}
						</span>
					</div>
					<p className="font-sans text-[11px] text-text-muted">
						Reference standard. Upload supporting documents in the Documents
						tab.
					</p>
				</div>
			))}
		</div>
	);
}
