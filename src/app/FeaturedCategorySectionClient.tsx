"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";
import { formatPriceMad } from "~/lib/format-price";

const CATEGORIES = [
  {
    id: "carpets",
    tab: "Carpets (Zrabd)",
    title: "Moroccan Carpets (Zrabd)",
    desc: "Moroccan carpets, known as Zrabd, are among the most iconic expressions of Moroccan craftsmanship. Handwoven in rural villages and mountain regions, each carpet reflects ancestral Berber traditions through unique symbols, patterns, and natural colors.",
    details: [
      { label: "Origin", value: "Moroccan villages" },
      { label: "Materials", value: "100% Natural Wool" },
      { label: "Style", value: "Berber geometric symbolism" },
      { label: "Each piece", value: "Unique and handmade" },
    ],
    color: "linear-gradient(135deg, #8B2D1E 0%, #C04830 40%, #A03820 70%)",
    bgImage: "/carpet.png",
    staticOnly: true,
  },
  {
    id: "pottery",
    tab: "Pottery & Ceramics",
    title: "Moroccan Pottery & Ceramics",
    desc: "From the kilns of Fez and Safi, Moroccan ceramics combine ancient glazing techniques with vibrant geometric motifs. Each piece is hand-thrown, painted, and fired by master potters carrying on centuries of tradition.",
    details: [
      { label: "Origin", value: "Fez, Safi" },
      { label: "Materials", value: "Natural clay & mineral glazes" },
      { label: "Style", value: "Geometric floral motifs" },
      { label: "Each piece", value: "Hand-painted" },
    ],
    color: "linear-gradient(135deg, #C87040 0%, #A05020 40%, #C89060 100%)",
    bgImage: "/pottery.png",
    staticOnly: true,
  },
  {
    id: "leather",
    tab: "Leather Goods",
    title: "Moroccan Leather Goods",
    desc: "The leather tanneries of Fez and Marrakech produce some of the world's finest hides. Babouches, bags, and belts are crafted using centuries-old vegetable tanning methods, giving each piece its distinctive character.",
    details: [
      { label: "Origin", value: "Fez, Marrakech" },
      { label: "Materials", value: "Full-grain natural leather" },
      { label: "Style", value: "Traditional & contemporary" },
      { label: "Each piece", value: "Handstitched" },
    ],
    color: "linear-gradient(135deg, #5A3010 0%, #7A4820 50%, #9A6830 100%)",
    bgImage: "/leather.png",
    staticOnly: true,
  },
  {
    id: "lanterns",
    tab: "Metal Lanterns",
    title: "Moroccan Metal Lanterns",
    desc: "Hammered by skilled metalworkers in the souks of Marrakech and Fez, these lanterns cast intricate geometric shadows. Made from brass, copper, or iron, they bring the warmth of the medina into any space.",
    details: [
      { label: "Origin", value: "Marrakech, Fez" },
      { label: "Materials", value: "Brass, copper, iron" },
      { label: "Style", value: "Islamic geometric patterns" },
      { label: "Each piece", value: "Hand-hammered" },
    ],
    color: "linear-gradient(135deg, #B8882A 0%, #8A6018 40%, #C8A040 100%)",
    bgImage: "/metal.png",
    staticOnly: true,
  },
  {
    id: "thuya",
    tab: "Thuya Wood Craft",
    title: "Thuya Wood Craft",
    desc: "Thuya wood from the Atlas Mountains has a rich, aromatic grain unlike any other. Essaouira's master woodworkers transform it into boxes, frames, and furniture inlaid with lemonswood and mother-of-pearl.",
    details: [
      { label: "Origin", value: "Essaouira" },
      { label: "Materials", value: "Thuya burl, citrus wood" },
      { label: "Style", value: "Marquetry inlay" },
      { label: "Each piece", value: "Hand-carved" },
    ],
    color: "linear-gradient(135deg, #7A5030 0%, #5A3810 50%, #9A7050 100%)",
    bgImage: "/wood.png",
    staticOnly: true,
  },
  {
    id: "caftans",
    tab: "Caftans",
    title: "Moroccan Caftans",
    desc: "The Moroccan caftan is a living art form — embroidered, hand-sewn, and layered with symbolism. From grand ceremony to everyday elegance, Moroccan seamstresses weave identity into every thread.",
    details: [
      { label: "Origin", value: "Fez, Rabat, Casablanca" },
      { label: "Materials", value: "Silk, satin, brocade" },
      { label: "Style", value: "Hand-embroidered" },
      { label: "Each piece", value: "Made to order" },
    ],
    color: "linear-gradient(135deg, #4A1A60 0%, #7A3A90 50%, #6A2A80 100%)",
    bgImage: "/caftan.png",
    staticOnly: true,
  },
] as const;

