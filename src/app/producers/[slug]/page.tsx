import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProducerBySlug } from "~/app/api/profile/actions";
import { PublicProducerPage } from "./public-producer-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const producer = await getPublicProducerBySlug(slug);
	if (!producer) return { title: "Producer | nevali" };
	return {
		title: `${producer.entityName} | Verified producer | nevali`,
		description:
			producer.publicTagline?.trim() ||
			producer.businessDescription?.slice(0, 160) ||
			`${producer.entityType} in ${producer.city}, Morocco — verified on nevali.`,
	};
}

export default async function PublicProducerRoute({ params }: Props) {
	const { slug } = await params;
	const producer = await getPublicProducerBySlug(slug);
	if (!producer) notFound();
	return <PublicProducerPage producer={producer} />;
}
