"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { listOrganizationsForAdmin } from "~/app/api/admin/actions";

export const adminOrganizationsQueryKey = ["admin", "organizations"] as const;

export function useAdminOrganizations() {
  return useQuery({
    queryKey: adminOrganizationsQueryKey,
    queryFn: listOrganizationsForAdmin,
  });
}

/** Selected org from URL (?org=slug). Resolves slug to id using org list. */
export function useAdminOrganizationFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: organizations = [] } = useAdminOrganizations();

  const selectedSlug = searchParams.get("org") ?? null;
  const selectedOrganizationId = selectedSlug
    ? organizations.find((o) => o.slug === selectedSlug)?.id ?? null
    : null;

  const setOrganization = useCallback(
    (slug: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (slug) next.set("org", slug);
      else next.delete("org");
      const q = next.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return {
    organizations,
    selectedSlug,
    selectedOrganizationId,
    setOrganization,
  };
}
