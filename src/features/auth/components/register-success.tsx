"use client";

import React from "react";
import Link from "next/link";
import type { RegisterFormData } from "../config/register";

const bg =
  "linear-gradient(in oklab 160deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 100%)";

export function RegisterSuccess({ form }: { form: RegisterFormData }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: bg }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
        aria-hidden
      >
        <defs>
          <pattern
            id="reg-success-pattern"
            x="0"
            y="0"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <rect x="10" y="10" width="28" height="28" fill="none" stroke="var(--color-gold)" strokeWidth="0.7" />
            <rect x="10" y="10" width="28" height="28" fill="none" stroke="var(--color-gold)" strokeWidth="0.7" transform="rotate(45 24 24)" />
            <circle cx="24" cy="24" r="3" fill="color-mix(in srgb, var(--color-gold) 40%, transparent)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#reg-success-pattern)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--color-gold) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 18l6 6 16-14" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>★</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Application Submitted</span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>★</span>
          </div>
          <h1 className="font-serif font-bold text-[32px] text-white leading-tight">Welcome, {form.firstName}.</h1>
          <p className="font-sans text-white/60 text-base leading-relaxed mt-3 max-w-sm">
            Your application has been received. Our team will review your documents and get back to you within 3-5 business days.
          </p>
        </div>
        <div
          className="w-full rounded-sm p-5 flex flex-col gap-3 text-left"
          style={{ background: "color-mix(in srgb, var(--color-paper) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--color-paper) 8%, transparent)" }}
        >
          {[
            { step: "1", label: "Application review", detail: "1-2 business days" },
            { step: "2", label: "Document verification", detail: "1-2 business days" },
            { step: "3", label: "On-site audit scheduled", detail: "1-3 weeks" },
            { step: "4", label: "Certification granted", detail: "Up to 1 week" },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-[10px] shrink-0"
                style={{ background: "color-mix(in srgb, var(--color-text-muted) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)", color: "var(--color-text-muted)" }}
              >
                {s.step}
              </div>
              <div className="flex-1 flex items-center justify-between gap-2">
                <span className="font-sans text-sm text-white/80">{s.label}</span>
                <span className="font-sans text-[11px] text-white/35">{s.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/artisan"
            className="font-sans font-semibold text-sm text-white rounded px-8 py-3.5 transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            Go to Dashboard
          </Link>
          <Link href="/" className="font-sans text-sm text-white/60 hover:text-white/80 transition-colors">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
