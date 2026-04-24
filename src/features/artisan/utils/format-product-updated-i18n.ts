import type { Translator } from "~/lib/i18n/create-translator";
import { interpolate } from "~/lib/i18n/interpolate";

/** Relative “updated …” text for product rows (aligned with legacy `formatProductUpdatedAt`). */
export function formatProductUpdatedRelative(date: Date, t: Translator): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return t("artisanProductsTable.updatedToday");
  if (days === 1) return t("artisanProductsTable.updatedOneDay");
  if (days < 7) return interpolate(t("artisanProductsTable.updatedDaysAgo"), { count: days });
  if (days < 14) return t("artisanProductsTable.updatedOneWeek");
  return interpolate(t("artisanProductsTable.updatedWeeksAgo"), { count: Math.floor(days / 7) });
}

export function artisanProductStatusLabel(status: string, t: Translator): string {
  const key = `artisanProductsTable.status.${status}`;
  const label = t(key);
  return label === key ? status : label;
}
