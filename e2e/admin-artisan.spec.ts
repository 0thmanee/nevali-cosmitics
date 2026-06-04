import { expect, type Page, test } from "@playwright/test";

const ADMIN = { email: "admin@nevali.store", password: "Password123!" };
const PARTNER = { email: "contact@nevali.store", password: "Password123!" };

async function login(page: Page, email: string, password: string) {
	await page.goto("/auth/login");
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);
	await page.getByRole("button", { name: /sign in/i }).click();
	await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
		timeout: 20_000,
	});
}

// Detect Next's error boundary so a 500/crash fails the test loudly.
async function expectNoAppError(page: Page) {
	await expect(page.locator("body")).not.toContainText(
		/Application error|Something went wrong|Internal Server Error|Unhandled Runtime/i,
	);
}

test.describe("admin portal", () => {
	test.beforeEach(async ({ page }) => {
		await login(page, ADMIN.email, ADMIN.password);
	});

	for (const path of [
		"/admin",
		"/admin/orders",
		"/admin/products",
		"/admin/users",
		"/admin/analytics",
		"/admin/certifications",
		"/admin/support",
		"/admin/training",
	]) {
		test(`admin page ${path} loads without crashing`, async ({ page }) => {
			const res = await page.goto(path);
			expect(res?.status() ?? 200).toBeLessThan(400);
			await expectNoAppError(page);
		});
	}
});

test.describe("artisan portal", () => {
	test.beforeEach(async ({ page }) => {
		await login(page, PARTNER.email, PARTNER.password);
	});

	for (const path of [
		"/artisan",
		"/artisan/products",
		"/artisan/orders",
		"/artisan/articles",
		"/artisan/certification",
		"/artisan/profile",
		"/artisan/notifications",
		"/artisan/support",
		"/artisan/training",
	]) {
		test(`artisan page ${path} loads without crashing`, async ({ page }) => {
			const res = await page.goto(path);
			expect(res?.status() ?? 200).toBeLessThan(400);
			await expectNoAppError(page);
		});
	}
});

test.describe("order reaches admin after a guest COD checkout", () => {
	test("placed order shows up in the admin orders list", async ({ page }) => {
		// Place an order as a guest.
		await page.goto("/products");
		await page.locator('a[href^="/products/"]').first().click();
		await page.waitForURL(/\/products\/[^/]+$/);
		await page
			.getByRole("button", { name: /add to cart|أضف|ajouter/i })
			.first()
			.click();
		await page.goto("/cart/checkout");
		// Unique buyer name so we can find this exact order in the admin list.
		const buyerName = `Admin Check ${Date.now() % 1000000}`;
		await page.locator('input[autocomplete="name"]').fill(buyerName);
		await page
			.locator('input[autocomplete="email"]')
			.fill("admin-check@example.com");
		await page.locator('input[autocomplete="tel"]').fill("+212600000001");
		await page
			.locator('input[autocomplete="address-line1"]')
			.fill("1 Admin Test St");
		await page.locator('input[autocomplete="address-level2"]').fill("Rabat");
		await page.locator('input[autocomplete="postal-code"]').fill("10000");
		const country = page.locator('input[autocomplete="country-name"]');
		if (!(await country.inputValue())) await country.fill("Morocco");
		await page.getByRole("button", { name: /place order/i }).click();
		await page.waitForURL("**/cart/checkout/success**", { timeout: 30_000 });

		// Sign in as admin and confirm the order (by unique buyer name) is visible.
		await login(page, ADMIN.email, ADMIN.password);
		await page.goto("/admin/orders");
		await expectNoAppError(page);
		await expect(page.locator("body")).toContainText(buyerName, {
			timeout: 15_000,
		});
	});

	test("admin can advance an order to SHIPPED (transition + stock + email path)", async ({
		page,
	}) => {
		// Create a fresh order to act on.
		await page.goto("/products");
		await page.locator('a[href^="/products/"]').first().click();
		await page.waitForURL(/\/products\/[^/]+$/);
		await page
			.getByRole("button", { name: /add to cart|أضف|ajouter/i })
			.first()
			.click();
		await page.goto("/cart/checkout");
		const buyerName = `Ship Test ${Date.now() % 1000000}`;
		await page.locator('input[autocomplete="name"]').fill(buyerName);
		await page
			.locator('input[autocomplete="email"]')
			.fill("ship-test@example.com");
		await page.locator('input[autocomplete="tel"]').fill("+212600000002");
		await page.locator('input[autocomplete="address-line1"]').fill("2 Ship St");
		await page.locator('input[autocomplete="address-level2"]').fill("Fes");
		await page.locator('input[autocomplete="postal-code"]').fill("30000");
		const country = page.locator('input[autocomplete="country-name"]');
		if (!(await country.inputValue())) await country.fill("Morocco");
		await page.getByRole("button", { name: /place order/i }).click();
		await page.waitForURL("**/cart/checkout/success**", { timeout: 30_000 });

		// Capture the order id from the success URL and open it directly as admin.
		const orderId = new URL(page.url()).searchParams.get("orderId");
		expect(orderId, "order id present in success URL").toBeTruthy();

		await login(page, ADMIN.email, ADMIN.password);
		await page.goto(`/admin/orders/${orderId}`);
		await expectNoAppError(page);
		await expect(page.locator("body")).toContainText(buyerName);

		// Advance status to SHIPPED via the status <select> (option value = status code).
		const select = page.locator("select").first();
		await expect(select).toBeVisible();
		await select.selectOption("SHIPPED");

		// The change fires an async server action + router.refresh(); the controlled
		// <select> only reflects SHIPPED once it has persisted. Wait for that.
		await expect(select).toHaveValue("SHIPPED", { timeout: 20_000 });

		// And confirm it survives a fresh navigation (truly persisted).
		await page.goto(`/admin/orders/${orderId}`);
		await expect(page.locator("select").first()).toHaveValue("SHIPPED");
	});
});
