import type { RfqRow } from "~/app/api/contracts/schemas/contracts.schema";
import { env } from "~/env";
import { prisma } from "~/lib/db";
import { isValidEmail, sendTransactionalEmail } from "~/lib/email";
import { userMuteRfqThreadEmail } from "~/lib/notification-prefs";
import { consumeRfqThreadEmailThrottle } from "~/lib/rfq-thread-email-throttle";

function appOrigin(): string {
	return env.BETTER_AUTH_URL.replace(/\/$/, "");
}

/** Escape plain text for inclusion in HTML bodies. */
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

export async function getOrganizationMemberEmails(
	organizationId: string,
): Promise<string[]> {
	const rows = await prisma.member.findMany({
		where: { organizationId },
		select: { user: { select: { email: true } } },
	});
	const set = new Set<string>();
	for (const r of rows) {
		const e = r.user.email?.trim();
		if (e) set.add(e);
	}
	return [...set];
}

export async function notifyPartnerApplicationApproved(params: {
	to: string;
	name: string;
}): Promise<void> {
	const loginUrl = `${appOrigin()}/auth/login?callbackUrl=${encodeURIComponent("/artisan")}`;
	const safeName = escapeHtml(params.name);
	const subject = "Your CraftHouse partner account is approved";
	const text = `Hello ${params.name},\n\nYour partner application has been approved. You can sign in and open your artisan dashboard:\n${loginUrl}\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>Your partner application has been <strong>approved</strong>.</p><p><a href="${escapeHtmlAttr(loginUrl)}" style="color:#7B1F0A;font-weight:600;">Sign in to your dashboard</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to: params.to, subject, text, html });
}

export async function notifyPartnerAccessDisabled(params: {
	to: string;
	name: string;
}): Promise<void> {
	const safeName = escapeHtml(params.name);
	const subject = "Your CraftHouse partner access has been updated";
	const text = `Hello ${params.name},\n\nYour partner account access has been suspended. If you think this is a mistake, reply to this thread or contact support via the CraftHouse contact page.\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>Your partner account access has been <strong>suspended</strong>.</p><p style="color:#666;font-size:14px;">If you think this is a mistake, contact CraftHouse support.</p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to: params.to, subject, text, html });
}

export async function notifyPartnerAccessReenabled(params: {
	to: string;
	name: string;
}): Promise<void> {
	const loginUrl = `${appOrigin()}/auth/login?callbackUrl=${encodeURIComponent("/artisan")}`;
	const safeName = escapeHtml(params.name);
	const subject = "Your CraftHouse partner access is active again";
	const text = `Hello ${params.name},\n\nYour partner account has been re-enabled. Sign in here:\n${loginUrl}\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>Your partner account has been <strong>re-enabled</strong>.</p><p><a href="${escapeHtmlAttr(loginUrl)}" style="color:#7B1F0A;font-weight:600;">Sign in</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to: params.to, subject, text, html });
}

export async function notifyProductReviewResult(params: {
	recipients: string[];
	productName: string;
	approved: boolean;
	rejectionReason?: string | null;
}): Promise<void> {
	if (params.recipients.length === 0) return;
	const safeProduct = escapeHtml(params.productName);
	const subject = params.approved
		? `Product approved: ${params.productName}`
		: `Product update: ${params.productName}`;
	const reasonText =
		!params.approved && params.rejectionReason?.trim()
			? `\n\nReason: ${params.rejectionReason.trim()}`
			: "";
	const text = params.approved
		? `Your product "${params.productName}" has been approved and can appear in the public catalogue (subject to listing rules).\n\n— CraftHouse`
		: `Your product "${params.productName}" was not approved.${reasonText}\n\n— CraftHouse`;
	const reasonHtml =
		!params.approved && params.rejectionReason?.trim()
			? `<p style="margin-top:12px;"><strong>Reason:</strong> ${escapeHtml(params.rejectionReason.trim())}</p>`
			: "";
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Product <strong>${safeProduct}</strong> ${
		params.approved
			? "has been <strong>approved</strong>."
			: "was <strong>not approved</strong>."
	}</p>${reasonHtml}<p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to: params.recipients, subject, text, html });
}

export async function notifyCertificationReviewResult(params: {
	recipients: string[];
	certificationName: string;
	approved: boolean;
	rejectionReason?: string | null;
}): Promise<void> {
	if (params.recipients.length === 0) return;
	const safeName = escapeHtml(params.certificationName);
	const subject = params.approved
		? `Certification approved: ${params.certificationName}`
		: `Certification update: ${params.certificationName}`;
	const reasonText =
		!params.approved && params.rejectionReason?.trim()
			? `\n\nReason: ${params.rejectionReason.trim()}`
			: "";
	const text = params.approved
		? `Your certification "${params.certificationName}" has been approved.\n\n— CraftHouse`
		: `Your certification "${params.certificationName}" was not approved.${reasonText}\n\n— CraftHouse`;
	const reasonHtml =
		!params.approved && params.rejectionReason?.trim()
			? `<p style="margin-top:12px;"><strong>Reason:</strong> ${escapeHtml(params.rejectionReason.trim())}</p>`
			: "";
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Certification <strong>${safeName}</strong> ${
		params.approved
			? "has been <strong>approved</strong>."
			: "was <strong>not approved</strong>."
	}</p>${reasonHtml}<p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to: params.recipients, subject, text, html });
}

export async function notifyOrganizationNewRfq(params: {
	recipients: string[];
	productLine: string;
	buyerName: string;
	buyerEmail: string;
}): Promise<void> {
	if (params.recipients.length === 0) return;
	const contractsUrl = `${appOrigin()}/artisan/contracts`;
	const subject = "New buyer inquiry on CraftHouse";
	const text = `You have a new product inquiry.\n\nRequest: ${params.productLine}\nFrom: ${params.buyerName} (${params.buyerEmail})\n\nOpen Contracts & RFQs:\n${contractsUrl}\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>You have a <strong>new product inquiry</strong>.</p><p><strong>Request:</strong> ${escapeHtml(params.productLine)}</p><p><strong>From:</strong> ${escapeHtml(params.buyerName)} (${escapeHtml(params.buyerEmail)})</p><p><a href="${escapeHtmlAttr(contractsUrl)}" style="color:#7B1F0A;font-weight:600;">Open Contracts &amp; RFQs</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;

	await sendTransactionalEmail({ to: params.recipients, subject, text, html });
}

