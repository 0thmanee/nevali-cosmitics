/**
 * Curated Unsplash URLs for Moroccan / cosmetics visuals.
 * Each `photo-*` id is verified to return HTTP 200 with `?q=80&auto=format&fit=crop&w=…`.
 */

function cosmeticsPhoto(photoId: string, width: number): string {
	return `https://images.unsplash.com/photo-${photoId}?q=80&auto=format&fit=crop&w=${width}`;
}

/** Wide hero / section photography */
export const COSMETICS_MARKETING = {
	hero: cosmeticsPhoto("1617897903246-719242758050", 2400),
	heroAlt: cosmeticsPhoto("1596462502278-27bfdc403348", 2400),
	flatlay: cosmeticsPhoto("1612817288484-6f916006741a", 1200),
	creams: cosmeticsPhoto("1571875257727-256c39da42af", 1200),
	arganBotanicals: cosmeticsPhoto("1609597876248-e5f7c84f0295", 2000),
	vanityProducts: cosmeticsPhoto("1556228720-195a672e8a03", 2000),
	portrait: cosmeticsPhoto("1573496359142-b8d87734a5a2", 1600),
	spaApplication: cosmeticsPhoto("1570172619644-dfd03ed5d881", 1600),
	brushes: cosmeticsPhoto("1522335789203-aabd1fc54bc9", 1200),
	wellness: cosmeticsPhoto("1487412912498-0447578fcca8", 1200),
} as const;

const PLACEHOLDER_ROTATION = [
	"1612817288484-6f916006741a",
	"1571875257727-256c39da42af",
	"1609597876248-e5f7c84f0295",
	"1596462502278-27bfdc403348",
	"1522335789203-aabd1fc54bc9",
	"1487412912498-0447578fcca8",
	"1570172619644-dfd03ed5d881",
	"1556228720-195a672e8a03",
	"1617897903246-719242758050",
	"1573496359142-b8d87734a5a2",
] as const;

/** Stable cosmetics photo when a listing has no upload yet (cart, PDP, admin, etc.). */
export function productPlaceholderImageUrl(seed: string, width = 800): string {
	let h = 5381;
	for (let i = 0; i < seed.length; i++) {
		h = ((h << 5) + h) ^ seed.charCodeAt(i);
	}
	const id = PLACEHOLDER_ROTATION[Math.abs(h) % PLACEHOLDER_ROTATION.length]!;
	return cosmeticsPhoto(id, width);
}

/** Home “featured category” panel when no live sample product image exists. */
export function featuredCategoryPlaceholderImage(
	categoryId: string,
	width = 900,
): string {
	switch (categoryId) {
		case "argan-oils":
			return cosmeticsPhoto("1609597876248-e5f7c84f0295", width);
		case "skincare":
			return cosmeticsPhoto("1571875257727-256c39da42af", width);
		case "hammam-body":
			return cosmeticsPhoto("1487412912498-0447578fcca8", width);
		case "hair-fragrance":
			return cosmeticsPhoto("1522335789203-aabd1fc54bc9", width);
		default:
			return productPlaceholderImageUrl(categoryId, width);
	}
}
