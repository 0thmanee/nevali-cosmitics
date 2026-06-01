import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPartner } from "~/app/api/partners/public-actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import type {
	PublicPartnerCertification,
	PublicPartnerProduct,
} from "~/app/partners/public-types";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import PartnerTabs from "./PartnerTabs";

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
			interpolate(t("partnerDetailPage.metaDescription"), {
				city: profile.city,
				region: profile.region,
			}),
	};
}

function getCategories(raw: unknown): string[] {
	return Array.isArray(raw) ? (raw as string[]) : [];
}

const AVATAR_PALETTES = [
	{ bg: "var(--color-ink)", text: "var(--color-paper)" },
	{
		bg: "color-mix(in srgb, var(--color-ink) 90%, black)",
		text: "var(--color-cream)",
	},
	{ bg: "var(--color-text-muted)", text: "var(--color-paper)" },
	{
		bg: "color-mix(in srgb, var(--color-ink) 82%, black)",
		text: "var(--color-cream)",
	},
];

function avatarPalette(id: string) {
	let hash = 0;
	for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
	return (
		AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length] ??
		AVATAR_PALETTES[0]!
	);
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
		<main className="flex min-h-screen w-full flex-col bg-cream">
			<Navbar />

			{/* Hero */}
			<div className="bg-primary pt-[56px]">
				<div className="mx-auto max-w-7xl px-6">
					{/* Breadcrumb */}
					<nav className="flex flex-wrap items-center gap-2 border-white/10 border-b py-4 font-sans text-white/40 text-xs uppercase tracking-[0.08em]">
						{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
							<Link
								className="transition-colors hover:text-white/70"
								href="/artisans"
							>
								{t("partnerDetailPage.breadcrumbArtisans")}
							</Link>
						) : (
							<Link
								className="transition-colors hover:text-white/70"
								href="/products"
							>
								{t("partnerDetailPage.breadcrumbShop")}
							</Link>
						)}
						<span>/</span>
						<span>{profile.region}</span>
						<span>/</span>
						<span className="text-white/70">{profile.entityName}</span>
					</nav>

					<div className="flex flex-col justify-between gap-10 py-16 md:flex-row md:items-end">
						{/* Left: identity */}
						<div className="flex min-w-0 items-start gap-5">
							{/* Avatar */}
							{org?.logo ? (
								<div
									className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/20"
									style={{
										background:
											"color-mix(in srgb, var(--color-ink) 20%, transparent)",
									}}
								>
									<Image
										alt=""
										className="object-contain p-2"
										fill
										sizes="80px"
										src={org.logo}
									/>
								</div>
							) : profile.profileImage ? (
								<Image
									alt={profile.entityName}
									className="h-20 w-20 shrink-0 border border-white/20 object-cover"
									height={80}
									src={profile.profileImage}
									width={80}
								/>
							) : (
								<div
									className="flex h-20 w-20 shrink-0 items-center justify-center border border-white/15 font-bold font-serif text-3xl"
									style={{ backgroundColor: palette.bg, color: palette.text }}
								>
									{initial}
								</div>
							)}

							<div className="flex min-w-0 flex-col gap-3">
								<p className="font-sans text-secondary text-xs uppercase tracking-[0.2em]">
									{profile.entityType ??
										t("partnerDetailPage.verifiedArtisanFallback")}
								</p>
								<h1
									className="font-bold font-serif text-white uppercase leading-[1.0]"
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
									<div className="mt-1 flex flex-wrap gap-2">
										{categories.map((cat) => (
											<span
												className="border border-white/20 px-2.5 py-1 font-sans text-white/70 text-xs"
												key={cat}
											>
												{cat}
											</span>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Right: tagline + stats */}
						<div className="flex shrink-0 flex-col gap-6 md:max-w-xs">
							{profile.publicTagline ? (
								<p className="font-sans text-sm text-white/60 leading-relaxed">
									{profile.publicTagline}
								</p>
							) : null}
							<dl className="flex gap-6">
								{[
									{
										label: t("partnerDetailPage.statProducts"),
										value: String(products.length),
									},
									{
										label: t("partnerDetailPage.statCertifications"),
										value: String(certifications.length),
									},
								].map((s) => (
									<div className="flex flex-col gap-0.5" key={s.label}>
										<dd
											className="font-bold font-serif text-secondary"
											style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
										>
											{s.value}
										</dd>
										<dt className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
											{s.label}
										</dt>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</div>

			<PartnerTabs
				certifications={certifications}
				organization={
					org
						? { id: org.id, name: org.name, slug: org.slug, logo: org.logo }
						: null
				}
				platformSince={platformSince}
				products={products}
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
			/>

			<Footer />
		</main>
	);
}
