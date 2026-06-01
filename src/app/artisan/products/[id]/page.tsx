import Link from "next/link";
import React from "react";
import { ProductDetailView } from "~/features/artisan/components/products/product-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function ProductShowPage({ params }: Props) {
	const { id } = await params;
	return (
		<div className="flex w-full flex-col gap-6 p-4 lg:p-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/products"
				>
					Products
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="truncate font-medium font-sans text-text-dark">
					View
				</span>
			</nav>
			<ProductDetailView productId={id} />
		</div>
	);
}
