import { after } from "next/server";
import { Resend } from "resend";
import { env } from "~/env";

/** Resend secret keys are `re_…` (see https://resend.com/docs/dashboard/api-keys). */
function looksLikeResendApiKey(key: string): boolean {
	return key.startsWith("re_") && key.length >= 32;
}

/** Lazy Resend client — only created when the key looks valid (server-side only). */
function getResendClient(): Resend | null {
	const key = env.RESEND_API_KEY?.trim();
	if (!key) return null;
	if (!looksLikeResendApiKey(key)) {
		if (env.NODE_ENV === "development") {
			console.warn(
				"[email] RESEND_API_KEY missing or not a Resend secret (expected `re_…`); emails skipped.",
			);
		}
		return null;
	}
	return new Resend(key);
}

/** Default from address: Resend test domain or your verified domain via env. */
const DEFAULT_FROM = "onboarding@resend.dev";

function getFromEmail(): string {
	const from = env.RESEND_FROM_EMAIL;
	if (from) return from;
	return DEFAULT_FROM;
}

/** Basic email format check to avoid unnecessary Resend calls and rate-limit abuse. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
	return (
		typeof value === "string" && value.length <= 254 && EMAIL_REGEX.test(value)
	);
}

/** Escape for safe use inside HTML attributes (e.g. href). */
function escapeHtmlAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export type SendVerificationEmailParams = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

export type SendTransactionalEmailParams = {
	to: string | string[];
	subject: string;
	text: string;
	html: string;
	/** Optional CC — addresses already in `to` are dropped (Resend-safe). */
	cc?: string | string[];
};

function normalizeRecipients(to: string | string[]): string[] {
	const list = (Array.isArray(to) ? to : [to])
		.map((e) => e.trim())
		.filter(Boolean);
	const unique = [...new Set(list)].filter(isValidEmail);
	return unique;
}

function normalizeCc(
	cc: string | string[] | undefined,
	toLowerSet: Set<string>,
): string[] | undefined {
	if (!cc) return undefined;
	const list = (Array.isArray(cc) ? cc : [cc])
		.map((e) => e.trim())
		.filter(Boolean);
	const unique = [...new Set(list)].filter(
		(e) => isValidEmail(e) && !toLowerSet.has(e.toLowerCase()),
	);
	return unique.length > 0 ? unique : undefined;
}

/**
 * Sends a transactional email via Resend (approvals, RFQs, etc.).
 * - Schedules the send with Next.js `after()` so responses are not blocked (serverless-safe).
 * - No-ops if `RESEND_API_KEY` is missing or all recipients are invalid.
 * - Never logs recipient addresses.
 */
export async function sendTransactionalEmail(
	params: SendTransactionalEmailParams,
): Promise<void> {
	const recipients = normalizeRecipients(params.to);
	if (recipients.length === 0) {
		return;
	}

	const resend = getResendClient();
	if (!resend) {
		if (env.NODE_ENV === "development") {
			const k = env.RESEND_API_KEY?.trim();
			if (!k) {
				console.warn(
					"[email] RESEND_API_KEY not set; transactional email skipped.",
				);
			}
		}
		return;
	}

	const from = getFromEmail();
	const toLower = new Set(recipients.map((e) => e.toLowerCase()));
	const ccList = normalizeCc(params.cc, toLower);

	const toField =
		recipients.length === 1 && recipients[0] !== undefined
			? recipients[0]
			: recipients;

	const payload: Parameters<Resend["emails"]["send"]>[0] = {
		from,
		to: toField,
		subject: params.subject,
		text: params.text,
		html: params.html,
		...(ccList && ccList.length > 0
			? {
					cc:
						ccList.length === 1 && ccList[0] !== undefined ? ccList[0] : ccList,
				}
			: {}),
	};

	after(async () => {
		try {
			const { error } = await resend.emails.send(payload);
			if (!error) return;
			const msg = error.message ?? String(error);
			const isInvalidKey =
				/api key is invalid|invalid api key|unauthorized|401/i.test(msg);
			if (env.NODE_ENV === "development") {
				if (isInvalidKey) {
					console.warn(
						"[email] Resend rejected the API key — set a valid RESEND_API_KEY or remove it to skip email.",
					);
				} else {
					console.error("[email] Resend error:", msg);
				}
			}
		} catch (err) {
			if (env.NODE_ENV === "development") {
				console.error("[email] Send failed:", err);
			}
		}
	});
}

/**
 * Sends a verification email via Resend.
 * - Does not await the send so auth response is not delayed (timing-attack safe).
 * - Schedules the actual send with Next.js `after()` so it runs after the response (serverless-safe).
 * - No-ops if RESEND_API_KEY is missing or `to` is invalid.
 * - Never logs the recipient address.
 */
export async function sendVerificationEmail(
	params: SendVerificationEmailParams,
): Promise<void> {
	await sendTransactionalEmail({
		to: params.to,
		subject: params.subject,
		text: params.text,
		html: params.html,
	});
}

/**
 * Builds HTML and text for the standard verification email.
 * URL is escaped for safe use in HTML.
 */
export function buildVerificationEmailContent(params: {
	verificationUrl: string;
	productName?: string;
}): { text: string; html: string } {
	const { verificationUrl, productName = "nevali" } = params;
	const safeUrl = escapeHtmlAttr(verificationUrl);
	const text = `Verify your email for ${productName}\n\nClick the link below to verify your email:\n${verificationUrl}\n\nIf you didn't request this, you can ignore this email.`;
	const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;color:#333;"><p>Click the link below to verify your email and complete your ${productName} account.</p><p><a href="${safeUrl}" style="color:#C8963C;font-weight:600;">Verify my email</a></p><p style="color:#666;font-size:14px;">If you didn't request this, you can ignore this email.</p></body></html>`;
	return { text, html };
}
