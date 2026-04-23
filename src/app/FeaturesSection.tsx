import React from "react";

// ── Pillar header icons ───────────────────────────────────────────────────────

function IconPillar1() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1l1.5 4.5H14l-4 2.9 1.5 4.6L8 10.2 4.5 13l1.5-4.6L2 5.5h4.5L8 1z"
        stroke="#000000"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPillar2() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#727272" strokeWidth="1.3" />
      <path
        d="M5 8h6M8 5l3 3-3 3"
        stroke="#727272"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPillar3() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 12l4-4 3 3 5-7"
        stroke="#000000"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Feature card icons ────────────────────────────────────────────────────────

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2l1.8 5.5H18l-5 3.6 1.8 5.5L10 13l-4.6 3.6 1.8-5.5L2 7.5h6.2L10 2z"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 10l3 3 7-7"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="8" stroke="#000000" strokeWidth="1.6" />
    </svg>
  );
}

function IconAudit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="5"
        width="14"
        height="11"
        rx="1.5"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <path
        d="M7 5V4a3 3 0 0 1 6 0v1M8 11l2 2 4-4"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1"
        stroke="#727272"
        strokeWidth="1.6"
      />
      <rect
        x="12"
        y="2"
        width="6"
        height="6"
        rx="1"
        stroke="#727272"
        strokeWidth="1.6"
      />
      <rect
        x="2"
        y="12"
        width="6"
        height="6"
        rx="1"
        stroke="#727272"
        strokeWidth="1.6"
      />
      <rect
        x="12"
        y="12"
        width="6"
        height="6"
        rx="1"
        stroke="#727272"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconShoppingBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 7h10v11H5V7z"
        stroke="#727272"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 7V5a2 2 0 0 1 4 0v2"
        stroke="#727272"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3z"
        stroke="#E8B84B"
        strokeWidth="1.6"
      />
      <path
        d="M7 10l2 2 4-4"
        stroke="#E8B84B"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTraining() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3v14M5 7l5-4 5 4M5 13l5 4 5-4"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="4"
        y="3"
        width="12"
        height="14"
        rx="1.5"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <path
        d="M8 7h4M8 10h4M8 13h2"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <rect
        x="12"
        y="2"
        width="6"
        height="6"
        rx="1"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <rect
        x="2"
        y="12"
        width="6"
        height="6"
        rx="1"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <path
        d="M12 15h6M15 12v6"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const pillars = [
  {
    label: "PILLAR 1 — TRUST & COMPLIANCE",
    pillarIcon: <IconPillar1 />,
    pillarIconBg: "#ffffff",
    cards: [
      {
        icon: <IconStar />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Quality Certification",
        desc: "Per-category quality criteria, document review, structured audit workflows, and certification expiry tracking.",
        tags: [
          {
            label: "ISO READY",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
          {
            label: "MULTI-CATEGORY",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
      {
        icon: <IconCheckCircle />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Traceability & QR Verification",
        desc: "Every SKU links to its Moroccan brand, ingredients, optional batch data, and certification IDs—easy for shoppers to verify.",
        tags: [
          {
            label: "QR SCANNABLE",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
          {
            label: "BATCH LINKED",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
      {
        icon: <IconAudit />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Quality Audits",
        desc: "Structured audit workflows with document upload, approval tracking, and automated expiry alerts.",
        tags: [
          {
            label: "AUTO-ALERTS",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
          {
            label: "SECURE & AUDITABLE",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
    ],
  },
  {
    label: "PILLAR 2 — MARKETPLACE ACCESS",
    pillarIcon: <IconPillar2 />,
    pillarIconBg: "#F5EDD6",
    cards: [
      {
        icon: <IconGrid />,
        iconBg: "#F5EDD6",
        cardBg: "#ffffff",
        cardBorder: "#F0E6CC",
        dark: false,
        title: "Product listings",
        desc: "Skincare, hair, body, fragrance, and ritual care—organized by category with photos, INCI-style ingredients, and variant pricing in MAD.",
        tags: [
          {
            label: "COSMETICS FOCUS",
            style: {
              background: "#F5EDD6",
              color: "#727272",
              border: "1px solid #e8d4a0",
            },
          },
        ],
      },
      {
        icon: <IconShoppingBag />,
        iconBg: "#F5EDD6",
        cardBg: "#ffffff",
        cardBorder: "#F0E6CC",
        dark: false,
        title: "Guest checkout & cart",
        desc: "Shoppers add to cart and pay by card (Stripe) or cash on delivery—no forced sign-in. Brands receive structured order lines for fulfilment.",
        tags: [
          {
            label: "NO LOGIN REQUIRED",
            style: {
              background: "#F5EDD6",
              color: "#727272",
              border: "1px solid #e8d4a0",
            },
          },
        ],
      },
      {
        icon: <IconMatch />,
        iconBg: "#72727233",
        cardBg: "#000000",
        cardBorder: "#000000",
        dark: true,
        title: "Brand discovery",
        desc: "Editorial layouts, search, and saved lists help customers find the right Moroccan maker—whether they want argan serums, hammam soaps, or niche perfumes.",
        tags: [
          {
            label: "CURATED DIRECTORY",
            style: {
              background: "rgba(201,145,61,0.2)",
              color: "#E8B84B",
              border: "1px solid rgba(201,145,61,0.3)",
            },
          },
        ],
      },
    ],
  },
  {
    label: "PILLAR 3 — GROWTH ENABLEMENT",
    pillarIcon: <IconPillar3 />,
    pillarIconBg: "#ffffff",
    cards: [
      {
        icon: <IconTraining />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Training programs",
        desc: "Micro-learning for beauty founders: EU-style labelling, stability basics, packaging photography, and export readiness for cosmetics.",
        tags: [
          {
            label: "PROGRESS TRACKING",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
      {
        icon: <IconDoc />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Legal & export guidance",
        desc: "Templates for invoices, certificates, and regulatory questions—plus a ticketed helpdesk that tracks every partner request.",
        tags: [
          {
            label: "REAL-TIME STATUS",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
      {
        icon: <IconAnalytics />,
        iconBg: "#ffffff",
        cardBg: "#ffffff",
        cardBorder: "#ffffff",
        dark: false,
        title: "Analytics & reporting",
        desc: "Dashboards for admins and brands: order volumes, revenue, certification status, and support workload—exportable when you need a snapshot.",
        tags: [
          {
            label: "EXPORT PDF / XLS",
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #d8d0c4",
            },
          },
        ],
      },
    ],
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-12 lg:gap-16">
        {/* ── Section header ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-secondary/60" />
              <span className="font-sans text-sm font-semibold tracking-[0.18em] text-secondary uppercase">
                Platform Features
              </span>
            </div>
            <h2 className="font-serif font-bold text-text-dark text-4xl md:text-5xl leading-tight">
              Three pillars for
              <br />
              Moroccan beauty
            </h2>
          </div>
          <p className="font-sans text-text-muted text-lg leading-relaxed max-w-[340px] lg:text-right lg:pt-14">
            Compliance, catalog reach, and founder education—everything nevali bundles so bio-minded
            Moroccan cosmetics can shine at home and abroad.
          </p>
        </div>

        {/* ── Pillars ── */}
        <div className="flex flex-col gap-14">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="flex flex-col gap-6">
              {/* Pillar header row */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: pillar.pillarIconBg }}
                >
                  {pillar.pillarIcon}
                </div>
                <span className="font-sans text-sm font-bold tracking-[0.18em] text-text-dark uppercase">
                  {pillar.label}
                </span>
                <div className="flex-1 h-px bg-cream-dark" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {pillar.cards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl p-7 flex flex-col gap-4"
                    style={{
                      background: card.cardBg,
                      border: `1px solid ${card.cardBorder}`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: card.iconBg }}
                    >
                      {card.icon}
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2 flex-1">
                      <h3
                        className="font-serif font-bold text-xl leading-snug"
                        style={{ color: card.dark ? "#ffffff" : "#000000" }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="font-sans text-sm leading-relaxed"
                        style={{
                          color: card.dark
                            ? "rgba(250,250,247,0.55)"
                            : "#727272",
                        }}
                      >
                        {card.desc}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className="font-sans text-xs font-bold tracking-wide rounded-full px-3 py-1 uppercase"
                          style={tag.style}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
