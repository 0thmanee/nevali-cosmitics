import Link from "next/link";

const artisanFeatures = [
  { label: "Verified profile & certification badge" },
  { label: "List your crafts with specs & pricing" },
  { label: "Receive inquiries from global buyers" },
  { label: "Training programs & export guidance" },
];

const buyerFeatures = [
  { label: "Browse hundreds of certified crafts" },
  { label: "Submit direct purchase inquiries" },
  { label: "Full product traceability & QR scan" },
  { label: "Secure negotiation & order tracking" },
];

export default function EcosystemSection() {
  return (
    <section id="about" className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top label row */}
        <div className="flex items-center gap-4 py-10 border-b border-stone-100">
          <span
            className="font-sans text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: "#C87020" }}
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
            style={{ fontSize: "clamp(80px, 12vw, 160px)", color: "rgba(123,45,30,0.04)" }}
          >
            01
          </span>

          <div className="flex flex-col gap-3 relative z-10">
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1"
              style={{ background: "rgba(123,45,30,0.07)" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" style={{ color: "#7B1F0A" }}>
                <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span
                className="font-sans text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "#7B1F0A" }}
              >
                Artisan side
              </span>
            </div>

            <h2
              className="font-serif font-bold leading-[1.05]"
              style={{ fontSize: "clamp(32px, 3.5vw, 54px)", color: "#1a0500" }}
            >
              From your hands
              <br />
              to the world
            </h2>

            <p className="font-sans text-stone-500 leading-relaxed max-w-sm" style={{ fontSize: 15 }}>
              Register, get certified, and open your crafts to buyers across Europe,
              the Gulf, and North America — all from one dashboard.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 relative z-10">
            {artisanFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center"
                  style={{ color: "#C87020" }}
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
            style={{ background: "#7B1F0A" }}
          >
            Apply as Artisan
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Buyer side ── */}
        <div
          className="relative px-8 lg:px-12 py-16 lg:py-20 flex flex-col gap-10"
          style={{ background: "#FAF7F4" }}
        >
          {/* Big background number */}
          <span
            className="absolute top-8 right-8 font-serif font-bold select-none pointer-events-none leading-none"
            style={{ fontSize: "clamp(80px, 12vw, 160px)", color: "rgba(200,112,32,0.06)" }}
          >
            02
          </span>

          <div className="flex flex-col gap-3 relative z-10">
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1"
              style={{ background: "rgba(200,112,32,0.1)" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" style={{ color: "#C87020" }}>
                <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span
                className="font-sans text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "#C87020" }}
              >
                Buyer side
              </span>
            </div>

            <h2
              className="font-serif font-bold leading-[1.05]"
              style={{ fontSize: "clamp(32px, 3.5vw, 54px)", color: "#1a0500" }}
            >
              Source crafts you
              <br />
              can trust
            </h2>

            <p className="font-sans text-stone-500 leading-relaxed max-w-sm" style={{ fontSize: 15 }}>
              Every product is certified, traceable, and market-ready. Browse, inquire,
              and negotiate directly with verified Moroccan artisans.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 relative z-10">
            {buyerFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center"
                  style={{ color: "#C87020" }}
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
              style={{ color: "#1a0500", borderColor: "rgba(26,5,0,0.2)", background: "white" }}
            >
              Browse Certified Crafts
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/auth/register-buyer"
              className="self-start font-sans font-semibold text-sm px-6 py-3 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              style={{ background: "#7B1F0A", color: "#fff" }}
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
            { value: "500+", label: "Certified artisans" },
            { value: "1,800+", label: "Verified products" },
            { value: "12", label: "Moroccan regions" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span
                className="font-serif font-bold"
                style={{ fontSize: "clamp(22px, 2.5vw, 36px)", color: "#1a0500" }}
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
