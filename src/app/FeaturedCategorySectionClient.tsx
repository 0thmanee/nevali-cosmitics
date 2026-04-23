"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";
import { featuredCategoryPlaceholderImage } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";

const CATEGORIES = [
  {
    id: "argan-oils",
    tab: "Argan & oils",
    title: "Argan & botanical oils",
    desc: "Cold-pressed argan, prickly pear, and nutrient-dense carrier oils anchor Moroccan beauty rituals. nevali partners document sourcing so you know the orchard, the press, and the story behind every bottle.",
    details: [
      { label: "Signature", value: "Terroir-driven lipid profiles" },
      { label: "Focus", value: "Face, body & hair nutrition" },
      { label: "Values", value: "Cooperative + lab partnerships" },
      { label: "On platform", value: "Traceable listings & reviews" },
    ],
    color: "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 88%, black) 0%, color-mix(in srgb, var(--color-ink) 70%, var(--color-text-muted)) 45%, var(--color-text-muted) 100%)",
  },
  {
    id: "skincare",
    tab: "Clean skincare",
    title: "Clean Moroccan skincare",
    desc: "Serums, creams, and masks formulated with local actives—rose water, ghassoul clays, botanical antioxidants—balanced for modern routines while respecting sensitive skin.",
    details: [
      { label: "Formulation", value: "pH-aware, preservative-smart" },
      { label: "Transparency", value: "Ingredients spelled for shoppers" },
      { label: "Proof", value: "Lab notes & certifications on profile" },
      { label: "Promise", value: "Original Moroccan recipes" },
    ],
    color: "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 80%, black) 0%, color-mix(in srgb, var(--color-ink) 58%, var(--color-text-muted)) 50%, color-mix(in srgb, var(--color-text-muted) 70%, white) 100%)",
  },
  {
    id: "hammam-body",
    tab: "Hammam & body",
    title: "Hammam & body rituals",
    desc: "Beldi soaps, kessa scrubs, hair masks, and spa-grade textures that translate Moroccan hammam culture into daily self-care—still handmade where it matters.",
    details: [
      { label: "Textures", value: "Polish, slip, and aromatics" },
      { label: "Ingredients", value: "Olive paste, ghassoul, botanicals" },
      { label: "Use", value: "Weekly reset or daily glow" },
      { label: "Heritage", value: "Ritual, not trend-chasing" },
    ],
    color: "linear-gradient(135deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 78%, var(--color-text-muted)) 55%, var(--color-text-muted) 100%)",
  },
  {
    id: "hair-fragrance",
    tab: "Hair & scent",
    title: "Haircare & botanical scent",
    desc: "Desert botanicals meet perfumery: shampoos, masks, and eaux inspired by Moroccan gardens—jasmine, orange blossom, resins—crafted by independent noses and labs.",
    details: [
      { label: "Hair", value: "Argan, rhassoul, herbal rinses" },
      { label: "Scent", value: "Low-temp macerations & attars" },
      { label: "Packaging", value: "Refillable where possible" },
      { label: "Vibe", value: "Modern Morocco, not souvenir kitsch" },
    ],
    color: "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 92%, black) 0%, color-mix(in srgb, var(--color-ink) 65%, var(--color-text-muted)) 40%, color-mix(in srgb, var(--color-text-muted) 65%, white) 100%)",
  },
] as const;

export type FeaturedCategorySamples = Partial<
  Record<string, FeaturedHomeProductSample | null>
>;

type Props = {
  samples: FeaturedCategorySamples;
};

export function FeaturedCategorySectionClient({ samples }: Props) {
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0]!.id);
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0]!;
  const sample = samples[activeId] ?? null;

  return (
    <section className="w-full py-28" style={{ background: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:gap-12">
        <AnimateOnScroll className="flex-[1.2] flex flex-col gap-5" direction="right">
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
        </AnimateOnScroll>

        <AnimateOnScroll className="flex-[1.5] flex flex-col gap-6 sm:flex-row" delay={90} direction="left" scale>
          <div className="flex flex-col gap-0 border-l-2 border-cream-dark sm:w-44 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className="text-left font-sans text-sm uppercase tracking-wider px-4 py-2.5 transition-colors"
                style={{
                  color: activeId === cat.id ? "var(--color-primary-darker)" : "var(--color-text-muted)",
                  fontWeight: activeId === cat.id ? 700 : 400,
                  borderLeft: activeId === cat.id ? "2px solid var(--color-primary-darker)" : "2px solid transparent",
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
                background: "radial-gradient(ellipse 60% 55% at 50% 48%, color-mix(in srgb, var(--color-paper) 18%, transparent) 0%, transparent 70%)",
              }}
            />

            {/* 3D floating product */}
            {(() => {
              const imgSrc =
                sample?.firstImageUrl ?? featuredCategoryPlaceholderImage(active.id, 900);
              return (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-0"
                  style={{ perspective: "900px" }}
                >
                  {/* Product image — no box clip, object-contain for transparent PNGs */}
                  <div
                    key={active.id}
                    className="relative w-56 h-56 sm:w-72 sm:h-72"
                    style={{ animation: "productFloat 4s ease-in-out infinite" }}
                  >
                    <Image
                      alt={active.tab}
                      src={imgSrc}
                      fill
                      className="object-contain"
                      sizes="288px"
                      style={{ transform: "rotateX(8deg)", filter: "drop-shadow(0 24px 40px color-mix(in srgb, var(--color-ink) 55%, transparent))" }}
                    />
                  </div>
                  {/* Cast shadow on the "floor" */}
                  <div
                    style={{
                      width: "120px",
                      height: "18px",
                      background: "radial-gradient(ellipse, color-mix(in srgb, var(--color-ink) 45%, transparent) 0%, transparent 75%)",
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
                background: "linear-gradient(to top, color-mix(in srgb, var(--color-ink) 55%, transparent) 0%, color-mix(in srgb, var(--color-ink) 8%, transparent) 40%, transparent 65%)",
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
            @keyframes productFloat {
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
        </AnimateOnScroll>
      </div>
    </section>
  );
}
