/**
 * Formatters and display helpers for RFQs and contracts (producer UI).
 */

export function getBuyerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "??";
}

const BUYER_COLORS = ["#7b2d1e", "#2a0f05", "#5a3a1a", "#7a3a1a", "#2d4a3e", "#3a2a1a", "#2a3a5a"];

export function getBuyerColor(index: number): string {
  return BUYER_COLORS[index % BUYER_COLORS.length] ?? BUYER_COLORS[0]!;
}

export function formatRelative(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 21) return "2 weeks ago";
  if (diffDays < 28) return "3 weeks ago";
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPeriod(start: Date, end: Date): string {
  const s = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(start));
  const e = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(end));
  return `${s} - ${e}`;
}
