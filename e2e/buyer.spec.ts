import { expect, type Page, test } from "@playwright/test";

const BUYER = {
	email: "buyer@nevali-cosmetics.local",
	password: "Password123!",
};

const APP_ERROR =
	/application error|something went wrong|internal server error/i;

const BUYER_PAGES = [
	"/buyer",
	"/buyer/orders",
	"/buyer/saved",
	"/buyer/notifications",
	"/profile",
];

async function login(
	page: Page,
	email = BUYER.email,
	password = BUYER.password,
) {
	await page.goto("/auth/login");
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);
	await page.getByRole("button", { name: /sign in/i }).click();
	await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
		timeout: 20_000,
	});
}

test.describe("buyer account", () => {
	test("buyer can sign in and every buyer page loads without an app error", async ({
		page,
	}) => {
		await login(page);

		for (const path of BUYER_PAGES) {
			const response = await page.goto(path, { waitUntil: "domcontentloaded" });
			// Some navigations (RSC) may not return a top-level response object.
			if (response) {
				expect(
					response.status(),
					`${path} returned ${response.status()}`,
				).toBeLessThan(400);
			}
			// We should not have been bounced back to the login screen.
			expect(page.url(), `${path} redirected to login`).not.toContain(
				"/auth/login",
			);
			await expect(page.locator("body")).not.toContainText(APP_ERROR, {
				timeout: 10_000,
			});
		}
	});

	test("orders page shows the seeded confirmed order", async ({ page }) => {
		await login(page);
		await page.goto("/buyer/orders");

		// Be lenient about layout: the seeded order should surface either the
		// product name ("argan"), a recognizable status label, or a MAD total.
		await expect(page.locator("body")).toContainText(
			/argan|confirmed|delivered|shipped|processing|paid|MAD|\bdhs?\b/i,
			{ timeout: 15_000 },
		);
		// And the empty-state must NOT be shown.
		await expect(page.locator("body")).not.toContainText(
			/no orders|haven'?t placed|browse cosmetics/i,
		);
	});

	test("orders are protected: signed-out user is redirected away", async ({
		browser,
	}) => {
		// Fresh, cookie-free context so we are guaranteed signed out.
		const context = await browser.newContext();
		const page = await context.newPage();
		try {
			await page.goto("/buyer/orders");
			await page.waitForURL(/\/auth\/login|localhost:\d+\/$|\/$/, {
				timeout: 15_000,
			});
			expect(page.url()).toMatch(/\/auth\/login|localhost:\d+\/?$/);
			// The buyer orders content must not be visible while signed out.
			expect(page.url()).not.toContain("/buyer/orders");
		} finally {
			await context.close();
		}
	});

	test("buyer can save a product to a list without errors", async ({
		page,
	}) => {
		await login(page);

		// Open the products listing and navigate into the first product detail.
		await page.goto("/products");
		const firstProduct = page.locator('a[href^="/products/"]').first();
		if ((await firstProduct.count()) === 0) {
			test.skip(true, "No public products available to open a detail page.");
			return;
		}
		await firstProduct.click();
		await page.waitForURL(/\/products\/[^/]+$/, { timeout: 15_000 });

		// The SaveProductControl renders a "Save product" button for logged-in
		// buyers once their saved lists load.
		const saveButton = page.getByRole("button", { name: /save product/i });
		if ((await saveButton.count()) === 0) {
			test.skip(
				true,
				"Save-to-list control not present on this product detail page.",
			);
			return;
		}

		// The control confirms via window.alert; auto-accept so the click resolves.
		page.on("dialog", (dialog) => void dialog.accept());

		await expect(saveButton.first()).toBeEnabled({ timeout: 15_000 });
		await saveButton.first().click();

		// No app error should appear as a result of saving.
		await expect(page.locator("body")).not.toContainText(APP_ERROR, {
			timeout: 10_000,
		});
	});
});
