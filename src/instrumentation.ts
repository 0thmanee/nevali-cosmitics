export async function register() {
  // Suppress pg SSL mode alias warning — it's informational only and clutters the dev overlay
  const _emitWarning = process.emitWarning.bind(process);
  process.emitWarning = (warning: string | Error, ...args: unknown[]) => {
    const msg = typeof warning === "string" ? warning : warning?.message ?? "";
    if (msg.includes("ssl modes")) return;
    return (_emitWarning as (...a: unknown[]) => void)(warning, ...args);
  };
}
