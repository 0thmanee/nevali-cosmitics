"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type {
	PublicPartnerCertification,
	PublicPartnerOrganization,
	PublicPartnerProduct,
	PublicPartnerProfileDetail,
} from "~/app/partners/public-types";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { PublicProductInquiryTriggers } from "~/components/public-product-inquiry-triggers";
import type { PublicProduct } from "~/components/public-product-types";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { interpolate } from "~/lib/i18n/interpolate";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { buildPublicProductListRow } from "~/lib/public-product-mapper";

type PartnerTabsProps = {
	profile: PublicPartnerProfileDetail;
	organization: PublicPartnerOrganization | null;
	products: PublicPartnerProduct[];
	certifications: PublicPartnerCertification[];
	platformSince: string;
};

function getCategories(raw: unknown): string[] {
	return Array.isArray(raw) ? (raw as string[]) : [];
}

function formatCertDate(d: Date | string) {
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
	}).format(date);
}

function formatListingDate(d: Date | string) {
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

function partnerProductPriceLabel(
	p: PublicPartnerProduct,
	formatMad: (amount: string | null | undefined) => string,
	t: (key: string, vars?: Record<string, string | number>) => string,
): string {
	if (p.variants.length === 0) return t("partnerTabs.dash");
	const nums = p.variants
		.map((v) => Number(v.price.replace(",", ".")))
		.filter(Number.isFinite);
	if (nums.length === 0) return t("partnerTabs.dash");
	const min = Math.min(...nums);
	const max = Math.max(...nums);
	if (min === max) return formatMad(min.toFixed(2));
	return interpolate(t("partnerTabs.priceFrom"), {
		price: formatMad(min.toFixed(2)),
	});
}

function productToPublic(
	p: PublicPartnerProduct,
	organizationName: string,
): PublicProduct {
	return buildPublicProductListRow({
		id: p.id,
		name: p.name,
		description: p.description,
		category: p.category,
		moq: p.moq,
		organizationId: p.organizationId,
		organizationName,
		firstImageUrl: p.firstImageUrl,
		paymentOption: p.paymentOption,
		gallery: p.gallery,
		variants: p.variants.map((v) => ({
			...v,
			price: new Prisma.Decimal(v.price),
		})),
	});
}

function ProductThumb({ product }: { product: PublicPartnerProduct }) {
	const src =
		product.firstImageUrl ??
		productPlaceholderImageUrl(`${product.id}:${product.category}`, 176);
	return (
		<div className="relative h-11 w-11 shrink-0 overflow-hidden border border-cream-dark bg-cream">
			<Image alt="" className="object-cover" fill sizes="44px" src={src} />
		</div>
	);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-3 font-body font-bold text-[10px] text-text-muted uppercase tracking-[0.2em]">
			{children}
		</p>
	);
}

function ProseBlock({
	title,
	children,
	empty,
}: {
	title: string;
	children: React.ReactNode;
	empty?: React.ReactNode;
}) {
	return (
		<div className="border border-cream-dark bg-white p-6 sm:p-8">
			<SectionLabel>{title}</SectionLabel>
			{children ? (
				<div className="whitespace-pre-wrap font-body text-[15px] text-text-dark leading-relaxed">
					{children}
				</div>
			) : (
				empty
			)}
		</div>
	);
}

function StatBox({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col gap-1 border border-cream-dark bg-white p-4">
			<span
				className="font-bold font-display text-text-dark leading-none"
				style={{ fontSize: 26 }}
			>
				{value}
			</span>
			<span className="font-body font-bold text-[9px] text-text-muted uppercase tracking-[0.12em]">
				{label}
			</span>
		</div>
	);
}

function VerifiedBadge() {
	const { t } = useI18n();
	return (
		<span
			className="shrink-0 border px-2 py-0.5 font-body font-bold text-[10px] uppercase tracking-wide"
			style={{
				borderColor: "var(--color-text-muted)",
				color: "var(--color-text-muted)",
				background:
					"color-mix(in srgb, var(--color-text-muted) 7%, transparent)",
			}}
		>
			{t("partnerTabs.verified")}
		</span>
	);
}

function ApprovedBadge() {
	const { t } = useI18n();
	return (
		<span
			className="inline-flex border px-2 py-0.5 font-body font-bold text-[10px] uppercase tracking-wide"
			style={{
				borderColor: "var(--color-text-muted)",
				color: "var(--color-text-muted)",
				background:
					"color-mix(in srgb, var(--color-text-muted) 7%, transparent)",
			}}
		>
			{t("partnerTabs.approved")}
		</span>
	);
}

