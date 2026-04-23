import Image from "next/image";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";
import Footer from "~/app/Footer";
import { AnimateOnScroll } from "./animate-on-scroll";

// ─── Value chain data ─────────────────────────────────────────────────────────

const CHAIN = [
  { actor: "Moroccan brand", cut: 42, color: "#000000", detail: "Keeps the lion’s share when selling direct on nevali" },
  { actor: "Ingredients & lab time", cut: 22, color: "#454545", detail: "Botanicals, stability testing, compounding labor" },
  { actor: "Packaging & fulfilment", cut: 18, color: "#727272", detail: "Bottles, labels, cold chain or COD logistics" },
  { actor: "Platform & compliance", cut: 12, color: "#727272", detail: "Payments, reviews, certification workflows" },
  { actor: "Retail markup (elsewhere)", cut: 6, color: "#9CA3AF", detail: "What department stores often add on top" },
];

const FORMULATION_STEPS = [
  { month: "Week 1–2", title: "Sourcing botanicals", body: "Cold-pressed oils, clays, and hydrosols move from cooperatives into quarantine—COA checks, moisture specs, and scent panels before a gram is blended." },
  { month: "Week 3–4", title: "Lab compounding", body: "Chemists balance pH, preservatives, and sensorial slip. Pilot batches chill in stability ovens while INCI copy is drafted in three languages." },
  { month: "Week 5–6", title: "Filling & compliance", body: "Lot codes, tamper seals, and UFI-ready labels. Nothing leaves the lab until Moroccan and export checklists are signed." },
  { month: "Week 7+", title: "Launch on nevali", body: "Approved SKUs go live with photography, reviews, and guest checkout—COD or card—so the story stays with the maker." },
];

const IMPACT = [
  { value: "3×", label: "Faster listing velocity vs. offline trade fairs for indie Moroccan beauty brands" },
  { value: "68%", label: "Target share of catalog revenue returned to partner brands after fulfilment costs" },
  { value: "40+", label: "Cities (and counting) where shoppers have received nevali orders" },
  { value: "0", label: "Opaque RFQ chains between you and the customer" },
];

