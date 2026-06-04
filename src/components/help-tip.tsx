/**
 * Small inline "?" help marker with a native tooltip. Non-technical-friendly:
 * hover (or long-press on touch) shows the explanation; the text is also exposed
 * to screen readers via aria-label.
 */
export function HelpTip({ text }: { text: string }) {
	return (
		<span
			aria-label={text}
			className="ms-1 inline-flex h-4 w-4 cursor-help select-none items-center justify-center rounded-full border border-text-muted/40 align-middle font-bold font-sans text-[9px] text-text-muted"
			role="img"
			title={text}
		>
			?
		</span>
	);
}
