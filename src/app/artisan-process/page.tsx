import Image from "next/image";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { AnimateOnScroll } from "./animate-on-scroll";

// ─── Value chain data ─────────────────────────────────────────────────────────

const CHAIN = [
  { actor: "Artisan", cut: 8, color: "#7A2915", detail: "Receives ~8% of the final retail price" },
  { actor: "Local collector", cut: 12, color: "#a33520", detail: "Buys in bulk, adds 12% margin" },
  { actor: "Regional broker", cut: 20, color: "#D87708", detail: "Aggregates, warehouses, adds 20% margin" },
  { actor: "Exporter / agent", cut: 25, color: "#c8963c", detail: "Handles export logistics, takes 25% cut" },
  { actor: "International retailer", cut: 35, color: "#9CA3AF", detail: "Final retail markup — often 35%+" },
];

const CRAFT_STEPS = [
  { month: "Month 1–2", title: "Sourcing raw materials", body: "She travels to the souk before dawn to negotiate wool prices — the same price she paid ten years ago. She carries it home by bus." },
  { month: "Month 2–3", title: "Dyeing & spinning", body: "Her hands stain deep red from the madder root. The smell of indigo fills the house for days. She works by natural light to save on electricity." },
  { month: "Month 3–5", title: "Weaving, knot by knot", body: "Eight hours a day. Sitting on the same wooden bench her mother sat on. Her eyes follow patterns she learned at age nine. No shortcuts exist." },
  { month: "Month 6", title: "Finishing & selling", body: "She brings the rug to market. The broker offers 600 MAD. She hesitates. She accepts. She needs the money for school fees." },
];

