import Link from "next/link";
import React from "react";
import { ProductCreateForm } from "~/features/artisan/components/products/product-create-form";

export default function NewProductPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/products"
				>
					Products
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="font-medium font-sans text-text-dark">Add new</span>
			</nav>
			<ProductCreateForm />
		</div>
	);
}
