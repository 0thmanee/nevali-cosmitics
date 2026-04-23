"use client";

import React from "react";
import Link from "next/link";

export function AuthLayout({
  children,
  title,
  subtitle,
  showRegisterLink = false,
  showLoginLink = false,
  contentClassName = "max-w-md",
  contentCenter = true,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  showRegisterLink?: boolean;
  showLoginLink?: boolean;
  contentClassName?: string;
  contentCenter?: boolean;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: brand side ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 px-10 py-12 relative overflow-hidden"
        style={{ background: "#000000" }}
      >
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} aria-hidden>
          <defs>
            <pattern id="auth-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>

        {/* Top: logo + tagline */}
        <div className="relative z-10">
          <Link href="/" className="flex flex-col gap-0.5 mb-14">
            <span className="font-display font-bold text-white text-[22px] uppercase tracking-wide leading-none">
              nevali
            </span>
            <span className="font-sans text-[9px] font-semibold tracking-[0.22em] text-white/40 uppercase mt-1">
              Partner portal
            </span>
          </Link>

          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
              {title}
            </span>
            <h2 className="font-serif font-bold text-[34px] text-white leading-tight">
              {subtitle}
            </h2>
            <p className="font-sans text-white/50 text-[13px] leading-relaxed max-w-[280px] mt-1">
              Premium Moroccan skincare and rituals—traceable sourcing, verified listings, and a calm, refined presence online.
            </p>
          </div>
        </div>

        {/* Decorative panel */}
        <div className="relative z-10 my-8 rounded-sm overflow-hidden" style={{ height: "180px" }}>
          <div
            className="w-full h-full"
            style={{ background: "linear-gradient(135deg, #727272 0%, #333333 40%, #000000 100%)" }}
          />
          <div
            className="absolute inset-0 flex items-end p-4"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
          >
            <span className="font-sans text-white/60 text-[10px] uppercase tracking-widest">NEVALI</span>
          </div>
        </div>

        {/* Bottom: testimonial */}
        <div className="relative z-10">
          <div
            className="rounded-sm p-5"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-white/35 text-sm">★</span>
              ))}
            </div>
            <p className="font-serif italic text-[13px] text-white/75 leading-relaxed">
              &ldquo;Within weeks of listing on nevali, shoppers in Europe were reordering our argan serum—finally under our own label.&rdquo;
            </p>
            <p className="font-sans text-[11px] text-white/40 mt-3">— Fatima O., Atlas Valley Skincare</p>
          </div>
        </div>
      </div>

      {/* ── Right panel: cream form side ── */}
      <div className="flex-1 flex flex-col bg-cream overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-cream-dark shrink-0">
          <Link href="/" className="lg:hidden font-display font-bold uppercase text-[18px] tracking-wide text-text-dark">
            nevali
          </Link>
          <div className="hidden lg:block" />
          <span className="font-sans text-[13px] text-text-muted">
            {showRegisterLink && (
              <>
                New here?{" "}
                <Link href="/auth/register" className="font-semibold text-forest-light hover:underline">
                  Create account
                </Link>
              </>
            )}
            {showLoginLink && (
              <>
                Already a partner?{" "}
                <Link href="/auth/login" className="font-semibold text-forest-light hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </span>
        </div>

        {/* Form area */}
        <div
          className={`flex-1 flex flex-col px-8 lg:px-14 pb-12 ${
            contentCenter ? "items-center justify-center" : "items-center pt-10"
          }`}
        >
          <div className={`w-full ${contentClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared style tokens for inputs (light theme) ── */
export const inputCls =
  "font-sans text-[14px] text-text-dark bg-white border border-cream-dark rounded px-4 py-3 outline-none w-full transition-colors placeholder:text-text-muted/40";

export const inputStyle = {};
export const inputFocusStyle = { borderColor: "#000000", boxShadow: "0 0 0 2px rgba(0,0,0,0.08)" };
