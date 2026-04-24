import { env } from "~/env";
import { prisma } from "~/lib/db";
import { isValidEmail, sendTransactionalEmail } from "~/lib/email";
import { emailTheme } from "~/lib/email-theme";

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
	const subject = "Your nevali partner account is approved";
	const text = `Hello ${params.name},\n\nYour partner application has been approved. You can sign in and open your brand dashboard:\n${loginUrl}\n\n— nevali`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Hello ${safeName},</p><p>Your partner application has been <strong>approved</strong>.</p><p><a href="${escapeHtmlAttr(loginUrl)}" style="color:${emailTheme.ink};font-weight:600;">Sign in to your brand dashboard</a></p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
	await sendTransactionalEmail({ to: params.to, subject, text, html });
}

export async function notifyPartnerAccessDisabled(params: {
	to: string;
	name: string;
}): Promise<void> {
	const safeName = escapeHtml(params.name);
	const subject = "Your nevali partner access has been updated";
	const text = `Hello ${params.name},\n\nYour partner account access has been suspended. If you think this is a mistake, reply to this thread or contact support via the nevali contact page.\n\n— nevali`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Hello ${safeName},</p><p>Your partner account access has been <strong>suspended</strong>.</p><p style="color:${emailTheme.textMuted};font-size:14px;">If you think this is a mistake, contact nevali support.</p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
	await sendTransactionalEmail({ to: params.to, subject, text, html });
}

