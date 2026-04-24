import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isAppLocale, LOCALE_COOKIE, type AppLocale } from "~/lib/i18n/config";
import { createJsonTranslator, createTranslator } from "~/lib/i18n/create-translator";
import { getMessages } from "~/lib/i18n/load-messages";

export async function getLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  return isAppLocale(raw) ? raw : DEFAULT_LOCALE;
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
