import React from "react";
import Link from "next/link";
import type { PublicProducerProfile } from "~/app/api/profile/schemas/profile.schema";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type Props = {
  producer: PublicProducerProfile;
};

export function PublicProducerPage({ producer }: Props) {
  const categories = producer.categories ?? [];
  const hasStory =
    producer.publicTagline?.trim() ||
    producer.businessDescription?.trim() ||
    producer.exportMarkets?.trim() ||
    producer.valuesHighlight?.trim();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-paper)" }}>
      <header className="border-b shrink-0" style={{ background: "var(--color-paper)", borderColor: "var(--color-cream-dark)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="font-display font-bold uppercase text-[15px] tracking-wide text-text-dark">
            nevali
          </Link>
          <Link href="/auth/login" className="font-sans text-sm text-text-muted hover:text-text-dark transition-colors">
            Artisan login
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div
          className="rounded-sm overflow-hidden border"
          style={{ background: "var(--color-paper)", borderColor: "var(--color-cream-dark)" }}
        >
          <div
            className="h-24 sm:h-28"
            style={{
              background:
                "linear-gradient(in oklab 90deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 50%, oklab(36% 0.09 0.048) 100%)",
            }}
          />
          <div className="px-6 sm:px-8 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm border-4 border-white overflow-hidden shrink-0 shadow-sm"
                style={{ background: "var(--color-paper)" }}
              >
                {producer.profileImage ? (
                  <img src={producer.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display font-bold text-2xl text-text-muted">
                    {producer.entityName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold uppercase text-2xl sm:text-3xl text-text-dark leading-tight">
                    {producer.entityName}
                  </h1>
                  <span
                    className="font-sans text-[9px] font-bold tracking-wider rounded-full px-2.5 py-1 uppercase"
                    style={{
                      background: "color-mix(in srgb, var(--color-ink) 85%, transparent)",
                      color: "var(--color-text-muted)",
                      border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
                    }}
                  >
                    Verified artisan
                  </span>
                </div>
                <p className="font-sans text-sm text-text-muted mt-1">
                  {producer.entityType} · {producer.city}, {producer.region}, Morocco
                </p>
                {producer.publicTagline?.trim() && (
                  <p className="font-sans text-base text-text-dark font-medium mt-3 leading-snug">
                    {producer.publicTagline}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="font-sans text-[11px] font-semibold rounded-full px-3 py-1"
                  style={{ background: "var(--color-cream-dark)", color: "var(--color-text-dark)", border: "1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-paper))" }}
                >
                  {c}
                </span>
              ))}
            </div>

            {producer.yearEstablished?.trim() && (
              <p className="font-sans text-sm text-text-muted mt-6">
                <span className="font-semibold text-text-dark">Established:</span> {producer.yearEstablished}
              </p>
            )}

            {producer.exportExperience?.trim() && (
              <p className="font-sans text-sm text-text-muted mt-2">
                <span className="font-semibold text-text-dark">Export experience:</span> {producer.exportExperience}
              </p>
            )}

            {producer.annualCapacity?.trim() && (
              <p className="font-sans text-sm text-text-muted mt-2">
                <span className="font-semibold text-text-dark">Capacity:</span> {producer.annualCapacity}
              </p>
            )}

            {producer.website?.trim() && (
              <p className="font-sans text-sm mt-2">
                <span className="font-semibold text-text-dark">Website:</span>{" "}
                <a
                  href={producer.website.startsWith("http") ? producer.website : `https://${producer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-dark underline hover:no-underline"
                >
                  {producer.website}
                </a>
              </p>
            )}

            {hasStory && (
              <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--color-cream-dark)" }}>
                {producer.businessDescription?.trim() && (
                  <div className="mb-6">
                    <h2 className="font-display font-bold uppercase text-lg text-text-dark mb-2">About</h2>
                    <p className="font-sans text-[15px] text-text-dark leading-relaxed whitespace-pre-wrap">
                      {producer.businessDescription}
                    </p>
                  </div>
                )}
                {producer.exportMarkets?.trim() && (
                  <div className="mb-6">
                    <h2 className="font-display font-bold uppercase text-lg text-text-dark mb-2">Export markets</h2>
                    <p className="font-sans text-[15px] text-text-muted">{producer.exportMarkets}</p>
                  </div>
                )}
                {producer.valuesHighlight?.trim() && (
                  <div>
                    <h2 className="font-display font-bold uppercase text-lg text-text-dark mb-2">Values & practices</h2>
                    <p className="font-sans text-[15px] text-text-muted">{producer.valuesHighlight}</p>
                  </div>
                )}
              </div>
            )}

            <div
              className="mt-10 rounded-sm p-5"
              style={{ background: "var(--color-cream-dark)", border: "1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-paper))" }}
            >
              <p className="font-sans text-sm text-text-dark leading-relaxed">
                Interested in this brand’s line? Browse nevali for Moroccan cosmetics with transparent checkout—or open a buyer account for saved lists.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/auth/register" : "/auth/register-buyer"}
                  className="font-sans text-sm font-semibold rounded-sm px-5 py-2.5 text-white transition-colors hover:opacity-90"
                  style={{ background: "var(--color-ink)" }}
                >
                  {SHOW_MULTI_PRODUCER_EXPERIENCE ? "Get started" : "Create buyer account"}
                </Link>
                <Link
                  href="/"
                  className="font-sans text-sm font-semibold rounded-sm px-5 py-2.5 transition-colors"
                  style={{ background: "var(--color-paper)", color: "var(--color-text-dark)", border: "1px solid var(--color-cream-dark)" }}
                >
                  Browse platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
