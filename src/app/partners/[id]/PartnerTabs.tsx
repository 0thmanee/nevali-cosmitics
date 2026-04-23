"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicProductInquiryTriggers } from "~/components/public-product-inquiry-triggers";
import type { PublicProduct } from "~/components/public-product-types";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { Prisma } from "@prisma/client";
import { buildPublicProductListRow } from "~/lib/public-product-mapper";
import type {
  PublicPartnerCertification,
  PublicPartnerProduct,
  PublicPartnerProfileDetail,
  PublicPartnerOrganization,
} from "~/app/partners/public-types";

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
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
}

function formatListingDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function partnerProductPriceLabel(p: PublicPartnerProduct): string {
  if (p.variants.length === 0) return "—";
  const nums = p.variants
    .map((v) => Number(v.price.replace(",", ".")))
    .filter(Number.isFinite);
  if (nums.length === 0) return "—";
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) return formatPriceMad(min.toFixed(2));
  return `From ${formatPriceMad(min.toFixed(2))}`;
}

function productToPublic(p: PublicPartnerProduct, organizationName: string): PublicProduct {
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
    <p className="font-body text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-3">
      {children}
    </p>
  );
}

function ProseBlock({ title, children, empty }: { title: string; children: React.ReactNode; empty?: React.ReactNode }) {
  return (
    <div className="bg-white border border-cream-dark p-6 sm:p-8">
      <SectionLabel>{title}</SectionLabel>
      {children ? (
        <div className="font-body text-[15px] text-text-dark leading-relaxed whitespace-pre-wrap">
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
    <div className="bg-white border border-cream-dark p-4 flex flex-col gap-1">
      <span className="font-display font-bold text-text-dark leading-none" style={{ fontSize: 26 }}>
        {value}
      </span>
      <span className="font-body text-[9px] font-bold tracking-[0.12em] text-text-muted uppercase">
        {label}
      </span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="shrink-0 border px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide"
      style={{ borderColor: "var(--color-text-muted)", color: "var(--color-text-muted)", background: "color-mix(in srgb, var(--color-text-muted) 7%, transparent)" }}
    >
      Verified
    </span>
  );
}

function ApprovedBadge() {
  return (
    <span
      className="inline-flex border px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide"
      style={{ borderColor: "var(--color-text-muted)", color: "var(--color-text-muted)", background: "color-mix(in srgb, var(--color-text-muted) 7%, transparent)" }}
    >
      Approved
    </span>
  );
}

function OverviewTab({ profile, organization, products, certifications, platformSince }: PartnerTabsProps) {
  const categories = getCategories(profile.categories);
  const contactName = `${profile.firstName} ${profile.lastName}`.trim();
  const websiteDisplay = profile.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {profile.businessDescription ? (
          <ProseBlock title="About the business">{profile.businessDescription}</ProseBlock>
        ) : profile.exportExperience ? (
          <ProseBlock title="Export experience">{profile.exportExperience}</ProseBlock>
        ) : (
          <div className="bg-white border border-cream-dark p-6 sm:p-8">
            <SectionLabel>About the business</SectionLabel>
            <p className="font-body text-sm text-text-muted italic">
              This brand has not added a full description yet. Browse their cosmetics catalog and certifications below.
            </p>
          </div>
        )}

        {profile.businessDescription && profile.exportExperience ? (
          <ProseBlock title="Export experience">{profile.exportExperience}</ProseBlock>
        ) : null}

        {profile.exportMarkets ? (
          <div className="bg-white border border-cream-dark p-6 sm:p-8">
            <SectionLabel>Export markets</SectionLabel>
            <p className="font-body text-[15px] text-text-dark leading-relaxed whitespace-pre-wrap">
              {profile.exportMarkets}
            </p>
          </div>
        ) : null}

        {profile.valuesHighlight ? (
          <div className="border border-cream-dark p-6 sm:p-8" style={{ background: "var(--color-cream)" }}>
            <SectionLabel>Values & practices</SectionLabel>
            <p className="font-body text-[15px] text-text-dark leading-relaxed whitespace-pre-wrap">
              {profile.valuesHighlight}
            </p>
          </div>
        ) : null}

        {/* Key figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox value={String(categories.length)} label="Product lines" />
          <StatBox value={String(products.length)} label="Live products" />
          <StatBox value={String(certifications.length)} label="Certifications" />
          <StatBox value={profile.yearEstablished ?? "—"} label="Founded" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4">
        {/* Contact & legal */}
        <div className="bg-primary border border-white/10">
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, var(--color-ink) 0%, var(--color-text-muted) 100%)" }}
          />
          <div className="p-5">
            <p className="font-body text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">
              Contact & legal
            </p>
            <dl className="flex flex-col gap-4">
              {organization ? (
                <div>
                  <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">Registered entity</dt>
                  <dd className="font-body text-sm font-medium text-white/90 mt-1">{organization.name}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">Contact</dt>
                <dd className="font-body text-sm font-medium text-white/90 mt-1">{contactName}</dd>
              </div>
              {profile.phone ? (
                <div>
                  <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="font-body text-sm font-medium text-secondary hover:underline">
                      {profile.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {profile.website ? (
                <div>
                  <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">Website</dt>
                  <dd className="mt-1">
                    <a
                      href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm font-medium text-secondary hover:underline break-all"
                    >
                      {websiteDisplay}
                    </a>
                  </dd>
                </div>
              ) : null}
              {profile.registrationNumber ? (
                <div>
                  <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">Registration no.</dt>
                  <dd className="font-mono text-sm text-white/80 mt-1">{profile.registrationNumber}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-body text-[11px] text-white/40 uppercase tracking-wide">On nevali since</dt>
                <dd className="font-body text-sm text-white/80 mt-1">{platformSince}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Location + capacity */}
        <div className="bg-white border border-cream-dark p-5">
          <SectionLabel>Location</SectionLabel>
          <p className="font-body text-sm text-text-dark">{profile.city}, {profile.region}, Morocco</p>
          {profile.annualCapacity ? (
            <div className="mt-4 pt-4 border-t border-cream-dark">
              <SectionLabel>Annual capacity</SectionLabel>
              <p className="font-body text-sm font-medium text-text-dark">{profile.annualCapacity}</p>
            </div>
          ) : null}
        </div>

        <Link
          href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"}
          className="font-body text-sm text-text-muted hover:text-text-dark transition-colors inline-flex items-center gap-2"
        >
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? "← Back to all brands" : "← Back to shop"}
        </Link>
      </aside>
    </div>
  );
}

function CertificationsTab({ certifications }: { certifications: PublicPartnerCertification[] }) {
  if (certifications.length === 0) {
    return (
      <div className="bg-white border border-cream-dark p-12 flex flex-col items-center gap-3 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 border border-cream-dark flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 2l2.2 5L17 7.5l-3.5 3.5.8 5L10 13.5 6.7 16l.8-5L4 7.5 8.8 7z" stroke="var(--color-primary-darker)" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display font-bold uppercase text-text-dark text-sm tracking-wide">No public certifications yet</p>
        <p className="font-body text-sm text-text-muted">Approved certificates and audit documents appear here once verified by nevali.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox value={String(certifications.length)} label="Verified on file" />
        <StatBox value={String(certifications.filter((c) => !c.productId).length)} label="Entity-wide" />
        <StatBox value={String(certifications.filter((c) => c.productId).length)} label="Product-linked" />
        <StatBox value="—" label="Renewal (if applicable)" />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((c) => (
          <li key={c.id} className="bg-white border border-cream-dark p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-body font-semibold text-text-dark leading-snug">{c.name}</p>
                {c.product ? (
                  <p className="font-body text-xs text-text-muted mt-1">Product: {c.product.name}</p>
                ) : (
                  <p className="font-body text-xs text-text-muted mt-1 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Organization-level</p>
                )}
              </div>
              <VerifiedBadge />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-cream-dark">
              <span className="font-body text-xs text-text-muted">Added {formatCertDate(c.createdAt)}</span>
              <a
                href={c.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors"
              >
                View document →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductsTab({ products, organizationName }: { products: PublicPartnerProduct[]; organizationName: string }) {
  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 border border-cream-dark bg-white p-12 text-center">
        <p className="font-display font-bold uppercase text-text-dark text-sm tracking-wide">No approved products yet</p>
        <p className="font-body text-sm text-text-muted">Approved cosmetics from this brand will appear here for shoppers to discover.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Approved catalog</p>
          <h2 className="mt-1 font-display font-bold uppercase text-text-dark" style={{ fontSize: 24 }}>
            {products.length} live listing{products.length !== 1 ? "s" : ""}
          </h2>
          <p className="mt-1 max-w-xl font-body text-sm text-text-muted">
            Each row is an approved catalog listing—variants, pricing, and payment options are supplied by the brand.
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto border border-cream-dark bg-white md:block">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-cream-dark" style={{ background: "var(--color-cream)" }}>
              {["Listing", "Category", "Price", "MOQ", "Capacity", "Status", "Listed", "Updated", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 font-body text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-b border-cream-dark last:border-0 hover:bg-cream/50 transition-colors" key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb product={product} />
                    <div className="min-w-0">
                      <p className="font-body text-sm font-semibold leading-snug text-text-dark">{product.name}</p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-text-muted/80">ID {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-body text-sm text-text-dark/90">{product.category}</td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-text-dark whitespace-nowrap">
                  {partnerProductPriceLabel(product)}
                </td>
                <td className="px-4 py-3 font-body text-sm text-text-dark">{product.moq ?? "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-text-dark">{product.capacity ?? "—"}</td>
                <td className="px-4 py-3"><ApprovedBadge /></td>
                <td className="px-4 py-3 font-body text-xs text-text-muted">{formatListingDate(product.createdAt)}</td>
                <td className="px-4 py-3 font-body text-xs text-text-muted">{formatListingDate(product.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <Link className="font-body text-xs font-semibold text-primary hover:underline" href={`/products/${product.id}`}>
                      Public page →
                    </Link>
                    <PublicProductInquiryTriggers className="flex flex-col gap-1" product={productToPublic(product, organizationName)} />
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
            productPlaceholderImageUrl(`${product.id}:${product.category}`, 800);
          return (
            <article className="overflow-hidden border border-cream-dark bg-white" key={product.id}>
              <div className="relative h-36 border-b border-cream-dark bg-cream">
                <Image alt="" className="object-cover" fill sizes="100vw" src={heroSrc} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="font-body text-[10px] font-bold uppercase tracking-widest text-white/70">{product.category}</p>
                  <h3 className="mt-0.5 font-display font-bold uppercase text-lg leading-tight text-white">{product.name}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-body text-[12px]">
                  {[
                    { label: "Price", value: partnerProductPriceLabel(product) },
                    { label: "MOQ", value: product.moq ?? "—" },
                    { label: "Capacity", value: product.capacity ?? "—" },
                    { label: "Listed", value: formatListingDate(product.createdAt) },
                    { label: "Updated", value: formatListingDate(product.updatedAt) },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{row.label}</dt>
                      <dd className="mt-0.5 font-semibold text-text-dark">{row.value}</dd>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Listing ID</dt>
                    <dd className="mt-0.5 break-all font-mono text-[11px] text-text-muted">{product.id}</dd>
                  </div>
                </dl>
                <ApprovedBadge />
                <div className="flex flex-col gap-2 border-t border-cream-dark pt-3">
                  <Link
                    className="inline-flex w-full items-center justify-center border border-cream-dark bg-cream py-2 font-body text-[13px] font-semibold text-text-dark hover:border-primary/30 transition-colors"
                    href={`/products/${product.id}`}
                  >
                    View public listing
                  </Link>
                  <PublicProductInquiryTriggers className="flex flex-col gap-1.5" product={productToPublic(product, organizationName)} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

const TABS = ["Overview", "Products", "Certifications"] as const;
type Tab = (typeof TABS)[number];

export default function PartnerTabs(props: PartnerTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    props.products.length > 0 ? "Products" : "Overview",
  );

  const orgDisplayName = props.organization?.name ?? props.profile.entityName;

  return (
    <div className="flex flex-col flex-1">
      {/* Tab bar */}
      <div className="bg-primary sticky top-[56px] z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`font-body text-sm font-medium py-4 px-4 sm:px-5 border-b-2 transition-colors shrink-0 ${
                activeTab === tab
                  ? "border-secondary text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
              {tab === "Certifications" && props.certifications.length > 0 ? (
                <span className="ml-2 text-[10px] font-bold opacity-70">({props.certifications.length})</span>
              ) : null}
              {tab === "Products" && props.products.length > 0 ? (
                <span className="ml-2 text-[10px] font-bold opacity-70">({props.products.length})</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-cream flex-1 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === "Overview" && <OverviewTab {...props} />}
          {activeTab === "Products" && <ProductsTab organizationName={orgDisplayName} products={props.products} />}
          {activeTab === "Certifications" && <CertificationsTab certifications={props.certifications} />}
        </div>
      </div>
    </div>
  );
}
