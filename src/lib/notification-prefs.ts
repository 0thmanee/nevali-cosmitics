import type { Prisma } from "@prisma/client";

export type NotificationPrefs = {
	muteRfqThreadEmail?: boolean;
};

export function parseNotificationPrefs(
	value: Prisma.JsonValue | null | undefined,
): NotificationPrefs {
	if (value == null || typeof value !== "object" || Array.isArray(value)) {
		return {};
	}
	const o = value as Record<string, unknown>;
	return {
		muteRfqThreadEmail:
			typeof o.muteRfqThreadEmail === "boolean"
				? o.muteRfqThreadEmail
				: undefined,
	};
}

export function userMuteRfqThreadEmail(
	prefs: Prisma.JsonValue | null | undefined,
): boolean {
	return parseNotificationPrefs(prefs).muteRfqThreadEmail === true;
}
