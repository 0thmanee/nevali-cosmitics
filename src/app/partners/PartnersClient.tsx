"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import type { PublicPartnerListItem } from "~/app/partners/public-types";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";

type Partner = PublicPartnerListItem;

const ALL_REGIONS = "__all__";

const AVATAR_PALETTES = [
  { bg: "var(--color-cream-dark)", text: "var(--color-ink)" },
  { bg: "color-mix(in srgb, var(--color-cream-dark) 80%, var(--color-paper))", text: "var(--color-ink)" },
  { bg: "color-mix(in srgb, var(--color-cream-dark) 65%, var(--color-paper))", text: "var(--color-text-dark)" },
  { bg: "color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))", text: "var(--color-ink)" },
  { bg: "color-mix(in srgb, var(--color-cream-dark) 72%, var(--color-paper))", text: "var(--color-ink)" },
  { bg: "color-mix(in srgb, var(--color-cream-dark) 60%, var(--color-paper))", text: "var(--color-text-dark)" },
];

function avatarPalette(id: string) {
  let hash = 0;
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length] ?? {
    bg: "var(--color-cream-dark)",
    text: "var(--color-ink)",
  };
}

function getCategories(raw: unknown): string[] {
  return Array.isArray(raw) ? (raw as string[]) : [];
}

