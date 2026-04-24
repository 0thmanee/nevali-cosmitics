import { getByPath } from "~/lib/i18n/get-by-path";
import { interpolate } from "~/lib/i18n/interpolate";
import type { Messages } from "~/lib/i18n/messages";

export type Translator = (key: string, vars?: Record<string, string | number>) => string;

export type JsonTranslator = <T>(key: string) => T;

export function createTranslator(messages: Messages): Translator {
  return (key: string, vars?: Record<string, string | number>) => {
    const raw = getByPath(messages, key);
    if (typeof raw !== "string") {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing or non-string message: ${key}`);
      }
      return key;
    }
    return interpolate(raw, vars);
  };
}

export function createJsonTranslator(messages: Messages): JsonTranslator {
  return <T>(key: string) => getByPath(messages, key) as T;
}
