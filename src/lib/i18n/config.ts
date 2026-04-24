export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_COOKIE = "NEVALI_LOCALE";

export function isRtlLocale(locale: AppLocale): boolean {
  return locale === "ar";
}

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value !== undefined && value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
