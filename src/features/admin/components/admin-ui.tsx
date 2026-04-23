/**
 * Shared admin UI primitives — keeps all pages visually consistent.
 * All components are flat/angular (no border-radius) matching the nevali design system.
 */
import React from "react";

// ─── Status badge color maps ──────────────────────────────────────────────────
// Amber = positive/approved, to match platform palette (no green)

export const STATUS_COLORS = {
  APPROVED:  { bg: "rgba(114,114,114,0.10)", color: "#727272", label: "Approved"  },
  PENDING:   { bg: "rgba(114,114,114,0.06)", color: "#727272", label: "Pending"   },
  REJECTED:  { bg: "rgba(192,57,43,0.10)", color: "#c0392b", label: "Rejected"  },
  RESOLVED:  { bg: "rgba(114,114,114,0.10)", color: "#727272", label: "Resolved"  },
  OPEN:      { bg: "rgba(192,57,43,0.10)", color: "#c0392b", label: "Open"      },
  IN_REVIEW: { bg: "rgba(114,114,114,0.06)", color: "#727272", label: "In Review" },
  ACTIVE:    { bg: "rgba(114,114,114,0.10)", color: "#727272", label: "Active"    },
  DRAFT:     { bg: "rgba(0,0,0,0.06)",     color: "#888",    label: "Draft"     },
  PUBLISHED: { bg: "rgba(114,114,114,0.10)", color: "#727272", label: "Published" },
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status as StatusKey] ?? STATUS_COLORS.PENDING;
  return (
    <span
      className="inline-block font-sans font-semibold text-xs px-2.5 py-0.5 uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// ─── Filter tab button ────────────────────────────────────────────────────────

export function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 font-sans font-medium text-sm px-4 py-1.5 transition-colors cursor-pointer ${
        active
          ? "bg-primary text-white"
          : "border border-cream-dark bg-white text-text-muted hover:border-primary/30"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`font-sans font-bold text-xs px-1.5 py-px ${
          active ? "bg-white/20 text-white" : "bg-black/[0.07] text-text-muted"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

export function BtnPrimary({
  children, onClick, disabled, className = "",
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-sans font-semibold text-xs px-3 py-1.5 bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({
  children, onClick, href, className = "",
}: { children: React.ReactNode; onClick?: () => void; href?: string; className?: string }) {
  if (href) {
    return (
      <a
        href={href}
        className={`font-sans font-medium text-xs px-3 py-1.5 border border-cream-dark bg-white text-text-dark no-underline transition-colors hover:border-primary/30 shrink-0 ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans font-medium text-xs px-3 py-1.5 border border-cream-dark bg-white text-text-dark transition-colors hover:border-primary/30 cursor-pointer shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

export function BtnDanger({
  children, onClick, disabled, className = "",
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-sans font-semibold text-xs px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 cursor-pointer shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Table container ──────────────────────────────────────────────────────────

export function AdminTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-cream-dark overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function AdminTableToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-cream-dark bg-white flex-wrap gap-3">
      {children}
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center px-5 py-2.5 bg-cream border-b border-cream-dark">
      {children}
    </div>
  );
}

export function AdminTableHeadCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-sans font-bold text-xs tracking-[0.1em] uppercase text-text-muted ${className}`}>
      {children}
    </div>
  );
}

export function AdminTableRow({
  children, onClick, className = "",
}: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`flex items-center px-5 py-3 border-b border-cream-dark last:border-0 transition-colors ${
        onClick ? "cursor-pointer hover:bg-cream/60" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminTableEmpty({ message }: { message: string }) {
  return (
    <div className="py-14 text-center font-sans text-sm text-text-muted">
      {message}
    </div>
  );
}

// ─── Page wrapper (consistent p-6 + stat card row) ───────────────────────────

export function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5 p-6">{children}</div>;
}

export function AdminStatRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{children}</div>;
}

// ─── Skeleton primitives ──────────────────────────────────────────────────────

export function Skel({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-cream-dark animate-pulse ${className}`} style={style} />;
}

export function AdminTableSkeleton({ rows = 7, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <AdminTable>
      {/* Toolbar */}
      <AdminTableToolbar>
        <div className="flex gap-1">
          {[80, 72, 80, 72].map((w, i) => (
            <Skel key={i} className="h-7" style={{ width: w }} />
          ))}
        </div>
        <Skel className="h-3 w-20" />
      </AdminTableToolbar>

      {/* Head */}
      <AdminTableHead>
        {Array.from({ length: cols }).map((_, i) => (
          <Skel key={i} className="h-2 flex-1" />
        ))}
      </AdminTableHead>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-cream-dark last:border-0">
          <Skel className="w-4 h-4 shrink-0" />
          <div className="flex items-center gap-3 flex-[2.8]">
            <Skel className="w-11 h-11 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skel className="h-3 w-28" />
              <Skel className="h-2 w-16" />
            </div>
          </div>
          {Array.from({ length: cols - 2 }).map((_, j) => (
            <Skel key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </AdminTable>
  );
}
