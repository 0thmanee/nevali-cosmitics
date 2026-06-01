/** Replace `{key}` placeholders (single braces, word keys). */
export function interpolate(
	template: string,
	vars?: Record<string, string | number>,
): string {
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (_, key: string) => {
		const v = vars[key];
		return v !== undefined && v !== null ? String(v) : `{${key}}`;
	});
}