/** Receipt to the buyer — separate copy from the seller notification so wording stays buyer-friendly. */
export async function notifyBuyerInquiryConfirmation(params: {
	to: string;
	buyerName: string;
	productLine: string;
	signedInBuyer: boolean;
}): Promise<void> {
	if (!isValidEmail(params.to.trim())) return;
	const rfqsUrl = `${appOrigin()}/buyer/rfqs`;
	const subject = "CraftHouse: your product inquiry was sent";
	const trackLine = params.signedInBuyer
		? `You can track inquiries you send while signed in here:\n${rfqsUrl}\n`
		: "";
	const text = `Hello ${params.buyerName},\n\nWe sent your request to the artisan:\n${params.productLine}\n\n${trackLine}They will follow up using the contact details you provided.\n\n— CraftHouse`;
	const trackHtml = params.signedInBuyer
		? `<p><a href="${escapeHtmlAttr(rfqsUrl)}" style="color:#7B1F0A;font-weight:600;">View your inquiries</a></p>`
		: "";
	const safeName = escapeHtml(params.buyerName);
	const safeLine = escapeHtml(params.productLine);
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>We sent your request to the artisan:</p><p><strong>${safeLine}</strong></p>${trackHtml}<p style="color:#666;font-size:14px;">They will follow up using the contact details you provided.</p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	const cc = enterpriseBuyerInquiryCc();
	await sendTransactionalEmail({
		to: params.to.trim(),
		cc,
		subject,
		text,
		html,
	});
}

/** One confirmation email listing several RFQs created from cart checkout. */
export async function notifyBuyerCartInquiriesConfirmation(params: {
	to: string;
	buyerName: string;
	/** Plain-text lines, e.g. "- Product × 2 (Artisan Co)" */
	linesText: string;
	signedInBuyer: boolean;
}): Promise<void> {
	if (!isValidEmail(params.to.trim())) return;
	const rfqsUrl = `${appOrigin()}/buyer/rfqs`;
	const subject = "CraftHouse: your quote requests were sent";
	const trackLine = params.signedInBuyer
		? `You can track inquiries you send while signed in here:\n${rfqsUrl}\n`
		: "";
	const text = `Hello ${params.buyerName},\n\nWe sent your requests to the artisans:\n${params.linesText}\n\n${trackLine}They will follow up using the contact details you provided.\n\n— CraftHouse`;
	const trackHtml = params.signedInBuyer
		? `<p><a href="${escapeHtmlAttr(rfqsUrl)}" style="color:#7B1F0A;font-weight:600;">View your inquiries</a></p>`
		: "";
	const safeName = escapeHtml(params.buyerName);
	const safeLines = escapeHtml(params.linesText);
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>We sent your requests to the artisans:</p><p style="white-space:pre-wrap;font-weight:600;">${safeLines}</p>${trackHtml}<p style="color:#666;font-size:14px;">They will follow up using the contact details you provided.</p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	const cc = enterpriseBuyerInquiryCc();
	await sendTransactionalEmail({
		to: params.to.trim(),
		cc,
		subject,
		text,
		html,
	});
}

