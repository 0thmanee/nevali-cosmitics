import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for pure logic. Playwright e2e specs live in ./e2e and are excluded.
export default defineConfig({
	resolve: {
		alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	test: {
		include: ["src/**/*.test.ts"],
		exclude: ["e2e/**", "node_modules/**"],
		environment: "node",
		// Pure-logic tests must not require real secrets; skip env schema validation.
		env: { SKIP_ENV_VALIDATION: "true" },
	},
});
