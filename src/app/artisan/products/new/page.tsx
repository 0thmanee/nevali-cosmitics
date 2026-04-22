import React from "react";
import Link from "next/link";
import { ProductCreateForm } from "~/features/artisan/components/products/product-create-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/artisan/products"
          className="font-sans text-[#7a4d38] hover:text-[#2a0f05] transition-colors"
        >
          Products
        </Link>
        <span className="font-sans text-[#7a4d38]/60">/</span>
        <span className="font-sans font-medium text-[#2a0f05]">Add new</span>
      </nav>
      <ProductCreateForm />
    </div>
  );
}
