"use client";

import { useMemo } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { formatPriceMad, paymentOptionLabel } from "~/lib/format-price";
import type { AppLocale } from "~/lib/i18n/config";

/** Locale-aware MAD formatting and payment labels for client components. */
export function useFormatPrice() {
	const { locale, t } = useI18n();
	return useMemo(
		() => ({
			formatMad: (amount: string | null | undefined) =>
				formatPriceMad(amount, locale as AppLocale),
			paymentLabel: (option: string | null | undefined) =>
				paymentOptionLabel(option, t),
		}),
		[locale, t],
	);
}
