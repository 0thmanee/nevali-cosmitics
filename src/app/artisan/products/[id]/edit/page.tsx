import Link from "next/link";
import React from "react";
import { ProductEditForm } from "~/features/artisan/components/products/product-edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditPage({ params }: Props) {
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
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href={`/artisan/products/${id}`}
				>
					View
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="font-medium font-sans text-text-dark">Edit</span>
			</nav>
			<ProductEditForm productId={id} />
		</div>
	);
}
