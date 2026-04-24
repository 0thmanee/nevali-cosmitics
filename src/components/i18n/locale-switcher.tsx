"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, type AppLocale, SUPPORTED_LOCALES } from "~/lib/i18n/config";
import { useI18n } from "~/components/i18n/i18n-provider";

function setLocaleCookie(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LocaleSwitcher() {
  const { locale, messages } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const names = messages.common.localeNames as Record<string, string>;

  return (
    <div
      className="flex items-center gap-1 rounded-sm border border-cream-dark bg-white/80 px-1 py-0.5"
      title={messages.localeSwitcher.hint}
    >
      <span className="sr-only">{messages.localeSwitcher.ariaLabel}</span>
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          onClick={() => {
            if (code === locale) return;
            setLocaleCookie(code);
            startTransition(() => {
              router.refresh();
            });
          }}
          className={`rounded-sm px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            code === locale ? "bg-primary text-white" : "text-text-muted hover:bg-cream-dark/60"
          }`}
        >
          {names[code] ?? code}
        </button>
      ))}
    </div>
  );
}
