import React from "react";

export type StatCardVariant = "neutral" | "green" | "amber" | "red";

const STYLES: Record<StatCardVariant, { accent: string; label: string; value: string; iconBg: string; iconColor: string; bg: string }> = {
  neutral: {
    accent:    "var(--color-ink)",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-text-dark",
    iconBg:    "bg-cream",
    iconColor: "var(--color-ink)",
  },
  green: {
    accent:    "var(--color-ink)",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-text-dark",
    iconBg:    "bg-cream",
    iconColor: "var(--color-ink)",
  },
  amber: {
    accent:    "var(--color-text-muted)",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-text-muted",
    iconBg:    "bg-cream",
    iconColor: "var(--color-text-muted)",
  },
  red: {
    accent:    "var(--color-danger-dark)",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-[var(--color-danger-dark)]",
    iconBg:    "bg-cream",
    iconColor: "var(--color-danger-dark)",
  },
};

export const STAT_ICON_COLOR: Record<StatCardVariant, string> = {
  neutral: "var(--color-ink)",
  green:   "var(--color-ink)",
  amber:   "var(--color-text-muted)",
  red:     "var(--color-danger-dark)",
};

type Props = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: StatCardVariant;
  subline?: string;
  className?: string;
};

export function StatCard({ label, value, icon, variant = "neutral", subline, className = "" }: Props) {
  const s = STYLES[variant];
  return (
    <div className={`relative flex items-stretch border border-cream-dark overflow-hidden ${s.bg} ${className}`}>
      {/* Left accent bar */}
      <div className="w-1 shrink-0" style={{ background: s.accent }} />

      <div className="flex flex-1 items-center justify-between px-5 py-5 gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className={`font-sans text-xs font-bold tracking-[0.12em] uppercase ${s.label}`}>
            {label}
          </span>
          <span className={`font-sans font-bold leading-none ${s.value}`} style={{ fontSize: "2.25rem" }}>
            {value}
          </span>
          {subline && (
            <p className="font-sans text-xs text-text-muted/80 leading-snug mt-1 max-w-[180px]">
              {subline}
            </p>
          )}
        </div>

        <div className={`w-11 h-11 flex items-center justify-center shrink-0 ${s.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