function OverviewTab({
	profile,
	organization,
	products,
	certifications,
	platformSince,
}: PartnerTabsProps) {
	const { t } = useI18n();
	const categories = getCategories(profile.categories);
	const contactName = `${profile.firstName} ${profile.lastName}`.trim();
	const websiteDisplay = profile.website
		?.replace(/^https?:\/\//, "")
		.replace(/\/$/, "");

	return (
		<div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
			<div className="flex min-w-0 flex-1 flex-col gap-6">
				{profile.businessDescription ? (
					<ProseBlock title={t("partnerTabs.aboutBusiness")}>
						{profile.businessDescription}
					</ProseBlock>
				) : profile.exportExperience ? (
					<ProseBlock title={t("partnerTabs.exportExperience")}>
						{profile.exportExperience}
					</ProseBlock>
				) : (
					<div className="border border-cream-dark bg-white p-6 sm:p-8">
						<SectionLabel>{t("partnerTabs.aboutBusiness")}</SectionLabel>
						<p className="font-body text-sm text-text-muted italic">
							{t("partnerTabs.aboutEmpty")}
						</p>
					</div>
				)}

				{profile.businessDescription && profile.exportExperience ? (
					<ProseBlock title={t("partnerTabs.exportExperience")}>
						{profile.exportExperience}
					</ProseBlock>
				) : null}

				{profile.exportMarkets ? (
					<div className="border border-cream-dark bg-white p-6 sm:p-8">
						<SectionLabel>{t("partnerTabs.exportMarkets")}</SectionLabel>
						<p className="whitespace-pre-wrap font-body text-[15px] text-text-dark leading-relaxed">
							{profile.exportMarkets}
						</p>
					</div>
				) : null}

				{profile.valuesHighlight ? (
					<div
						className="border border-cream-dark p-6 sm:p-8"
						style={{ background: "var(--color-cream)" }}
					>
						<SectionLabel>{t("partnerTabs.valuesPractices")}</SectionLabel>
						<p className="whitespace-pre-wrap font-body text-[15px] text-text-dark leading-relaxed">
							{profile.valuesHighlight}
						</p>
					</div>
				) : null}

				{/* Key figures */}
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<StatBox
						label={t("partnerTabs.statProductLines")}
						value={String(categories.length)}
					/>
					<StatBox
						label={t("partnerTabs.statLiveProducts")}
						value={String(products.length)}
					/>
					<StatBox
						label={t("partnerTabs.statCertifications")}
						value={String(certifications.length)}
					/>
					<StatBox
						label={t("partnerTabs.statFounded")}
						value={profile.yearEstablished ?? t("partnerTabs.dash")}
					/>
				</div>
			</div>

			{/* Sidebar */}
			<aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[280px]">
				{/* Contact & legal */}
				<div className="border border-white/10 bg-primary">
					<div
						className="h-0.5 w-full"
						style={{
							background:
								"linear-gradient(90deg, var(--color-ink) 0%, var(--color-text-muted) 100%)",
						}}
					/>
					<div className="p-5">
						<p className="mb-4 font-body font-bold text-[10px] text-white/40 uppercase tracking-[0.2em]">
							{t("partnerTabs.contactLegal")}
						</p>
						<dl className="flex flex-col gap-4">
							{organization ? (
								<div>
									<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
										{t("partnerTabs.registeredEntity")}
									</dt>
									<dd className="mt-1 font-body font-medium text-sm text-white/90">
										{organization.name}
									</dd>
								</div>
							) : null}
							<div>
								<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
									{t("partnerTabs.contact")}
								</dt>
								<dd className="mt-1 font-body font-medium text-sm text-white/90">
									{contactName}
								</dd>
							</div>
							{profile.phone ? (
								<div>
									<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
										{t("partnerTabs.phone")}
									</dt>
									<dd className="mt-1">
										<a
											className="font-body font-medium text-secondary text-sm hover:underline"
											href={`tel:${profile.phone.replace(/\s/g, "")}`}
										>
											{profile.phone}
										</a>
									</dd>
								</div>
							) : null}
							{profile.website ? (
								<div>
									<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
										{t("partnerTabs.website")}
									</dt>
									<dd className="mt-1">
										<a
											className="break-all font-body font-medium text-secondary text-sm hover:underline"
											href={
												profile.website.startsWith("http")
													? profile.website
													: `https://${profile.website}`
											}
											rel="noopener noreferrer"
											target="_blank"
										>
											{websiteDisplay}
										</a>
									</dd>
								</div>
							) : null}
							{profile.registrationNumber ? (
								<div>
									<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
										{t("partnerTabs.registrationNo")}
									</dt>
									<dd className="mt-1 font-mono text-sm text-white/80">
										{profile.registrationNumber}
									</dd>
								</div>
							) : null}
							<div>
								<dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">
									{t("partnerTabs.onNevaliSince")}
								</dt>
								<dd className="mt-1 font-body text-sm text-white/80">
									{platformSince}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Location + capacity */}
				<div className="border border-cream-dark bg-white p-5">
					<SectionLabel>{t("partnerTabs.location")}</SectionLabel>
					<p className="font-body text-sm text-text-dark">
						{profile.city}, {profile.region}
						{t("partnerTabs.locationMoroccoSuffix")}
					</p>
					{profile.annualCapacity ? (
						<div className="mt-4 border-cream-dark border-t pt-4">
							<SectionLabel>{t("partnerTabs.annualCapacity")}</SectionLabel>
							<p className="font-body font-medium text-sm text-text-dark">
								{profile.annualCapacity}
							</p>
						</div>
					) : null}
				</div>

				<Link
					className="inline-flex items-center gap-2 font-body text-sm text-text-muted transition-colors hover:text-text-dark"
					href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"}
				>
					{SHOW_MULTI_PRODUCER_EXPERIENCE
						? t("partnerTabs.backToBrands")
						: t("partnerTabs.backToShop")}
				</Link>
			</aside>
		</div>
	);
}