export type FeaturedCategorySamples = Partial<
  Record<string, FeaturedHomeProductSample | null>
>;

type Props = {
  samples: FeaturedCategorySamples;
};

export function FeaturedCategorySectionClient({ samples }: Props) {
  const [activeId, setActiveId] = useState("carpets");
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0]!;
  const staticOnly = "staticOnly" in active && active.staticOnly === true;
  const sample = staticOnly ? null : (samples[activeId] ?? null);

  return (
    <section className="w-full py-28" style={{ background: "#F5EDE3" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:gap-12">
        <div className="flex-[1.2] flex flex-col gap-5">
          <h2
            className="font-display font-bold uppercase leading-[1.0] text-text-dark"
            style={{ fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-0.01em" }}
          >
            {active.title}
          </h2>
          <p className="font-sans text-base leading-relaxed text-text-muted max-w-sm">
            {active.desc}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            {active.details.map((d) => (
              <div key={d.label} className="flex gap-2 font-sans text-sm">
                <span className="text-text-muted font-medium">{d.label}:</span>
                <span className="text-text-dark">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[1.5] flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-0 border-l-2 border-cream-dark sm:w-44 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className="text-left font-sans text-sm uppercase tracking-wider px-4 py-2.5 transition-colors"
                style={{
                  color: activeId === cat.id ? "#7B2000" : "#7A4D38",
                  fontWeight: activeId === cat.id ? 700 : 400,
                  borderLeft: activeId === cat.id ? "2px solid #7B2000" : "2px solid transparent",
                  marginLeft: "-2px",
                }}
              >
                {cat.tab}
              </button>
            ))}
          </div>

          <div
            className="relative flex-1 rounded-sm overflow-hidden"
            style={{ minHeight: "420px", background: active.color }}
          >
            {/* Spotlight glow behind product */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(255,255,255,0.18) 0%, transparent 70%)",
              }}
            />

            {/* 3D floating product */}
            {(() => {
              const imgSrc = sample?.firstImageUrl ?? ("bgImage" in active && active.bgImage ? active.bgImage : null);
              if (!imgSrc) return null;
              return (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-0"
                  style={{ perspective: "900px" }}
                >
                  {/* Product image — no box clip, object-contain for transparent PNGs */}
                  <div
                    key={active.id}
                    className="relative w-56 h-56 sm:w-72 sm:h-72"
                    style={{ animation: "craftFloat 4s ease-in-out infinite" }}
                  >
                    <Image
                      alt={active.tab}
                      src={imgSrc}
                      fill
                      className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
                      sizes="288px"
                      style={{ transform: "rotateX(8deg)" }}
                    />
                  </div>
                  {/* Cast shadow on the "floor" */}
                  <div
                    style={{
                      width: "120px",
                      height: "18px",
                      background: "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 75%)",
                      animation: "shadowPulse 4s ease-in-out infinite",
                      marginTop: "-8px",
                    }}
                  />
                </div>
              );
            })()}

            {/* Bottom label overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 40%, transparent 65%)",
              }}
            >
              <div className="flex flex-col gap-1.5 pointer-events-auto">
                {sample ? (
                  <>
                    <Link
                      className="font-sans text-sm font-semibold text-white line-clamp-2 hover:underline"
                      href={`/products/${sample.id}`}
                    >
                      {sample.name}
                    </Link>
                    <p className="font-sans text-sm font-semibold text-white/95">
                      {formatPriceMad(sample.fromPriceMad)}
                    </p>
                  </>
                ) : null}
                <span className="font-sans text-white/70 text-xs uppercase tracking-widest">
                  {active.tab}
                  {sample ? " · Live listing" : ""}
                </span>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes craftFloat {
              0%   { transform: translateY(0px); }
              50%  { transform: translateY(-16px); }
              100% { transform: translateY(0px); }
            }
            @keyframes shadowPulse {
              0%   { opacity: 1; transform: scaleX(1); }
              50%  { opacity: 0.5; transform: scaleX(0.75); }
              100% { opacity: 1; transform: scaleX(1); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
