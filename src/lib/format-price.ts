/** Format a decimal string (e.g. variant price from API) for display in MAD. */
export function formatPriceMad(amount: string | null | undefined): string {
	if (amount == null || amount === "") return "—";
	const n = Number(amount.replace(",", "."));
	if (!Number.isFinite(n)) return amount;
	return `${new Intl.NumberFormat("fr-MA", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(n)} MAD`;
}

export function paymentOptionLabel(option: string | null | undefined): string {
	switch (option) {
		case "CARD":
			return "Card payment";
		case "COD":
			return "Cash on delivery";
		case "BOTH":
			return "Card & cash on delivery";
		default:
			return "—";
	}
}
