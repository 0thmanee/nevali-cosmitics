"use client";

import type React from "react";
import { useRef } from "react";
import type {
	ProductImageItem,
	ProductVariantRow,
} from "~/app/api/products/schemas/products.schema";
import { uploadMedia } from "~/lib/media";
import {
	useAddProductImage,
	useRemoveProductImage,
	useSetProductImageVariant,
} from "../../hooks/use-products";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

type Props = {
	productId: string;
	images: ProductImageItem[];
	variants: ProductVariantRow[];
};

export function ProductGalleryEditor({ productId, images, variants }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const addMutation = useAddProductImage();
	const removeMutation = useRemoveProductImage();
	const variantMutation = useSetProductImageVariant();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		e.target.value = "";
		try {
			const { url } = await uploadMedia(file, "productImages");
			addMutation.mutate({ productId, url });
		} catch {
			addMutation.reset();
		}
	};

	const handleRemove = (imageId: string) => {
		removeMutation.mutate({ productId, imageId });
	};

	const variantOptions = [
		{ value: "", label: "All variants (default)" },
		...variants.map((v) => ({ value: v.id, label: v.name })),
	];

	return (
		<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
			<div className="flex flex-wrap items-center justify-between gap-3 border-cream-dark border-b px-6 py-4">
				<h2 className="font-bold font-serif text-[15px] text-text-dark">
					Product images
				</h2>
				<input
					accept="image/jpeg,image/png,image/webp"
					className="hidden"
					onChange={handleFileChange}
					ref={inputRef}
					type="file"
				/>
				<button
					className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
					disabled={addMutation.isPending}
					onClick={() => inputRef.current?.click()}
					style={{ background: "var(--color-ink)", color: "white" }}
					type="button"
				>
					{addMutation.isPending ? "Uploading…" : "Add image"}
				</button>
			</div>
			<div className="p-6">
				{images.length === 0 && !addMutation.isPending ? (
					<p className="font-sans text-sm text-text-muted">
						No images yet. Click &quot;Add image&quot; to upload (JPEG, PNG or
						WebP, max 5MB).
					</p>
				) : (
					<div className="flex flex-col gap-4">
						{variants.length > 0 ? (
							<p className="font-sans text-[12px] text-text-muted">
								Optionally link each image to a variant so the storefront can
								highlight the right packaging.
							</p>
						) : null}
						<div className="flex flex-wrap gap-4">
							{images.map((img) => (
								<div
									className="flex flex-col gap-2"
									key={img.id}
									style={{ width: 200, maxWidth: "100%" }}
								>
									<div
										className="group relative overflow-hidden rounded-sm"
										style={{
											width: "100%",
											height: 120,
											border: "1px solid var(--color-cream-dark)",
										}}
									>
										<img
											alt=""
											className="h-full w-full object-cover"
											src={img.url}
										/>
										<button
											className="absolute inset-0 flex items-center justify-center bg-black/50 font-sans font-semibold text-white text-xs opacity-0 transition-opacity disabled:opacity-50 group-hover:opacity-100"
											disabled={removeMutation.isPending}
											onClick={() => handleRemove(img.id)}
											type="button"
										>
											Remove
										</button>
									</div>
									{variants.length > 0 ? (
										<label className="flex flex-col gap-1 font-sans font-semibold text-[10px] text-text-muted uppercase tracking-wide">
											Show for variant
											<select
												className="rounded-sm border border-cream-dark bg-white px-2 py-1.5 font-medium font-sans text-[11px] text-text-dark normal-case tracking-normal"
												disabled={variantMutation.isPending}
												onChange={(e) => {
													const v = e.target.value;
													variantMutation.mutate({
														productId,
														imageId: img.id,
														variantId: v === "" ? null : v,
													});
												}}
												value={img.variantId ?? ""}
											>
												{variantOptions.map((o) => (
													<option key={o.value || "all"} value={o.value}>
														{o.label}
													</option>
												))}
											</select>
										</label>
									) : null}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
