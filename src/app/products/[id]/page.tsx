import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApprovedProductForPublicByIdRepo } from "~/app/api/products/repo/products.repo";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { absoluteUrl } from "~/lib/site-url";
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
		alternates: { canonical: `/products/${id}` },
		openGraph: {
			type: "website",
			title: product.name,
			description: desc,
			url: `/products/${id}`,
			images: product.images[0]?.url
				? [{ url: product.images[0].url }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: desc,
			images: product.images[0]?.url ? [product.images[0].url] : undefined,
		},
	};
}

export default async function PublicProductPage({ params }: Props) {
	const { id } = await params;
	const product = await getApprovedProductForPublicByIdRepo(id);
	if (!product) notFound();

	const prices = product.variants
		.map((v) => Number(v.price))
		.filter((n) => Number.isFinite(n) && n > 0);
	const anyInStock = product.variants.some((v) => v.inStock);
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description?.trim() || undefined,
		image: product.images.map((i) => i.url),
		brand: { "@type": "Brand", name: product.organizationName },
		...(prices.length > 0
			? {
					offers: {
						"@type": "AggregateOffer",
						priceCurrency: "MAD",
						lowPrice: Math.min(...prices).toFixed(2),
						highPrice: Math.max(...prices).toFixed(2),
						offerCount: prices.length,
						availability: anyInStock
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						url: absoluteUrl(`/products/${id}`),
					},
				}
			: {}),
	};

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-14">
			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				type="application/ld+json"
			/>
			<Navbar />
			<PublicProductDetailView product={product} />
			<Footer />
		</main>
	);
}
