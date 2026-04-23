/**
 * Transactional email HTML colors. Most clients ignore `var(--*)`; keep literals here
 * in sync with `src/styles/globals.css` `@theme` when the brand palette changes.
 */
export const emailTheme = {
	ink: "#000000",
	textMuted: "#727272",
	paper: "#ffffff",
	cream: "#ede6dc",
	creamDark: "#d8d0c4",
} as const;
