"use client";

import React, { useState } from "react";
import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";

const OPTIONS: {
	value: ProductPaymentOptionValue;
	label: string;
	hint: string;
}[] = [
	{ value: "CARD", label: "Card payment", hint: "Buyers pay online by card." },
	{
		value: "COD",
		label: "Cash on delivery (COD)",
		hint: "Payment when the order is delivered.",
	},
	{
		value: "BOTH",
		label: "Card & COD",
		hint: "Buyers can choose either method.",
	},
];

export type ApproveProductModalProps = {
	productName: string;
	onConfirm: (paymentOption: ProductPaymentOptionValue) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
};

export function ApproveProductModal({
	productName,
	onConfirm,
	onCancel,
	isSubmitting,
}: ApproveProductModalProps) {
	const [paymentOption, setPaymentOption] =
		useState<ProductPaymentOptionValue>("BOTH");

	return (
		<div
			aria-labelledby="approve-modal-title"
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
						id="approve-modal-title"
					>
						Approve product
					</h3>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{productName}
					</p>
				</div>
				<div className="flex flex-col gap-4 p-5">
					<p className="font-bold font-sans text-[11px] text-text-muted uppercase tracking-[0.12em]">
						How can buyers pay?
					</p>
					<div className="flex flex-col gap-2">
						{OPTIONS.map((opt) => (
							<label
								className={`flex cursor-pointer items-start gap-3 rounded-sm border px-3.5 py-3 transition-colors ${
									paymentOption === opt.value
										? "border-[var(--color-ink)] bg-[var(--color-paper)]"
										: "srgb, var(--color-gold) 45%, var(--color-cream-dark))] border-cream-dark hover:border-[color-mix(in"
								}`}
								key={opt.value}
							>
								<input
									checked={paymentOption === opt.value}
									className="mt-1 shrink-0"
									disabled={isSubmitting}
									name="payment-option"
									onChange={() => setPaymentOption(opt.value)}
									type="radio"
									value={opt.value}
								/>
								<span className="min-w-0">
									<span className="block font-sans font-semibold text-sm text-text-dark">
										{opt.label}
									</span>
									<span className="mt-0.5 block font-sans text-[12px] text-text-muted">
										{opt.hint}
									</span>
								</span>
							</label>
						))}
					</div>
					<div className="flex items-center gap-3 pt-1">
						<button
							className="rounded-sm px-4 py-2.5 font-sans font-semibold text-sm text-white transition-colors disabled:opacity-60"
							disabled={isSubmitting}
							onClick={() => onConfirm(paymentOption)}
							style={{ background: "var(--color-ink)" }}
							type="button"
						>
							{isSubmitting ? "Approving…" : "Approve product"}
						</button>
						<button
							className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark disabled:opacity-60"
							disabled={isSubmitting}
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
