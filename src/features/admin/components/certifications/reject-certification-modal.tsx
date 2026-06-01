"use client";

import React, { useState } from "react";

type Props = {
	certificationName: string;
	onConfirm: (rejectionReason: string) => void;
	onCancel: () => void;
};

export function RejectCertificationModal({
	certificationName,
	onConfirm,
	onCancel,
}: Props) {
	const [reason, setReason] = useState("");

	return (
		<div
			aria-labelledby="reject-cert-modal-title"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			style={{
				background: "color-mix(in srgb, var(--color-ink) 40%, transparent)",
			}}
		>
			<div
				className="w-full max-w-md overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="border-b px-5 py-4"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h3
						className="font-bold font-serif text-[15px] text-text-dark"
						id="reject-cert-modal-title"
					>
						Reject certification
					</h3>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{certificationName}
					</p>
				</div>
				<div className="flex flex-col gap-4 p-5">
					<div className="flex flex-col gap-1.5">
						<label
							className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]"
							htmlFor="reject-cert-reason"
						>
							Reason for rejection (optional but recommended)
						</label>
						<textarea
							className="w-full resize-none rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark outline-none"
							id="reject-cert-reason"
							maxLength={500}
							onChange={(e) => setReason(e.target.value)}
							placeholder="e.g. Document expired or unclear. Please upload an updated version."
							rows={3}
							style={{
								background: "var(--color-paper)",
								border: "1px solid var(--color-cream-dark)",
							}}
							value={reason}
						/>
					</div>
					<div className="flex items-center gap-3">
						<button
							className="rounded-sm px-4 py-2.5 font-sans font-semibold text-sm text-white transition-colors"
							onClick={() => onConfirm(reason.trim() || "")}
							style={{ background: "var(--color-danger-dark)" }}
							type="button"
						>
							Reject certification
						</button>
						<button
							className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
							onClick={onCancel}
							type="button"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