const IMPACT = [
  { value: "3×", label: "Average income increase for CraftHouse artisans vs traditional intermediary chains" },
  { value: "68%", label: "Of the sale price goes directly to the artisan — not middlemen" },
  { value: "40+", label: "Countries where CraftHouse artisans now sell directly to buyers" },
  { value: "0", label: "Intermediaries between the artisan and your order" },
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
              <span className="text-white/70">Artisan Process</span>
            </div>

            <div className="py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <AnimateOnScroll direction="up">
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-secondary mb-6">
                  The real cost of handcraft
                </p>
                <h1 className="font-serif font-bold uppercase text-white leading-[0.95]"
                  style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
                >
                  6 months.<br />1 rug.<br />
                  <span className="text-secondary">200 MAD</span><br />profit.
                </h1>
                <p className="font-sans text-white/60 mt-8 text-base leading-relaxed max-w-sm">
                  This is the reality for thousands of Moroccan artisans. Their craft takes months.
                  Their reward barely covers the wool. We built CraftHouse to change this.
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll direction="left" delay={200}>
                <div className="relative h-[420px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2000&auto=format&fit=crop"
                    alt="Moroccan artisan weaving"
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
                      resale price in Paris — for a rug the artisan sold for 600 MAD
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ── FATIMA'S STORY ────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-dark border-x border-cream-dark">

              {/* Image side */}
              <div className="relative min-h-[480px]">
                <Image
                  src="/assets/images/fatima.png"
                  alt="Fatima, artisan weaver from Zagora"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Story side */}
              <div className="px-8 py-16 flex flex-col justify-center">
                <AnimateOnScroll direction="right">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold">
                    A story repeated 150,000 times
                  </span>

                  <h2 className="font-serif font-bold uppercase text-forest-dark mt-4 mb-6 leading-tight"
                    style={{ fontSize: "clamp(24px, 2.5vw, 38px)" }}
                  >
                    Meet Fatima.<br />She has been weaving since she was nine.
                  </h2>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-5">
                    Fatima lives in the Drâa-Tafilalet region. Every morning at 5am, before the household wakes,
                    she sits at her loom. She has been doing this for 34 years. Her fingers know every knot
                    without thinking. Her rugs have sold in design studios in Milan, Amsterdam, and New York —
                    though she has never seen those cities, and often doesn't know where her work ends up.
                  </p>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-8">
                    Last spring, she finished a rug that took her four months. She sold it to the local broker
                    for 800 MAD — about 75 euros. The broker sold it to an exporter for 320 euros. It appeared
                    in an online shop in Berlin for 1,890 euros. Fatima saw none of that difference.
                  </p>

                  {/* Pull quote */}
                  <blockquote className="border-l-4 border-secondary pl-5 py-2">
                    <p className="font-serif italic text-forest-dark text-lg leading-relaxed">
                      "I know my rugs are beautiful. I just didn't know they were worth that much.
                      Nobody told me."
                    </p>
                    <footer className="font-sans text-xs text-text-muted mt-3 tracking-[0.05em] uppercase">
                      — Fatima, 43, Zagora
                    </footer>
                  </blockquote>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── CRAFT JOURNEY ────────────────────────────────────────────────── */}
        <section className="bg-cream border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <AnimateOnScroll direction="up">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold mb-3">
                The process
              </p>
              <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight mb-16"
                style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
              >
                6 months of work,<br />invisible to the market
              </h2>
            </AnimateOnScroll>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-cream-dark hidden md:block" />

              <div className="flex flex-col gap-0 divide-y divide-cream-dark border border-cream-dark bg-white">
                {CRAFT_STEPS.map((step, i) => (
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
                  Where does the money go?<br />Not to the artisan.
                </h2>
                <p className="font-sans text-text-muted text-sm leading-relaxed max-w-xs">
                  A 1,000€ rug. Five hands it passes through.
                  The person who made it receives less than 80€.
                  Follow the money.
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
                * Illustration based on a 1,000€ retail price. Percentages are approximate and vary by region and product category.
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
                  number: "150K+",
                  label: "Moroccan artisans",
                  body: "Over 150,000 artisans in Morocco depend on craft as their primary income. Most are women. Most live in rural areas with limited market access.",
                },
                {
                  number: "92%",
                  label: "Never meet the buyer",
                  body: "92% of traditional artisans never speak directly to the person who buys their work. They have no idea who values it, or how much it is truly worth.",
                },
                {
                  number: "< 10%",
                  label: "Of retail value retained",
                  body: "In most traditional supply chains, the artisan retains less than 10% of the final retail price. The rest is absorbed by brokers, exporters, and retailers.",
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
                    The CraftHouse model
                  </p>
                  <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight mb-6"
                    style={{ fontSize: "clamp(26px, 2.8vw, 42px)" }}
                  >
                    We cut out the chain.<br />Not the artisan.
                  </h2>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-5">
                    CraftHouse connects verified Moroccan artisans directly to international buyers —
                    no brokers, no collectors, no exporters skimming the margin. The artisan sets their
                    price. The buyer places the order. The money moves directly.
                  </p>

                  <p className="font-sans text-text-muted text-base leading-relaxed mb-10">
                    We handle the logistics, the compliance, the documentation, and the trust —
                    so artisans can focus on what they do best: creating work that no factory ever will.
                  </p>

                  {/* Before / After */}
                  <div className="grid grid-cols-2 gap-0 divide-x divide-cream-dark border border-cream-dark mb-8">
                    <div className="p-5">
                      <p className="font-sans text-xs tracking-[0.15em] uppercase text-text-muted mb-3">Before</p>
                      <p className="font-serif font-bold text-[32px] text-red-600 leading-none">8%</p>
                      <p className="font-sans text-xs text-text-muted mt-1">of retail value to artisan</p>
                    </div>
                    <div className="p-5 bg-cream">
                      <p className="font-sans text-xs tracking-[0.15em] uppercase text-text-muted mb-3">With CraftHouse</p>
                      <p className="font-serif font-bold text-[32px] text-forest-light leading-none">68%</p>
                      <p className="font-sans text-xs text-text-muted mt-1">of sale price to artisan</p>
                    </div>
                  </div>

                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-3 bg-primary text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 hover:opacity-90 transition-opacity w-fit"
                  >
                    Join as an Artisan
                    <span className="text-secondary">→</span>
                  </Link>
                </AnimateOnScroll>
              </div>

              {/* Visual */}
              <div className="relative min-h-[500px]">
                <Image
                  src="/assets/images/cutout.png"
                  alt="Artisan proudly displaying finished work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-serif italic text-white text-lg leading-relaxed">
                    "For the first time, I know who is buying my work — and I know it's worth it."
                  </p>
                  <p className="font-sans text-xs text-white/60 mt-3 tracking-[0.08em] uppercase">
                    — Khadija, CraftHouse artisan since 2024
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
                  Fatima deserves<br />to know her worth.<br />
                  <span className="text-secondary">Help us tell her.</span>
                </h2>
              </AnimateOnScroll>

              <AnimateOnScroll direction="up" delay={150} className="flex flex-col gap-4 shrink-0">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center bg-secondary text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:opacity-90 transition-opacity"
                >
                  Join as an Artisan
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-white/30 text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:bg-white/10 transition-colors"
                >
                  Browse Artisan Products
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
