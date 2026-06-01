"use client";

import type React from "react";
import { useRef, useState } from "react";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import {
	CERTIFICATION_ACCEPT,
	CERTIFICATION_ALLOWED_MIMES,
} from "~/app/api/media/schemas/media.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { uploadMedia } from "~/lib/media";
import {
	useAddCertification,
	useCertifications,
	useRemoveCertification,
} from "../../hooks/use-certifications";
import { useProducts } from "../../hooks/use-products";

// ── Shared atoms ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
	PENDING: {
		bg: "color-mix(in srgb, var(--color-gold) 10%, transparent)",
		color: "var(--color-text-muted)",
		dot: "var(--color-text-muted)",
		labelKey: "producerProfileCert.statusPendingReview",
	},
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-ink) 10%, transparent)",
		color: "var(--color-success)",
		dot: "var(--color-success-light)",
		labelKey: "producerProfileCert.statusApproved",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 10%, transparent)",
		color: "var(--color-danger-dark)",
		dot: "var(--color-danger)",
		labelKey: "producerProfileCert.statusRejected",
	},
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
	const { t } = useI18n();
	const s =
		STATUS_CONFIG[cert.status as keyof typeof STATUS_CONFIG] ??
		STATUS_CONFIG.PENDING;
	return (
		<div className="group flex items-center gap-3 bg-white px-4 py-3">
			<div
				className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
				style={{
					background: "color-mix(in srgb, var(--color-ink) 7%, transparent)",
				}}
			>
				<svg fill="none" height="14" viewBox="0 0 16 16" width="14">
					<path
						d="M4 2h6l3 3v9H4V2z"
						stroke="var(--color-ink)"
						strokeLinejoin="round"
						strokeWidth="1.3"
					/>
					<path
						d="M10 2v3h3"
						stroke="var(--color-ink)"
						strokeLinejoin="round"
						strokeWidth="1.3"
					/>
					<path
						d="M6 7h4M6 9.5h4M6 12h2"
						stroke="var(--color-ink)"
						strokeLinecap="round"
						strokeWidth="1.1"
					/>
				</svg>
			</div>

			<div className="min-w-0 flex-1">
				<p className="truncate font-sans font-semibold text-[13px] text-text-dark">
					{cert.name}
				</p>
				{cert.status === "REJECTED" && cert.rejectionReason && (
					<p className="mt-0.5 truncate font-sans text-[11px] text-red-500">
						{cert.rejectionReason}
					</p>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<span
					className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold font-sans text-[10px] tracking-wide"
					style={{ background: s.bg, color: s.color }}
				>
					<span
						className="inline-block h-1.5 w-1.5 rounded-full"
						style={{ background: s.dot }}
					/>
					{t(s.labelKey)}
				</span>
				<a
					className="srgb, var(--color-paper) 70%, var(--color-cream-dark))] srgb, var(--color-paper) 55%, var(--color-cream-dark))] rounded-sm border border-cream-dark bg-[color-mix(in px-2.5 py-1 font-medium font-sans text-[11px] text-text-dark transition-colors hover:bg-[color-mix(in"
					href={cert.fileUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					{t("producerProfileCert.view")}
				</a>
				<button
					className="font-medium font-sans text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-red-500 disabled:opacity-50"
					disabled={removing}
					onClick={onRemove}
					type="button"
				>
					{t("producerProfileCert.remove")}
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
	const { t } = useI18n();
	const inputRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState("");
	const [fileError, setFileError] = useState<string | null>(null);
	const addMutation = useAddCertification();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		setFileError(null);
		if (!file) return;
		if (!name.trim()) {
			setFileError(t("producerProfileCert.errorEnterCertName"));
			return;
		}
		if (!ALLOWED_SET.has(file.type)) {
			setFileError(t("producerProfileCert.errorFileType"));
			return;
		}
		try {
			const { url } = await uploadMedia(file, "certificationDocuments");
			addMutation.mutate(
				{ name: name.trim(), fileUrl: url, productId },
				{
					onSuccess: () => {
						setName("");
						onSuccess?.();
					},
				},
			);
		} catch {
			addMutation.reset();
			setFileError(t("producerProfileCert.errorUploadFailed"));
		}
	};

	return (
		<div
			className="flex flex-col gap-2 rounded-sm px-4 py-3"
			style={{
				background: "color-mix(in srgb, var(--color-ink) 4%, transparent)",
				border:
					"1px dashed color-mix(in srgb, var(--color-ink) 18%, transparent)",
			}}
		>
			<p className="font-sans font-semibold text-[11px] text-text-dark uppercase tracking-wide">
				{t("producerProfileCert.newCertificate")}
			</p>
			<div className="flex flex-wrap items-center gap-2">
				<input
					accept={CERTIFICATION_ACCEPT}
					className="hidden"
					onChange={handleFileChange}
					ref={inputRef}
					type="file"
				/>
				<input
					className="min-w-[200px] flex-1 rounded-sm border border-cream-dark bg-white px-3.5 py-2 font-sans text-[13px] transition-colors focus:border-[var(--color-ink)] focus:outline-none"
					onChange={(e) => {
						setName(e.target.value);
						setFileError(null);
					}}
					placeholder={t("producerProfileCert.certNamePlaceholder")}
					type="text"
					value={name}
				/>
				<button
					className="flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 font-sans font-semibold text-[13px] transition-colors disabled:opacity-60"
					disabled={addMutation.isPending}
					onClick={() => {
						setFileError(null);
						inputRef.current?.click();
					}}
					style={{ background: "var(--color-ink)", color: "white" }}
					type="button"
				>
					{addMutation.isPending ? (
						<>
							<svg
								className="animate-spin"
								fill="none"
								height="13"
								viewBox="0 0 13 13"
								width="13"
							>
								<circle
									cx="6.5"
									cy="6.5"
									r="5"
									stroke="white"
									strokeOpacity="0.3"
									strokeWidth="1.4"
								/>
								<path
									d="M6.5 1.5A5 5 0 0 1 11.5 6.5"
									stroke="white"
									strokeLinecap="round"
									strokeWidth="1.4"
								/>
							</svg>
							{t("producerProfileCert.uploading")}
						</>
					) : (
						<>
							<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
								<path
									d="M6 1v7M3 4l3-3 3 3"
									stroke="white"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.4"
								/>
								<path
									d="M1 10.5h10"
									stroke="white"
									strokeLinecap="round"
									strokeWidth="1.4"
								/>
							</svg>
							{t("producerProfileCert.uploadFile")}
						</>
					)}
				</button>
			</div>
			<p className="font-sans text-[11px] text-text-muted">
				{t("producerProfileCert.fileFormatHint")}
			</p>
			{fileError && (
				<p className="font-sans text-[12px] text-red-500" role="alert">
					{fileError}
				</p>
			)}
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
		<div
			className="border-b px-5 py-4"
			style={{ borderColor: "var(--color-cream-dark)" }}
		>
			<div className="mb-0.5 flex items-center gap-2">
				<div
					className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm"
					style={{
						background: "color-mix(in srgb, var(--color-ink) 10%, transparent)",
					}}
				>
					{icon}
				</div>
				<h3 className="font-bold font-serif text-[15px] text-text-dark">
					{title}
				</h3>
				{count !== undefined && count > 0 && (
					<span
						className="rounded-full px-2 py-0.5 font-sans font-semibold text-[10px]"
						style={{
							background:
								"color-mix(in srgb, var(--color-ink) 10%, transparent)",
							color: "var(--color-ink)",
						}}
					>
						{count}
					</span>
				)}
			</div>
			<p className="font-sans text-[12px] text-text-muted">{description}</p>
		</div>
	);
}

// ── Main component ────────────────────────────────────────────────────────────

export function CertificationDocumentsSection() {
	const { t } = useI18n();
	const { data: certifications = [], isLoading, isError } = useCertifications();
	const { data: products = [] } = useProducts();
	const removeMutation = useRemoveCertification();

	// Which product's inline upload form is currently open
	const [openProductId, setOpenProductId] = useState<string | null>(null);
	// Whether the org-level upload form is open
	const [orgFormOpen, setOrgFormOpen] = useState(false);

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center rounded-sm py-12"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-[13px] text-text-muted">
					{t("producerProfileCert.loadingCertifications")}
				</p>
			</div>
		);
	}
	if (isError) {
		return (
			<div
				className="rounded-sm px-5 py-6"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<p className="font-sans text-[13px] text-red-500">
					{t("producerProfileCert.failedLoadCertifications")}
				</p>
			</div>
		);
	}

	const globalCerts = certifications.filter((c) => !c.productId);
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
			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<SectionHeader
					count={globalCerts.length}
					description={t("producerProfileCert.orgCertsDescription")}
					icon={
						<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
							<path
								d="M6 1l1.4 3.5H11L8.3 6.7l1 3.3L6 8.2l-3.3 1.8 1-3.3L1 4.5h3.6L6 1z"
								stroke="var(--color-ink)"
								strokeLinejoin="round"
								strokeWidth="1.2"
							/>
						</svg>
					}
					title={t("producerProfileCert.orgCertsHeading")}
				/>

				<div className="flex flex-col gap-3 p-5">
					{/* Existing certs */}
					{globalCerts.length > 0 && (
						<div className="flex flex-col gap-2">
							{globalCerts.map((c) => (
								<CertRow
									cert={c}
									key={c.id}
									onRemove={() => removeMutation.mutate(c.id)}
									removing={removeMutation.isPending}
								/>
							))}
						</div>
					)}

					{/* Add button / inline form */}
					{orgFormOpen ? (
						<InlineUploadForm
							onSuccess={() => setOrgFormOpen(false)}
							productId={null}
						/>
					) : (
						<button
							className="flex items-center gap-2 self-start rounded-sm px-4 py-2.5 font-sans font-semibold text-[13px] transition-colors"
							onClick={() => setOrgFormOpen(true)}
							style={{
								background:
									"color-mix(in srgb, var(--color-ink) 6%, transparent)",
								color: "var(--color-ink)",
								border:
									"1px solid color-mix(in srgb, var(--color-ink) 14%, transparent)",
							}}
							type="button"
						>
							<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
								<path
									d="M6 1v10M1 6h10"
									stroke="currentColor"
									strokeLinecap="round"
									strokeWidth="1.5"
								/>
							</svg>
							{t("producerProfileCert.addCertificate")}
						</button>
					)}

					{globalCerts.length === 0 && !orgFormOpen && (
						<p className="font-sans text-[12px] text-text-muted">
							{t("producerProfileCert.noOrgCertsYet")}
						</p>
					)}
				</div>
			</div>

			{/* ── Section 2: Product Certifications ── */}
			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<SectionHeader
					count={productCerts.length}
					description={t("producerProfileCert.productCertsDescription")}
					icon={
						<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
							<rect
								height="7"
								rx="1.5"
								stroke="var(--color-ink)"
								strokeWidth="1.2"
								width="10"
								x="1"
								y="4"
							/>
							<path
								d="M4 4V3a2 2 0 0 1 4 0v1"
								stroke="var(--color-ink)"
								strokeLinecap="round"
								strokeWidth="1.2"
							/>
							<circle cx="6" cy="7.5" fill="var(--color-ink)" r="1" />
						</svg>
					}
					title={t("producerProfileCert.productCertsHeading")}
				/>

				{products.length === 0 ? (
					<div className="px-5 py-8 text-center">
						<p className="font-sans text-[13px] text-text-muted">
							{t("producerProfileCert.noProductsYet")}
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-3 p-5">
						{products.map((product) => {
							const certs = certsByProduct.get(product.id) ?? [];
							const isOpen = openProductId === product.id;

							return (
								<div
									className="flex flex-col gap-0 overflow-hidden rounded-sm"
									key={product.id}
									style={{
										border: "1px solid var(--color-cream-dark)",
										background: "var(--color-paper)",
									}}
								>
									<div className="flex flex-col gap-3 px-4 py-3.5">
										{/* Product row */}
										<div className="flex items-center justify-between gap-3">
											<div className="flex min-w-0 items-center gap-2.5">
												<span className="truncate font-sans font-semibold text-[13px] text-text-dark">
													{product.name}
												</span>
												<span
													className="shrink-0 rounded-sm px-1.5 py-0.5 font-sans font-semibold text-[10px]"
													style={{
														background:
															"color-mix(in srgb, var(--color-ink) 7%, transparent)",
														color: "var(--color-text-muted)",
													}}
												>
													{product.category}
												</span>
												{certs.length > 0 && (
													<span
														className="shrink-0 rounded-full px-2 py-0.5 font-sans font-semibold text-[10px]"
														style={{
															background:
																"color-mix(in srgb, var(--color-ink) 10%, transparent)",
															color: "var(--color-ink)",
														}}
													>
														{certs.length !== 1
															? t("producerProfileCert.certCountPlural", {
																	count: certs.length,
																})
															: t("producerProfileCert.certCountSingular", {
																	count: certs.length,
																})}
													</span>
												)}
											</div>

											<button
												className="flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-semibold text-[12px] transition-colors"
												onClick={() =>
													setOpenProductId(isOpen ? null : product.id)
												}
												style={
													isOpen
														? {
																background:
																	"color-mix(in srgb, var(--color-ink) 10%, transparent)",
																color: "var(--color-ink)",
															}
														: {
																background:
																	"color-mix(in srgb, var(--color-ink) 6%, transparent)",
																color: "var(--color-ink)",
																border:
																	"1px solid color-mix(in srgb, var(--color-ink) 14%, transparent)",
															}
												}
												type="button"
											>
												{isOpen ? (
													<>
														<svg
															fill="none"
															height="10"
															viewBox="0 0 10 10"
															width="10"
														>
															<path
																d="M2 5h6"
																stroke="currentColor"
																strokeLinecap="round"
																strokeWidth="1.5"
															/>
														</svg>
														{t("producerProfileCert.cancel")}
													</>
												) : (
													<>
														<svg
															fill="none"
															height="10"
															viewBox="0 0 10 10"
															width="10"
														>
															<path
																d="M5 1v8M1 5h8"
																stroke="currentColor"
																strokeLinecap="round"
																strokeWidth="1.5"
															/>
														</svg>
														{t("producerProfileCert.addCert")}
													</>
												)}
											</button>
										</div>

										{/* Inline upload form */}
										{isOpen && (
											<InlineUploadForm
												key={product.id}
												onSuccess={() => setOpenProductId(null)}
												productId={product.id}
											/>
										)}
									</div>

									{/* Existing certs — flush bottom of card with a top border */}
									{certs.length > 0 && (
										<div
											className="flex flex-col gap-0 border-t"
											style={{ borderColor: "var(--color-cream-dark)" }}
										>
											{certs.map((c, i) => (
												<div
													key={c.id}
													style={{
														borderTop:
															i > 0
																? "1px solid var(--color-cream-dark)"
																: "none",
													}}
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
