"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createTranslator, type Translator } from "~/lib/i18n/create-translator";
import type { AppLocale } from "~/lib/i18n/config";
import type { Messages } from "~/lib/i18n/messages";

export type I18nContextValue = {
  locale: AppLocale;
  messages: Messages;
  t: Translator;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: AppLocale;
  messages: Messages;
  children: ReactNode;
}) {
  const t = useMemo(() => createTranslator(messages), [messages]);
  const value = useMemo(() => ({ locale, messages, t }), [locale, messages, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
