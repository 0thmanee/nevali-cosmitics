"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useCart } from "~/features/cart/cart-context";
import { getCategoryGradient } from "~/lib/public-product-gradient";
import { pickDefaultPublicVariant, publicVariantOrderHint } from "~/lib/public-product-helpers";
import { ProductInquiryModal } from "./product-inquiry-modal";
import type { PublicProduct } from "./public-product-types";

type Props = {
	product: PublicProduct;
	/** Extra classes on the button stack wrapper */
	className?: string;
};

export function PublicProductInquiryTriggers({ product, className }: Props) {
	const { t } = useI18n();
	const [modal, setModal] = useState<"cart" | "b2b" | null>(null);
	const [justAdded, setJustAdded] = useState(false);
	const { addLine } = useCart();
	const gradient = getCategoryGradient(product.category);
	const defaultV = useMemo(() => pickDefaultPublicVariant(product.variants), [product.variants]);
	const modalProduct = {
		id: product.id,
		name: product.name,
		category: product.category,
		organizationName: product.organizationName,
		organizationId: product.organizationId,
		firstImageUrl: product.firstImageUrl,
		gradient,
		orderHint: defaultV ? publicVariantOrderHint(defaultV) : null,
	};

	function handleAddToCart() {
		const v = pickDefaultPublicVariant(product.variants);
		if (!v?.inStock) {
			setModal("cart");
			return;
		}
		addLine({
			productId: product.id,
			productVariantId: v.id,
			variantName: v.name,
			organizationId: product.organizationId,
			organizationName: product.organizationName,
			name: product.name,
			category: product.category,
			price: v.price,
			unit: v.unit,
			minOrderQuantity: v.minOrderQuantity,
			minOrderNote: v.minOrderNote,
			firstImageUrl: product.firstImageUrl,
			paymentOption: product.paymentOption,
			quantity: 1,
		});
		setJustAdded(true);
		window.setTimeout(() => setJustAdded(false), 2600);
	}

	return (
		<>
			<div className={className ?? "mt-auto flex flex-col gap-1.5"}>
				<button
					className={`flex w-full items-center justify-center gap-2 rounded-sm py-2.5 font-sans text-sm font-semibold shadow-sm transition-opacity disabled:cursor-default ${
						justAdded
							? "border border-(--color-ink)/35 bg-cream text-text-dark"
							: "text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ink)/55 focus-visible:ring-offset-2"
					}`}
					onClick={handleAddToCart}
					style={justAdded ? undefined : { background: "var(--color-ink)" }}
					type="button"
				>
					<svg aria-hidden="true" fill="none" height="13" viewBox="0 0 14 14" width="13">
						<path
							d="M1 1h2l1.5 7h6l1.5-4.5H4"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.4"
						/>
						<circle cx="6" cy="12" fill="currentColor" r="0.8" />
						<circle cx="11" cy="12" fill="currentColor" r="0.8" />
					</svg>
					{justAdded ? t("publicProductCard.added") : t("publicProductCard.addToCart")}
				</button>
				<button
					className="flex w-full items-center justify-center gap-1 rounded-sm py-1 font-sans text-sm font-medium text-text-muted transition-colors hover:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ink)/35 focus-visible:ring-offset-2"
					onClick={() => setModal("b2b")}
					type="button"
				>
					{t("publicProductCard.wholesaleInquiryCta")}
					<svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
						<path
							d="M2 6h8M7 3l3 3-3 3"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.4"
						/>
					</svg>
				</button>
			</div>
			{justAdded ? (
				<div
					className="mt-2 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 font-sans text-emerald-900 text-xs"
					aria-live="polite"
					role="status"
				>
					<span className="font-semibold">{t("publicInquiryTriggers.addedToCart")}</span>{" "}
					<Link className="font-semibold text-text-dark underline underline-offset-2" href="/cart">
						{t("publicInquiryTriggers.viewCart")}
					</Link>
				</div>
			) : null}
			<p className="mt-2 font-sans text-[11px] text-stone-500 leading-relaxed">
				{t("publicInquiryTriggers.billingHint")}
				{process.env.NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE?.trim()
					? ` ${process.env.NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE.trim()}`
					: ""}
			</p>

			{modal ? (
				<ProductInquiryModal mode={modal} onClose={() => setModal(null)} product={modalProduct} />
			) : null}
		</>
	);
}
