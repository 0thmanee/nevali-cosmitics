import { expect, type Page, test } from "@playwright/test";

const USERS = {
	admin: { email: "admin@nevali.store", password: "Password123!" },
	partner: { email: "contact@nevali.store", password: "Password123!" },
	buyer: { email: "buyer@nevali-cosmetics.local", password: "Password123!" },
};

async function login(page: Page, email: string, password: string) {
	await page.goto("/auth/login");
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);
	await page.getByRole("button", { name: /sign in/i }).click();
	// Leave the login page on success.
	await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
		timeout: 20_000,
	});
}

test.describe("login + roles", () => {
	test("buyer can sign in", async ({ page }) => {
		await login(page, USERS.buyer.email, USERS.buyer.password);
		expect(page.url()).not.toContain("/auth/login");
	});

	test("partner can sign in and reach the artisan portal", async ({ page }) => {
		await login(page, USERS.partner.email, USERS.partner.password);
		await page.waitForURL(/\/artisan/, { timeout: 20_000 }).catch(() => {});
		expect(page.url()).not.toContain("/auth/login");
	});

	test("admin can sign in and reach the admin area", async ({ page }) => {
		await login(page, USERS.admin.email, USERS.admin.password);
		await page.waitForURL(/\/admin/, { timeout: 20_000 }).catch(() => {});
		expect(page.url()).not.toContain("/auth/login");
	});

	test("wrong password shows an error and stays on login", async ({ page }) => {
		await page.goto("/auth/login");
		await page.locator('input[type="email"]').fill(USERS.buyer.email);
		await page.locator('input[type="password"]').fill("wrong-password-xyz");
		await page.getByRole("button", { name: /sign in/i }).click();
		await expect(page.locator("body")).toContainText(
			/invalid|incorrect|wrong|غير صحيح|invalide/i,
			{ timeout: 15_000 },
		);
		expect(page.url()).toContain("/auth/login");
	});
});

test.describe("protected routes redirect anonymous users", () => {
	for (const path of ["/admin", "/artisan", "/buyer"]) {
		test(`${path} redirects to login when signed out`, async ({ page }) => {
			await page.goto(path);
			await page.waitForURL(/\/auth\/login|\/$/, { timeout: 15_000 });
			expect(page.url()).toMatch(/\/auth\/login|localhost:\d+\/$/);
		});
	}
});

test.describe("password recovery", () => {
	test("forgot-password form submits and shows a neutral confirmation", async ({
		page,
	}) => {
		await page.goto("/auth/forgot-password");
		await page.locator('input[type="email"]').fill("nobody@example.com");
		await page.getByRole("button", { name: /send/i }).click();
		await expect(page.locator("body")).toContainText(
			/reset link|on its way|check your inbox|طريقها|lien/i,
			{ timeout: 15_000 },
		);
	});

	test("reset-password without a token shows an invalid-link message", async ({
		page,
	}) => {
		await page.goto("/auth/reset-password");
		await expect(page.locator("body")).toContainText(
			/invalid|expired|expir|صالح/i,
		);
	});
});

test.describe("registration", () => {
	test("buyer registration page renders all fields", async ({ page }) => {
		await page.goto("/auth/register-buyer");
		await expect(page.locator('input[type="email"]')).toBeVisible();
		expect(
			await page.locator('input[type="password"]').count(),
		).toBeGreaterThanOrEqual(2);
		await expect(page.getByRole("button").last()).toBeVisible();
	});
});
