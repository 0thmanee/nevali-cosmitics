"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { addCertification } from "~/app/api/certifications/actions";
import {
	CERTIFICATION_ACCEPT,
	CERTIFICATION_ALLOWED_MIMES,
} from "~/app/api/media/schemas/media.schema";
import { addProductImage, createProduct } from "~/app/api/products/actions";
import { useI18n } from "~/components/i18n/i18n-provider";
import { COSMETICS_CATEGORY_SUGGESTIONS } from "~/features/profile/config";
import { uploadMedia } from "~/lib/media";
import {
	productFormInputBase,
	productFormInputStyle,
	productFormLabelClass,
} from "./product-form-styles";
import {
	emptyVariantDraft,
	ProductVariantsFormBlock,
	type VariantDraft,
} from "./product-variants-form-block";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;
const CERT_ALLOWED = new Set<string>(CERTIFICATION_ALLOWED_MIMES);

type StagedImage = { id: string; file: File; preview: string };
type StagedCert = { id: string; name: string; file: File };

export function ProductCreateForm() {
	const router = useRouter();
	const { t } = useI18n();

	const [form, setForm] = useState({
		name: "",
		category: "",
		description: "",
		capacity: "",
	});
	const [variants, setVariants] = useState<VariantDraft[]>([
		emptyVariantDraft(),
	]);
	const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
	const [stagedCerts, setStagedCerts] = useState<StagedCert[]>([]);
	const [certName, setCertName] = useState("");
	const [certError, setCertError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);

	const imageInputRef = useRef<HTMLInputElement>(null);
	const certInputRef = useRef<HTMLInputElement>(null);

	// Revoke object URLs on unmount to avoid memory leaks
	useEffect(() => {
		return () => {
			stagedImages.forEach((img) => URL.revokeObjectURL(img.preview));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleImageFiles = useCallback((files: FileList | null) => {
		if (!files) return;
		const newImages: StagedImage[] = Array.from(files)
			.filter((f) => f.type.startsWith("image/"))
			.map((file) => ({
				id: crypto.randomUUID(),
				file,
				preview: URL.createObjectURL(file),
			}));
		setStagedImages((prev) => [...prev, ...newImages]);
		if (imageInputRef.current) imageInputRef.current.value = "";
	}, []);

	const removeImage = (id: string) => {
		setStagedImages((prev) => {
			const img = prev.find((i) => i.id === id);
			if (img) URL.revokeObjectURL(img.preview);
			return prev.filter((i) => i.id !== id);
		});
	};

	const handleCertFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		setCertError(null);
		if (!file) return;
		if (!certName.trim()) {
			setCertError(t("producerProducts.enterDocumentNameFirst"));
			return;
		}
		if (!CERT_ALLOWED.has(file.type)) {
			setCertError(t("producerProducts.onlyPdfJpegPngWebp"));
			return;
		}
		setStagedCerts((prev) => [
			...prev,
			{ id: crypto.randomUUID(), name: certName.trim(), file },
		]);
		setCertName("");
	};

	const removeCert = (id: string) =>
		setStagedCerts((prev) => prev.filter((c) => c.id !== id));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!form.name.trim()) {
			setError(t("producerProducts.productNameRequired"));
			return;
		}
		if (!form.category.trim()) {
			setError(t("producerProducts.categoryRequired"));
			return;
		}
		for (let i = 0; i < variants.length; i++) {
			const v = variants[i]!;
			if (!v.name.trim()) {
				setError(
					t("producerProducts.variantPackagingNameRequired", { n: i + 1 }),
				);
				return;
			}
			if (!v.price.trim()) {
				setError(t("producerProducts.variantPriceRequired", { n: i + 1 }));
				return;
			}
		}

		setSubmitting(true);
		try {
			// 1 — create product
			setUploadStatus(t("producerProducts.creatingProduct"));
			const product = await createProduct({
				name: form.name.trim(),
				category: form.category.trim(),
				capacity: form.capacity.trim() || undefined,
				description: form.description.trim() || null,
				variants: variants.map((v, i) => ({
					name: v.name.trim(),
					unit: v.unit.trim() || "item",
					sourceName: v.sourceName.trim() || null,
					minOrderQuantity: Number(v.minOrderQuantity) || 1,
					minOrderNote: v.minOrderNote.trim() || null,
					price: v.price.trim(),
					unitCost: v.unitCost.trim() || "0",
					packagingCost: v.packagingCost.trim() || "0",
					handlingCost: v.handlingCost.trim() || "0",
					otherCost: v.otherCost.trim() || "0",
					quantityOnHand: Math.max(0, Number(v.quantityOnHand) || 0),
					inStock: v.inStock,
					sortOrder: i,
				})),
			});
			const productId = product.id;

			// 2 — upload images in parallel
			if (stagedImages.length > 0) {
				setUploadStatus(
					stagedImages.length > 1
						? t("producerProducts.uploadingImagesPlural", {
								n: stagedImages.length,
							})
						: t("producerProducts.uploadingImage", {
								n: stagedImages.length,
							}),
				);
				await Promise.all(
					stagedImages.map(async (img) => {
						const { url } = await uploadMedia(img.file, "productImages");
						await addProductImage(productId, url);
					}),
				);
			}

			// 3 — upload certifications in parallel
			if (stagedCerts.length > 0) {
				setUploadStatus(
					stagedCerts.length > 1
						? t("producerProducts.uploadingCertificationsPlural", {
								n: stagedCerts.length,
							})
						: t("producerProducts.uploadingCertification", {
								n: stagedCerts.length,
							}),
				);
				await Promise.all(
					stagedCerts.map(async (cert) => {
						const { url } = await uploadMedia(
							cert.file,
							"certificationDocuments",
						);
						await addCertification({
							name: cert.name,
							fileUrl: url,
							productId,
						});
					}),
				);
			}

			router.push("/artisan/products");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: t("producerProducts.failedToCreateProduct"),
			);
		} finally {
			setSubmitting(false);
			setUploadStatus(null);
		}
	};

	return (
		<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
			{/* Header card */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							{t("producerProducts.addNewProduct")}
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							{t("producerProducts.addNewProductSubtitle")}
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted/80">
							{t("producerProducts.addNewProductReviewNote")}
						</p>
					</div>
					<span
						className="h-fit shrink-0 rounded-full px-2.5 py-0.5 font-bold font-sans text-[11px] uppercase tracking-wide"
						style={{
							background:
								"color-mix(in srgb, var(--color-gold) 20%, transparent)",
							color: "var(--color-gold)",
							border:
								"1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
						}}
					>
						PENDING
					</span>
				</div>
			</div>

			{error && (
				<div
					className="rounded-sm px-6 py-4"
					style={{
						background:
							"color-mix(in srgb, var(--color-danger) 6%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
					}}
				>
					<p className="font-sans text-danger text-sm">{error}</p>
				</div>
			)}

			{/* Details */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("producerProducts.details")}
					</h2>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label className={productFormLabelClass} htmlFor="product-name">
								{t("producerProducts.productName")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={submitting}
								id="product-name"
								maxLength={200}
								onChange={(e) =>
									setForm((p) => ({ ...p, name: e.target.value }))
								}
								placeholder={t("producerProducts.productNamePlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.name}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								className={productFormLabelClass}
								htmlFor="product-category"
							>
								{t("producerProducts.category")}{" "}
								<span className="text-danger">*</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={submitting}
								id="product-category"
								list="cosmetics-category-suggestions"
								onChange={(e) =>
									setForm((p) => ({ ...p, category: e.target.value }))
								}
								placeholder={t("producerProducts.categoryPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.category}
							/>
							<datalist id="cosmetics-category-suggestions">
								{COSMETICS_CATEGORY_SUGGESTIONS.map((c) => (
									<option key={c} value={c} />
								))}
							</datalist>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								className={productFormLabelClass}
								htmlFor="product-capacity"
							>
								{t("producerProducts.capacity")}{" "}
								<span className="text-text-muted/70">
									{t("producerProducts.optional")}
								</span>
							</label>
							<input
								className={productFormInputBase}
								disabled={submitting}
								id="product-capacity"
								maxLength={100}
								onChange={(e) =>
									setForm((p) => ({ ...p, capacity: e.target.value }))
								}
								placeholder={t("producerProducts.capacityPlaceholder")}
								style={productFormInputStyle}
								type="text"
								value={form.capacity}
							/>
						</div>
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label
								className={productFormLabelClass}
								htmlFor="product-description"
							>
								{t("producerProducts.description")}{" "}
								<span className="text-text-muted/70">
									{t("producerProducts.optional")}
								</span>
							</label>
							<textarea
								className={productFormInputBase}
								disabled={submitting}
								id="product-description"
								maxLength={20000}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								placeholder={t("producerProducts.descriptionPlaceholder")}
								rows={4}
								style={productFormInputStyle}
								value={form.description}
							/>
						</div>
					</div>

					<div className="mt-6 border-cream-dark border-t pt-6">
						<h3 className="mb-3 font-bold font-serif text-[14px] text-text-dark">
							{t("producerProducts.variantsAndPricing")}
						</h3>
						<ProductVariantsFormBlock
							disabled={submitting}
							onChange={setVariants}
							variants={variants}
						/>
					</div>
				</div>
			</div>

			{/* Product images */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex items-center justify-between gap-3 border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("producerProducts.productImages")}
					</h2>
					<input
						accept="image/jpeg,image/png,image/webp"
						className="hidden"
						disabled={submitting}
						multiple
						onChange={(e) => handleImageFiles(e.target.files)}
						ref={imageInputRef}
						type="file"
					/>
					<button
						className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
						disabled={submitting}
						onClick={() => imageInputRef.current?.click()}
						style={{ background: "var(--color-ink)", color: "white" }}
						type="button"
					>
						{t("producerProducts.addImage")}
					</button>
				</div>
				<div className="p-6">
					{stagedImages.length === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							{t("producerProducts.noImagesYetHint")}
						</p>
					) : (
						<div className="flex flex-wrap gap-4">
							{stagedImages.map((img) => (
								<div
									className="group relative shrink-0 overflow-hidden rounded-sm"
									key={img.id}
									style={{
										width: 120,
										height: 120,
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										alt=""
										className="h-full w-full object-cover"
										src={img.preview}
									/>
									<button
										className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity disabled:opacity-60 group-hover:opacity-100"
										disabled={submitting}
										onClick={() => removeImage(img.id)}
										style={{
											background:
												"color-mix(in srgb, var(--color-ink) 65%, transparent)",
										}}
										type="button"
									>
										<X color="white" size={12} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Certifications */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						{t("producerProducts.certifications")}
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						{t("producerProducts.certificationsCreateHint")}
					</p>
				</div>
				<div className="border-cream-dark border-b px-6 py-4">
					<div className="flex flex-wrap items-center gap-2">
						<input
							className="w-44 rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm disabled:opacity-60"
							disabled={submitting}
							onChange={(e) => {
								setCertName(e.target.value);
								setCertError(null);
							}}
							placeholder={t("producerProducts.documentName")}
							style={{ background: "var(--color-paper)" }}
							type="text"
							value={certName}
						/>
						<input
							accept={CERTIFICATION_ACCEPT}
							className="hidden"
							disabled={submitting}
							onChange={handleCertFile}
							ref={certInputRef}
							type="file"
						/>
						<button
							className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={submitting}
							onClick={() => {
								setCertError(null);
								certInputRef.current?.click();
							}}
							style={{ background: "var(--color-ink)", color: "white" }}
							type="button"
						>
							{t("producerProducts.uploadCertification")}
						</button>
					</div>
					<p className="mt-1.5 font-sans text-[11px] text-text-muted">
						{t("producerProducts.pdfOrImageMax10mb")}
					</p>
					{certError && (
						<p className="mt-1 font-sans text-[12px] text-danger" role="alert">
							{certError}
						</p>
					)}
				</div>
				<div className="p-6">
					{stagedCerts.length === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							{t("producerProducts.noCertificationsAddedYet")}
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{stagedCerts.map((cert) => (
								<li
									className="flex items-center justify-between gap-3 rounded-sm px-4 py-3"
									key={cert.id}
									style={{
										background: "var(--color-paper)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									<div className="min-w-0">
										<p className="truncate font-sans font-semibold text-sm text-text-dark">
											{cert.name}
										</p>
										<p className="truncate font-sans text-[11px] text-text-muted">
											{cert.file.name}
										</p>
									</div>
									<button
										className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-60"
										disabled={submitting}
										onClick={() => removeCert(cert.id)}
										style={{
											background:
												"color-mix(in srgb, var(--color-danger) 12%, transparent)",
										}}
										type="button"
									>
										<X color="var(--color-danger)" size={12} />
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Actions */}
			<div
				className="flex flex-wrap items-center gap-4 overflow-hidden rounded-sm px-6 py-5 shadow-sm"
				style={cardStyle}
			>
				<button
					className="min-w-[160px] rounded-sm px-6 py-3 font-sans font-semibold text-sm text-white transition-colors disabled:opacity-60"
					disabled={submitting}
					style={{ background: "var(--color-ink)" }}
					type="submit"
				>
					{uploadStatus ?? t("producerProducts.createProduct")}
				</button>
				<Link
					className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/products"
				>
					{t("producerProducts.cancel")}
				</Link>
			</div>
		</form>
	);
}
