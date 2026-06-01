import { env } from "~/env";

/**
 * Absolute public base URL (no trailing slash) for canonical URLs, sitemap, robots,
 * and JSON-LD. Derived from BETTER_AUTH_URL; falls back to localhost in dev.
 */
export function siteUrl(): string {
	const raw = env.BETTER_AUTH_URL?.trim() || "http://localhost:3000";
	return raw.replace(/\/+$/, "");
}

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
	const base = siteUrl();
	return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
