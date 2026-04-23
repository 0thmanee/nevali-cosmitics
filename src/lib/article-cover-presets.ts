/** Preset card backgrounds for producer journal articles (homepage + editor). */
export const ARTICLE_COVER_PRESETS = [
	{
		id: "ink",
		label: "Ink wash",
		value:
			"linear-gradient(135deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 75%, var(--color-text-muted)) 50%, var(--color-text-muted) 100%)",
	},
	{
		id: "twilight",
		label: "Twilight",
		value:
			"linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 88%, black) 0%, color-mix(in srgb, var(--color-ink) 70%, var(--color-text-muted)) 50%, color-mix(in srgb, var(--color-text-muted) 70%, white) 100%)",
	},
	{
		id: "studio",
		label: "Studio",
		value:
			"linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 95%, black) 0%, var(--color-ink) 55%, var(--color-text-muted) 100%)",
	},
] as const;

export const DEFAULT_ARTICLE_COVER = ARTICLE_COVER_PRESETS[0]!.value;
