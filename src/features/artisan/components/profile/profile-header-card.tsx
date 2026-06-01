"use client";

import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import { Avatar } from "~/components/avatar";
import { useUploadProfileImage } from "~/features/media";

type Props = {
	displayName: string;
	entityName: string;
	entityType: string;
	region: string;
	memberSince: string;
	profileImage?: string | null;
	/** Shown under entity line when set (public headline). */
	publicTagline?: string | null;
};

export function ProfileHeaderCard({
	displayName,
	entityName,
	entityType,
	region,
	memberSince,
	profileImage,
	publicTagline,
}: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);
	const uploadMutation = useUploadProfileImage();

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		uploadMutation.mutate(file, {
			onSuccess: () => {
				if (fileInputRef.current) fileInputRef.current.value = "";
			},
			onError: (err) => {
				setError(
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
				);
			},
		});
	};

	const openFilePicker = () => {
		setError(null);
		fileInputRef.current?.click();
	};

	const uploading = uploadMutation.isPending;
	const displayError =
		error ??
		(uploadMutation.isError && uploadMutation.error instanceof Error
			? uploadMutation.error.message
			: null);

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div
				className="h-20"
				style={{
					background:
						"linear-gradient(in oklab 90deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 50%, oklab(36% 0.09 0.048) 100%)",
				}}
			/>
			<div className="px-6 pb-6">
				<div
					className="flex items-end justify-between"
					style={{ marginTop: -28 }}
				>
					<div className="flex flex-col items-start gap-1">
						<Avatar
							displayName={displayName}
							imageUrl={profileImage}
							size="lg"
							variant="header"
						/>
						<input
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							disabled={uploading}
							onChange={handlePhotoChange}
							ref={fileInputRef}
							type="file"
						/>
						<button
							className="font-medium font-sans text-[11px] text-text-muted transition-colors hover:text-text-dark disabled:opacity-50"
							disabled={uploading}
							onClick={openFilePicker}
							type="button"
						>
							{uploading ? "Uploading…" : "Change photo"}
						</button>
						{displayError && (
							<p
								className="max-w-[200px] font-sans text-red-600 text-xs"
								role="alert"
							>
								{displayError}
							</p>
						)}
					</div>
					<Link
						className="inline-block rounded-sm px-4 py-2 font-medium font-sans text-sm transition-colors"
						href="/artisan/profile/edit"
						style={{
							background: "var(--color-paper)",
							color: "var(--color-ink)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						Edit Profile
					</Link>
				</div>
				<div className="mt-3 flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h2 className="font-bold font-display text-[20px] text-text-dark uppercase leading-tight">
							{displayName}
						</h2>
						<span
							className="rounded-full px-2.5 py-1 font-bold font-sans text-[9px] uppercase tracking-wider"
							style={{
								background:
									"color-mix(in srgb, var(--color-ink) 85%, transparent)",
								color: "var(--color-text-muted)",
								border:
									"1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
							}}
						>
							Certified
						</span>
					</div>
					<p className="font-sans text-sm text-text-muted">
						{entityType} · {entityName}
					</p>
					{publicTagline?.trim() && (
						<p className="mt-2 max-w-xl font-medium font-sans text-sm text-text-dark leading-snug">
							{publicTagline}
						</p>
					)}
					<div className="mt-1 flex flex-wrap items-center gap-4">
						<span className="flex items-center gap-1.5 font-sans text-[12px] text-text-muted">
							<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
								<path
									d="M6 1C4.1 1 2.5 2.6 2.5 4.5c0 2.8 3.5 6.5 3.5 6.5s3.5-3.7 3.5-6.5C9.5 2.6 7.9 1 6 1z"
									stroke="var(--color-text-muted)"
									strokeWidth="1.1"
								/>
								<circle
									cx="6"
									cy="4.5"
									r="1.2"
									stroke="var(--color-text-muted)"
									strokeWidth="1.1"
								/>
							</svg>
							{region} Region, Morocco
						</span>
						<span className="flex items-center gap-1.5 font-sans text-[12px] text-text-muted">
							<svg fill="none" height="12" viewBox="0 0 12 12" width="12">
								<rect
									height="8"
									rx="1.5"
									stroke="var(--color-text-muted)"
									strokeWidth="1.1"
									width="10"
									x="1"
									y="2"
								/>
								<path
									d="M1 4.5h10"
									stroke="var(--color-text-muted)"
									strokeWidth="1.1"
								/>
								<path
									d="M4 1v2M8 1v2"
									stroke="var(--color-text-muted)"
									strokeLinecap="round"
									strokeWidth="1.1"
								/>
							</svg>
							Member since {memberSince}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
