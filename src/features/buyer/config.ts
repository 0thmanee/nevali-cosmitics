/**
 * Buyer portal: nav and page titles.
 */

export const BUYER_NAV_ITEMS = [
	{ label: "Overview", href: "/buyer" },
	{ label: "My inquiries", href: "/buyer/rfqs" },
	{ label: "Saved lists", href: "/buyer/saved" },
	{ label: "Alerts", href: "/buyer/notifications" },
] as const;

export const BUYER_PAGE_SUBTITLE: Record<string, string> = {
	"/buyer": "Your saved requests and quotes from Moroccan artisans.",
	"/buyer/rfqs": "Product inquiries you sent while signed in.",
	"/buyer/saved": "Named lists of products you want to track or compare.",
	"/buyer/notifications":
		"In-app notices for RFQ threads (not a full messaging product).",
};

export function getBuyerPageTitle(pathname: string): string {
	if (pathname.startsWith("/buyer/rfqs")) return "My inquiries";
	if (pathname.startsWith("/buyer/saved")) return "Saved lists";
	if (pathname.startsWith("/buyer/notifications")) return "Alerts";
	return "Buyer dashboard";
}
