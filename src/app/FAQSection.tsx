"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "What is CraftHouse and who is it for?",
    a: "CraftHouse is a B2B platform connecting certified Moroccan artisans and cooperatives with verified international buyers. It's designed for individual artisans, cooperatives, and any Moroccan entity seeking to access global markets through a structured, certification-backed trade process.",
  },
  {
    q: "How does the certification process work?",
    a: "Producers submit legal documents and product details for SuperAdmin review. After initial verification, an on-site audit is conducted and products are assessed against per-category quality criteria. Certified artisans receive a badge on their profile and listings, renewable annually.",
  },
  {
    q: "What products and regions are eligible?",
    a: "All major Moroccan agricultural and artisanal exports are eligible — argan oil, saffron, rose water, honey, ceramics, textiles, spices, and more. Producers from all 12 Moroccan regions may apply, provided they meet the platform's legal registration and quality standards.",
  },
  {
    q: "How long does certification take?",
    a: "The typical certification timeline is 4-8 weeks from initial application to badge issuance. This includes document review (1-2 weeks), on-site audit scheduling (1-3 weeks), and final approval (up to 1 week). Expedited review is available for cooperatives with existing certifications.",
  },
  {
    q: "Can international buyers verify a supplier's certification?",
    a: "Yes. Every certified product listing includes a scannable QR code linked to a public traceability record — including the artisan's certification ID, audit date, product batch, and regional origin. Buyers can verify in real-time without contacting the platform.",
  },
  {
    q: "What are the platform fees and what do they include?",
    a: "CraftHouse operates on a subscription model for producers and a transaction fee for buyers. Producer plans cover certification support, listing management, training access, and export document templates. Buyer access is free; a small success fee applies on closed B2B contracts.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 lg:py-24" style={{ background: "#FAFAF7" }}>
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col gap-12 lg:gap-16">
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
              Frequently Asked Questions
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
            Everything you need
            <br />
            to know
          </h2>

          <p className="font-sans text-text-muted text-lg max-w-[480px] leading-relaxed">
            Answers to the most common questions from artisans, cooperatives,
            and international buyers joining the CraftHouse platform.
          </p>
        </div>

        {/* ── FAQ list ── */}
        <div className="flex flex-col max-w-[820px] w-full mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-cream-dark">
              <button
                className="w-full flex items-center justify-between gap-6 py-7 text-left"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="font-sans font-semibold text-text-dark text-lg leading-snug">
                  {faq.q}
                </span>
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border"
                  style={{ borderColor: "#d4c4a0" }}
                >
                  <span
                    className="text-secondary text-base leading-none"
                    style={{ marginTop: -1 }}
                  >
                    {open === i ? "−" : "+"}
                  </span>
                </div>
              </button>
              {open === i && (
                <p className="font-sans text-text-muted text-base leading-relaxed pb-7 max-w-[720px]">
                  {faq.a}
                </p>
              )}
            </div>
          ))}

          {/* Still have questions card */}
          <div
            className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl px-6 sm:px-8 py-6"
            style={{ background: "#FAF5EE", border: "1px solid #f0e8dc" }}
          >
            <div>
              <p className="font-sans font-semibold text-text-dark text-base mb-0.5">
                Still have questions?
              </p>
              <p className="font-sans text-text-muted text-sm">
                Our team typically responds within one business day.
              </p>
            </div>
            <button
              className="shrink-0 flex items-center gap-2 font-sans font-semibold text-sm text-white rounded-xl px-6 py-3 transition-colors"
              style={{ background: "#1a0500" }}
            >
              Contact Support
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
