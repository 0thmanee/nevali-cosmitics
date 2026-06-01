/**
 * Buyer portal: nav and page titles.
 */

export const BUYER_NAV_ITEMS = [
	{ label: "Overview", href: "/buyer" },
	{ label: "My orders", href: "/buyer/orders" },
	{ label: "Saved lists", href: "/buyer/saved" },
	{ label: "Alerts", href: "/buyer/notifications" },
] as const;

export const BUYER_PAGE_SUBTITLE: Record<string, string> = {
	"/buyer":
		"Optional buyer hub—shopping and checkout stay available to everyone without an account.",
	"/buyer/orders": "Orders you placed on the public cosmetics catalog.",
	"/buyer/saved": "Named lists of products you want to track or compare.",
	"/buyer/notifications": "In-app notices for your orders and promotions.",
};

export function getBuyerPageTitle(pathname: string): string {
	if (pathname.startsWith("/buyer/orders")) return "My orders";
	if (pathname.startsWith("/buyer/saved")) return "Saved lists";
	if (pathname.startsWith("/buyer/notifications")) return "Alerts";
	return "Buyer dashboard";
}
