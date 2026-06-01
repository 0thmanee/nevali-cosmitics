"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { submitProductInquiry } from "~/app/api/inquiries/actions";
import { useI18n } from "~/components/i18n/i18n-provider";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { interpolate } from "~/lib/i18n/interpolate";

type Mode = "cart" | "b2b";

export type InquiryModalProduct = {
	id: string;
	name: string;
	category: string;
	organizationName: string;
	organizationId: string;
	firstImageUrl: string | null;
	gradient: string;
	/** Minimum order / packaging hint (e.g. MOQ text or “Min. 10 kg”). */
	orderHint: string | null;
};

type Props = {
	product: InquiryModalProduct;
	mode: Mode;
	onClose: () => void;
};

type FormState = "idle" | "loading" | "success" | "error";

function marketplaceBillingNote(): string | undefined {
	const raw = process.env.NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE?.trim();
	return raw || undefined;
}

export function ProductInquiryModal({ product, mode, onClose }: Props) {
	const { t } = useI18n();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [quantity, setQuantity] = useState(product.orderHint ?? "");
	const [message, setMessage] = useState("");
	const [state, setState] = useState<FormState>("idle");
	const overlayRef = useRef<HTMLDivElement>(null);
	const billingExtra = marketplaceBillingNote();

	useEffect(() => {
		const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setState("loading");
		try {
			await submitProductInquiry({
				organizationId: product.organizationId,
				productId: product.id,
				productName: product.name,
				buyerName: name.trim(),
				buyerEmail: email.trim(),
				quantity: quantity.trim(),
				message: message.trim() || undefined,
				type: mode,
			});
			setState("success");
		} catch {
			setState("error");
		}
	}

	const isB2B = mode === "b2b";
	const submitLabel = isB2B
		? t("inquiryModal.submitWholesale")
		: t("inquiryModal.submitInquiry");
	const coverSrc =
		product.firstImageUrl ??
		productPlaceholderImageUrl(
			`${product.organizationId}:${product.id}:${product.category}`,
			640,
		);

	const billingPrimary = isB2B
		? t("inquiryModal.wholesaleBilling")
		: t("inquiryModal.oosBilling");

	return (
		<div
			className="fixed inset-0 z-[999] flex items-center justify-center p-4"
			onClick={(e) => e.target === overlayRef.current && onClose()}
			ref={overlayRef}
			style={{
				background: "color-mix(in srgb, var(--color-ink) 50%, transparent)",
				backdropFilter: "blur(4px)",
			}}
		>
			<div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
				<button
					aria-label={t("inquiryModal.closeAria")}
					className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
					onClick={onClose}
					type="button"
				>
					<svg
						aria-hidden
						fill="none"
						height="14"
						viewBox="0 0 14 14"
						width="14"
					>
						<path
							d="M2 2l10 10M12 2L2 12"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="1.6"
						/>
					</svg>
				</button>

				{state === "success" ? (
					<div className="flex flex-col items-center justify-center gap-5 px-8 py-16 text-center">
						<div
							className="flex h-16 w-16 items-center justify-center rounded-full"
							style={{ background: "var(--color-ink)" }}
						>
							<svg
								aria-hidden
								fill="none"
								height="28"
								viewBox="0 0 28 28"
								width="28"
							>
								<path
									d="M6 14l6 6 10-12"
									stroke="white"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
								/>
							</svg>
						</div>
						<div>
							<p className="mb-1 font-bold font-serif text-text-dark text-xl">
								{isB2B
									? t("inquiryModal.successWholesale")
									: t("inquiryModal.successInquiry")}
							</p>
							<p className="max-w-xs font-sans text-sm text-text-muted leading-relaxed">
								{t("inquiryModal.successBody")}{" "}
								<span className="font-semibold text-text-dark">{email}</span>{" "}
								{t("inquiryModal.successBodyTrail")}
							</p>
						</div>
						<button
							className="rounded-sm px-8 py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
							onClick={onClose}
							style={{ background: "var(--color-ink)" }}
							type="button"
						>
							{t("inquiryModal.done")}
						</button>
					</div>
				) : (
					<>
						<div className="flex items-center gap-4 border-cream-dark border-b p-5">
							<div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-cream">
								<Image
									alt={product.name}
									className="object-cover"
									fill
									sizes="64px"
									src={coverSrc}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<div className="mb-0.5 flex items-center gap-2">
									<span
										className="rounded-full px-2 py-0.5 font-bold font-sans text-[9px] uppercase tracking-widest"
										style={
											isB2B
												? {
														background: "var(--color-cream)",
														color: "var(--color-ink)",
													}
												: {
														background:
															"color-mix(in srgb, var(--color-paper) 85%, var(--color-cream-dark))",
														color: "var(--color-ink)",
													}
										}
									>
										{isB2B
											? t("inquiryModal.badgeWholesale")
											: t("inquiryModal.badgeOrder")}
									</span>
								</div>
								<p className="truncate font-bold font-serif text-[15px] text-text-dark leading-snug">
									{product.name}
								</p>
								<p className="truncate font-sans text-[12px] text-text-muted">
									{product.organizationName}
								</p>
							</div>
						</div>

						<form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<label className="font-sans font-semibold text-[11px] text-text-dark uppercase tracking-wide">
										{t("inquiryModal.yourName")}{" "}
										<span className="text-red-400">*</span>
									</label>
									<input
										className="w-full rounded-sm border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark transition-colors placeholder:text-text-muted/50 focus:border-forest-mid focus:outline-none"
										onChange={(e) => setName(e.target.value)}
										placeholder={t("inquiryModal.namePlaceholder")}
										required
										value={name}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="font-sans font-semibold text-[11px] text-text-dark uppercase tracking-wide">
										{t("inquiryModal.email")}{" "}
										<span className="text-red-400">*</span>
									</label>
									<input
										className="w-full rounded-sm border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark transition-colors placeholder:text-text-muted/50 focus:border-forest-mid focus:outline-none"
										onChange={(e) => setEmail(e.target.value)}
										placeholder={t("inquiryModal.emailPlaceholder")}
										required
										type="email"
										value={email}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="font-sans font-semibold text-[11px] text-text-dark uppercase tracking-wide">
									{t("inquiryModal.quantity")}{" "}
									<span className="text-red-400">*</span>
									{product.orderHint ? (
										<span className="ml-1.5 font-normal text-text-muted normal-case tracking-normal">
											({product.orderHint})
										</span>
									) : null}
								</label>
								<input
									className="w-full rounded-sm border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark transition-colors placeholder:text-text-muted/50 focus:border-forest-mid focus:outline-none"
									onChange={(e) => setQuantity(e.target.value)}
									placeholder={
										product.orderHint
											? interpolate(t("inquiryModal.quantityPlaceholderHint"), {
													hint: product.orderHint,
												})
											: t("inquiryModal.quantityPlaceholderGeneric")
									}
									required
									value={quantity}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="font-sans font-semibold text-[11px] text-text-dark uppercase tracking-wide">
									{t("inquiryModal.message")}{" "}
									<span className="ml-1.5 font-normal text-text-muted normal-case tracking-normal">
										{t("common.optional")}
									</span>
								</label>
								<textarea
									className="w-full resize-none rounded-sm border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark transition-colors placeholder:text-text-muted/50 focus:border-forest-mid focus:outline-none"
									onChange={(e) => setMessage(e.target.value)}
									placeholder={
										isB2B
											? t("inquiryModal.messagePlaceholderWholesale")
											: t("inquiryModal.messagePlaceholderInquiry")
									}
									rows={3}
									value={message}
								/>
							</div>

							<p className="font-sans text-[11px] text-text-muted leading-relaxed">
								{billingPrimary}
								{billingExtra ? ` ${billingExtra}` : ""}
							</p>

							{state === "error" ? (
								<p className="rounded-sm bg-red-50 px-3 py-2 font-sans text-red-500 text-xs">
									{t("common.errorGeneric")}
								</p>
							) : null}

							<button
								className="flex w-full items-center justify-center gap-2 rounded-sm py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
								disabled={state === "loading"}
								style={{ background: "var(--color-ink)" }}
								type="submit"
							>
								{state === "loading" ? (
									<>
										<svg
											aria-hidden
											className="animate-spin"
											fill="none"
											height="14"
											viewBox="0 0 14 14"
											width="14"
										>
											<circle
												cx="7"
												cy="7"
												r="5.5"
												stroke="white"
												strokeOpacity="0.3"
												strokeWidth="1.5"
											/>
											<path
												d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
												stroke="white"
												strokeLinecap="round"
												strokeWidth="1.5"
											/>
										</svg>
										{t("inquiryModal.sending")}
									</>
								) : (
									<>
										{submitLabel}
										<svg
											aria-hidden
											fill="none"
											height="13"
											viewBox="0 0 14 14"
											width="13"
										>
											<path
												d="M2 7h10M8 3l4 4-4 4"
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="1.5"
											/>
										</svg>
									</>
								)}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
