import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests assume a running Next app (or use webServer below).
 * Local: `pnpm dev` in another terminal, then `pnpm test:e2e`.
 * CI: set PLAYWRIGHT_TEST_BASE_URL or rely on webServer startup.
 */
/** Use `localhost` to match `next dev` and avoid cross-origin dev warnings. */
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
		? undefined
		: {
				command: "pnpm dev",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
				stdout: "pipe",
				stderr: "pipe",
			},
});