export default function ArtisanProcessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[56px]">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/70">Our story</span>
            </div>

            <div className="py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <AnimateOnScroll direction="up">
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-secondary mb-6">
                  Why Moroccan beauty needs a new lane
                </p>
                <h1 className="font-serif font-bold uppercase text-white leading-[0.95]"
                  style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
                >
                  10 weeks.<br />One serum.<br />
                  <span className="text-secondary">Still invisible</span><br />online.
                </h1>
                <p className="font-sans text-white/60 mt-8 text-base leading-relaxed max-w-sm">
                  Incredible formulas sit in small labs while resellers copy the story. nevali exists so bio-minded Moroccan cosmetics reach shoppers with proof, price clarity, and dignity for the maker.
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll direction="left" delay={200}>
                <div className="relative h-[420px] w-full">
                  <Image
                    src={COSMETICS_MARKETING.vanityProducts}
                    alt="Moroccan beauty brand workspace with skincare and makeup"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Floating stat */}
                  <div className="absolute bottom-0 left-0 bg-white p-5 max-w-[220px]">
                    <p className="font-serif font-bold text-primary leading-none"
                      style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
                    >
                      4,200€
                    </p>
                    <p className="font-sans text-xs text-text-muted mt-1 leading-snug">
                      boutique retail abroad—for a serum batch the lab invoiced at 900 MAD
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ── FOUNDER STORY ─────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-dark border-x border-cream-dark">

              {/* Image side */}
              <div className="relative min-h-[480px]">
                <Image
                  src={COSMETICS_MARKETING.portrait}
                  alt="Beauty founder in a professional setting representing Moroccan cosmetics brands"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Story side */}
              <div className="px-8 py-16 flex flex-col justify-center">
                <AnimateOnScroll direction="right">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold">
                    A story repeated across cooperatives & labs
                  </span>

                  <h2 className="font-serif font-bold uppercase text-forest-dark mt-4 mb-6 leading-tight"
                    style={{ fontSize: "clamp(24px, 2.5vw, 38px)" }}
                  >
                    Meet Yasmine.<br />She formulates since dawn.
                  </h2>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-5">
                    Yasmine runs a small lab outside Agadir. Cold-pressed argan, rhassoul masks, and rose serums
                    leave her bench every week—yet most shoppers only see them repackaged under foreign labels.
                    She rarely meets the people wearing her textures, and almost never captures the margin they pay abroad.
                  </p>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-8">
                    Last season she bottled a brightening oil that took ten weeks to stabilize. A broker bought the batch
                    for 900 MAD per litre. The same formula resurfaced in London for €48—story rewritten, origin blurred.
                    Yasmine saw almost none of that upside.
                  </p>

                  {/* Pull quote */}
                  <blockquote className="border-l-4 border-secondary pl-5 py-2">
                    <p className="font-serif italic text-forest-dark text-lg leading-relaxed">
                      &ldquo;I know our botanicals are world-class. I just need a shelf that tells the truth—in our words.&rdquo;
                    </p>
                    <footer className="font-sans text-xs text-text-muted mt-3 tracking-[0.05em] uppercase">
                      — Yasmine, 38, Agadir region
                    </footer>
                  </blockquote>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── FORMULATION JOURNEY ───────────────────────────────────────────── */}
        <section className="bg-cream border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <AnimateOnScroll direction="up">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold mb-3">
                From bench to barcode
              </p>
              <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight mb-16"
                style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
              >
                Weeks of science,<br />invisible on the shelf
              </h2>
            </AnimateOnScroll>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-cream-dark hidden md:block" />

              <div className="flex flex-col gap-0 divide-y divide-cream-dark border border-cream-dark bg-white">
                {FORMULATION_STEPS.map((step, i) => (
                  <AnimateOnScroll key={i} direction="up" delay={i * 100}>
                    <div className="flex flex-col md:flex-row gap-6 p-7 md:p-8">
                      <div className="shrink-0 md:w-40">
                        <span className="font-sans text-xs tracking-[0.15em] uppercase text-secondary font-semibold">
                          {step.month}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-bold uppercase text-forest-dark text-lg mb-2">
                          {step.title}
                        </h3>
                        <p className="font-sans text-text-muted text-sm leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                      <div className="shrink-0 md:w-20 flex md:justify-end items-start">
                        <span className="font-serif font-bold text-cream-dark text-[48px] leading-none select-none">
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

        {/* ── THE BROKEN CHAIN ─────────────────────────────────────────────── */}
        <section className="bg-white border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <AnimateOnScroll direction="up">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold mb-3">
                The supply chain problem
              </p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight"
                  style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
                >
                  Where does the margin go?<br />Not to the lab.
                </h2>
                <p className="font-sans text-text-muted text-sm leading-relaxed max-w-xs">
                  A €95 face oil. Brokers, repackagers, and duty-free counters each take a slice.
                  The Moroccan maker who pressed the argan often keeps single-digit percent.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Chain bars */}
            <div className="flex flex-col gap-0 border border-cream-dark divide-y divide-cream-dark">
              {CHAIN.map((link, i) => (
                <AnimateOnScroll key={i} direction="up" delay={i * 80}>
                  <div className="flex items-center gap-6 px-6 py-5 bg-white hover:bg-cream transition-colors">
                    {/* Actor */}
                    <div className="w-44 shrink-0">
                      <p className="font-sans font-semibold text-sm text-text-dark">{link.actor}</p>
                      <p className="font-sans text-xs text-text-muted mt-0.5">{link.detail}</p>
                    </div>

                    {/* Bar */}
                    <div className="flex-1 h-8 bg-cream-dark overflow-hidden">
                      <div
                        className="h-full flex items-center px-3 transition-all duration-1000"
                        style={{ width: `${link.cut * 2.5}%`, minWidth: "48px", background: link.color }}
                      >
                        <span className="font-serif font-bold text-white text-sm whitespace-nowrap">
                          {link.cut}%
                        </span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="w-20 shrink-0 text-right">
                      <span className="font-serif font-bold text-base" style={{ color: link.color }}>
                        {link.cut * 10}€
                      </span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll direction="up" delay={100}>
              <p className="font-sans text-sm text-text-muted mt-4 italic">
                * Illustrative economics for a premium cosmetics SKU. Actual splits vary by channel, taxes, and fulfilment.
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ── THE EMOTIONAL TRUTH ──────────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                {
                  number: "1,000+",
                  label: "Micro-beauty labs & cooperatives",
                  body: "Morocco’s cosmetics scene is fragmented—brilliant at formulation, under-resourced on global storytelling, and squeezed by traders who white-label their oils.",
                },
                {
                  number: "78%",
                  label: "Shoppers ask for origin proof",
                  body: "Buyers want INCI clarity, batch discipline, and proof of Moroccan origin. Without a digital home, even pristine labs fail the trust bar online.",
                },
                {
                  number: "< 12%",
                  label: "Typical margin after opaque resale",
                  body: "When serums are sold through anonymous brokers, the lab that compounded them rarely captures the value the consumer assumes reaches Morocco.",
                },
              ].map((stat, i) => (
                <AnimateOnScroll key={i} direction="up" delay={i * 120} className="px-8 py-10">
                  <p className="font-serif font-bold text-secondary leading-none"
                    style={{ fontSize: "clamp(40px, 4vw, 64px)" }}
                  >
                    {stat.number}
                  </p>
                  <p className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-white/50 mt-2 mb-4">
                    {stat.label}
                  </p>
                  <p className="font-sans text-white/60 text-sm leading-relaxed">
                    {stat.body}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE SOLUTION ─────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-dark border-x border-cream-dark">

              {/* Text */}
              <div className="px-8 py-16 flex flex-col justify-center">
                <AnimateOnScroll direction="up">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold mb-4">
                    The nevali model
                  </p>
                  <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight mb-6"
                    style={{ fontSize: "clamp(26px, 2.8vw, 42px)" }}
                  >
                    We shorten the chain.<br />Not the maker.
                  </h2>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-5">
                    nevali connects verified Moroccan beauty brands directly to shoppers—guest checkout,
                    COD or card, and structured order lines. Brands set pricing and inventory; customers see the
                    real story on every PDP.
                  </p>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-10">
                    We layer compliance tooling, certification uploads, training, and support tickets so labs can
                    focus on what they do best: bio-original formulas that feel unmistakably Moroccan.
                  </p>

                  {/* Before / After */}
                  <div className="grid grid-cols-2 gap-0 divide-x divide-cream-dark border border-cream-dark mb-8">
                    <div className="p-5">
                      <p className="font-sans text-xs tracking-[0.15em] uppercase text-text-muted mb-3">Before</p>
                      <p className="font-serif font-bold text-[32px] text-red-600 leading-none">8%</p>
                      <p className="font-sans text-xs text-text-muted mt-1">of retail value to maker (typical broker path)</p>
                    </div>
                    <div className="p-5 bg-cream">
                      <p className="font-sans text-xs tracking-[0.15em] uppercase text-text-muted mb-3">With nevali</p>
                      <p className="font-serif font-bold text-[32px] text-forest-light leading-none">68%</p>
                      <p className="font-sans text-xs text-text-muted mt-1">target share returned to partner brands</p>
                    </div>
                  </div>

                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-3 bg-primary text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 hover:opacity-90 transition-opacity w-fit"
                  >
                    List your brand
                    <span className="text-secondary">→</span>
                  </Link>
                </AnimateOnScroll>
              </div>

              {/* Visual */}
              <div className="relative min-h-[500px]">
                <Image
                  src={COSMETICS_MARKETING.spaApplication}
                  alt="Curated Moroccan skincare and cosmetic products"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-serif italic text-white text-lg leading-relaxed">
                    &ldquo;For the first time, shoppers read our INCI list in our words—and checkout stays with us.&rdquo;
                  </p>
                  <p className="font-sans text-xs text-white/60 mt-3 tracking-[0.08em] uppercase">
                    — Khadija, nevali partner brand since 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACT NUMBERS ───────────────────────────────────────────────── */}
        <section className="bg-cream border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 divide-x divide-cream-dark border border-cream-dark">
              {IMPACT.map((item, i) => (
                <AnimateOnScroll key={i} direction="up" delay={i * 100} className="px-8 py-12 text-center">
                  <p className="font-serif font-bold text-primary leading-none"
                    style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
                  >
                    {item.value}
                  </p>
                  <p className="font-sans text-sm text-text-muted mt-3 leading-snug max-w-[180px] mx-auto">
                    {item.label}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <AnimateOnScroll direction="up">
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-secondary mb-5">
                  Be part of the change
                </p>
                <h2 className="font-serif font-bold uppercase text-white leading-[0.95]"
                  style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                  Moroccan makers deserve<br />the full story.<br />
                  <span className="text-secondary">Help us tell it.</span>
                </h2>
              </AnimateOnScroll>

              <AnimateOnScroll direction="up" delay={150} className="flex flex-col gap-4 shrink-0">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center bg-secondary text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:opacity-90 transition-opacity"
                >
                  List your brand
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-white/30 text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:bg-white/10 transition-colors"
                >
                  Shop Moroccan cosmetics
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
