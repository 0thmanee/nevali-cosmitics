"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { submitProductInquiry } from "~/app/api/inquiries/actions";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";

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

const OOS_INQUIRY_BILLING =
	"This item is not available for cart checkout right now. Your message goes to the brand by email—no account required.";

const WHOLESALE_REQUEST_BILLING =
	"Optional wholesale request to the brand by email. For immediate purchase, use Add to cart and guest checkout instead—no sign-in required.";

function marketplaceBillingNote(): string | undefined {
	const raw = process.env.NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE?.trim();
	return raw || undefined;
}

export function ProductInquiryModal({ product, mode, onClose }: Props) {
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
	const submitLabel = isB2B ? "Send wholesale request" : "Send inquiry";
	const coverSrc =
		product.firstImageUrl ??
		productPlaceholderImageUrl(`${product.organizationId}:${product.id}:${product.category}`, 640);

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-[999] flex items-center justify-center p-4"
			style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
			onClick={(e) => e.target === overlayRef.current && onClose()}
		>
			<div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
					type="button"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
					</svg>
				</button>

				{state === "success" ? (
					<div className="flex flex-col items-center justify-center gap-5 px-8 py-16 text-center">
						<div
							className="flex h-16 w-16 items-center justify-center rounded-full"
							style={{ background: "#000000" }}
						>
							<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
								<path
									d="M6 14l6 6 10-12"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<div>
							<p className="mb-1 font-serif font-bold text-xl text-text-dark">
								{isB2B ? "Wholesale request sent!" : "Inquiry sent!"}
							</p>
							<p className="max-w-xs font-sans text-sm leading-relaxed text-text-muted">
								The brand will review your request and get back to you at{" "}
								<span className="font-semibold text-text-dark">{email}</span> shortly.
							</p>
						</div>
						<button
							onClick={onClose}
							className="rounded-xl px-8 py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
							style={{ background: "#000000" }}
							type="button"
						>
							Done
						</button>
					</div>
				) : (
					<>
						<div className="flex items-center gap-4 border-cream-dark border-b p-5">
							<div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
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
										className="rounded-full px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest"
										style={
											isB2B
												? { background: "#ede6dc", color: "#000000" }
												: { background: "#f4f4f4", color: "#000000" }
										}
									>
										{isB2B ? "WHOLESALE" : "ORDER"}
									</span>
								</div>
								<p className="truncate font-serif font-bold text-[15px] text-text-dark leading-snug">{product.name}</p>
								<p className="truncate font-sans text-[12px] text-text-muted">{product.organizationName}</p>
							</div>
						</div>

						<form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<label className="font-sans text-[11px] font-semibold tracking-wide text-text-dark uppercase">
										Your Name <span className="text-red-400">*</span>
									</label>
									<input
										required
										className="w-full rounded-xl border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark placeholder:text-text-muted/50 transition-colors focus:border-forest-mid focus:outline-none"
										onChange={(e) => setName(e.target.value)}
										placeholder="Jane Doe"
										value={name}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="font-sans text-[11px] font-semibold tracking-wide text-text-dark uppercase">
										Email <span className="text-red-400">*</span>
									</label>
									<input
										required
										className="w-full rounded-xl border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark placeholder:text-text-muted/50 transition-colors focus:border-forest-mid focus:outline-none"
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@company.com"
										type="email"
										value={email}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="font-sans text-[11px] font-semibold tracking-wide text-text-dark uppercase">
									Quantity <span className="text-red-400">*</span>
									{product.orderHint ? (
										<span className="ml-1.5 font-normal normal-case tracking-normal text-text-muted">
											({product.orderHint})
										</span>
									) : null}
								</label>
								<input
									required
									className="w-full rounded-xl border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark placeholder:text-text-muted/50 transition-colors focus:border-forest-mid focus:outline-none"
									onChange={(e) => setQuantity(e.target.value)}
									placeholder={product.orderHint ? `e.g. ${product.orderHint}` : "e.g. 50kg, 100L"}
									value={quantity}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="font-sans text-[11px] font-semibold tracking-wide text-text-dark uppercase">
									Message
									<span className="ml-1.5 font-normal normal-case tracking-normal text-text-muted">(optional)</span>
								</label>
								<textarea
									className="w-full resize-none rounded-xl border border-cream-dark bg-cream px-3.5 py-2.5 font-sans text-sm text-text-dark placeholder:text-text-muted/50 transition-colors focus:border-forest-mid focus:outline-none"
									onChange={(e) => setMessage(e.target.value)}
									placeholder={
										isB2B
											? "Destination country, packaging requirements, delivery timeline…"
											: "Any specific requirements or questions…"
									}
									rows={3}
									value={message}
								/>
							</div>

							<p className="font-sans text-[11px] text-text-muted leading-relaxed">
								{isB2B ? WHOLESALE_REQUEST_BILLING : OOS_INQUIRY_BILLING}
								{billingExtra ? ` ${billingExtra}` : ""}
							</p>

							{state === "error" ? (
								<p className="rounded-lg bg-red-50 px-3 py-2 font-sans text-red-500 text-xs">
									Something went wrong. Please try again.
								</p>
							) : null}

							<button
								className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
								disabled={state === "loading"}
								style={{ background: "#000000" }}
								type="submit"
							>
								{state === "loading" ? (
									<>
										<svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
											<circle cx="7" cy="7" r="5.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
											<path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
										</svg>
										Sending…
									</>
								) : (
									<>
										{submitLabel}
										<svg width="13" height="13" viewBox="0 0 14 14" fill="none">
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
