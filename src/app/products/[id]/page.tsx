import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getApprovedProductForPublicByIdRepo } from "~/app/api/products/repo/products.repo";
import { PublicProductDetailView } from "./public-product-detail-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const product = await getApprovedProductForPublicByIdRepo(id);
	if (!product) {
		return { title: "Product — CraftHouse" };
	}
	const desc =
		product.description?.trim().slice(0, 155) ||
		`Certified ${product.category} from ${product.organizationName} on CraftHouse — verified producer and B2B sourcing.`;
	return {
		title: `${product.name} — CraftHouse`,
		description: desc,
		openGraph: {
			title: product.name,
			description: desc,
			images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
		},
	};
}

export default async function PublicProductPage({ params }: Props) {
	const { id } = await params;
	const product = await getApprovedProductForPublicByIdRepo(id);
	if (!product) notFound();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream">
			<Navbar />
			<PublicProductDetailView product={product} />
			<Footer />
		</main>
	);
}
