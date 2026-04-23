import React from "react";
import Link from "next/link";
import { ProductEditForm } from "~/features/artisan/components/products/product-edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 w-full">
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/artisan/products"
          className="font-sans text-text-muted hover:text-text-dark transition-colors"
        >
          Products
        </Link>
        <span className="font-sans text-text-muted/60">/</span>
        <Link
          href={`/artisan/products/${id}`}
          className="font-sans text-text-muted hover:text-text-dark transition-colors"
        >
          View
        </Link>
        <span className="font-sans text-text-muted/60">/</span>
        <span className="font-sans font-medium text-text-dark">Edit</span>
      </nav>
      <ProductEditForm productId={id} />
    </div>
  );
}
