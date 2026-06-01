"use client";

import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useRef, useState } from "react";
import type { CertificationRow } from "~/app/api/certifications/schemas/certifications.schema";
import {
	CERTIFICATION_ACCEPT,
	CERTIFICATION_ALLOWED_MIMES,
} from "~/app/api/media/schemas/media.schema";
import { uploadMedia } from "~/lib/media";
import {
	useAddCertification,
	useRemoveCertification,
} from "../../hooks/use-certifications";
import { producerProductQueryKey } from "../../hooks/use-products";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;
const statusStyles: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	PENDING: {
		bg: "color-mix(in srgb, var(--color-gold) 20%, transparent)",
		color: "var(--color-gold)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
	},
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 20%, transparent)",
		color: "var(--color-danger)",
		border:
			"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
	},
};

const ALLOWED_SET = new Set<string>(CERTIFICATION_ALLOWED_MIMES);

type Props = {
	productId: string;
	productName: string;
	certifications: CertificationRow[];
};

export function ProductCertificationsSection({
	productId,
	productName,
	certifications,
}: Props) {
	const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState("");
	const [fileError, setFileError] = useState<string | null>(null);
	const addMutation = useAddCertification();
	const removeMutation = useRemoveCertification();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		setFileError(null);
		if (!file) return;
		if (!name.trim()) {
			setFileError("Enter a document name first.");
			return;
		}
		if (!ALLOWED_SET.has(file.type)) {
			setFileError("Only PDF and images (JPEG, PNG, WebP) are allowed.");
			return;
		}
		try {
			const { url } = await uploadMedia(file, "certificationDocuments");
			addMutation.mutate(
				{ name: name.trim(), fileUrl: url, productId },
				{
					onSuccess: () => {
						setName("");
						queryClient.invalidateQueries({
							queryKey: producerProductQueryKey(productId),
						});
					},
				},
			);
		} catch {
			addMutation.reset();
		}
	};

	return (
		<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
			<div className="flex flex-col gap-1 border-cream-dark border-b px-6 py-4">
				<h2 className="font-bold font-serif text-[15px] text-text-dark">
					Certifications
				</h2>
				<p className="font-sans text-[11px] text-text-muted">
					Add documents (PDF or image) for this product. Each certification is
					reviewed by admin separately and will show as PENDING until approved.
				</p>
			</div>
			<div className="flex flex-col gap-3 border-cream-dark border-b px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<input
							accept={CERTIFICATION_ACCEPT}
							className="hidden"
							onChange={handleFileChange}
							ref={inputRef}
							type="file"
						/>
						<input
							className="w-40 rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm"
							onChange={(e) => {
								setName(e.target.value);
								setFileError(null);
							}}
							placeholder="Document name"
							type="text"
							value={name}
						/>
						<button
							className="rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={addMutation.isPending}
							onClick={() => {
								setFileError(null);
								inputRef.current?.click();
							}}
							style={{ background: "var(--color-ink)", color: "white" }}
							type="button"
						>
							{addMutation.isPending ? "Uploading…" : "Upload certification"}
						</button>
					</div>
					<p className="font-sans text-[11px] text-text-muted">
						PDF or image only (JPEG, PNG, WebP). Max 10 MB.
					</p>
					{fileError && (
						<p
							className="font-sans text-[12px] text-[var(--color-danger)]"
							role="alert"
						>
							{fileError}
						</p>
					)}
				</div>
			</div>
			<div className="p-6">
				{certifications.length === 0 ? (
					<p className="font-sans text-sm text-text-muted">
						No certifications linked to this product yet. Add a document (PDF or
						image) above.
					</p>
				) : (
					<ul className="flex flex-col gap-2">
						{certifications.map((c) => {
							const style = statusStyles[c.status] ?? statusStyles.PENDING;
							return (
								<li
									className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-3"
									key={c.id}
									style={{
										background: "var(--color-paper)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									<div className="min-w-0">
										<a
											className="block truncate font-sans font-semibold text-sm text-text-dark hover:underline"
											href={c.fileUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											{c.name}
										</a>
										{c.status === "REJECTED" && c.rejectionReason && (
											<p className="mt-0.5 font-sans text-[11px] text-[var(--color-danger)]">
												{c.rejectionReason}
											</p>
										)}
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<span
											className="rounded-full px-2.5 py-1 font-bold font-sans text-[10px] uppercase tracking-wide"
											style={style}
										>
											{c.status}
										</span>
										<a
											className="font-medium font-sans text-[12px] text-text-dark hover:underline"
											href={c.fileUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											View
										</a>
										<button
											className="font-medium font-sans text-[12px] text-[var(--color-danger)] hover:underline disabled:opacity-60"
											disabled={removeMutation.isPending}
											onClick={() => removeMutation.mutate(c.id)}
											type="button"
										>
											Remove
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
