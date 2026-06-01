import { expect, test } from "@playwright/test";

// These pages are pure client forms (no DB), safe to run without a seeded database.
test.describe("auth recovery pages", () => {
	test("forgot-password page renders the request form", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await expect(page.getByRole("button", { name: /send/i })).toBeVisible();
		await expect(page.locator('input[type="email"]')).toBeVisible();
	});

	test("reset-password without a token shows an invalid-link message", async ({
		page,
	}) => {
		await page.goto("/auth/reset-password");
		await expect(page.getByText(/invalid|expired|expir|صالح/i)).toBeVisible();
	});

	test("login page links to forgot-password", async ({ page }) => {
		await page.goto("/auth/login");
		const link = page.getByRole("link", { name: /forgot/i });
		await expect(link).toBeVisible();
		await link.click();
		await page.waitForURL("**/auth/forgot-password", { timeout: 15_000 });
	});
});

test.describe("not-found", () => {
	test("unknown route renders the 404 page", async ({ page }) => {
		await page.goto("/this-route-does-not-exist-xyz");
		await expect(
			page.getByText(/not found|introuvable|غير موجودة/i),
		).toBeVisible();
	});
});
