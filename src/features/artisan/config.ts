/**
 * Artisan portal: nav items and page metadata.
 */

export const PRODUCER_NAV_ITEMS = [
  { labelKey: "artisanPortal.nav.dashboard", href: "/artisan", badge: null },
  { labelKey: "artisanPortal.nav.profile", href: "/artisan/profile", badge: null },
  { labelKey: "artisanPortal.nav.products", href: "/artisan/products", badge: null },
  { labelKey: "artisanPortal.nav.journal", href: "/artisan/articles", badge: null },
  { labelKey: "artisanPortal.nav.orders", href: "/artisan/orders", badge: null },
  { labelKey: "artisanPortal.nav.certification", href: "/artisan/certification", badge: null },
  { labelKey: "artisanPortal.nav.training", href: "/artisan/training", badge: null },
  { labelKey: "artisanPortal.nav.support", href: "/artisan/support", badge: null },
  { labelKey: "artisanPortal.nav.alerts", href: "/artisan/notifications", badge: null },
] as const;

export const PAGE_SUBTITLE: Record<string, string> = {
  "/artisan": "artisanPortal.subtitle.dashboard",
  "/artisan/profile": "artisanPortal.subtitle.profile",
  "/artisan/profile/edit": "artisanPortal.subtitle.profileEdit",
  "/artisan/products": "artisanPortal.subtitle.products",
  "/artisan/articles": "artisanPortal.subtitle.articles",
  "/artisan/articles/new": "artisanPortal.subtitle.articlesNew",
  "/artisan/orders": "artisanPortal.subtitle.orders",
  "/artisan/products/new": "artisanPortal.subtitle.productsNew",
  "/artisan/certification": "artisanPortal.subtitle.certification",
  "/artisan/training": "artisanPortal.subtitle.training",
  "/artisan/support": "artisanPortal.subtitle.support",
  "/artisan/notifications": "artisanPortal.subtitle.notifications",
};

export function getPageSubtitle(pathname: string): string {
  const fromMap = PAGE_SUBTITLE[pathname];
  if (fromMap !== undefined) return fromMap;
  if (pathname.startsWith("/artisan/articles/") && pathname.endsWith("/edit")) {
    return "artisanPortal.subtitle.articlesEdit";
  }
  return "artisanPortal.subtitle.dashboard";
}

export function getPageTitle(pathname: string, firstName?: string | null): { key: string; firstName?: string } {
  switch (pathname) {
    case "/artisan":
      return { key: firstName ? "artisanPortal.title.morningWithName" : "artisanPortal.title.morning", firstName: firstName ?? undefined };
    case "/artisan/profile":
      return { key: "artisanPortal.title.profile" };
    case "/artisan/profile/edit":
      return { key: "artisanPortal.title.editProfile" };
    case "/artisan/products":
      return { key: "artisanPortal.title.products" };
    case "/artisan/articles":
      return { key: "artisanPortal.title.journal" };
    case "/artisan/articles/new":
      return { key: "artisanPortal.title.newArticle" };
    case "/artisan/orders":
      return { key: "artisanPortal.title.orders" };
    case "/artisan/products/new":
      return { key: "artisanPortal.title.addProduct" };
    case "/artisan/certification":
      return { key: "artisanPortal.title.certification" };
    case "/artisan/training":
      return { key: "artisanPortal.title.training" };
    case "/artisan/support":
      return { key: "artisanPortal.title.support" };
    case "/artisan/notifications":
      return { key: "artisanPortal.title.alerts" };
    default:
      if (pathname.startsWith("/artisan/articles/") && pathname.endsWith("/edit")) {
        return { key: "artisanPortal.title.editArticle" };
      }
      return { key: "artisanPortal.title.dashboard" };
  }
}
