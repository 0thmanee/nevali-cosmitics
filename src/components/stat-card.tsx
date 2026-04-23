import React from "react";

export type StatCardVariant = "neutral" | "green" | "amber" | "red";

const STYLES: Record<StatCardVariant, { accent: string; label: string; value: string; iconBg: string; iconColor: string; bg: string }> = {
  neutral: {
    accent:    "#000000",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-text-dark",
    iconBg:    "bg-[#f5ede3]",
    iconColor: "#000000",
  },
  green: {
    accent:    "#000000",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-text-dark",
    iconBg:    "bg-[#f5ede3]",
    iconColor: "#000000",
  },
  amber: {
    accent:    "#727272",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-[#727272]",
    iconBg:    "bg-[#fdf3e0]",
    iconColor: "#727272",
  },
  red: {
    accent:    "#c0392b",
    bg:        "bg-white",
    label:     "text-text-muted",
    value:     "text-[#c0392b]",
    iconBg:    "bg-[#fdf0f0]",
    iconColor: "#c0392b",
  },
};

export const STAT_ICON_COLOR: Record<StatCardVariant, string> = {
  neutral: "#000000",
  green:   "#000000",
  amber:   "#727272",
  red:     "#c0392b",
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
