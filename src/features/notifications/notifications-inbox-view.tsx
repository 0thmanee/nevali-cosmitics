"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
	getMyNotificationPrefsAction,
	listMyNotificationsAction,
	markAllNotificationsReadAction,
	markNotificationReadAction,
	type UserNotificationRow,
	updateMyNotificationPrefsAction,
} from "~/app/api/notifications/actions";
import { unreadNotificationsQueryKey } from "./use-unread-notification-count";

const listKey = ["notifications", "list"] as const;
const prefsKey = ["notifications", "prefs"] as const;

type Props = {
	dashboardHref: string;
};

export function NotificationsInboxView({ dashboardHref }: Props) {
	const queryClient = useQueryClient();
	const { data, isPending, isError } = useQuery({
		queryKey: listKey,
		queryFn: async () => {
			const res = await listMyNotificationsAction();
			if (res.error) throw new Error(res.error);
			return res.items ?? [];
		},
	});

	const { data: prefs } = useQuery({
		queryKey: prefsKey,
		queryFn: () => getMyNotificationPrefsAction(),
	});

	const updatePrefs = useMutation({
		mutationFn: (muteRfqThreadEmail: boolean) =>
			updateMyNotificationPrefsAction({ muteRfqThreadEmail }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: prefsKey });
		},
	});

	const markOne = useMutation({
		mutationFn: async (id: string) => {
			const res = await markNotificationReadAction(id);
			if (res.error) throw new Error(res.error);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: listKey });
			void queryClient.invalidateQueries({
				queryKey: unreadNotificationsQueryKey,
			});
		},
	});

	const markAll = useMutation({
		mutationFn: async () => {
			const res = await markAllNotificationsReadAction();
			if (res.error) throw new Error(res.error);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: listKey });
			void queryClient.invalidateQueries({
				queryKey: unreadNotificationsQueryKey,
			});
		},
	});

	const items = data ?? [];

	return (
		<div className="mx-auto flex flex-col gap-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="font-bold font-serif text-text-dark text-xl">
						Alerts
					</h2>
					<p className="mt-1 max-w-md font-sans text-sm text-text-muted leading-relaxed">
						Short in-app notices for RFQ thread activity. Optional digest email
						via{" "}
						<code className="font-mono text-[11px]">
							POST /api/cron/notifications-digest
						</code>{" "}
						when{" "}
						<code className="font-mono text-[11px]">
							NOTIFICATION_DIGEST_CRON_SECRET
						</code>{" "}
						is set.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Link
						className="rounded-sm border border-cream-dark bg-white px-3 py-1.5 font-sans text-sm text-text-muted transition-colors hover:bg-cream"
						href={dashboardHref}
					>
						← Dashboard
					</Link>
					{items.some((n) => !n.readAt) ? (
						<button
							className="rounded-sm border border-cream-dark bg-white px-3 py-1.5 font-sans text-forest-mid text-sm transition-colors hover:bg-cream disabled:opacity-50"
							disabled={markAll.isPending}
							onClick={() => markAll.mutate()}
							type="button"
						>
							Mark all read
						</button>
					) : null}
				</div>
			</div>

			<div className="rounded-sm border border-cream-dark bg-white p-4">
				<p className="mb-2 font-sans font-semibold text-sm text-text-dark">
					Email for thread activity
				</p>
				<label className="flex cursor-pointer items-start gap-2 font-sans text-sm text-text-muted">
					<input
						checked={prefs?.muteRfqThreadEmail === true}
						className="mt-1"
						disabled={prefs == null || updatePrefs.isPending}
						onChange={(e) => updatePrefs.mutate(e.target.checked)}
						type="checkbox"
					/>
					<span>
						Mute RFQ thread emails (you still get in-app alerts here). Useful
						for shared inboxes that prefer digest-only mail.
					</span>
				</label>
			</div>

			{isPending ? (
				<p className="font-sans text-sm text-text-muted">Loading alerts…</p>
			) : isError ? (
				<p className="font-sans text-red-600 text-sm">
					Could not load alerts. Try refreshing.
				</p>
			) : items.length === 0 ? (
				<div className="rounded-sm border border-cream-dark bg-white p-8 text-center">
					<p className="font-sans text-sm text-text-muted">
						No alerts yet. When someone posts in an RFQ thread you are involved
						in, a notice will appear here (and you may get email if Resend is
						configured).
					</p>
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{items.map((n) => (
						<NotificationRow
							key={n.id}
							markRead={() => markOne.mutate(n.id)}
							markReadPending={markOne.isPending}
							row={n}
						/>
					))}
				</ul>
			)}
		</div>
	);
}

function NotificationRow({
	row,
	markRead,
	markReadPending,
}: {
	row: UserNotificationRow;
	markRead: () => void;
	markReadPending: boolean;
}) {
	const unread = !row.readAt;
	const date = new Date(row.createdAt).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	});

	return (
		<li
			className={`rounded-sm border px-4 py-3 ${
				unread
					? "border-forest-mid/20 bg-white"
					: "border-cream-dark bg-cream/40"
			}`}
		>
			<div className="flex flex-wrap items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<p className="font-sans font-semibold text-sm text-text-dark">
						{row.title}
					</p>
					<p className="mt-1 whitespace-pre-wrap font-sans text-text-muted text-xs leading-relaxed">
						{row.body}
					</p>
					<p className="mt-2 font-sans text-[11px] text-text-muted">{date}</p>
				</div>
				<div className="flex shrink-0 flex-col gap-1.5">
					{row.linkHref ? (
						<Link
							className="font-medium font-sans text-forest-mid text-xs hover:underline"
							href={row.linkHref}
							onClick={() => {
								if (unread) markRead();
							}}
						>
							Open thread
						</Link>
					) : null}
					{unread ? (
						<button
							className="text-left font-sans text-text-muted text-xs hover:text-text-dark disabled:opacity-50"
							disabled={markReadPending}
							onClick={markRead}
							type="button"
						>
							Mark read
						</button>
					) : null}
				</div>
			</div>
		</li>
	);
}
