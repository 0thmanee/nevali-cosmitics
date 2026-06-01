export function getByPath(root: unknown, path: string): unknown {
	return path.split(".").reduce<unknown>((acc, part) => {
		if (acc === null || acc === undefined) return undefined;
		if (typeof acc !== "object") return undefined;
		return (acc as Record<string, unknown>)[part];
	}, root);
}
