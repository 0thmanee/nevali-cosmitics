"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCountAction } from "~/app/api/notifications/actions";

export const unreadNotificationsQueryKey = ["notifications", "unread-count"] as const;

export function useUnreadNotificationCount() {
	return useQuery({
		queryKey: unreadNotificationsQueryKey,
		queryFn: () => getUnreadNotificationCountAction(),
		staleTime: 20_000,
		refetchInterval: 45_000,
	});
}
