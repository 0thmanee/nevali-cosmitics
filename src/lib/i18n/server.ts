import "server-only";

import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "~/lib/i18n/config";
import { createJsonTranslator, createTranslator } from "~/lib/i18n/create-translator";
import { getMessages } from "~/lib/i18n/load-messages";

function localeFromAcceptLanguage(raw: string | null): AppLocale | null {
  if (!raw) return null;
  const supported = new Set<string>(SUPPORTED_LOCALES);
  const tokens = raw.split(",").map((part) => part.trim().toLowerCase());
  for (const token of tokens) {
    const primary = token.split(";")[0]?.trim();
    if (!primary) continue;
    if (supported.has(primary)) return primary as AppLocale;
    const base = primary.split("-")[0];
    if (base && supported.has(base)) return base as AppLocale;
  }
  return null;
}

export async function getLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(raw)) return raw;

  const hdrs = await headers();
  const deviceLocale = localeFromAcceptLanguage(hdrs.get("accept-language"));
  return deviceLocale ?? DEFAULT_LOCALE;
}

export async function getTranslator() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return createTranslator(messages);
}

export async function getJsonTranslator() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return createJsonTranslator(messages);
}
