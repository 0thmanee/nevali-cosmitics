/** Labels for Prisma `ProductCategory` enum on public PDP. */
const COSMETICS_CATEGORY_LABELS: Record<string, string> = {
	SKINCARE: "Skincare",
	MAKEUP: "Makeup",
	HAIRCARE: "Haircare",
	BODY_CARE: "Body care",
	FRAGRANCE: "Fragrance",
	TOOLS_ACCESSORIES: "Tools & accessories",
	SUPPLEMENTS: "Supplements",
	OTHER: "Other",
};

const SKIN_TYPE_LABELS: Record<string, string> = {
	OILY: "Oily",
	DRY: "Dry",
	COMBINATION: "Combination",
	SENSITIVE: "Sensitive",
	NORMAL: "Normal",
};

export function cosmeticsCategoryLabel(code: string | null): string | null {
	if (!code) return null;
	return (
		COSMETICS_CATEGORY_LABELS[code] ??
		code
			.replace(/_/g, " ")
			.toLowerCase()
			.replace(/\b\w/g, (c) => c.toUpperCase())
	);
}

/** Parse `skinTypes` field (JSON array or comma-separated codes). */
export function parseSkinTypeCodes(raw: string | null): string[] {
	if (!raw?.trim()) return [];
	const t = raw.trim();
	if (t.startsWith("[")) {
		try {
			const parsed = JSON.parse(t) as unknown;
			if (Array.isArray(parsed)) {
				return parsed.map((x) => String(x).trim().toUpperCase()).filter(Boolean);
			}
		} catch {
			/* fall through */
		}
	}
	return t
		.split(/[,;]/)
		.map((s) => s.trim().toUpperCase())
		.filter(Boolean);
}

export function skinTypeDisplayLabel(code: string): string {
	return SKIN_TYPE_LABELS[code] ?? code.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Split ingredients string into display chips (comma / semicolon / newline). */
export function parseIngredientList(raw: string | null, max = 24): string[] {
	if (!raw?.trim()) return [];
	const parts = raw
		.split(/[,;\n]/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
	return [...new Set(parts)].slice(0, max);
}
