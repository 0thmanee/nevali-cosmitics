/**
 * Shared form field styles for product create/edit.
 */
export const productFormInputBase =
	"font-sans text-sm text-text-dark rounded-sm px-3.5 py-2.5 outline-none w-full transition-colors focus:ring-2 focus:ring-ink/20 focus:border-ink";
export const productFormInputStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
} as const;
export const productFormLabelClass =
	"font-sans text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase block mb-1.5";
export const productFormCardStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
} as const;
export const productFormSectionBorder = {
	borderColor: "var(--color-cream-dark)",
} as const;