function PartnerCard({ partner }: { partner: Partner }) {
  const { t } = useI18n();
  const profile = partner.profile;
  if (!profile) return null;

  const org = partner.members[0]?.organization;
  const palette = avatarPalette(partner.id);
  const initial = profile.entityName.charAt(0).toUpperCase();
  const categories = getCategories(profile.categories);
  const websiteLabel = profile.website
    ? profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;
  const productCount = org?.approvedProductCount ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden border border-cream-dark bg-white transition-shadow hover:shadow-md">
      {/* Brand accent bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: "linear-gradient(90deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 70%, var(--color-text-muted)) 50%, var(--color-text-muted) 100%)" }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Header: avatar + name + verified */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {profile.profileImage ? (
              <Image
                alt=""
                className="h-12 w-12 shrink-0 rounded-sm object-cover ring-1 ring-cream-dark"
                height={48}
                src={profile.profileImage}
                width={48}
              />
            ) : (
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm font-display text-lg font-bold"
                style={{ backgroundColor: palette.bg, color: palette.text }}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2
                className="font-display font-bold uppercase leading-snug text-text-dark transition-colors group-hover:text-primary"
                style={{ fontSize: 16, letterSpacing: "0.01em" }}
              >
                {profile.entityName}
              </h2>
              {org?.name && org.name !== profile.entityName ? (
                <p className="mt-0.5 truncate font-body text-[11px] text-text-muted">
                  {org.name}
                </p>
              ) : null}
              <p className="mt-0.5 font-body text-[12px] text-text-muted">
                {profile.city}, {profile.region}
                {profile.yearEstablished
                  ? ` · ${interpolate(t("partnersDirectory.established"), { year: profile.yearEstablished })}`
                  : ""}
              </p>
            </div>
          </div>

          {/* Verified badge */}
          <span
            className="shrink-0 border px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-widest"
            style={{
              borderColor: "var(--color-text-muted)",
              color: "var(--color-text-muted)",
              background: "color-mix(in srgb, var(--color-text-muted) 7%, transparent)",
            }}
          >
            {t("partnersDirectory.verified")}
          </span>
        </div>

        {/* Tagline */}
        {profile.publicTagline ? (
          <p className="line-clamp-2 font-body text-[13px] leading-relaxed text-text-dark/80">
            {profile.publicTagline}
          </p>
        ) : null}

        {/* Listing count + entity type */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 font-body text-[11px] font-semibold"
            style={{ background: "color-mix(in srgb, var(--color-ink) 9%, transparent)", color: "var(--color-ink)" }}
          >
            <svg aria-hidden fill="none" height="11" viewBox="0 0 12 12" width="11">
              <rect height="7" rx="0.5" stroke="currentColor" strokeWidth="1.1" width="9" x="1.5" y="3.5" />
              <path d="M4 3.5V2.5a2 2 0 0 1 4 0v1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" />
            </svg>
            {productCount === 1
              ? interpolate(t("partnersDirectory.listingOne"), { count: productCount })
              : interpolate(t("partnersDirectory.listingMany"), { count: productCount })}
          </span>
          {profile.entityType ? (
            <span className="font-body text-[12px] text-text-muted">{profile.entityType}</span>
          ) : null}
        </div>

        {/* Category tags */}
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="border border-cream-dark bg-white px-2.5 py-1 font-body text-[11px] font-medium text-text-dark/80"
              >
                {cat}
              </span>
            ))}
            {categories.length > 4 ? (
              <span className="font-body text-[11px] text-text-muted">+{categories.length - 4}</span>
            ) : null}
          </div>
        ) : null}

        {/* Website */}
        {websiteLabel ? (
          <p className="truncate font-body text-[11px] text-text-muted" title={profile.website ?? undefined}>
            {websiteLabel}
          </p>
        ) : null}

        {/* CTA */}
        <div className="mt-auto border-t border-cream-dark pt-4">
          <Link
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
            href={`/partners/${partner.id}`}
          >
            {t("partnersDirectory.viewProfile")}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PartnersClient({ partners }: { partners: Partner[] }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(ALL_REGIONS);

  const regions = useMemo(() => {
    const set = new Set(partners.map((p) => p.profile?.region).filter(Boolean) as string[]);
    return [ALL_REGIONS, ...Array.from(set).sort()];
  }, [partners]);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (!p.profile) return false;
      if (region !== ALL_REGIONS && p.profile.region !== region) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const cats = getCategories(p.profile.categories).join(" ").toLowerCase();
      const orgName = p.members[0]?.organization?.name?.toLowerCase() ?? "";
      return (
        p.profile.entityName.toLowerCase().includes(q) ||
        p.profile.region.toLowerCase().includes(q) ||
        p.profile.city.toLowerCase().includes(q) ||
        cats.includes(q) ||
        orgName.includes(q)
      );
    });
  }, [partners, search, region]);

  return (
    <section className="flex-1 bg-cream">
      {/* Filter bar */}
      <div className="border-b border-cream-dark bg-white px-4 py-5">
        <AnimateOnScroll className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center" direction="up">
          <div className="relative w-full shrink-0 sm:w-72">
            <svg
              aria-hidden
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/50"
              fill="none"
              height="14"
              viewBox="0 0 16 16"
              width="14"
            >
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
            <input
              className="w-full border border-cream-dark bg-white py-2.5 pl-9 pr-4 font-body text-sm text-text-dark placeholder:text-text-muted/50 transition-colors focus:border-primary focus:outline-none"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("partnersDirectory.searchPlaceholder")}
              type="text"
              value={search}
            />
          </div>

          <div className="hidden h-6 w-px shrink-0 bg-cream-dark sm:block" aria-hidden />

          <div className="flex flex-wrap items-center gap-2">
            <span className="me-1 font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              {t("partnersDirectory.region")}
            </span>
            {regions.map((r) => (
              <button
                key={r}
                className="border px-3.5 py-1.5 font-body text-sm transition-colors"
                style={
                  region === r
                    ? { background: "var(--color-ink)", borderColor: "var(--color-ink)", color: "var(--color-paper)" }
                    : { background: "var(--color-paper)", borderColor: "var(--color-cream-dark)", color: "var(--color-text-dark)" }
                }
                onClick={() => setRegion(r)}
                type="button"
              >
                {r === ALL_REGIONS ? t("partnersDirectory.allRegions") : r}
              </button>
            ))}
          </div>
        </AnimateOnScroll>
      </div>

      {/* Grid */}
      <AnimateOnScroll className="mx-auto max-w-7xl px-4 py-10" delay={60} direction="up" scale>
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-text-muted">{t("partnersDirectory.emptyFilters")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </AnimateOnScroll>
    </section>
  );
}
