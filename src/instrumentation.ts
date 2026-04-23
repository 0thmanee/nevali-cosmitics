export async function register() {
  // Bundled for Edge + Node; `process.emitWarning` is Node-only. In dev, `NEXT_RUNTIME` may be unset (still Node).
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  // Suppress pg SSL mode alias warning — informational only; clutters the dev overlay.
  const _emitWarning = process.emitWarning.bind(process);
  process.emitWarning = (warning: string | Error, ...args: unknown[]) => {
    const msg = typeof warning === "string" ? warning : warning?.message ?? "";
    if (msg.includes("ssl modes")) return;
    return (_emitWarning as (...a: unknown[]) => void)(warning, ...args);
  };
}
