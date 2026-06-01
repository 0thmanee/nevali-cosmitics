import Link from "next/link";
import React from "react";
import { ProductCreateForm } from "~/features/artisan/components/products/product-create-form";
import { getTranslator } from "~/lib/i18n/server";

export default async function NewProductPage() {
	const t = await getTranslator();
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/products"
				>
					{t("producerProductPages.breadcrumbProducts")}
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="font-medium font-sans text-text-dark">
					{t("producerProductPages.breadcrumbAddNew")}
				</span>
			</nav>
			<ProductCreateForm />
		</div>
	);
}
