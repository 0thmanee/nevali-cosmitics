"use client";

import Link from "next/link";
import React from "react";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import { useCertifications } from "~/features/artisan/hooks/use-certifications";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type CertificationCardProps = {
	partnerId: string;
	partnerSince: string;
};

function documentStatusLabel(
	status: string,
): "Verified" | "Pending" | "Rejected" {
	switch (status) {
		case "APPROVED":
			return "Verified";
		case "PENDING":
			return "Pending";
		case "REJECTED":
			return "Rejected";
		default:
			return "Pending";
	}
}

export function ProfileSideCards({
	partnerId,
	partnerSince,
}: CertificationCardProps) {
	const { data: certifications = [], isLoading, isError } = useCertifications();
	return (
		<div className="flex flex-col gap-4">
			<div
				className="overflow-hidden rounded-sm"
				style={{ background: "var(--color-ink)" }}
			>
				<div className="border-white/8 border-b px-5 py-4">
					<h3 className="font-bold font-display text-[15px] text-white uppercase tracking-wide">
						Artisan status
					</h3>
					<p className="mt-0.5 font-sans text-[11px] text-white/40">
						{SHOW_MULTI_PRODUCER_EXPERIENCE
							? "nevali verified brand"
							: `${NEVALI_HOUSE_BRAND.legalName} studio profile`}
					</p>
				</div>
				<div className="flex flex-col gap-4 p-5">
					<div className="flex items-center gap-3">
						<div
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
							style={{
								background:
									"color-mix(in srgb, var(--color-gold) 10%, transparent)",
								border:
									"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
							}}
						>
							<svg fill="none" height="16" viewBox="0 0 16 16" width="16">
								<path
									d="M8 1.5l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5L8 1.5z"
									stroke="var(--color-text-muted)"
									strokeLinejoin="round"
									strokeWidth="1.3"
								/>
							</svg>
						</div>
						<div>
							<p className="font-bold font-sans text-sm text-text-muted">
								Active & Certified
							</p>
							<p className="font-sans text-[11px] text-white/40">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? "Registered artisan on the platform"
									: `Registered producer for ${NEVALI_HOUSE_BRAND.legalName}`}
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="font-sans text-[11px] text-white/40">
								Artisan ID
							</span>
							<span className="font-sans font-semibold text-[11px] text-white/80">
								{partnerId}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="font-sans text-[11px] text-white/40">
								Member since
							</span>
							<span className="font-sans font-semibold text-[11px] text-white/80">
								{partnerSince}
							</span>
						</div>
					</div>
					<Link
						className="block w-full rounded-sm py-2 text-center font-sans font-semibold text-[12px] transition-colors hover:opacity-90"
						href="/api/certificate"
						rel="noopener noreferrer"
						style={{
							background:
								"color-mix(in srgb, var(--color-gold) 12%, transparent)",
							color: "var(--color-text-muted)",
							border:
								"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
						}}
						target="_blank"
					>
						Download Certificate
					</Link>
				</div>
			</div>

			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="border-b px-5 py-4"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h3 className="font-bold font-display text-[15px] text-text-dark uppercase tracking-wide">
						Documents
					</h3>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Certification files on record
					</p>
				</div>
				<div className="flex flex-col gap-2 p-5">
					{isLoading && (
						<p className="py-2 font-sans text-[12px] text-text-muted">
							Loading documents…
						</p>
					)}
					{isError && (
						<p className="py-2 font-sans text-[12px] text-[var(--color-danger)]">
							Failed to load documents.
						</p>
					)}
					{!isLoading && !isError && certifications.length === 0 && (
						<p className="py-2 font-sans text-[12px] text-text-muted">
							No documents yet. Upload certifications below or on the
							Certification page.
						</p>
					)}
					{!isLoading &&
						certifications.map((doc: CertificationRow) => {
							const label = documentStatusLabel(doc.status);
							const isVerified = doc.status === "APPROVED";
							const isRejected = doc.status === "REJECTED";
							return (
								<div
									className="flex items-center justify-between gap-3"
									key={doc.id}
								>
									<div className="flex min-w-0 items-center gap-2">
										<svg
											className="shrink-0"
											fill="none"
											height="13"
											viewBox="0 0 13 13"
											width="13"
										>
											<rect
												height="11"
												rx="1.5"
												stroke="var(--color-text-muted)"
												strokeWidth="1.1"
												width="9"
												x="2"
												y="1"
											/>
											<line
												stroke="var(--color-text-muted)"
												strokeLinecap="round"
												strokeWidth="1.1"
												x1="4.5"
												x2="8.5"
												y1="5"
												y2="5"
											/>
											<line
												stroke="var(--color-text-muted)"
												strokeLinecap="round"
												strokeWidth="1.1"
												x1="4.5"
												x2="7"
												y1="7.5"
												y2="7.5"
											/>
										</svg>
										<a
											className="block min-w-0 truncate font-sans text-[12px] text-text-dark hover:underline"
											href={doc.fileUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											{doc.name}
										</a>
									</div>
									<span
										className="shrink-0 rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
										style={
											isVerified
												? {
														background:
															"color-mix(in srgb, var(--color-ink) 85%, transparent)",
														color: "var(--color-text-muted)",
														border:
															"1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
													}
												: isRejected
													? {
															background:
																"color-mix(in srgb, var(--color-danger) 10%, transparent)",
															color: "var(--color-danger)",
															border:
																"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
														}
													: {
															background:
																"color-mix(in srgb, var(--color-gold) 15%, transparent)",
															color: "var(--color-gold)",
															border:
																"1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
														}
										}
									>
										{label}
									</span>
								</div>
							);
						})}
					<Link
						className="mt-1 block w-full rounded-sm py-2 text-center font-medium font-sans text-[12px] transition-colors hover:opacity-90"
						href="/artisan/certification"
						style={{
							background: "var(--color-paper)",
							color: "var(--color-ink)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						+ Upload Document
					</Link>
				</div>
			</div>
		</div>
	);
}
