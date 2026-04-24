import { INTL_LOCALE_TAG, type AppLocale } from "~/lib/i18n/config";
import type { Translator } from "~/lib/i18n/create-translator";

/** Format a decimal string (e.g. variant price from API) using MAD with locale-aware grouping and symbol. */
export function formatPriceMad(amount: string | null | undefined, locale: AppLocale = "en"): string {
	if (amount == null || amount === "") return "\u2014";
	const n = Number(amount.replace(",", "."));
	if (!Number.isFinite(n)) return amount;
	const tag = INTL_LOCALE_TAG[locale] ?? INTL_LOCALE_TAG.en;
	try {
		return new Intl.NumberFormat(tag, {
			style: "currency",
			currency: "MAD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(n);
	} catch {
		return `${new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} MAD`;
	}
}

/** Payment option labels — pass `t` from `useI18n()` or server `getTranslator()`. */
export function paymentOptionLabel(option: string | null | undefined, t: Translator): string {
	switch (option) {
		case "CARD":
			return t("common.paymentCard");
		case "COD":
			return t("common.paymentCod");
		case "BOTH":
			return t("common.paymentBoth");
		default:
			return t("common.dash");
	}
}
