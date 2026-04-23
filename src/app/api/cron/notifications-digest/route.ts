import { NextResponse } from "next/server";
import { env } from "~/env";
import { prisma } from "~/lib/db";
import { isValidEmail, sendTransactionalEmail } from "~/lib/email";
import { emailTheme } from "~/lib/email-theme";

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function escapeHtmlAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

/**
 * POST digest of unread in-app alerts (optional cron).
 * Auth: `Authorization: Bearer <NOTIFICATION_DIGEST_CRON_SECRET>` or header `x-cron-secret`.
 */
export async function POST(request: Request) {
	const secret = env.NOTIFICATION_DIGEST_CRON_SECRET?.trim();
	if (!secret) {
		return NextResponse.json(
			{ error: "NOTIFICATION_DIGEST_CRON_SECRET is not set." },
			{ status: 503 },
		);
	}

	const auth = request.headers.get("authorization");
	const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : undefined;
	const headerSecret = request.headers.get("x-cron-secret")?.trim();
	const token = bearer ?? headerSecret;
	if (!token || token !== secret) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	const holders = await prisma.userNotification.findMany({
		where: { readAt: null },
		distinct: ["userId"],
		select: { userId: true },
	});

	let sent = 0;
	for (const { userId } of holders) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true, name: true, role: true },
		});
		if (!user?.email || !isValidEmail(user.email)) continue;
		if (user.role !== "buyer" && user.role !== "partner") continue;

		const items = await prisma.userNotification.findMany({
			where: { userId, readAt: null },
			orderBy: { createdAt: "desc" },
			take: 40,
			select: { title: true, body: true, linkHref: true, createdAt: true },
		});
		if (items.length === 0) continue;

		const origin = env.BETTER_AUTH_URL.replace(/\/$/, "");
		const inboxHref =
			user.role === "buyer"
				? `${origin}/buyer/notifications`
				: `${origin}/artisan/notifications`;
		const name = user.name?.trim() || "there";
		const lines = items
			.map(
				(i) =>
					`- ${i.title} (${i.createdAt.toISOString().slice(0, 16)}): ${i.body.slice(0, 120)}${i.body.length > 120 ? "…" : ""}`,
			)
			.join("\n");
		const subject = `nevali: ${items.length} unread alert(s)`;
		const text = `Hello ${name},\n\nYou have ${items.length} unread in-app alert(s) on nevali:\n\n${lines}\n\nOpen alerts: ${inboxHref}\n\n— nevali`;

		const listHtml = items
			.map((i) => {
				const href = i.linkHref
					? `<a href="${escapeHtmlAttr(i.linkHref)}">${escapeHtml(i.title)}</a>`
					: `<strong>${escapeHtml(i.title)}</strong>`;
				return `<li style="margin-bottom:8px;">${href}<br/><span style="color:${emailTheme.textMuted};font-size:13px;">${escapeHtml(i.body.slice(0, 200))}${i.body.length > 200 ? "…" : ""}</span></li>`;
			})
			.join("");
		const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Hello ${escapeHtml(name)},</p><p>You have <strong>${items.length}</strong> unread alert(s).</p><ul style="padding-left:18px;">${listHtml}</ul><p><a href="${escapeHtmlAttr(inboxHref)}" style="color:${emailTheme.ink};font-weight:600;">Open Alerts</a></p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;

		await sendTransactionalEmail({
			to: user.email,
			subject,
			text,
			html,
		});
		sent += 1;
	}

	return NextResponse.json({ ok: true, usersEmailed: sent });
}