function enterpriseBuyerInquiryCc(): string | undefined {
	const raw = env.BUYER_ENTERPRISE_INQUIRY_CC_EMAIL?.trim();
	if (raw && isValidEmail(raw)) return raw;
	return undefined;
}

function rfqThreadCc(): string | undefined {
	const raw = env.RFQ_THREAD_CC_EMAIL?.trim();
	if (raw && isValidEmail(raw)) return raw;
	return undefined;
}

/** After a thread message: email the other party (throttled + prefs), optional CC, in-app rows. */
export async function notifyAfterRfqThreadMessage(params: {
	rfqId: string;
	product: string;
	organizationId: string;
	buyerUserId: string | null;
	authorUserId: string;
	authorRole: "BUYER" | "PARTNER";
	body: string;
	attachmentCount?: number;
}): Promise<void> {
	const cc = rfqThreadCc();
	const att =
		(params.attachmentCount ?? 0) > 0
			? ` (${params.attachmentCount} file(s) attached)`
			: "";
	const previewBase =
		params.body.length > 300 ? `${params.body.slice(0, 300)}…` : params.body;
	const preview = `${previewBase}${att}`;
	const buyerLink = `${appOrigin()}/buyer/rfqs?thread=${encodeURIComponent(params.rfqId)}`;
	const artisanLink = `${appOrigin()}/artisan/contracts?thread=${encodeURIComponent(params.rfqId)}`;

	if (params.authorRole === "PARTNER" && params.buyerUserId) {
		const buyer = await prisma.user.findUnique({
			where: { id: params.buyerUserId },
			select: { email: true, notificationPrefs: true },
		});
		const to = buyer?.email?.trim();
		const mute = userMuteRfqThreadEmail(buyer?.notificationPrefs);
		if (to && isValidEmail(to) && !mute) {
			const { sendEmail, bundledCount } = await consumeRfqThreadEmailThrottle(
				params.rfqId,
				params.buyerUserId,
			);
			if (sendEmail) {
				const subject =
					bundledCount > 1
						? `CraftHouse: ${bundledCount} new messages on “${params.product}”`
						: `CraftHouse: new message on “${params.product}”`;
				const lead =
					bundledCount > 1
						? `There are ${bundledCount} new messages in your inquiry thread (grouped within a few minutes). Latest preview:\n\n${preview}\n`
						: `The artisan posted in your inquiry thread.\n\n${preview}\n`;
				const text = `${lead}\nOpen your inquiries:\n${buyerLink}\n\n— CraftHouse`;
				const safeProduct = escapeHtml(params.product);
				const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>${
					bundledCount > 1
						? `There are <strong>${bundledCount}</strong> new messages in your inquiry thread for <strong>${safeProduct}</strong> (grouped within a few minutes).`
						: `There is a <strong>new message</strong> in your inquiry thread for <strong>${safeProduct}</strong>.`
				}</p><p style="white-space:pre-wrap;">${escapeHtml(preview)}</p><p><a href="${escapeHtmlAttr(buyerLink)}" style="color:#7B1F0A;font-weight:600;">Open My inquiries</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
				await sendTransactionalEmail({ to, cc, subject, text, html });
			}
		}
		await prisma.userNotification.create({
			data: {
				userId: params.buyerUserId,
				kind: "RFQ_THREAD_MESSAGE",
				title: "New message on your inquiry",
				body: preview,
				linkHref: buyerLink,
				contextRfqId: params.rfqId,
			},
		});
	}

	if (params.authorRole === "BUYER") {
		const members = await prisma.member.findMany({
			where: { organizationId: params.organizationId },
			select: {
				userId: true,
				user: { select: { email: true, notificationPrefs: true } },
			},
		});
		const recipients = members.filter((m) => m.userId !== params.authorUserId);
		const emailRecipients = recipients.filter((m) => {
			const e = m.user.email?.trim();
			return (
				!!e &&
				isValidEmail(e) &&
				!userMuteRfqThreadEmail(m.user.notificationPrefs)
			);
		});
		const emails = [
			...new Set(
				emailRecipients
					.map((m) => m.user.email?.trim())
					.filter((e): e is string => !!e && isValidEmail(e)),
			),
		];
		if (emails.length > 0) {
			const orgKey = `org:${params.organizationId}`;
			const { sendEmail, bundledCount } = await consumeRfqThreadEmailThrottle(
				params.rfqId,
				orgKey,
			);
			if (sendEmail) {
				const subject =
					bundledCount > 1
						? `CraftHouse: ${bundledCount} buyer messages on “${params.product}”`
						: `CraftHouse: buyer message on “${params.product}”`;
				const lead =
					bundledCount > 1
						? `There are ${bundledCount} new buyer messages in an inquiry thread (grouped within a few minutes). Latest preview:\n\n${preview}\n`
						: `A buyer posted in an inquiry thread.\n\n${preview}\n`;
				const text = `${lead}\nOpen Contracts & RFQs:\n${artisanLink}\n\n— CraftHouse`;
				const safeProduct = escapeHtml(params.product);
				const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>${
					bundledCount > 1
						? `There are <strong>${bundledCount}</strong> new buyer messages for <strong>${safeProduct}</strong>.`
						: `A buyer posted in the thread for <strong>${safeProduct}</strong>.`
				}</p><p style="white-space:pre-wrap;">${escapeHtml(preview)}</p><p><a href="${escapeHtmlAttr(artisanLink)}" style="color:#7B1F0A;font-weight:600;">Open Contracts &amp; RFQs</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
				await sendTransactionalEmail({
					to: emails,
					cc,
					subject,
					text,
					html,
				});
			}
		}
		const rows = recipients.map((m) => ({
			userId: m.userId,
			kind: "RFQ_THREAD_MESSAGE",
			title: "New buyer message",
			body: preview,
			linkHref: artisanLink,
			contextRfqId: params.rfqId,
		}));
		if (rows.length > 0) {
			await prisma.userNotification.createMany({ data: rows });
		}
	}
}

