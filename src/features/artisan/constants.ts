export const PRODUCT_STATUS_STYLES: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-ink) 6%, transparent)",
		color: "var(--color-ink)",
		border: "1px solid var(--color-cream-dark)",
	},
	PENDING: {
		bg: "color-mix(in srgb, var(--color-text-muted) 8%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid var(--color-cream-dark)",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 8%, transparent)",
		color: "var(--color-danger-dark)",
		border:
			"1px solid color-mix(in srgb, var(--color-danger-dark) 25%, transparent)",
	},
};

export const STATUS_DOT_COLORS: Record<string, string> = {
	APPROVED: "var(--color-ink)",
	PENDING: "var(--color-text-muted)",
	REJECTED: "var(--color-danger-dark)",
};
