import React from "react";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import type { PublicProducerProfile } from "~/app/api/profile/schemas/profile.schema";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type Props = {
  producer: PublicProducerProfile;
};

export function PublicArtisanPage({ producer }: Props) {
  const categories = producer.categories ?? [];

  const initial = producer.entityName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* Hero banner */}
      <section className="bg-forest-dark pt-[56px]">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col sm:flex-row sm:items-end gap-8">
          {/* Avatar */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 border-2 border-white/20 overflow-hidden"
            style={{ background: "#000000" }}
          >
            {producer.profileImage ? (
              <img src={producer.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display font-bold text-2xl text-secondary">
                {initial}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="font-body text-[10px] font-bold uppercase tracking-[0.2em] border px-2.5 py-1"
                style={{ borderColor: "rgba(114,114,114,0.5)", color: "#727272" }}
              >
                Verified Artisan
              </span>
              {producer.entityType && (
                <span className="font-body text-[11px] text-white/40 uppercase tracking-widest">
                  {producer.entityType}
                </span>
              )}
            </div>
            <h1
              className="font-display font-bold uppercase text-white leading-[1.0]"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              {producer.entityName}
            </h1>
            <p className="font-body text-sm text-white/50">
              {producer.city}, {producer.region}, Morocco
              {producer.yearEstablished?.trim() ? ` · Est. ${producer.yearEstablished}` : ""}
            </p>
          </div>

          {/* Back link — directory hidden while single-house-brand mode */}
          <Link
            href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"}
            className="shrink-0 font-body text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5"
          >
            {SHOW_MULTI_PRODUCER_EXPERIENCE ? "← All artisans" : "← Shop"}
          </Link>
        </div>

        {/* Terracotta accent line at bottom */}
        <div
          className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, #000000 0%, #454545 50%, #727272 100%)" }}
        />
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left: story + details */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Tagline */}
            {producer.publicTagline?.trim() && (
              <p
                className="font-display font-bold uppercase leading-snug text-primary"
                style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
              >
                {producer.publicTagline}
              </p>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="border border-cream-dark bg-white px-3 py-1 font-body text-[11px] font-medium text-text-dark/80 uppercase tracking-wide"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* About */}
            {producer.businessDescription?.trim() && (
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold uppercase text-text-dark" style={{ fontSize: 13, letterSpacing: "0.15em" }}>
                  About
                </h2>
                <div className="h-px bg-cream-dark" />
                <p className="font-body text-[15px] text-text-dark/80 leading-relaxed whitespace-pre-wrap">
                  {producer.businessDescription}
                </p>
              </div>
            )}

            {/* Export markets */}
            {producer.exportMarkets?.trim() && (
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold uppercase text-text-dark" style={{ fontSize: 13, letterSpacing: "0.15em" }}>
                  Export Markets
                </h2>
                <div className="h-px bg-cream-dark" />
                <p className="font-body text-[15px] text-text-muted leading-relaxed">
                  {producer.exportMarkets}
                </p>
              </div>
            )}

            {/* Values & practices */}
            {producer.valuesHighlight?.trim() && (
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-bold uppercase text-text-dark" style={{ fontSize: 13, letterSpacing: "0.15em" }}>
                  Values & Practices
                </h2>
                <div className="h-px bg-cream-dark" />
                <p className="font-body text-[15px] text-text-muted leading-relaxed">
                  {producer.valuesHighlight}
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6">

            {/* Meta details card */}
            <div className="border border-cream-dark bg-white">
              <div
                className="px-5 py-3 border-b border-cream-dark font-display font-bold uppercase text-text-dark"
                style={{ fontSize: 11, letterSpacing: "0.15em" }}
              >
                Details
              </div>
              <div className="flex flex-col divide-y divide-cream-dark">
                {[
                  { label: "Type", value: producer.entityType },
                  { label: "Region", value: producer.region },
                  { label: "City", value: producer.city },
                  { label: "Established", value: producer.yearEstablished },
                  { label: "Export exp.", value: producer.exportExperience },
                  { label: "Annual capacity", value: producer.annualCapacity },
                ]
                  .filter((r) => r.value?.trim())
                  .map((row) => (
                    <div key={row.label} className="flex items-start gap-3 px-5 py-3">
                      <span className="font-body text-[11px] uppercase tracking-wider text-text-muted w-28 shrink-0">
                        {row.label}
                      </span>
                      <span className="font-body text-[13px] text-text-dark">{row.value}</span>
                    </div>
                  ))}
                {producer.website?.trim() && (
                  <div className="flex items-start gap-3 px-5 py-3">
                    <span className="font-body text-[11px] uppercase tracking-wider text-text-muted w-28 shrink-0">
                      Website
                    </span>
                    <a
                      href={producer.website.startsWith("http") ? producer.website : `https://${producer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[13px] text-primary hover:underline break-all"
                    >
                      {producer.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* CTA card */}
            <div className="border border-cream-dark bg-white">
              <div
                className="h-1 w-full"
                style={{ background: "linear-gradient(90deg, #000000 0%, #727272 100%)" }}
              />
              <div className="p-5 flex flex-col gap-4">
                <p className="font-body text-sm text-text-dark/80 leading-relaxed">
                  Interested in this brand’s cosmetics? Shop on nevali—guest checkout—or create a buyer account for lists and alerts.
                </p>
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                  <Link
                    href="/auth/register"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-white text-sm transition-opacity hover:opacity-90"
                  >
                    Get started →
                  </Link>
                ) : (
                  <Link
                    href="/auth/register-buyer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-display font-bold uppercase tracking-[0.1em] text-white text-sm transition-opacity hover:opacity-90"
                  >
                    Create buyer account →
                  </Link>
                )}
                <Link
                  href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"}
                  className="w-full inline-flex items-center justify-center border border-cream-dark bg-cream px-4 py-2.5 font-body text-sm text-text-dark transition-colors hover:border-primary/30"
                >
                  {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Browse all artisans" : "Browse products"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
