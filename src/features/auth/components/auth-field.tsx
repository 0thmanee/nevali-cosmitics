"use client";

import type React from "react";

export function AuthField({
	label,
	children,
	error,
}: {
	label: string;
	children: React.ReactNode;
	error?: string;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.14em]">
				{label}
			</label>
			{children}
			{error && (
				<p className="mt-0.5 font-sans text-[11px] text-[var(--color-danger)]">
					{error}
				</p>
			)}
		</div>
	);
}
