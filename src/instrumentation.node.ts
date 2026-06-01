import "server-only";

/**
 * Patches `process.emitWarning` to hide noisy pg "ssl modes" alias messages in dev.
 * Lives in a `server-only` module so `instrumentation.ts` stays Edge-safe.
 */
export function installPgSslWarningFilter(): void {
	const _emitWarning = process.emitWarning.bind(process);
	process.emitWarning = (warning: string | Error, ...args: unknown[]) => {
		const msg =
			typeof warning === "string" ? warning : (warning?.message ?? "");
		if (msg.includes("ssl modes")) return;
		return (_emitWarning as (...a: unknown[]) => void)(warning, ...args);
	};
}
