import type { Prisma } from "@prisma/client";

export type NotificationPrefs = {
	muteOrderEmails?: boolean;
};

export function parseNotificationPrefs(
	value: Prisma.JsonValue | null | undefined,
): NotificationPrefs {
	if (value == null || typeof value !== "object" || Array.isArray(value)) {
		return {};
	}
	const o = value as Record<string, unknown>;
	return {
		muteOrderEmails:
			typeof o.muteOrderEmails === "boolean" ? o.muteOrderEmails : undefined,
	};
}

export function userMuteOrderEmails(
	prefs: Prisma.JsonValue | null | undefined,
): boolean {
	return parseNotificationPrefs(prefs).muteOrderEmails === true;
}
