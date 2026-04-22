import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProducerBySlug } from "~/app/api/profile/actions";
import { PublicArtisanPage } from "./public-artisan-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artisan = await getPublicProducerBySlug(slug);
  if (!artisan) return { title: "Artisan | CraftHouse" };
  return {
    title: `${artisan.entityName} | Verified artisan | CraftHouse`,
    description:
      artisan.publicTagline?.trim() ||
      artisan.businessDescription?.slice(0, 160) ||
      `${artisan.entityType} in ${artisan.city}, Morocco — verified on CraftHouse.`,
  };
}

export default async function PublicArtisanRoute({ params }: Props) {
  const { slug } = await params;
  const artisan = await getPublicProducerBySlug(slug);
  if (!artisan) notFound();
  return <PublicArtisanPage producer={artisan} />;
}
