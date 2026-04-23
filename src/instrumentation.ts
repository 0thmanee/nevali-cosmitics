export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  const { installPgSslWarningFilter } = await import("./instrumentation.node");
  installPgSslWarningFilter();
}