export async function notifyPartnerAccessReenabled(params: {
	to: string;
	name: string;
}): Promise<void> {
	const loginUrl = `${appOrigin()}/auth/login?callbackUrl=${encodeURIComponent("/artisan")}`;
	const safeName = escapeHtml(params.name);
	const subject = "Your nevali partner access is active again";
	const text = `Hello ${params.name},\n\nYour partner account has been re-enabled. Sign in here:\n${loginUrl}\n\n— nevali`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Hello ${safeName},</p><p>Your partner account has been <strong>re-enabled</strong>.</p><p><a href="${escapeHtmlAttr(loginUrl)}" style="color:${emailTheme.ink};font-weight:600;">Sign in</a></p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
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
		? `Your product "${params.productName}" has been approved and can appear in the public catalogue (subject to listing rules).\n\n— nevali`
		: `Your product "${params.productName}" was not approved.${reasonText}\n\n— nevali`;
	const reasonHtml =
		!params.approved && params.rejectionReason?.trim()
			? `<p style="margin-top:12px;"><strong>Reason:</strong> ${escapeHtml(params.rejectionReason.trim())}</p>`
			: "";
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Product <strong>${safeProduct}</strong> ${
		params.approved
			? "has been <strong>approved</strong>."
			: "was <strong>not approved</strong>."
	}</p>${reasonHtml}<p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
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
		? `Your certification "${params.certificationName}" has been approved.\n\n— nevali`
		: `Your certification "${params.certificationName}" was not approved.${reasonText}\n\n— nevali`;
	const reasonHtml =
		!params.approved && params.rejectionReason?.trim()
			? `<p style="margin-top:12px;"><strong>Reason:</strong> ${escapeHtml(params.rejectionReason.trim())}</p>`
			: "";
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p>Certification <strong>${safeName}</strong> ${
		params.approved
			? "has been <strong>approved</strong>."
			: "was <strong>not approved</strong>."
	}</p>${reasonHtml}<p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
	await sendTransactionalEmail({ to: params.recipients, subject, text, html });
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

function normalizePhoneForWhatsApp(phoneRaw: string): string | null {
	const rawDigits = phoneRaw.replace(/\D/g, "");
	if (!rawDigits) return null;

	// Accept common user formats and normalize to Morocco mobile in E.164 digits (no +), e.g. 212612345678.
	let digits = rawDigits;
	if (digits.startsWith("00")) digits = digits.slice(2);

	let national = digits;
	if (digits.startsWith("212")) {
		national = digits.slice(3);
		if (national.startsWith("0")) national = national.slice(1);
	} else if (digits.startsWith("0")) {
		national = digits.slice(1);
	}

	// Morocco mobile numbers are 9 digits and typically start with 6 or 7.
	if (!/^[67]\d{8}$/.test(national)) return null;
	return `212${national}`;
}

async function sendArabicWhatsAppOrderConfirmation(params: {
	toPhone: string;
	buyerName: string;
	orderId: string;
	totalMad: string;
	lines: {
		productName: string;
		variantName: string;
		quantity: number;
		lineTotalMad: string;
		imageUrl?: string | null;
	}[];
}): Promise<boolean> {
	const infobipBaseUrl = env.INFOBIP_BASE_URL?.trim();
	const infobipApiKey = env.INFOBIP_API_KEY?.trim();
	const infobipFrom = env.INFOBIP_WHATSAPP_FROM?.trim();

	const token = env.WHATSAPP_CLOUD_API_TOKEN?.trim();
	const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID?.trim();
	const to = normalizePhoneForWhatsApp(params.toPhone);
	if (!to) return false;

	const linesText = params.lines
		.map((l, i) => {
			const imageLine = l.imageUrl?.trim() ? `\n🖼️ ${l.imageUrl.trim()}` : "";
			return `${i + 1}) ${l.productName} (${l.variantName}) × ${l.quantity} — ${l.lineTotalMad} درهم${imageLine}`;
		})
		.join("\n");
	const body = [
		`السلام عليكم ${params.buyerName}،`,
		"",
		"✅ تم تأكيد طلبكم بنجاح.",
		`🔖 رقم الطلب: ${params.orderId}`,
		`💳 طريقة الدفع: الدفع عند الاستلام`,
		`💰 المجموع: ${params.totalMad} درهم`,
		"",
		"📦 تفاصيل الطلب:",
		linesText,
		"",
		"سنقوم بالتواصل معكم لتأكيد التوصيل. شكراً لثقتكم.",
	].join("\n");

	// Prefer Infobip when configured.
	if (infobipBaseUrl && infobipApiKey && infobipFrom) {
		const url = `${infobipBaseUrl.replace(/\/$/, "")}/whatsapp/1/message/text`;
		try {
			const res = await fetch(url, {
				method: "POST",
				headers: {
					Authorization: `App ${infobipApiKey}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					from: infobipFrom,
					to,
					content: {
						text: body,
					},
				}),
			});
			if (res.ok) return true;
		} catch {
			// fallback to Meta sender below when available
		}
	}

	// Meta fallback (existing path)
	if (!token || !phoneNumberId) return false;
	const metaUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
	try {
		const res = await fetch(metaUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messaging_product: "whatsapp",
				recipient_type: "individual",
				to,
				type: "text",
				text: { preview_url: false, body },
			}),
		});
		return res.ok;
	} catch {
		return false;
	}
}

/** Buyer receipt after a guest catalog checkout order is recorded. */
export async function notifyShopOrderBuyerConfirmation(params: {
	to: string;
	toPhone?: string | null;
	buyerName: string;
	orderId: string;
	totalMad: string;
	paymentMethod: string;
	lines: {
		productName: string;
		variantName: string;
		quantity: number;
		lineTotalMad: string;
		imageUrl?: string | null;
	}[];
}): Promise<void> {
	const to = params.to.trim();
	const hasEmail = isValidEmail(to);

	if (params.toPhone?.trim()) {
		const sent = await sendArabicWhatsAppOrderConfirmation({
			toPhone: params.toPhone,
			buyerName: params.buyerName,
			orderId: params.orderId,
			totalMad: params.totalMad,
			lines: params.lines,
		});
		if (sent) return;
	}

	if (!hasEmail) return;
	const safeName = escapeHtml(params.buyerName);
	const pay = escapeHtml(checkoutPaymentLabel(params.paymentMethod));
	const linesText = params.lines
		.map(
			(l) =>
				`• ${l.productName} (${l.variantName}) × ${l.quantity} — ${l.lineTotalMad} MAD${l.imageUrl ? ` [image: ${l.imageUrl}]` : ""}`,
		)
		.join("\n");
	const subject = `تم تأكيد طلبكم (${params.orderId.slice(0, 8)}…)`;
	const text = `السلام عليكم ${params.buyerName},\n\n✅ تم تأكيد طلبكم بنجاح.\n\nرقم الطلب: ${params.orderId}\nطريقة الدفع: الدفع عند الاستلام\nالمجموع: ${params.totalMad} درهم\n\n${linesText}\n\nسنتواصل معكم لتأكيد تفاصيل التوصيل.\n\n— nevali`;
	const rowsHtml = params.lines
		.map(
			(l) =>
				`<tr><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};">${escapeHtml(l.productName)} <span style="color:${emailTheme.textMuted};">(${escapeHtml(l.variantName)})</span>${l.imageUrl ? `<div style="margin-top:6px;"><a href="${escapeHtmlAttr(l.imageUrl)}" style="color:${emailTheme.textMuted};font-size:12px;">عرض صورة المنتج</a></div>` : ""}</td><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};text-align:right;">× ${l.quantity}</td><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};text-align:right;">${escapeHtml(l.lineTotalMad)} MAD</td></tr>`,
		)
		.join("");
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.7;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;direction:rtl;text-align:right;"><p>السلام عليكم ${safeName}،</p><p>✅ تم <strong>تأكيد طلبكم</strong> بنجاح.</p><p><strong>رقم الطلب:</strong> ${escapeHtml(params.orderId)}<br/><strong>طريقة الدفع:</strong> ${pay}<br/><strong>المجموع:</strong> ${escapeHtml(params.totalMad)} درهم</p><table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">${rowsHtml}</table><p style="color:${emailTheme.textMuted};font-size:14px;">سنتواصل معكم لتأكيد تفاصيل التوصيل.</p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;
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

		const subject = `nevali: new shop order — ${organizationName}`;
		const text = `You have a new order on nevali.\n\nOrganization: ${organizationName}\nOrder: ${params.orderId}\nBuyer: ${params.buyerName} (${params.buyerEmail})${phoneLine}\nPayment: ${pay}\nLines for you:\n${linesText}\n\nSubtotal (your lines): ${subtotal} MAD · Order total: ${params.totalMad} MAD\n\nOpen Orders: ${appOrigin()}/artisan/orders\n\n— nevali`;

		const rowsHtml = lines
			.map(
				(l) =>
					`<tr><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};">${escapeHtml(l.productName)} <span style="color:${emailTheme.textMuted};">(${escapeHtml(l.variantName)})</span></td><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};text-align:right;">× ${l.quantity}</td><td style="padding:8px;border-bottom:1px solid ${emailTheme.creamDark};text-align:right;">${escapeHtml(l.lineTotalMad)} MAD</td></tr>`,
			)
			.join("");
		const ordersUrl = `${appOrigin()}/artisan/orders`;
		const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.55;color:${emailTheme.ink};background:${emailTheme.cream};padding:24px;"><p><strong>New shop order</strong> on nevali.</p><p><strong>${escapeHtml(organizationName)}</strong></p><p><strong>Order:</strong> ${escapeHtml(params.orderId)}<br/><strong>Buyer:</strong> ${escapeHtml(params.buyerName)} (${escapeHtml(params.buyerEmail)})${params.buyerPhone?.trim() ? `<br/><strong>Phone:</strong> ${escapeHtml(params.buyerPhone.trim())}` : ""}<br/><strong>Payment:</strong> ${escapeHtml(pay)}</p><table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">${rowsHtml}</table><p style="font-size:13px;color:${emailTheme.textMuted};">Subtotal (your lines): <strong>${escapeHtml(subtotal)} MAD</strong> · Order total: ${escapeHtml(params.totalMad)} MAD</p><p><a href="${escapeHtmlAttr(ordersUrl)}" style="color:${emailTheme.ink};font-weight:600;">Open catalog orders</a></p><p style="color:${emailTheme.textMuted};font-size:14px;">— nevali</p></body></html>`;

		await sendTransactionalEmail({ to: recipients, subject, text, html });
	}
}
