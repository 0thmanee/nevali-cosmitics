/** Shallow-recursive merge: override wins for objects; arrays and primitives replace. */
export function deepMerge<T extends Record<string, unknown>>(base: T, override: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const bv = base[key];
    const ov = override[key];
    if (ov !== null && typeof ov === "object" && !Array.isArray(ov) && bv !== null && typeof bv === "object" && !Array.isArray(bv)) {
      out[key] = deepMerge(bv as Record<string, unknown>, ov as Record<string, unknown>);
    } else {
      out[key] = ov;
    }
  }
  return out as T;
}
