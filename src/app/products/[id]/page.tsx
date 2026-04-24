import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getApprovedProductForPublicByIdRepo } from "~/app/api/products/repo/products.repo";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { PublicProductDetailView } from "./public-product-detail-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const t = await getTranslator();
	const { id } = await params;
	const product = await getApprovedProductForPublicByIdRepo(id);
	if (!product) {
		return { title: t("pdp.metaFallbackTitle") };
	}
	const desc =
		product.description?.trim().slice(0, 155) ||
		(SHOW_MULTI_PRODUCER_EXPERIENCE
			? interpolate(t("pdp.metaDescMulti"), {
					name: product.name,
					organizationName: product.organizationName,
				})
			: interpolate(t("pdp.metaDescSingle"), {
					name: product.name,
					brand: NEVALI_HOUSE_BRAND.legalName,
				}));
	return {
		title: t("pdp.metaTitle", { name: product.name }),
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
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<Navbar />
			<PublicProductDetailView product={product} />
			<Footer />
		</main>
	);
}
