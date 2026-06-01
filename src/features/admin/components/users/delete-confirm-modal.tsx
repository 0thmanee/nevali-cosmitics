"use client";

import React from "react";
import type { PartnerRow } from "~/app/api/partners/schemas/partners.schema";

type Props = {
	user: PartnerRow | null;
	onClose: () => void;
	onConfirm: (userId: string) => void;
	isDeleting: boolean;
};

export function DeleteConfirmModal({
	user,
	onClose,
	onConfirm,
	isDeleting,
}: Props) {
	if (!user) return null;

	return (
		<div
			aria-labelledby="delete-partner-title"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
			role="dialog"
			style={{
				background: "color-mix(in srgb, var(--color-ink) 40%, transparent)",
			}}
		>
			<div
				className="w-full max-w-sm overflow-hidden rounded-sm"
				onClick={(e) => e.stopPropagation()}
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="border-b px-5 py-4"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h2
						className="font-bold font-serif text-[15px] text-text-dark"
						id="delete-partner-title"
					>
						Delete partner
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						This will permanently remove the partner and their profile. This
						action cannot be undone.
					</p>
				</div>
				<div className="p-5">
					<p className="font-sans text-sm text-text-dark">
						<span className="font-semibold">{user.name}</span> — {user.email}
					</p>
					<div className="mt-4 flex justify-end gap-3">
						<button
							className="rounded-sm px-4 py-2.5 font-medium font-sans text-sm transition-colors"
							onClick={onClose}
							style={{
								background: "var(--color-paper)",
								color: "var(--color-ink)",
								border: "1px solid var(--color-cream-dark)",
							}}
							type="button"
						>
							Cancel
						</button>
						<button
							className="rounded-sm px-4 py-2.5 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={isDeleting}
							onClick={() => onConfirm(user.id)}
							style={{
								background:
									"color-mix(in srgb, var(--color-danger) 15%, transparent)",
								color: "var(--color-danger-dark)",
								border:
									"1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)",
							}}
							type="button"
						>
							{isDeleting ? "Deleting…" : "Delete"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
