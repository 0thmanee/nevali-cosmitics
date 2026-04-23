import Link from "next/link";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

const artisanFeatures = [
  { label: "Verified brand profile & certification uploads" },
  { label: "List SKUs, variants, ingredients, and imagery" },
  { label: "Receive catalog orders with COD or card rules" },
  { label: "Training on compliance, packaging, and exports" },
];

const buyerFeatures = [
  { label: "Shop Moroccan skincare, hair, body & ritual care" },
  { label: "Guest checkout—no account required" },
  { label: "Transparent ingredients & brand storytelling" },
  { label: "Saved lists, alerts, and optional buyer account" },
];

export default function EcosystemSection() {
  if (!SHOW_MULTI_PRODUCER_EXPERIENCE) {
    return (
      <section id="about" className="w-full overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4 border-b border-stone-100 py-10">
            <span
              className="font-sans text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: "#727272" }}
            >
              How it works
            </span>
            <div className="h-px flex-1 bg-stone-100" />
            <span className="font-sans text-xs tracking-widest text-stone-400 uppercase">Shop nevali</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-3">
            <h2
              className="font-serif font-bold leading-[1.05]"
              style={{ fontSize: "clamp(32px, 3.5vw, 48px)", color: "#000000" }}
            >
              Moroccan cosmetics,
              <br />
              one trusted house brand
            </h2>
            <p className="max-w-lg font-sans text-[15px] leading-relaxed text-stone-500">
              NEVALI formulates and curates every listing you see today—transparent ingredients, guest checkout, and
              optional buyer accounts for orders and saved lists.
            </p>
          </div>

          <ul className="mt-10 flex flex-col gap-3">
            {buyerFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center" style={{ color: "#727272" }}>
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path
                      d="M3 8l3.5 3.5L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-sans text-sm text-stone-600">{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 self-start border border-stone-300 bg-white px-6 py-3 font-sans text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ color: "#000000" }}
            >
              Browse the catalog
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/auth/register-buyer"
              className="inline-flex items-center gap-2 self-start bg-black px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create buyer account
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-4 border-x border-t border-stone-100 py-8 px-8 sm:grid-cols-3 lg:px-12">
            {[
              { value: "24+", label: "Curated SKUs" },
              { value: "100%", label: "House-controlled listings" },
              { value: "1", label: "Moroccan lab, one voice" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-serif font-bold" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", color: "#000000" }}>
                  {s.value}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest text-stone-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top label row */}
        <div className="flex items-center gap-4 py-10 border-b border-stone-100">
          <span
            className="font-sans text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: "#727272" }}
          >
            How it works
          </span>
          <div className="flex-1 h-px bg-stone-100" />
          <span className="font-sans text-xs text-stone-400 tracking-widest uppercase">
            Two sides · One platform
          </span>
        </div>
      </div>

      {/* Split columns — contained */}
      <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-x border-stone-100">
        {/* ── Artisan side ── */}
        <div className="relative px-8 lg:px-12 py-16 lg:py-20 flex flex-col gap-10 border-b lg:border-b-0 lg:border-r border-stone-100">
          {/* Big background number */}
          <span
            className="absolute top-8 right-8 font-serif font-bold select-none pointer-events-none leading-none"
            style={{ fontSize: "clamp(80px, 12vw, 160px)", color: "rgba(0,0,0,0.04)" }}
          >
            01
          </span>

          <div className="flex flex-col gap-3 relative z-10">
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1"
              style={{ background: "rgba(0,0,0,0.06)" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" style={{ color: "#000000" }}>
                <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span
                className="font-sans text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "#000000" }}
              >
                Brand side
              </span>
            </div>

            <h2
              className="font-serif font-bold leading-[1.05]"
              style={{ fontSize: "clamp(32px, 3.5vw, 54px)", color: "#000000" }}
            >
              From your hands
              <br />
              to the world
            </h2>

            <p className="font-sans text-stone-500 leading-relaxed max-w-sm" style={{ fontSize: 15 }}>
              Register, pass review, and publish your Moroccan cosmetics to shoppers in Morocco and abroad—all from one dashboard.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 relative z-10">
            {artisanFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center"
                  style={{ color: "#727272" }}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-sans text-sm text-stone-600">{f.label}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/auth/register"
            className="relative z-10 self-start font-sans font-semibold text-sm text-white px-6 py-3 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
            style={{ background: "#000000" }}
          >
            Apply as a brand
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Buyer side ── */}
        <div
          className="relative px-8 lg:px-12 py-16 lg:py-20 flex flex-col gap-10"
          style={{ background: "#ede6dc" }}
        >
          {/* Big background number */}
          <span
            className="absolute top-8 right-8 font-serif font-bold select-none pointer-events-none leading-none"
            style={{ fontSize: "clamp(80px, 12vw, 160px)", color: "rgba(114,114,114,0.06)" }}
          >
            02
          </span>

          <div className="flex flex-col gap-3 relative z-10">
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1"
              style={{ background: "rgba(114,114,114,0.1)" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" style={{ color: "#727272" }}>
                <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span
                className="font-sans text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "#727272" }}
              >
                Buyer side
              </span>
            </div>

            <h2
              className="font-serif font-bold leading-[1.05]"
              style={{ fontSize: "clamp(32px, 3.5vw, 54px)", color: "#000000" }}
            >
              Shop cosmetics you
              <br />
              can trace
            </h2>

            <p className="font-sans text-stone-500 leading-relaxed max-w-sm" style={{ fontSize: 15 }}>
              Every listing is reviewed for quality and clarity. Browse by category, read ingredients, then
              check out in a few steps—supporting Moroccan makers without opaque middlemen.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 relative z-10">
            {buyerFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center"
                  style={{ color: "#727272" }}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-sans text-sm text-stone-600">{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <Link
              href="/products"
              className="self-start font-sans font-semibold text-sm px-6 py-3 transition-opacity hover:opacity-90 inline-flex items-center gap-2 border"
              style={{ color: "#000000", borderColor: "rgba(0,0,0,0.2)", background: "white" }}
            >
              Browse the catalog
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/auth/register-buyer"
              className="self-start font-sans font-semibold text-sm px-6 py-3 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              style={{ background: "#000000", color: "#fff" }}
            >
              Create buyer account
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom stat bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 border-t border-x border-stone-100 py-8 gap-4 px-8 lg:px-12">
          {[
            { value: "500+", label: "Partner brands (goal)" },
            { value: "1,800+", label: "Curated SKUs (goal)" },
            { value: "12", label: "Regions represented" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span
                className="font-serif font-bold"
                style={{ fontSize: "clamp(22px, 2.5vw, 36px)", color: "#000000" }}
              >
                {s.value}
              </span>
              <span className="font-sans text-xs text-stone-400 uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
