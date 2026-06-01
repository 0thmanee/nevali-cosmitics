import * as Sentry from "@sentry/nextjs";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { installPgSslWarningFilter } = await import(
			"./instrumentation.node"
		);
		installPgSslWarningFilter();
	}

	// Server + edge error reporting. No-ops cleanly when SENTRY_DSN is unset.
	const dsn = process.env.SENTRY_DSN;
	if (dsn) {
		Sentry.init({
			dsn,
			enabled: process.env.NODE_ENV === "production",
			tracesSampleRate: 0.1,
		});
	}
}

// Captures errors thrown in nested React Server Components (Next.js onRequestError hook).
export const onRequestError = Sentry.captureRequestError;
