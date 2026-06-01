/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// Content-Security-Policy. Kept intentionally permissive for scripts/styles because
// the Next.js App Router emits inline bootstrap scripts and the UI uses inline styles
// heavily; the strong clickjacking/sniffing protections come from the headers below.
// connect-src allowlists Supabase (storage/images) and Sentry ingest.
const cspDirectives = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https:",
	"font-src 'self' data:",
	"connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io https://*.sentry.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: cspDirectives },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "SAMEORIGIN" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

/** @type {import("next").NextConfig} */
const config = {
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
	async redirects() {
		return [
			{ source: "/producer", destination: "/artisan", permanent: true },
			{
				source: "/producer/:path*",
				destination: "/artisan/:path*",
				permanent: true,
			},
		];
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "6mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default config;