export type BuyerRfqSellerNotifyKind =
	| "quoted"
	| "negotiating"
	| "declined"
	| "cancelled_by_seller";

/** If the RFQ is tied to a buyer account, email them when the artisan updates the pipeline. */
export async function notifyLinkedBuyerOfRfqChange(
	row: RfqRow,
	kind: BuyerRfqSellerNotifyKind,
): Promise<void> {
	if (!row.buyerUserId) return;
	const user = await prisma.user.findUnique({
		where: { id: row.buyerUserId },
		select: { email: true, name: true },
	});
	const to = user?.email?.trim();
	if (!to || !isValidEmail(to)) return;

	const safeProduct = escapeHtml(row.product);
	const buyerName = user?.name?.trim() || "there";
	const safeName = escapeHtml(buyerName);
	const rfqsUrl = `${appOrigin()}/buyer/rfqs`;

	const copy: Record<
		BuyerRfqSellerNotifyKind,
		{ subject: string; lead: string }
	> = {
		quoted: {
			subject: "CraftHouse: you received a quote",
			lead: "The artisan has shared an estimated value for your request.",
		},
		negotiating: {
			subject: "CraftHouse: negotiation opened",
			lead: "The artisan marked your request as under negotiation.",
		},
		declined: {
			subject: "CraftHouse: update on your inquiry",
			lead: "The artisan declined this request.",
		},
		cancelled_by_seller: {
			subject: "CraftHouse: inquiry withdrawn",
			lead: "The artisan cancelled this request.",
		},
	};
	const { subject, lead } = copy[kind];
	const valueLine = row.estimatedValue
		? `\nEstimate: ${row.estimatedValue}`
		: "";
	const text = `Hello ${buyerName},\n\n${lead}\n\nRequest: ${row.product}${valueLine}\n\nTrack inquiries: ${rfqsUrl}\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>${escapeHtml(lead)}</p><p><strong>${safeProduct}</strong>${
		row.estimatedValue
			? `<br/><span style="color:#666;">Estimate: ${escapeHtml(row.estimatedValue)}</span>`
			: ""
	}</p><p><a href="${escapeHtmlAttr(rfqsUrl)}" style="color:#7B1F0A;font-weight:600;">View your inquiries</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;

	const cc = enterpriseBuyerInquiryCc();
	await sendTransactionalEmail({ to, cc, subject, text, html });
}

/** After an RFQ becomes an active contract — notify org members and buyer contact when possible. */
export async function notifyContractRecordedFromRfq(params: {
	orgMemberEmails: string[];
	productLine: string;
	valueLabel: string;
	buyerUserId: string | null;
	buyerContactEmail: string | null;
}): Promise<void> {
	const artisanContractsUrl = `${appOrigin()}/artisan/contracts`;
	const buyerRfqsUrl = `${appOrigin()}/buyer/rfqs`;

	if (params.orgMemberEmails.length > 0) {
		const subject = "CraftHouse: active contract recorded";
		const text = `An active contract was created from a buyer inquiry.\n\nProduct / request: ${params.productLine}\nValue: ${params.valueLabel}\n\nView contracts:\n${artisanContractsUrl}\n\n— CraftHouse`;
		const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>An <strong>active contract</strong> was created from a buyer inquiry.</p><p><strong>Request:</strong> ${escapeHtml(params.productLine)}</p><p><strong>Value:</strong> ${escapeHtml(params.valueLabel)}</p><p><a href="${escapeHtmlAttr(artisanContractsUrl)}" style="color:#7B1F0A;font-weight:600;">Open Contracts &amp; RFQs</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
		await sendTransactionalEmail({
			to: params.orgMemberEmails,
			subject,
			text,
			html,
		});
	}

	let buyerTo: string | null = null;
	let buyerName = "there";
	if (params.buyerUserId) {
		const user = await prisma.user.findUnique({
			where: { id: params.buyerUserId },
			select: { email: true, name: true },
		});
		const e = user?.email?.trim();
		if (e && isValidEmail(e)) buyerTo = e;
		if (user?.name?.trim()) buyerName = user.name.trim();
	}
	if (
		!buyerTo &&
		params.buyerContactEmail?.trim() &&
		isValidEmail(params.buyerContactEmail.trim())
	) {
		buyerTo = params.buyerContactEmail.trim();
	}
	if (!buyerTo) return;

	const safeName = escapeHtml(buyerName);
	const subject = "CraftHouse: your inquiry became an active contract";
	const text = `Hello ${buyerName},\n\nThe artisan recorded an active contract for:\n${params.productLine}\nValue: ${params.valueLabel}\n\nTrack related activity:\n${buyerRfqsUrl}\n\n— CraftHouse`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>The artisan recorded an <strong>active contract</strong> for:</p><p><strong>${escapeHtml(params.productLine)}</strong></p><p><strong>Value:</strong> ${escapeHtml(params.valueLabel)}</p><p><a href="${escapeHtmlAttr(buyerRfqsUrl)}" style="color:#7B1F0A;font-weight:600;">View your inquiries</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({
		to: buyerTo,
		cc: enterpriseBuyerInquiryCc(),
		subject,
		text,
		html,
	});
}

function checkoutPaymentLabel(method: string): string {
	switch (method) {
		case "CARD":
			return "Card";
		case "COD":
			return "Cash on delivery";
		default:
			return method;
	}
}

/** Buyer receipt after a guest catalog checkout order is recorded. */
export async function notifyShopOrderBuyerConfirmation(params: {
	to: string;
	buyerName: string;
	orderId: string;
	totalMad: string;
	paymentMethod: string;
	lines: {
		productName: string;
		variantName: string;
		quantity: number;
		lineTotalMad: string;
	}[];
}): Promise<void> {
	const to = params.to.trim();
	if (!isValidEmail(to)) return;
	const safeName = escapeHtml(params.buyerName);
	const pay = escapeHtml(checkoutPaymentLabel(params.paymentMethod));
	const linesText = params.lines
		.map(
			(l) =>
				`• ${l.productName} (${l.variantName}) × ${l.quantity} — ${l.lineTotalMad} MAD`,
		)
		.join("\n");
	const subject = `CraftHouse: order received (${params.orderId.slice(0, 8)}…)`;
	const text = `Hello ${params.buyerName},\n\nThank you — we've received your order.\n\nOrder reference: ${params.orderId}\nPayment: ${checkoutPaymentLabel(params.paymentMethod)}\nTotal: ${params.totalMad} MAD\n\n${linesText}\n\nWe'll follow up using the contact details you provided.\n\n— CraftHouse`;
	const rowsHtml = params.lines
		.map(
			(l) =>
				`<tr><td style="padding:8px;border-bottom:1px solid #f0e8dc;">${escapeHtml(l.productName)} <span style="color:#666;">(${escapeHtml(l.variantName)})</span></td><td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:right;">× ${l.quantity}</td><td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:right;">${escapeHtml(l.lineTotalMad)} MAD</td></tr>`,
		)
		.join("");
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p>Hello ${safeName},</p><p>Thank you — we've <strong>received your order</strong>.</p><p><strong>Order reference:</strong> ${escapeHtml(params.orderId)}<br/><strong>Payment:</strong> ${pay}<br/><strong>Total:</strong> ${escapeHtml(params.totalMad)} MAD</p><table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">${rowsHtml}</table><p style="color:#666;font-size:14px;">We'll follow up using the contact details you provided.</p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;
	await sendTransactionalEmail({ to, subject, text, html });
}

/** Email each partner org that has lines on a new shop order (ops / observability). */
export async function notifyOrganizationsOfShopOrder(params: {
	orderId: string;
	buyerName: string;
	buyerEmail: string;
	buyerPhone?: string | null;
	totalMad: string;
	paymentMethod: string;
	lines: {
		productName: string;
		variantName: string;
		quantity: number;
		lineTotalMad: string;
		organizationId: string;
		organizationName: string;
	}[];
}): Promise<void> {
	const byOrg = new Map<
		string,
		{ organizationName: string; lines: (typeof params.lines)[number][] }
	>();
	for (const line of params.lines) {
		const cur = byOrg.get(line.organizationId) ?? {
			organizationName: line.organizationName,
			lines: [],
		};
		cur.lines.push(line);
		byOrg.set(line.organizationId, cur);
	}

	const pay = checkoutPaymentLabel(params.paymentMethod);
	const phoneLine = params.buyerPhone?.trim()
		? `\nPhone: ${params.buyerPhone.trim()}`
		: "";

	for (const [organizationId, { organizationName, lines }] of byOrg) {
		const recipients = await getOrganizationMemberEmails(organizationId);
		if (recipients.length === 0) continue;

		const linesText = lines
			.map(
				(l) =>
					`• ${l.productName} (${l.variantName}) × ${l.quantity} — ${l.lineTotalMad} MAD`,
			)
			.join("\n");
		const subtotal = lines
			.reduce((s, l) => s + Number(l.lineTotalMad.replace(",", ".")), 0)
			.toFixed(2);

		const subject = `CraftHouse: new shop order — ${organizationName}`;
		const text = `You have a new order on CraftHouse.\n\nOrganization: ${organizationName}\nOrder: ${params.orderId}\nBuyer: ${params.buyerName} (${params.buyerEmail})${phoneLine}\nPayment: ${pay}\nLines for you:\n${linesText}\n\nSubtotal (your lines): ${subtotal} MAD · Order total: ${params.totalMad} MAD\n\nOpen Orders: ${appOrigin()}/artisan/orders\n\n— CraftHouse`;

		const rowsHtml = lines
			.map(
				(l) =>
					`<tr><td style="padding:8px;border-bottom:1px solid #f0e8dc;">${escapeHtml(l.productName)} <span style="color:#666;">(${escapeHtml(l.variantName)})</span></td><td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:right;">× ${l.quantity}</td><td style="padding:8px;border-bottom:1px solid #f0e8dc;text-align:right;">${escapeHtml(l.lineTotalMad)} MAD</td></tr>`,
			)
			.join("");
		const ordersUrl = `${appOrigin()}/artisan/orders`;
		const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:#2a0f05;background:#faf7f4;padding:24px;"><p><strong>New shop order</strong> on CraftHouse.</p><p><strong>${escapeHtml(organizationName)}</strong></p><p><strong>Order:</strong> ${escapeHtml(params.orderId)}<br/><strong>Buyer:</strong> ${escapeHtml(params.buyerName)} (${escapeHtml(params.buyerEmail)})${params.buyerPhone?.trim() ? `<br/><strong>Phone:</strong> ${escapeHtml(params.buyerPhone.trim())}` : ""}<br/><strong>Payment:</strong> ${escapeHtml(pay)}</p><table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">${rowsHtml}</table><p style="font-size:13px;color:#666;">Subtotal (your lines): <strong>${escapeHtml(subtotal)} MAD</strong> · Order total: ${escapeHtml(params.totalMad)} MAD</p><p><a href="${escapeHtmlAttr(ordersUrl)}" style="color:#7B1F0A;font-weight:600;">Open artisan orders</a></p><p style="color:#666;font-size:14px;">— CraftHouse</p></body></html>`;

		await sendTransactionalEmail({ to: recipients, subject, text, html });
	}
}
