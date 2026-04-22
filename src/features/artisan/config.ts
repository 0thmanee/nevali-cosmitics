/**
 * Artisan portal: nav items and page metadata.
 */

export const PRODUCER_NAV_ITEMS = [
  { label: "Dashboard", href: "/artisan", badge: null },
  { label: "My Profile", href: "/artisan/profile", badge: null },
  { label: "My Products", href: "/artisan/products", badge: null },
  { label: "Catalog orders", href: "/artisan/orders", badge: null },
  { label: "Certification", href: "/artisan/certification", badge: null },
  { label: "Training", href: "/artisan/training", badge: null },
  { label: "Support", href: "/artisan/support", badge: null },
  { label: "Alerts", href: "/artisan/notifications", badge: null },
] as const;

export const PAGE_SUBTITLE: Record<string, string> = {
  "/artisan": "Here's what's happening with your workshop today.",
  "/artisan/profile": "Manage your personal and business information",
  "/artisan/profile/edit": "Update your personal and business information",
  "/artisan/products": "Manage your product listings and certifications",
  "/artisan/orders": "Aggregated sales from public catalog checkout (no buyer PII).",
  "/artisan/products/new": "Fill in product details — images and certifications can be added after saving",
  "/artisan/certification": "Track your certification status and documents",
  "/artisan/training": "Continue your export readiness programs",
  "/artisan/support": "Get help from the nevali team",
  "/artisan/notifications":
    "In-app notices for orders and platform updates.",
};

export function getPageTitle(pathname: string, firstName?: string | null): string {
  switch (pathname) {
    case "/artisan":
      return firstName ? `Good morning, ${firstName}` : "Good morning";
    case "/artisan/profile":
      return "My Profile";
    case "/artisan/profile/edit":
      return "Edit Profile";
    case "/artisan/products":
      return "My Products";
    case "/artisan/orders":
      return "Catalog orders";
    case "/artisan/products/new":
      return "Add New Product";
    case "/artisan/certification":
      return "Certification";
    case "/artisan/training":
      return "Training";
    case "/artisan/support":
      return "Support";
    case "/artisan/notifications":
      return "Alerts";
    default:
      return "Dashboard";
  }
}
