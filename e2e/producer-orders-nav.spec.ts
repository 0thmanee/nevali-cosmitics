import { expect, type Page, test } from "@playwright/test";

/**
 * Producer portal coverage: ORDERS list + detail (status guidance), MOBILE NAV
 * drawer, dashboard getting-started visibility, and Arabic (RTL) localization.
 *
 * Selectors are intentionally resilient and case-insensitive. Each test logs in
 * on its own so they stay independent and order-agnostic — EXCEPT the final
 * status-mutating test, which is kept LAST on purpose (it advances the single
 * seeded order to SHIPPED and is documented as acceptable).
 */

const PARTNER = { email: "contact@nevali.store", password: "Password123!" };
const SEED_BUYER = "Demo Buyer";

async function login(page: Page, email: string, password: string) {
	await page.goto("/auth/login");
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);
	await page.getByRole("button", { name: /sign in/i }).click();
	await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
		timeout: 20_000,
	});
}

test.describe("producer orders, navigation, and localization", () => {
	test("orders list shows the seeded order with stats, search, and status filters", async ({
		page,
	}) => {
		await login(page, PARTNER.email, PARTNER.password);
		await page.goto("/artisan/orders");

		// The seeded order's buyer is visible.
		await expect(page.getByText(SEED_BUYER).first()).toBeVisible({
			timeout: 15_000,
		});

		// Stats row: total orders / units / revenue labels.
		const body = page.locator("body");
		await expect(body).toContainText(/total product orders|orders/i);
		await expect(body).toContainText(/units sold|units/i);
		await expect(body).toContainText(/revenue/i);

		// Search input.
		const search = page.locator('input[placeholder*="search" i]').first();
		await expect(search).toBeVisible();

		// Status filter pills: All + each status.
		await expect(
			page.getByRole("button", { name: /^all$/i }).first(),
		).toBeVisible();
		for (const status of [
			/new/i,
			/confirmed/i,
			/shipped/i,
			/canceled/i,
			/returned/i,
		]) {
			await expect(
				page.getByRole("button", { name: status }).first(),
			).toBeVisible();
		}

		// Typing "Demo" keeps the order.
		await search.fill("Demo");
		await expect(page.getByText(SEED_BUYER).first()).toBeVisible();

		// Typing "zzzz" shows the no-match message.
		await search.fill("zzzz");
		await expect(body).toContainText(/no orders match/i);

		// Reset search before exercising the status pills.
		await search.fill("");
		await expect(page.getByText(SEED_BUYER).first()).toBeVisible();

		// Status pills filter the list. We don't assume how many orders exist for
		// each status (the COD-checkout specs inject extra orders for this same
		// producer), so we use a status the seed never produces — "Returned" — to
		// prove the filter actually narrows to nothing.
		await page
			.getByRole("button", { name: /^returned$/i })
			.first()
			.click();
		await expect(body).toContainText(/no orders match/i);

		// Clicking "All" brings the seeded order back.
		await page.getByRole("button", { name: /^all$/i }).first().click();
		await expect(page.getByText(SEED_BUYER).first()).toBeVisible();
	});

	test("dashboard getting-started is hidden when products and articles exist", async ({
		page,
	}) => {
		await login(page, PARTNER.email, PARTNER.password);
		await page.goto("/artisan");

		// Wait for the dashboard to settle, then assert the first-run checklist is gone.
		await expect(page.locator("body")).toBeVisible();
		await expect(page.locator("body")).not.toContainText(
			/add your first product/i,
			{ timeout: 15_000 },
		);
	});

	test("mobile nav drawer opens, navigates to Products, and closes", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await login(page, PARTNER.email, PARTNER.password);
		await page.goto("/artisan");

		// The hamburger is visible on mobile.
		const hamburger = page.getByRole("button", { name: /open menu/i });
		await expect(hamburger).toBeVisible();

		// The desktop sidebar (the "brand portal" caption lives there) is hidden.
		await expect(page.getByText(/brand portal/i)).toBeHidden();

		// Open the drawer.
		await hamburger.click();

		// Scope to the drawer panel (the slide-over <aside>), not the page behind
		// it — the dashboard also has a "View all → /artisan/products" link, and the
		// desktop sidebar carries the same href while hidden.
		const drawer = page.locator("div.fixed.inset-0.z-50 aside");
		await expect(drawer).toBeVisible();
		const productsLink = drawer.locator('a[href="/artisan/products"]').first();
		await expect(productsLink).toBeVisible();

		// Navigate via the Products link.
		await productsLink.click();
		await page.waitForURL(/\/artisan\/products(\/|$|\?)/, { timeout: 15_000 });

		// The drawer closes on navigation: the close-menu button should be gone.
		await expect(
			page.getByRole("button", { name: /close menu/i }),
		).toBeHidden();
	});

	test("producer portal in Arabic is RTL with no English jargon leaks", async ({
		page,
		context,
	}) => {
		// Sign in first while the UI is in the default (English) locale — the login
		// button label is matched in English. Only then switch the locale cookie to
		// Arabic and load the producer page.
		await login(page, PARTNER.email, PARTNER.password);
		await context.addCookies([
			{
				name: "NEVALI_LOCALE",
				value: "ar",
				url: "http://localhost:3001",
			},
		]);
		await page.goto("/artisan/products");

		// Document direction is right-to-left in Arabic.
		await expect(page.locator("html")).toHaveAttribute("dir", "rtl", {
			timeout: 15_000,
		});

		// None of these English product/variant jargon strings should leak through.
		const bodyText = (await page.locator("body").innerText()).toLowerCase();
		for (const jargon of [
			"show for variant",
			"all variants",
			"cogs",
			"net per item",
			"in stock (buyers",
		]) {
			expect(
				bodyText.includes(jargon.toLowerCase()),
				`Arabic page should not leak English jargon: "${jargon}"`,
			).toBe(false);
		}
	});

	// ── KEEP LAST: mutates the single seeded order's status to SHIPPED. ──────────
	test("order detail shows status guidance and advances a confirmed order to shipped", async ({
		page,
	}) => {
		await login(page, PARTNER.email, PARTNER.password);
		await page.goto("/artisan/orders");

		// Open the seeded order by clicking its row link.
		const orderLink = page
			.locator('a[href^="/artisan/orders/"]')
			.filter({ hasText: SEED_BUYER })
			.first();
		await expect(orderLink).toBeVisible({ timeout: 15_000 });
		await orderLink.click();
		await page.waitForURL(/\/artisan\/orders\/[^/]+$/, { timeout: 15_000 });

		// Status <select> exists (option values are status codes).
		const select = page.locator("select").first();
		await expect(select).toBeVisible();

		// Plain-language status description line (CONFIRMED guidance mentions shipping).
		await expect(page.locator("body")).toContainText(
			/mark it shipped|confirmed this order/i,
		);

		// Primary next-step button for a CONFIRMED order.
		const nextStep = page.getByRole("button", { name: /mark as shipped/i });
		await expect(nextStep).toBeVisible();

		// Advancing fires an async server action + router.refresh(); the controlled
		// <select> only reflects SHIPPED once persisted. Wait generously.
		await nextStep.click();
		await expect(select).toHaveValue("SHIPPED", { timeout: 20_000 });
	});
});
