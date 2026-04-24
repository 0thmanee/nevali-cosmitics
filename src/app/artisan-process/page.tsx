import Image from "next/image";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";
import { getMessages } from "~/lib/i18n/load-messages";
import { interpolate } from "~/lib/i18n/interpolate";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { AnimateOnScroll } from "./animate-on-scroll";

type ChainRow = { actor: string; detail: string; cut: number; color: string };
type ImpactRow = { value: string; label: string };

export default async function ArtisanProcessPage() {
  const t = await getTranslator();
  const messages = getMessages(await getLocale());
  const ap = messages.artisanProcess;
  const brand = NEVALI_HOUSE_BRAND.legalName;

  const chain: readonly ChainRow[] = SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.chainMulti : ap.chainSingle;
  const impact: readonly ImpactRow[] = SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.impactMulti : ap.impactSingle;

  return (
    <>
      <Navbar />
      <main className="pt-[56px]">
        <section className="relative overflow-hidden bg-primary">
          <div className="mx-auto max-w-7xl px-6">
            <AnimateOnScroll
              className="flex items-center gap-2 border-b border-white/10 py-4 font-sans text-xs tracking-[0.08em] text-white/40 uppercase"
              direction="down"
            >
              <Link className="transition-colors hover:text-white/70" href="/">
                {t("common.home")}
              </Link>
              <span>{t("common.breadcrumbSeparator")}</span>
              <span className="text-white/70">{ap.breadcrumbOurStory}</span>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 items-center gap-16 py-24 md:grid-cols-2">
              <AnimateOnScroll direction="up">
                <p className="mb-6 font-sans text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
                  {ap.heroEyebrow}
                </p>
                <h1 className="font-serif font-bold uppercase leading-[0.95] text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>
                  {ap.heroTitleLine1}
                  <br />
                  {ap.heroTitleLine2}
                  <br />
                  <span className="text-secondary">{ap.heroTitleAccent}</span>
                  <br />
                  {ap.heroTitleLine3}
                </h1>
                <p className="mt-8 max-w-sm font-sans text-base leading-relaxed text-white/60">{ap.heroBody}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200} direction="left">
                <div className="relative h-[420px] w-full">
                  <Image src={COSMETICS_MARKETING.vanityProducts} alt={ap.heroImageAlt} fill className="object-cover" priority />
                  <div className="absolute bottom-0 start-0 max-w-[220px] bg-white p-5">
                    <p className="font-serif font-bold leading-none text-primary" style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>
                      4,200€
                    </p>
                    <p className="mt-1 font-sans text-xs text-text-muted leading-snug">{ap.heroStatCaption}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <section className="border-b border-cream-dark bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 divide-y border-x border-cream-dark md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="relative min-h-[480px]">
                <Image src={COSMETICS_MARKETING.portrait} alt={ap.founderImageAlt} fill className="object-cover" />
              </div>

              <div className="flex flex-col justify-center px-8 py-16">
                <AnimateOnScroll direction="right">
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
                    {ap.founderKicker}
                  </span>

                  <h2
                    className="mt-4 mb-6 font-serif font-bold uppercase leading-tight text-forest-dark"
                    style={{ fontSize: "clamp(24px, 2.5vw, 38px)" }}
                  >
                    {ap.founderTitleLine1}
                    <br />
                    {ap.founderTitleLine2}
                  </h2>

                  <p className="mb-5 font-sans text-base leading-relaxed text-text-muted">{ap.founderP1}</p>

                  <p className="mb-8 font-sans text-base leading-relaxed text-text-muted">{ap.founderP2}</p>

                  <blockquote className="border-s-4 border-secondary py-2 ps-5">
                    <p className="font-serif text-lg leading-relaxed text-forest-dark italic">&ldquo;{ap.founderQuote}&rdquo;</p>
                    <footer className="mt-3 font-sans text-xs text-text-muted tracking-[0.05em] uppercase">
                      {ap.founderAttribution}
                    </footer>
                  </blockquote>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-cream-dark bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <AnimateOnScroll direction="up">
              <p className="mb-3 font-sans text-xs font-semibold tracking-[0.2em] text-secondary uppercase">{ap.formulationKicker}</p>
              <h2
                className="mb-16 font-serif font-bold uppercase leading-tight text-forest-dark"
                style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
              >
                {ap.formulationTitleLine1}
                <br />
                {ap.formulationTitleLine2}
              </h2>
            </AnimateOnScroll>

            <div className="relative">
              <div className="absolute top-0 bottom-0 start-[19px] hidden w-px bg-cream-dark md:block" />

              <div className="flex flex-col gap-0 divide-y divide-cream-dark border border-cream-dark bg-white">
                {ap.formulationSteps.map((step, i) => (
                  <AnimateOnScroll delay={i * 100} direction="up" key={step.month}>
                    <div className="flex flex-col gap-6 p-7 md:flex-row md:p-8">
                      <div className="shrink-0 md:w-40">
                        <span className="font-sans text-xs font-semibold tracking-[0.15em] text-secondary uppercase">
                          {step.month}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-serif text-lg font-bold uppercase text-forest-dark">{step.title}</h3>
                        <p className="font-sans text-sm leading-relaxed text-text-muted">{step.body}</p>
                      </div>
                      <div className="flex shrink-0 items-start md:w-20 md:justify-end">
                        <span className="font-serif text-[48px] leading-none font-bold text-cream-dark select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-cream-dark bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <AnimateOnScroll direction="up">
              <p className="mb-3 font-sans text-xs font-semibold tracking-[0.2em] text-secondary uppercase">{ap.brokenChainKicker}</p>
              <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2
                  className="font-serif font-bold uppercase leading-tight text-forest-dark"
                  style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
                >
                  {ap.brokenChainTitleLine1}
                  <br />
                  {ap.brokenChainTitleLine2}
                </h2>
                <p className="max-w-xs font-sans text-sm leading-relaxed text-text-muted">{ap.brokenChainBody}</p>
              </div>
            </AnimateOnScroll>

            <div className="flex flex-col gap-0 divide-y divide-cream-dark border border-cream-dark">
              {chain.map((link, i) => (
                <AnimateOnScroll delay={i * 80} direction="up" key={link.actor}>
                  <div className="flex items-center gap-6 bg-white px-6 py-5 transition-colors hover:bg-cream">
                    <div className="w-44 shrink-0">
                      <p className="font-sans text-sm font-semibold text-text-dark">{link.actor}</p>
                      <p className="mt-0.5 font-sans text-xs text-text-muted">{link.detail}</p>
                    </div>

                    <div className="h-8 flex-1 overflow-hidden bg-cream-dark">
                      <div
                        className="flex h-full items-center px-3 transition-all duration-1000"
                        style={{ width: `${link.cut * 2.5}%`, minWidth: "48px", background: link.color }}
                      >
                        <span className="whitespace-nowrap font-serif text-sm font-bold text-white">{link.cut}%</span>
                      </div>
                    </div>

                    <div className="w-20 shrink-0 text-end">
                      <span className="font-serif text-base font-bold" style={{ color: link.color }}>
                        {link.cut * 10}€
                      </span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll delay={100} direction="up">
              <p className="mt-4 font-sans text-sm text-text-muted italic">{ap.brokenChainFootnote}</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section className="bg-primary">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid grid-cols-1 gap-0 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {ap.emotionalTruth.map((stat, i) => (
                <AnimateOnScroll className="px-8 py-10" delay={i * 120} direction="up" key={stat.label}>
                  <p className="font-serif font-bold leading-none text-secondary" style={{ fontSize: "clamp(40px, 4vw, 64px)" }}>
                    {stat.number}
                  </p>
                  <p className="mt-2 mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">{stat.label}</p>
                  <p className="font-sans text-sm leading-relaxed text-white/60">{stat.body}</p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-cream-dark bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 divide-y border-x border-cream-dark md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex flex-col justify-center px-8 py-16">
                <AnimateOnScroll direction="up">
                  <p className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-secondary uppercase">{ap.solutionKicker}</p>
                  <h2
                    className="mb-6 font-serif font-bold uppercase leading-tight text-forest-dark"
                    style={{ fontSize: "clamp(26px, 2.8vw, 42px)" }}
                  >
                    {ap.solutionTitleLine1}
                    <br />
                    {ap.solutionTitleLine2}
                  </h2>

                  <p className="mb-5 font-sans text-base leading-relaxed text-text-muted">
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.solutionBodyMulti : interpolate(ap.solutionBodySingle, { brand })}
                  </p>

                  <p className="mb-10 font-sans text-base leading-relaxed text-text-muted">
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.solutionBody2Multi : ap.solutionBody2Single}
                  </p>

                  <div className="mb-8 grid grid-cols-2 gap-0 divide-x divide-cream-dark border border-cream-dark">
                    <div className="p-5">
                      <p className="mb-3 font-sans text-xs text-text-muted uppercase tracking-[0.15em]">{ap.beforeLabel}</p>
                      <p className="font-serif text-[32px] leading-none font-bold text-red-600">{ap.beforePercent}</p>
                      <p className="mt-1 font-sans text-xs text-text-muted">{ap.beforeCaption}</p>
                    </div>
                    <div className="bg-cream p-5">
                      <p className="mb-3 font-sans text-xs text-text-muted uppercase tracking-[0.15em]">
                        {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.afterLabelMulti : interpolate(ap.afterLabelSingle, { brand })}
                      </p>
                      <p className="font-serif text-[32px] leading-none font-bold text-forest-light">{ap.afterPercent}</p>
                      <p className="mt-1 font-sans text-xs text-text-muted">
                        {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.afterCaptionMulti : interpolate(ap.afterCaptionSingle, { brand })}
                      </p>
                    </div>
                  </div>

                  {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                    <Link
                      href="/auth/register"
                      className="inline-flex w-fit items-center gap-3 bg-primary px-8 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
                    >
                      {ap.listYourBrand}
                      <span className="text-secondary">→</span>
                    </Link>
                  ) : (
                    <Link
                      href="/products"
                      className="inline-flex w-fit items-center gap-3 bg-primary px-8 py-4 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
                    >
                      {ap.shopTheCatalog}
                      <span className="text-secondary">→</span>
                    </Link>
                  )}
                </AnimateOnScroll>
              </div>

              <div className="relative min-h-[500px]">
                <Image src={COSMETICS_MARKETING.spaApplication} alt={ap.solutionImageAlt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-0 start-0 end-0 p-8">
                  <p className="font-serif text-lg leading-relaxed text-white italic">
                    &ldquo;
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.solutionQuoteMulti : interpolate(ap.solutionQuoteSingle, { brand })}
                    &rdquo;
                  </p>
                  <p className="mt-3 font-sans text-xs text-white/60 tracking-[0.08em] uppercase">
                    {SHOW_MULTI_PRODUCER_EXPERIENCE ? ap.solutionQuoteAttrMulti : interpolate(ap.solutionQuoteAttrSingle, { brand })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-cream-dark bg-cream">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 divide-y border border-cream-dark sm:grid-cols-2 sm:divide-y-0 sm:divide-x md:grid-cols-4">
              {impact.map((item, i) => (
                <AnimateOnScroll className="px-8 py-12 text-center" delay={i * 100} direction="up" key={item.value + item.label}>
                  <p className="font-serif font-bold leading-none text-primary" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
                    {item.value}
                  </p>
                  <p className="mx-auto mt-3 max-w-[180px] font-sans text-sm text-text-muted leading-snug">{item.label}</p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
              <AnimateOnScroll direction="up">
                <p className="mb-5 font-sans text-xs tracking-[0.25em] text-secondary uppercase">{ap.finalKicker}</p>
                <h2 className="font-serif font-bold uppercase leading-[0.95] text-white" style={{ fontSize: "clamp(36px, 5vw, 72px)" }}>
                  {ap.finalTitleLine1}
                  <br />
                  {ap.finalTitleLine2}
                  <br />
                  <span className="text-secondary">{ap.finalTitleAccent}</span>
                </h2>
              </AnimateOnScroll>

              <AnimateOnScroll className="flex shrink-0 flex-col gap-4" delay={150} direction="up">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center bg-secondary px-10 py-5 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
                  >
                    {ap.listYourBrand}
                  </Link>
                ) : null}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-white/30 px-10 py-5 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-white/10"
                >
                  {ap.shopMoroccan}
                </Link>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
