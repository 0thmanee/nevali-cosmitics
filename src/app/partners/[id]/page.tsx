import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { getPublicPartner } from "~/app/api/partners/public-actions";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import PartnerTabs from "./PartnerTabs";
import type {
  PublicPartnerCertification,
  PublicPartnerProduct,
} from "~/app/partners/public-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslator();
  const { id } = await params;
  const partner = await getPublicPartner(id);
  if (!partner?.profile) {
    return { title: t("partnerDetailPage.metaFallbackTitle") };
  }
  const { profile } = partner;
  return {
    title: t("partnerDetailPage.metaTitle", { entityName: profile.entityName }),
    description:
      profile.publicTagline?.trim() ||
      interpolate(t("partnerDetailPage.metaDescription"), { city: profile.city, region: profile.region }),
  };
}

function getCategories(raw: unknown): string[] {
  return Array.isArray(raw) ? (raw as string[]) : [];
}

const AVATAR_PALETTES = [
  { bg: "var(--color-ink)", text: "var(--color-paper)" },
  { bg: "color-mix(in srgb, var(--color-ink) 90%, black)", text: "var(--color-cream)" },
  { bg: "var(--color-text-muted)", text: "var(--color-paper)" },
  { bg: "color-mix(in srgb, var(--color-ink) 82%, black)", text: "var(--color-cream)" },
];

function avatarPalette(id: string) {
  let hash = 0;
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length] ?? AVATAR_PALETTES[0]!;
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPublicPartner(id);

  if (!partner || !partner.profile) notFound();

  const { profile } = partner;
  const categories = getCategories(profile.categories);
  const initial = profile.entityName.charAt(0).toUpperCase();
  const palette = avatarPalette(partner.id);

  const org = partner.members?.[0]?.organization ?? null;
  const rawProducts = org?.products ?? [];
  const products: PublicPartnerProduct[] = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    status: p.status,
    moq: p.moq,
    capacity: p.capacity,
    description: p.description,
    paymentOption: p.paymentOption,
    firstImageUrl: p.images?.[0]?.url ?? null,
    gallery: (p.images ?? []).map((i) => ({
      id: i.id,
      url: i.url,
      sortOrder: i.sortOrder,
      variantId: i.variantId,
    })),
    variants: (p.variants ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      unit: v.unit,
      minOrderQuantity: v.minOrderQuantity,
      minOrderNote: v.minOrderNote,
      price: v.price.toFixed(2),
      quantityOnHand: v.quantityOnHand,
      inStock: v.inStock,
      sortOrder: v.sortOrder,
    })),
    organizationId: p.organizationId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  const rawCerts = org?.certifications ?? [];
  const certifications: PublicPartnerCertification[] = rawCerts.map((c) => ({
    id: c.id,
    name: c.name,
    fileUrl: c.fileUrl,
    productId: c.productId,
    createdAt: c.createdAt,
    product: c.product,
  }));

  const platformSince = new Date(partner.createdAt).getFullYear().toString();
  const t = await getTranslator();

  return (
    <main className="flex flex-col w-full min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary pt-[56px]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10 flex-wrap">
            {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
              <Link href="/artisans" className="hover:text-white/70 transition-colors">
                {t("partnerDetailPage.breadcrumbArtisans")}
              </Link>
            ) : (
              <Link href="/products" className="hover:text-white/70 transition-colors">
                {t("partnerDetailPage.breadcrumbShop")}
              </Link>
            )}
            <span>/</span>
            <span>{profile.region}</span>
            <span>/</span>
            <span className="text-white/70">{profile.entityName}</span>
          </nav>

          <div className="py-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
            {/* Left: identity */}
            <div className="flex items-start gap-5 min-w-0">
              {/* Avatar */}
              {org?.logo ? (
                <div className="relative w-20 h-20 shrink-0 border border-white/20 overflow-hidden" style={{ background: "color-mix(in srgb, var(--color-ink) 20%, transparent)" }}>
                  <Image src={org.logo} alt="" fill className="object-contain p-2" sizes="80px" />
                </div>
              ) : profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.entityName}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover shrink-0 border border-white/20"
                />
              ) : (
                <div
                  className="w-20 h-20 flex items-center justify-center font-serif font-bold text-3xl shrink-0 border border-white/15"
                  style={{ backgroundColor: palette.bg, color: palette.text }}
                >
                  {initial}
                </div>
              )}

              <div className="flex flex-col gap-3 min-w-0">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
                  {profile.entityType ?? t("partnerDetailPage.verifiedArtisanFallback")}
                </p>
                <h1
                  className="font-serif font-bold uppercase text-white leading-[1.0]"
                  style={{ fontSize: "clamp(24px, 3.5vw, 52px)" }}
                >
                  {profile.entityName}
                </h1>
                <p className="font-sans text-sm text-white/55">
                  {profile.city}, {profile.region}
                  {profile.yearEstablished
                    ? ` · ${interpolate(t("partnersDirectory.established"), { year: profile.yearEstablished })}`
                    : ""}
                </p>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {categories.map((cat) => (
                      <span key={cat} className="font-sans text-xs text-white/70 border border-white/20 px-2.5 py-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: tagline + stats */}
            <div className="md:max-w-xs shrink-0 flex flex-col gap-6">
              {profile.publicTagline ? (
                <p className="font-sans text-white/60 leading-relaxed text-sm">
                  {profile.publicTagline}
                </p>
              ) : null}
              <dl className="flex gap-6">
                {[
                  { label: t("partnerDetailPage.statProducts"), value: String(products.length) },
                  { label: t("partnerDetailPage.statCertifications"), value: String(certifications.length) },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5">
                    <dd className="font-serif font-bold text-secondary" style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}>{s.value}</dd>
                    <dt className="font-sans text-[10px] uppercase tracking-widest text-white/40">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <PartnerTabs
        profile={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          entityType: profile.entityType,
          entityName: profile.entityName,
          registrationNumber: profile.registrationNumber,
          region: profile.region,
          city: profile.city,
          yearEstablished: profile.yearEstablished,
          website: profile.website,
          categories: profile.categories,
          annualCapacity: profile.annualCapacity,
          exportExperience: profile.exportExperience,
          profileImage: profile.profileImage,
          publicTagline: profile.publicTagline,
          businessDescription: profile.businessDescription,
          exportMarkets: profile.exportMarkets,
          valuesHighlight: profile.valuesHighlight,
        }}
        organization={
          org
            ? { id: org.id, name: org.name, slug: org.slug, logo: org.logo }
            : null
        }
        products={products}
        certifications={certifications}
        platformSince={platformSince}
      />

      <Footer />
    </main>
  );
}
