import React from "react";
import Link from "next/link";
import type { PublicProducerProfile } from "~/app/api/profile/schemas/profile.schema";

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
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF5EE" }}>
      <header className="border-b shrink-0" style={{ background: "white", borderColor: "#f0e8dc" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="font-display font-bold uppercase text-[15px] tracking-wide text-[#2a0f05]">
            CraftHouse
          </Link>
          <Link href="/auth/login" className="font-sans text-sm text-[#7a4d38] hover:text-[#2a0f05] transition-colors">
            Artisan login
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ background: "white", borderColor: "#f0e8dc" }}
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
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white overflow-hidden shrink-0 shadow-sm"
                style={{ background: "#FAF5EE" }}
              >
                {producer.profileImage ? (
                  <img src={producer.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display font-bold text-2xl text-[#7a4d38]">
                    {producer.entityName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold uppercase text-2xl sm:text-3xl text-[#2a0f05] leading-tight">
                    {producer.entityName}
                  </h1>
                  <span
                    className="font-sans text-[9px] font-bold tracking-wider rounded-full px-2.5 py-1 uppercase"
                    style={{
                      background: "rgba(26,5,0,0.85)",
                      color: "#C8963C",
                      border: "1px solid rgba(200,150,60,0.3)",
                    }}
                  >
                    Verified artisan
                  </span>
                </div>
                <p className="font-sans text-sm text-[#7a4d38] mt-1">
                  {producer.entityType} · {producer.city}, {producer.region}, Morocco
                </p>
                {producer.publicTagline?.trim() && (
                  <p className="font-sans text-base text-[#2a0f05] font-medium mt-3 leading-snug">
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
                  style={{ background: "#f0e8dc", color: "#7b2d1e", border: "1px solid #e8d8c8" }}
                >
                  {c}
                </span>
              ))}
            </div>

            {producer.yearEstablished?.trim() && (
              <p className="font-sans text-sm text-[#7a4d38] mt-6">
                <span className="font-semibold text-[#2a0f05]">Established:</span> {producer.yearEstablished}
              </p>
            )}

            {producer.exportExperience?.trim() && (
              <p className="font-sans text-sm text-[#7a4d38] mt-2">
                <span className="font-semibold text-[#2a0f05]">Export experience:</span> {producer.exportExperience}
              </p>
            )}

            {producer.annualCapacity?.trim() && (
              <p className="font-sans text-sm text-[#7a4d38] mt-2">
                <span className="font-semibold text-[#2a0f05]">Capacity:</span> {producer.annualCapacity}
              </p>
            )}

            {producer.website?.trim() && (
              <p className="font-sans text-sm mt-2">
                <span className="font-semibold text-[#2a0f05]">Website:</span>{" "}
                <a
                  href={producer.website.startsWith("http") ? producer.website : `https://${producer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7b2d1e] underline hover:no-underline"
                >
                  {producer.website}
                </a>
              </p>
            )}

            {hasStory && (
              <div className="mt-8 pt-8 border-t" style={{ borderColor: "#f0e8dc" }}>
                {producer.businessDescription?.trim() && (
                  <div className="mb-6">
                    <h2 className="font-display font-bold uppercase text-lg text-[#2a0f05] mb-2">About</h2>
                    <p className="font-sans text-[15px] text-[#2a0f05] leading-relaxed whitespace-pre-wrap">
                      {producer.businessDescription}
                    </p>
                  </div>
                )}
                {producer.exportMarkets?.trim() && (
                  <div className="mb-6">
                    <h2 className="font-display font-bold uppercase text-lg text-[#2a0f05] mb-2">Export markets</h2>
                    <p className="font-sans text-[15px] text-[#7a4d38]">{producer.exportMarkets}</p>
                  </div>
                )}
                {producer.valuesHighlight?.trim() && (
                  <div>
                    <h2 className="font-display font-bold uppercase text-lg text-[#2a0f05] mb-2">Values & practices</h2>
                    <p className="font-sans text-[15px] text-[#7a4d38]">{producer.valuesHighlight}</p>
                  </div>
                )}
              </div>
            )}

            <div
              className="mt-10 rounded-xl p-5"
              style={{ background: "#f0e8dc", border: "1px solid #e8d8c8" }}
            >
              <p className="font-sans text-sm text-[#2a0f05] leading-relaxed">
                Interested in sourcing from this artisan? Join CraftHouse as a buyer or contact us to connect with verified Moroccan craftspeople.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/auth/register"
                  className="font-sans text-sm font-semibold rounded-xl px-5 py-2.5 text-white transition-colors hover:opacity-90"
                  style={{ background: "#1a0500" }}
                >
                  Get started
                </Link>
                <Link
                  href="/"
                  className="font-sans text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
                  style={{ background: "white", color: "#2a0f05", border: "1px solid #f0e8dc" }}
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