function CertificationsTab({
	certifications,
}: {
	certifications: PublicPartnerCertification[];
}) {
	const { t } = useI18n();
	if (certifications.length === 0) {
		return (
			<div className="mx-auto flex max-w-lg flex-col items-center gap-3 border border-cream-dark bg-white p-12 text-center">
				<div className="flex h-12 w-12 items-center justify-center border border-cream-dark">
					<svg
						aria-hidden
						fill="none"
						height="22"
						viewBox="0 0 20 20"
						width="22"
					>
						<path
							d="M10 2l2.2 5L17 7.5l-3.5 3.5.8 5L10 13.5 6.7 16l.8-5L4 7.5 8.8 7z"
							stroke="var(--color-primary-darker)"
							strokeLinejoin="round"
							strokeWidth="1.4"
						/>
					</svg>
				</div>
				<p className="font-bold font-display text-sm text-text-dark uppercase tracking-wide">
					{t("partnerTabs.certsEmptyTitle")}
				</p>
				<p className="font-body text-sm text-text-muted">
					{t("partnerTabs.certsEmptyBody")}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<StatBox
					label={t("partnerTabs.statVerifiedOnFile")}
					value={String(certifications.length)}
				/>
				<StatBox
					label={t("partnerTabs.statEntityWide")}
					value={String(certifications.filter((c) => !c.productId).length)}
				/>
				<StatBox
					label={t("partnerTabs.statProductLinked")}
					value={String(certifications.filter((c) => c.productId).length)}
				/>
				<StatBox
					label={t("partnerTabs.statRenewal")}
					value={t("partnerTabs.dash")}
				/>
			</div>

			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{certifications.map((c) => (
					<li
						className="flex flex-col gap-3 border border-cream-dark bg-white p-5 transition-colors hover:border-primary/30"
						key={c.id}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0">
								<p className="font-body font-semibold text-text-dark leading-snug">
									{c.name}
								</p>
								{c.product ? (
									<p className="mt-1 font-body text-text-muted text-xs">
										{interpolate(t("partnerTabs.certProductLabel"), {
											name: c.product.name,
										})}
									</p>
								) : (
									<p
										className="mt-1 font-body text-text-muted text-xs uppercase tracking-wide"
										style={{ color: "var(--color-text-muted)" }}
									>
										{t("partnerTabs.certOrgLevel")}
									</p>
								)}
							</div>
							<VerifiedBadge />
						</div>
						<div className="flex items-center justify-between gap-3 border-cream-dark border-t pt-2">
							<span className="font-body text-text-muted text-xs">
								{interpolate(t("partnerTabs.certAdded"), {
									date: formatCertDate(c.createdAt),
								})}
							</span>
							<a
								className="inline-flex items-center gap-1 font-body font-semibold text-primary text-sm transition-colors hover:text-primary-dark"
								href={c.fileUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								{t("partnerTabs.viewDocument")}
							</a>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function ProductsTab({
	products,
	organizationName,
}: {
	products: PublicPartnerProduct[];
	organizationName: string;
}) {
	const { t } = useI18n();
	const { formatMad } = useFormatPrice();
	if (products.length === 0) {
		return (
			<div className="mx-auto flex max-w-lg flex-col items-center gap-3 border border-cream-dark bg-white p-12 text-center">
				<p className="font-bold font-display text-sm text-text-dark uppercase tracking-wide">
					{t("partnerTabs.productsEmptyTitle")}
				</p>
				<p className="font-body text-sm text-text-muted">
					{t("partnerTabs.productsEmptyBody")}
				</p>
			</div>
		);
	}

	const tableHeaders = [
		t("partnerTabs.tableListing"),
		t("partnerTabs.tableCategory"),
		t("partnerTabs.tablePrice"),
		t("partnerTabs.tableMoq"),
		t("partnerTabs.tableCapacity"),
		t("partnerTabs.tableStatus"),
		t("partnerTabs.tableListed"),
		t("partnerTabs.tableUpdated"),
		t("partnerTabs.tableActions"),
	] as const;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="font-body font-bold text-[10px] text-text-muted uppercase tracking-[0.2em]">
						{t("partnerTabs.catalogEyebrow")}
					</p>
					<h2
						className="mt-1 font-bold font-display text-text-dark uppercase"
						style={{ fontSize: 24 }}
					>
						{products.length === 1
							? interpolate(t("partnerTabs.liveListingsTitle"), {
									count: products.length,
								})
							: interpolate(t("partnerTabs.liveListingsTitlePlural"), {
									count: products.length,
								})}
					</h2>
					<p className="mt-1 max-w-xl font-body text-sm text-text-muted">
						{t("partnerTabs.catalogIntro")}
					</p>
				</div>
			</div>

			{/* Desktop table */}
			<div className="hidden overflow-x-auto border border-cream-dark bg-white md:block">
				<table className="w-full min-w-[800px] border-collapse text-left">
					<thead>
						<tr
							className="border-cream-dark border-b"
							style={{ background: "var(--color-cream)" }}
						>
							{tableHeaders.map((h) => (
								<th
									className="px-4 py-3 font-body font-bold text-[10px] text-text-muted uppercase tracking-widest"
									key={h}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr
								className="border-cream-dark border-b transition-colors last:border-0 hover:bg-cream/50"
								key={product.id}
							>
								<td className="px-4 py-3">
									<div className="flex items-center gap-3">
										<ProductThumb product={product} />
										<div className="min-w-0">
											<p className="font-body font-semibold text-sm text-text-dark leading-snug">
												{product.name}
											</p>
											<p className="mt-0.5 truncate font-mono text-[10px] text-text-muted/80">
												{interpolate(t("partnerTabs.listingId"), {
													id: product.id,
												})}
											</p>
										</div>
									</div>
								</td>
								<td className="px-4 py-3 font-body text-sm text-text-dark/90">
									{product.category}
								</td>
								<td className="whitespace-nowrap px-4 py-3 font-body font-semibold text-sm text-text-dark">
									{partnerProductPriceLabel(product, formatMad, t)}
								</td>
								<td className="px-4 py-3 font-body text-sm text-text-dark">
									{product.moq ?? t("partnerTabs.dash")}
								</td>
								<td className="px-4 py-3 font-body text-sm text-text-dark">
									{product.capacity ?? t("partnerTabs.dash")}
								</td>
								<td className="px-4 py-3">
									<ApprovedBadge />
								</td>
								<td className="px-4 py-3 font-body text-text-muted text-xs">
									{formatListingDate(product.createdAt)}
								</td>
								<td className="px-4 py-3 font-body text-text-muted text-xs">
									{formatListingDate(product.updatedAt)}
								</td>
								<td className="px-4 py-3">
									<div className="flex flex-col gap-2">
										<Link
											className="font-body font-semibold text-primary text-xs hover:underline"
											href={`/products/${product.id}`}
										>
											{t("partnerTabs.publicPageLink")}
										</Link>
										<PublicProductInquiryTriggers
											className="flex flex-col gap-1"
											product={productToPublic(product, organizationName)}
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile stacked cards */}
			<div className="flex flex-col gap-4 md:hidden">
				{products.map((product) => {
					const heroSrc =
						product.firstImageUrl ??
						productPlaceholderImageUrl(
							`${product.id}:${product.category}`,
							800,
						);
					return (
						<article
							className="overflow-hidden border border-cream-dark bg-white"
							key={product.id}
						>
							<div className="relative h-36 border-cream-dark border-b bg-cream">
								<Image
									alt=""
									className="object-cover"
									fill
									sizes="100vw"
									src={heroSrc}
								/>
								<div
									aria-hidden
									className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"
								/>
								<div className="absolute right-4 bottom-3 left-4">
									<p className="font-body font-bold text-[10px] text-white/70 uppercase tracking-widest">
										{product.category}
									</p>
									<h3 className="mt-0.5 font-bold font-display text-lg text-white uppercase leading-tight">
										{product.name}
									</h3>
								</div>
							</div>
							<div className="flex flex-col gap-3 p-4">
								<dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-body text-[12px]">
									{[
										{
											label: t("partnerTabs.tablePrice"),
											value: partnerProductPriceLabel(product, formatMad, t),
										},
										{
											label: t("partnerTabs.tableMoq"),
											value: product.moq ?? t("partnerTabs.dash"),
										},
										{
											label: t("partnerTabs.tableCapacity"),
											value: product.capacity ?? t("partnerTabs.dash"),
										},
										{
											label: t("partnerTabs.tableListed"),
											value: formatListingDate(product.createdAt),
										},
										{
											label: t("partnerTabs.tableUpdated"),
											value: formatListingDate(product.updatedAt),
										},
									].map((row) => (
										<div key={row.label}>
											<dt className="font-bold text-[10px] text-text-muted uppercase tracking-wide">
												{row.label}
											</dt>
											<dd className="mt-0.5 font-semibold text-text-dark">
												{row.value}
											</dd>
										</div>
									))}
									<div className="col-span-2">
										<dt className="font-bold text-[10px] text-text-muted uppercase tracking-wide">
											{t("partnerTabs.mobileListingIdLabel")}
										</dt>
										<dd className="mt-0.5 break-all font-mono text-[11px] text-text-muted">
											{product.id}
										</dd>
									</div>
								</dl>
								<ApprovedBadge />
								<div className="flex flex-col gap-2 border-cream-dark border-t pt-3">
									<Link
										className="inline-flex w-full items-center justify-center border border-cream-dark bg-cream py-2 font-body font-semibold text-[13px] text-text-dark transition-colors hover:border-primary/30"
										href={`/products/${product.id}`}
									>
										{t("partnerTabs.viewPublicListing")}
									</Link>
									<PublicProductInquiryTriggers
										className="flex flex-col gap-1.5"
										product={productToPublic(product, organizationName)}
									/>
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}

const TAB_ORDER = ["overview", "products", "certifications"] as const;
type TabId = (typeof TAB_ORDER)[number];

export default function PartnerTabs(props: PartnerTabsProps) {
	const { t } = useI18n();
	const [activeTab, setActiveTab] = useState<TabId>(() =>
		props.products.length > 0 ? "products" : "overview",
	);

	const orgDisplayName = props.organization?.name ?? props.profile.entityName;

	const tabLabel: Record<TabId, string> = {
		overview: t("partnerTabs.tabOverview"),
		products: t("partnerTabs.tabProducts"),
		certifications: t("partnerTabs.tabCertifications"),
	};

	return (
		<div className="flex flex-1 flex-col">
			{/* Tab bar */}
			<div className="sticky top-[56px] z-30 border-white/10 border-b bg-primary">
				<div className="mx-auto flex max-w-7xl overflow-x-auto px-6">
					{TAB_ORDER.map((tab) => (
						<button
							className={`shrink-0 border-b-2 px-4 py-4 font-body font-medium text-sm transition-colors sm:px-5 ${
								activeTab === tab
									? "border-secondary text-white"
									: "border-transparent text-white/40 hover:text-white/70"
							}`}
							key={tab}
							onClick={() => setActiveTab(tab)}
							type="button"
						>
							{tabLabel[tab]}
							{tab === "certifications" && props.certifications.length > 0 ? (
								<span className="ms-2 font-bold text-[10px] opacity-70">
									({props.certifications.length})
								</span>
							) : null}
							{tab === "products" && props.products.length > 0 ? (
								<span className="ms-2 font-bold text-[10px] opacity-70">
									({props.products.length})
								</span>
							) : null}
						</button>
					))}
				</div>
			</div>

			{/* Tab content */}
			<div className="flex-1 bg-cream py-8 sm:py-10">
				<div className="mx-auto max-w-7xl px-6">
					{activeTab === "overview" && <OverviewTab {...props} />}
					{activeTab === "products" && (
						<ProductsTab
							organizationName={orgDisplayName}
							products={props.products}
						/>
					)}
					{activeTab === "certifications" && (
						<CertificationsTab certifications={props.certifications} />
					)}
				</div>
			</div>
		</div>
	);
}
