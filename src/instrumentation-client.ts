import * as Sentry from "@sentry/nextjs";

// Browser error reporting. No-ops cleanly when NEXT_PUBLIC_SENTRY_DSN is unset.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
	Sentry.init({
		dsn,
		enabled: process.env.NODE_ENV === "production",
		tracesSampleRate: 0.1,
		replaysSessionSampleRate: 0,
		replaysOnErrorSampleRate: 0,
	});
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
