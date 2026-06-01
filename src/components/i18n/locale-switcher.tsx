"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import {
	type AppLocale,
	LOCALE_COOKIE,
	SUPPORTED_LOCALES,
} from "~/lib/i18n/config";

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
			className="flex items-center gap-1 rounded-sm border border-cream-dark bg-white px-1 py-1"
			title={messages.localeSwitcher.hint}
		>
			<span className="sr-only">{messages.localeSwitcher.ariaLabel}</span>
			{SUPPORTED_LOCALES.map((code) => (
				<button
					aria-label={names[code] ?? code}
					className={`rounded-sm px-2 py-1 font-medium font-sans text-[10px] transition-colors ${
						code === locale
							? "bg-primary text-white"
							: "text-text-muted hover:bg-cream hover:text-text-dark"
					}`}
					disabled={pending}
					key={code}
					onClick={() => {
						if (code === locale) return;
						setLocaleCookie(code);
						startTransition(() => {
							router.refresh();
						});
					}}
					title={names[code] ?? code}
					type="button"
				>
					{names[code] ?? code}
				</button>
			))}
		</div>
	);
}
