import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProducerBySlug } from "~/app/api/profile/actions";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { PublicArtisanPage } from "./public-artisan-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const artisan = await getPublicProducerBySlug(slug);
	if (!artisan) return { title: "Brand | nevali" };
	const titleSuffix = SHOW_MULTI_PRODUCER_EXPERIENCE
		? "Verified brand | nevali"
		: "Nevali | nevali";
	const defaultDescription = SHOW_MULTI_PRODUCER_EXPERIENCE
		? `${artisan.entityType} in ${artisan.city}, Morocco — verified Moroccan cosmetics on nevali.`
		: `${artisan.entityType} in ${artisan.city}, Morocco — Moroccan cosmetics by Nevali.`;
	return {
		title: `${artisan.entityName} | ${titleSuffix}`,
		description:
			artisan.publicTagline?.trim() ||
			artisan.businessDescription?.slice(0, 160) ||
			defaultDescription,
	};
}

export default async function PublicArtisanRoute({ params }: Props) {
	const { slug } = await params;
	const artisan = await getPublicProducerBySlug(slug);
	if (!artisan) notFound();
	return <PublicArtisanPage producer={artisan} />;
}
