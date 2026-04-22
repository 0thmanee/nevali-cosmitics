"use server";

import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";
import type { NotificationPrefs } from "~/lib/notification-prefs";
import {
	parseNotificationPrefs,
} from "~/lib/notification-prefs";

/** Unread in-app alerts for the current user (buyer or partner). */
export async function getUnreadNotificationCountAction(): Promise<number> {
	const session = await getSession();
	if (!session?.user?.id) return 0;
	return prisma.userNotification.count({
		where: { userId: session.user.id, readAt: null },
	});
}

export type UserNotificationRow = {
	id: string;
	kind: string;
	title: string;
	body: string;
	linkHref: string | null;
	readAt: string | null;
	createdAt: string;
};

async function requireBuyerOrPartnerSession(): Promise<{ userId: string }> {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/auth/login");
	}
	const role = (session.user as { role?: string }).role;
	if (role !== "buyer" && role !== "partner") {
		redirectNonSuperadminHome();
	}
	return { userId: session.user.id };
}

export async function listMyNotificationsAction(): Promise<{
	error?: string;
	items?: UserNotificationRow[];
}> {
	const { userId } = await requireBuyerOrPartnerSession();

	const rows = await prisma.userNotification.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		take: 100,
		select: {
			id: true,
			kind: true,
			title: true,
			body: true,
			linkHref: true,
			readAt: true,
			createdAt: true,
		},
	});
	return {
		items: rows.map((r) => ({
			...r,
			readAt: r.readAt?.toISOString() ?? null,
			createdAt: r.createdAt.toISOString(),
		})),
	};
}

export async function markNotificationReadAction(
	notificationId: string,
): Promise<{ error?: string }> {
	const { userId } = await requireBuyerOrPartnerSession();

	const res = await prisma.userNotification.updateMany({
		where: { id: notificationId, userId },
		data: { readAt: new Date() },
	});
	if (res.count === 0) return { error: "Notification not found." };
	return {};
}

export async function markAllNotificationsReadAction(): Promise<{
	error?: string;
}> {
	const { userId } = await requireBuyerOrPartnerSession();

	await prisma.userNotification.updateMany({
		where: { userId, readAt: null },
		data: { readAt: new Date() },
	});
	return {};
}

/** Legacy RFQ thread notifications - deprecated. */
export async function markRfqThreadNotificationsReadAction(
	rfqId: string,
): Promise<{ error?: string }> {
	// RFQ threads are no longer supported
	return {};
}

export async function getMyNotificationPrefsAction(): Promise<{
	muteRfqThreadEmail: boolean;
}> {
	const { userId } = await requireBuyerOrPartnerSession();
	const u = await prisma.user.findUnique({
		where: { id: userId },
		select: { notificationPrefs: true },
	});
	const prefs = parseNotificationPrefs(u?.notificationPrefs);
	return {
		muteRfqThreadEmail: prefs.muteOrderEmails === true,
	};
}

export async function updateMyNotificationPrefsAction(input: {
	muteRfqThreadEmail?: boolean;
}): Promise<{ error?: string }> {
	const { userId } = await requireBuyerOrPartnerSession();
	const u = await prisma.user.findUnique({
		where: { id: userId },
		select: { notificationPrefs: true },
	});
	const prev = parseNotificationPrefs(u?.notificationPrefs);
	const merged: NotificationPrefs = { ...prev };
	// Map RFQ thread mute to order email mute
	if (typeof input.muteRfqThreadEmail === "boolean") {
		merged.muteOrderEmails = input.muteRfqThreadEmail;
	}
	await prisma.user.update({
		where: { id: userId },
		data: {
			notificationPrefs: merged as Prisma.InputJsonValue,
		},
	});
	return {};
}
