import type { AppLocale } from "~/lib/i18n/config";
import { deepMerge } from "~/lib/i18n/deep-merge";
import type { Messages } from "~/lib/i18n/messages";
import ar from "~/messages/ar.json";
import en from "~/messages/en.json";
import fr from "~/messages/fr.json";

export function getMessages(locale: AppLocale): Messages {
  const base = en as unknown as Messages;
  if (locale === "en") return base;
  const patch = (locale === "fr" ? fr : ar) as Record<string, unknown>;
  return deepMerge(base as unknown as Record<string, unknown>, patch) as Messages;
}
