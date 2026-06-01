import * as Sentry from "@sentry/nextjs";

/**
 * Central error reporter. Forwards to Sentry (a no-op until a DSN is configured in
 * instrumentation) and logs to the console in development. Safe to call from client
 * and server components.
 */
export function reportError(
	error: unknown,
	context?: Record<string, unknown>,
): void {
	try {
		Sentry.captureException(error, context ? { extra: context } : undefined);
	} catch {
		// never let reporting throw
	}
	if (process.env.NODE_ENV !== "production") {
		// eslint-disable-next-line no-console
		console.error("[reportError]", error, context ?? "");
	}
}
