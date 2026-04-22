import React from "react";
import Link from "next/link";
import { ProductDetailView } from "~/features/artisan/components/products/product-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function ProductShowPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 w-full">
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/artisan/products"
          className="font-sans text-[#7a4d38] hover:text-[#2a0f05] transition-colors"
        >
          Products
        </Link>
        <span className="font-sans text-[#7a4d38]/60">/</span>
        <span className="font-sans font-medium text-[#2a0f05] truncate">View</span>
      </nav>
      <ProductDetailView productId={id} />
    </div>
  );
}
