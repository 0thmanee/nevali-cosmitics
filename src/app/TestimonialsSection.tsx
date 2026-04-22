import React from "react";

// ── Location icons ────────────────────────────────────────────────────────────

function IconQuoteGreen() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 9C2 6.2 4 4 6 3L7 5C5.5 5.8 5 7 5 8v1H2V9zM8 9C8 6.2 10 4 12 3l1 2c-1.5.8-2 2-2 3v1H8V9z"
        fill="#7b2d1e"
      />
    </svg>
  );
}

function IconQuoteGold() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 9C2 6.2 4 4 6 3L7 5C5.5 5.8 5 7 5 8v1H2V9zM8 9C8 6.2 10 4 12 3l1 2c-1.5.8-2 2-2 3v1H8V9z"
        fill="#C8963C"
      />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#E8B84B" strokeWidth="1.4" />
      <path
        d="M4 7h6M7 4l3 3-3 3"
        stroke="#E8B84B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    location: "SOUSS-MASSA REGION",
    locationIcon: <IconQuoteGreen />,
    locationIconStyle: {
      background: "#FAF5EE",
      borderRadius: "10px 10px 6px 6px",
    },
    topBar:
      "linear-gradient(in oklab 90deg, oklab(24% 0.07 0.038) 0%, oklab(36% 0.09 0.048) 50%, oklab(69.6% 0.033 0.116) 100%)",
    cardBg: "#FAFAF7",
    cardBorder: "1px solid #FAF5EE",
    cardShadow: "#0B241712 0px 4px 32px",
    dark: false,
    quote:
      '"CraftHouse gave our cooperative the credibility we needed. Within 6 months of certification, we signed our first contract with a French organic retailer — something we never could have done alone."',
    name: "Fatima Ait Benhaddou",
    role: "Director, Coopérative Tissint — Argan & Rose",
    initials: "FA",
    avatarGradient:
      "linear-gradient(in oklab 135deg, oklab(24% 0.07 0.038) 0%, oklab(36% 0.09 0.048) 100%)",
    badge: "PRODUCER",
    badgeStyle: { background: "#FAF5EE", color: "#7b2d1e" },
  },
  {
    location: "AMSTERDAM, NETHERLANDS",
    locationIcon: <IconGlobe />,
    locationIconStyle: {
      background: "#C8963C26",
      border: "1px solid #C8963C4D",
      borderRadius: "10px 10px 6px 6px",
    },
    topBar:
      "linear-gradient(in oklab 90deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 50%, oklab(69.6% 0.033 0.116) 100%)",
    cardBg:
      "linear-gradient(in oklab 155deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)",
    cardBorder: "none",
    cardShadow: "#0B241740 0px 8px 48px",
    dark: true,
    quote:
      '"As a European organic importer, supplier verification used to take months. CraftHouse gave us instant access to pre-certified Moroccan cooperatives with full traceability — we closed our first B2B contract in under 3 weeks."',
    name: "Lars Van der Berg",
    role: "Procurement Director, NaturaBio Imports — Amsterdam",
    initials: "LV",
    avatarGradient:
      "linear-gradient(in oklab 135deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 100%)",
    badge: "BUYER",
    badgeStyle: {
      background: "#C8963C33",
      color: "#E8B84B",
      border: "1px solid #C8963C59",
    },
  },
  {
    location: "TALIOUINE REGION",
    locationIcon: <IconQuoteGold />,
    locationIconStyle: {
      background: "#F5EDD6",
      borderRadius: "10px 10px 6px 6px",
    },
    topBar:
      "linear-gradient(in oklab 90deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 50%, oklab(24% 0.07 0.038) 100%)",
    cardBg: "#FAFAF7",
    cardBorder: "1px solid #FAF5EE",
    cardShadow: "#0B241712 0px 4px 32px",
    dark: false,
    quote:
      '"The training programs transformed how we document our production process. The platform\'s support system meant we always had an expert one message away for our export paperwork."',
    name: "Mohammed Benali",
    role: "Artisan, Domaine Berbère — Saffron, Taliouine",
    initials: "MB",
    avatarGradient:
      "linear-gradient(in oklab 135deg, oklab(69.6% 0.033 0.116) 0%, oklab(80.6% 0.012 0.135) 100%)",
    badge: "PRODUCER",
    badgeStyle: { background: "#F5EDD6", color: "#C8963C" },
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-12 lg:gap-16">
        {/* ── Section header ── */}
        <div className="flex flex-col items-center text-center gap-5">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-secondary/40" />
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
                stroke="#C8963C"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-sans text-sm font-semibold tracking-[0.18em] text-secondary uppercase">
              Artisan Stories
            </span>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
                stroke="#C8963C"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <div className="h-px w-10 bg-secondary/40" />
          </div>

          <h2 className="font-serif font-bold text-text-dark leading-tight text-4xl md:text-5xl">
            Trusted by growers
            <br />
            and buyers alike
          </h2>

          <p className="font-sans text-text-muted text-lg max-w-[480px] leading-relaxed">
            Real results from both sides of the marketplace — Moroccan artisans
            and international buyers.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[20px] overflow-hidden"
              style={{
                background: t.cardBg,
                border: t.cardBorder,
                boxShadow: t.cardShadow,
              }}
            >
              {/* Top gradient bar */}
              <div
                className="h-1.5 shrink-0"
                style={{ backgroundImage: t.topBar }}
              />

              {/* Card content */}
              <div className="flex flex-col gap-6 p-9 flex-1">
                {/* Location row */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={t.locationIconStyle}
                  >
                    {t.locationIcon}
                  </div>
                  <span
                    className="font-sans text-sm font-bold tracking-[0.14em] uppercase"
                    style={{
                      color: t.dark ? "rgba(250,250,247,0.45)" : "#7a4d38",
                    }}
                  >
                    {t.location}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-secondary text-lg leading-none">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="font-serif italic text-lg leading-relaxed flex-1"
                  style={{
                    color: t.dark ? "rgba(250,250,247,0.9)" : "#2a0f05",
                  }}
                >
                  {t.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-sans font-bold text-sm text-white"
                    style={{ backgroundImage: t.avatarGradient }}
                  >
                    {t.initials}
                  </div>

                  {/* Name + role */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p
                      className="font-sans font-semibold text-sm leading-tight"
                      style={{ color: t.dark ? "#FAFAF7" : "#2a0f05" }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="font-sans text-xs leading-tight"
                      style={{
                        color: t.dark ? "rgba(250,250,247,0.45)" : "#7a4d38",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>

                  {/* Badge */}
                  <span
                    className="font-sans text-xs font-bold tracking-wider rounded-full px-2.5 py-1 shrink-0 uppercase"
                    style={t.badgeStyle}
                  >
                    {t.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
