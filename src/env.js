import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().url(),
		/** Optional comma-separated origins for Better Auth (e.g. https://nevali.store,https://www.nevali.store). */
		BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
		RESEND_API_KEY: z.string().optional(),
		/** Verified sender (e.g. noreply@yourdomain.com). Defaults to Resend's test address when unset. */
		RESEND_FROM_EMAIL: z.string().email().optional(),
		/**
		 * When `true` / `1` / `yes` / `on`, Better Auth requires verified email before password sign-in.
		 * Requires `emailVerification.sendVerificationEmail` (wired to Resend) and `RESEND_API_KEY` in production.
		 */
		REQUIRE_EMAIL_VERIFICATION: z
			.string()
			.optional()
			.transform((v) =>
				v ? ["1", "true", "yes", "on"].includes(v.toLowerCase()) : false,
			),
		/** Optional CC on RFQ thread message notification emails (internal visibility). */
		RFQ_THREAD_CC_EMAIL: z.string().email().optional(),
		/** Optional CC on buyer-facing inquiry / RFQ lifecycle emails (e.g. procurement desk). */
		BUYER_ENTERPRISE_INQUIRY_CC_EMAIL: z.string().email().optional(),
		/**
		 * Placeholder for a future digest/cron endpoint (not wired yet). Optional secret string
		 * for scheduled summaries or an internal job caller.
		 */
		NOTIFICATION_DIGEST_CRON_SECRET: z.string().optional(),
		/** Optional: shown near legal summaries on /contact (informational sites). */
		LEGAL_POLICY_EFFECTIVE_DATE: z.string().max(64).optional(),
		/** Stripe secret key — used for Checkout Sessions (card catalog orders) and webhook verification. */
		STRIPE_SECRET_KEY: z.string().optional(),
		/** Signing secret for `POST /api/webhooks/stripe` (Stripe Dashboard → Developers → Webhooks). */
		STRIPE_WEBHOOK_SECRET: z.string().optional(),
		/** Supabase Storage — project URL and service role key for server-side uploads. */
		SUPABASE_URL: z.string().url().optional(),
		SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
		/** Supabase Storage bucket name for all media (e.g. profile pictures, product images). Must exist and be public. */
		SUPABASE_STORAGE_BUCKET: z.string().min(1).optional(),
		/** Public contact address shown on /contact (e.g. hello@yourdomain.com). */
		CONTACT_PUBLIC_EMAIL: z.string().email().optional(),
		/** Meta WhatsApp Cloud API token (optional). */
		WHATSAPP_CLOUD_API_TOKEN: z.string().min(1).optional(),
		/** Meta WhatsApp business phone number ID (optional). */
		WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
		/** Infobip API base URL, e.g. https://xyz.api.infobip.com */
		INFOBIP_BASE_URL: z.string().optional(),
		/** Infobip API key. */
		INFOBIP_API_KEY: z.string().min(1).optional(),
		/** Infobip WhatsApp sender number/name configured in your account. */
		INFOBIP_WHATSAPP_FROM: z.string().min(1).optional(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		/** Supabase project URL — used to build public image URLs for display. */
		NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
		/** Shown on public product actions; optional extra line (e.g. “Invoices via your ERP”). */
		NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE: z.string().max(500).optional(),
		/** Optional: Stripe publishable key (e.g. future Elements). Hosted Checkout does not require it on the client. */
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
		REQUIRE_EMAIL_VERIFICATION: process.env.REQUIRE_EMAIL_VERIFICATION,
		RFQ_THREAD_CC_EMAIL: process.env.RFQ_THREAD_CC_EMAIL,
		BUYER_ENTERPRISE_INQUIRY_CC_EMAIL: process.env.BUYER_ENTERPRISE_INQUIRY_CC_EMAIL,
		NOTIFICATION_DIGEST_CRON_SECRET: process.env.NOTIFICATION_DIGEST_CRON_SECRET,
		LEGAL_POLICY_EFFECTIVE_DATE: process.env.LEGAL_POLICY_EFFECTIVE_DATE,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
		SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE: process.env.NEXT_PUBLIC_MARKETPLACE_BILLING_NOTE,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		CONTACT_PUBLIC_EMAIL: process.env.CONTACT_PUBLIC_EMAIL,
		WHATSAPP_CLOUD_API_TOKEN: process.env.WHATSAPP_CLOUD_API_TOKEN,
		WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
		INFOBIP_BASE_URL: process.env.INFOBIP_BASE_URL,
		INFOBIP_API_KEY: process.env.INFOBIP_API_KEY,
		INFOBIP_WHATSAPP_FROM: process.env.INFOBIP_WHATSAPP_FROM,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
