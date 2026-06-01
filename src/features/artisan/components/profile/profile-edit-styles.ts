/** Shared styles for profile view and edit cards */
export const cardStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
} as const;

export const cardHeaderBorder = {
	borderColor: "var(--color-cream-dark)" as const,
};

export const fieldStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
};

export const inputClassName =
	"font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 w-full outline-none transition-colors focus:border-text-muted focus:ring-1 focus:ring-text-muted/30";
export const labelClassName =
	"font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase block mb-1.5";
