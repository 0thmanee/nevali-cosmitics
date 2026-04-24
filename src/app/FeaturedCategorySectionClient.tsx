"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import type { Translator } from "~/lib/i18n/create-translator";
import { featuredCategoryPlaceholderImage } from "~/lib/cosmetics-image-placeholders";

const CATEGORY_ORDER = ["argan-oils", "skincare", "hammam-body", "hair-fragrance"] as const;

type CategoryId = (typeof CATEGORY_ORDER)[number];

const FEATURED_I18N_KEY: Record<CategoryId, "arganOils" | "skincare" | "hammamBody" | "hairFragrance"> = {
  "argan-oils": "arganOils",
  skincare: "skincare",
  "hammam-body": "hammamBody",
  "hair-fragrance": "hairFragrance",
};

const CATEGORY_BACKGROUNDS: Record<CategoryId, string> = {
  "argan-oils":
    "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 88%, black) 0%, color-mix(in srgb, var(--color-ink) 70%, var(--color-text-muted)) 45%, var(--color-text-muted) 100%)",
  skincare:
    "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 80%, black) 0%, color-mix(in srgb, var(--color-ink) 58%, var(--color-text-muted)) 50%, color-mix(in srgb, var(--color-text-muted) 70%, white) 100%)",
  "hammam-body":
    "linear-gradient(135deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 78%, var(--color-text-muted)) 55%, var(--color-text-muted) 100%)",
  "hair-fragrance":
    "linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 92%, black) 0%, color-mix(in srgb, var(--color-ink) 65%, var(--color-text-muted)) 40%, color-mix(in srgb, var(--color-text-muted) 65%, white) 100%)",
};

function featuredSectionCopy(id: CategoryId, t: Translator) {
  const slug = FEATURED_I18N_KEY[id];
  const base = `featuredCategory.${slug}`;
  const details = [0, 1, 2, 3].map((i) => ({
    label: t(`${base}.detail${i}Label`),
    value: t(`${base}.detail${i}Value`),
  }));
  return {
    tab: t(`${base}.tab`),
    title: t(`${base}.title`),
    desc: t(`${base}.desc`),
    details,
    color: CATEGORY_BACKGROUNDS[id],
  };
}

export type FeaturedCategorySamples = Partial<Record<string, FeaturedHomeProductSample | null>>;

type Props = {
  samples: FeaturedCategorySamples;
};

export function FeaturedCategorySectionClient({ samples }: Props) {
  const { t } = useI18n();
  const { formatMad } = useFormatPrice();
  const [activeId, setActiveId] = useState<CategoryId>(CATEGORY_ORDER[0]!);
  const active = useMemo(() => featuredSectionCopy(activeId, t), [activeId, t]);
  const tabLabelById = useMemo(() => {
    const m = {} as Record<CategoryId, string>;
    for (const id of CATEGORY_ORDER) {
      m[id] = featuredSectionCopy(id, t).tab;
    }
    return m;
  }, [t]);
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
          <p className="font-sans text-base leading-relaxed text-text-muted max-w-sm">{active.desc}</p>
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
            {CATEGORY_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                className="text-left font-sans text-sm uppercase tracking-wider px-4 py-2.5 transition-colors"
                style={{
                  color: activeId === id ? "var(--color-primary-darker)" : "var(--color-text-muted)",
                  fontWeight: activeId === id ? 700 : 400,
                  borderLeft: activeId === id ? "2px solid var(--color-primary-darker)" : "2px solid transparent",
                  marginLeft: "-2px",
                }}
              >
                {tabLabelById[id]}
              </button>
            ))}
          </div>

          <div
            className="relative flex-1 rounded-sm overflow-hidden"
            style={{ minHeight: "420px", background: active.color }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 55% at 50% 48%, color-mix(in srgb, var(--color-paper) 18%, transparent) 0%, transparent 70%)",
              }}
            />

            {(() => {
              const imgSrc = sample?.firstImageUrl ?? featuredCategoryPlaceholderImage(activeId, 900);
              return (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-0"
                  style={{ perspective: "900px" }}
                >
                  <div
                    key={activeId}
                    className="relative w-56 h-56 sm:w-72 sm:h-72"
                    style={{ animation: "productFloat 4s ease-in-out infinite" }}
                  >
                    <Image
                      alt={active.tab}
                      src={imgSrc}
                      fill
                      className="object-contain"
                      sizes="288px"
                      style={{
                        transform: "rotateX(8deg)",
                        filter: "drop-shadow(0 24px 40px color-mix(in srgb, var(--color-ink) 55%, transparent))",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "120px",
                      height: "18px",
                      background:
                        "radial-gradient(ellipse, color-mix(in srgb, var(--color-ink) 45%, transparent) 0%, transparent 75%)",
                      animation: "shadowPulse 4s ease-in-out infinite",
                      marginTop: "-8px",
                    }}
                  />
                </div>
              );
            })()}

            <div
              className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in srgb, var(--color-ink) 55%, transparent) 0%, color-mix(in srgb, var(--color-ink) 8%, transparent) 40%, transparent 65%)",
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
                    <p className="font-sans text-sm font-semibold text-white/95">{formatMad(sample.fromPriceMad)}</p>
                  </>
                ) : null}
                <span className="font-sans text-white/70 text-xs uppercase tracking-widest">
                  {active.tab}
                  {sample ? t("featuredCategory.liveListingSuffix") : ""}
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
