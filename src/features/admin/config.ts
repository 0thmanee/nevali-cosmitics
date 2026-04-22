/**
 * Admin portal: nav items and page metadata.
 */

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", badge: null },
  { label: "Analytics", href: "/admin/analytics", badge: null },
  { label: "Artisans", href: "/admin/users", badge: null },
  { label: "Products", href: "/admin/products", badge: null },
  { label: "Orders", href: "/admin/orders", badge: null },
  { label: "Certifications", href: "/admin/certifications", badge: null },
  { label: "Training", href: "/admin/training", badge: null },
  { label: "Support", href: "/admin/support", badge: null },
  { label: "Contracts", href: "/admin/contracts", badge: null },
] as const;

export const PAGE_SUBTITLE: Record<string, string> = {
  "/admin": "Artisan & product management, certification, analytics, training.",
  "/admin/analytics": "RFQ and contract pipeline overview, exports, and PDF summary.",
  "/admin/users": "Activate artisan accounts and manage access.",
  "/admin/products": "Approve or reject artisan product listings.",
  "/admin/orders": "Guest checkout orders from the public catalog (buyer contact & lines).",
  "/admin/certifications": "Approve or reject certification documents (separate from product approval).",
  "/admin/training": "Create and manage training programs; assign programs to artisans.",
  "/admin/support": "View and manage support tickets from artisans.",
  "/admin/contracts": "List RFQs and contracts; cancel RFQs or mark contracts completed.",
};

export function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/analytics") return "Analytics";
  if (pathname === "/admin/users") return "Artisans";
  if (pathname.startsWith("/admin/users/")) return "Artisan";
  if (pathname === "/admin/products") return "Products";
  if (pathname === "/admin/orders") return "Orders";
  if (pathname === "/admin/certifications") return "Certifications";
  if (pathname === "/admin/training") return "Training";
  if (pathname === "/admin/support") return "Support";
  if (pathname.startsWith("/admin/support/")) return "Support ticket";
  if (pathname === "/admin/contracts") return "Contracts";
  if (pathname.startsWith("/admin/training/")) return "Training program";
  if (pathname.startsWith("/admin/products/")) return "Product";
  return "Dashboard";
}

export function getPageSubtitle(pathname: string): string {
  if (pathname in PAGE_SUBTITLE) return PAGE_SUBTITLE[pathname as keyof typeof PAGE_SUBTITLE] ?? "";
  if (pathname.startsWith("/admin/users/")) return "View and manage artisan account and profile.";
  if (pathname.startsWith("/admin/products/")) return "View product details and linked certifications; approve or reject product and certs separately.";
  if (pathname.startsWith("/admin/training/")) return "Edit program, modules, and media; assign to organizations.";
  if (pathname.startsWith("/admin/support/")) return "View message, update status, and add internal notes.";
  if (pathname === "/admin/contracts") return "List RFQs and contracts; cancel RFQs or mark contracts completed.";
  if (pathname === "/admin/orders") return PAGE_SUBTITLE["/admin/orders"] ?? "";
  return PAGE_SUBTITLE["/admin"] ?? "Artisan & product management, certification, analytics, training.";
}
