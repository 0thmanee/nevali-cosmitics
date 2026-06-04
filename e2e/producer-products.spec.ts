import { expect, type Locator, type Page, test } from "@playwright/test";

const PRODUCER = { email: "contact@nevali.store", password: "Password123!" };

async function login(page: Page, email: string, password: string) {
	await page.goto("/auth/login");
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);
	await page.getByRole("button", { name: /sign in/i }).click();
	await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
		timeout: 20_000,
	});
}

async function expectNoAppError(page: Page) {
	await expect(page.locator("body")).not.toContainText(
		/Application error|Something went wrong|Internal Server Error|Unhandled Runtime/i,
	);
}

/** The desktop products table is the `hidden sm:block` container. */
function desktopTable(page: Page): Locator {
	return page.locator("div.hidden.sm\\:block").first();
}

/** A row inside the desktop table that contains the given product name. */
function desktopRowByName(page: Page, name: string): Locator {
	return desktopTable(page)
		.locator("div.grid")
		.filter({ hasText: name })
		.first();
}

test.describe("producer products", () => {
	test.beforeEach(async ({ page }) => {
		await login(page, PRODUCER.email, PRODUCER.password);
	});

	test("list renders seeded products with status badges", async ({ page }) => {
		await page.goto("/artisan/products");
		await expectNoAppError(page);

		const body = page.locator("body");
		// Seeded products across statuses are listed.
		await expect(body).toContainText(/Cold-pressed argan oil/i, {
			timeout: 15_000,
		});
		await expect(body).toContainText(/Damask rose water mist/i);
		await expect(body).toContainText(/Ghassoul clay mask/i);
		await expect(body).toContainText(/Neroli night serum/i);
		await expect(body).toContainText(/Beldi black soap/i);

		// Status badges are CSS-uppercased; assert case-insensitively.
		await expect(body).toContainText(/approved/i);
		await expect(body).toContainText(/pending/i);
		await expect(body).toContainText(/rejected/i);
	});

	test("rejected product shows its rejection reason (INCI/ingredients)", async ({
		page,
	}) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Beldi black soap");
		await expect(row).toBeVisible({ timeout: 15_000 });
		// Reason text mentions the ingredient list / INCI.
		await expect(row).toContainText(/INCI|ingredient/i);
	});

	test("low-stock product shows a Low stock badge", async ({ page }) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Ghassoul clay mask");
		await expect(row).toBeVisible({ timeout: 15_000 });
		await expect(row).toContainText(/low stock/i);
	});

	test("stock toggle flips In stock / Out of stock", async ({ page }) => {
		await page.goto("/artisan/products");
		// Scope to the desktop row to avoid the duplicate mobile copy.
		const row = desktopRowByName(page, "Damask rose water mist");
		await expect(row).toBeVisible({ timeout: 15_000 });

		const toggle = row
			.getByRole("button", { name: /in stock|out of stock/i })
			.first();
		await expect(toggle).toBeVisible();

		const before = (await toggle.textContent())?.trim() ?? "";
		await toggle.click();

		// The label flips after the mutation resolves; poll until it changes.
		await expect
			.poll(async () => (await toggle.textContent())?.trim() ?? "", {
				timeout: 15_000,
			})
			.not.toBe(before);
	});

	test("featured argan oil shows Remove from homepage toggle", async ({
		page,
	}) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Cold-pressed argan oil");
		await expect(row).toBeVisible({ timeout: 15_000 });
		// The featured-on-home approved product exposes the remove control.
		await expect(
			row.getByRole("button", { name: /remove from homepage/i }),
		).toBeVisible();
	});

	test("duplicate opens an edit page with a (copy) name", async ({ page }) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Damask rose water mist");
		await expect(row).toBeVisible({ timeout: 15_000 });

		await row
			.getByRole("button", { name: /duplicate/i })
			.first()
			.click();
		await page.waitForURL(/\/artisan\/products\/[^/]+\/edit/, {
			timeout: 20_000,
		});

		const nameInput = page.locator("#product-name").first();
		await expect(nameInput).toBeVisible();
		await expect.poll(async () => nameInput.inputValue()).toMatch(/\(copy\)/i);
	});

	test("create form shows humanized labels and hides jargon", async ({
		page,
	}) => {
		await page.goto("/artisan/products/new");
		await expectNoAppError(page);
		const body = page.locator("body");

		// Humanized labels (case-insensitive).
		await expect(body).toContainText(/size \/ variant/i, { timeout: 15_000 });
		await expect(body).toContainText(/units in stock/i);
		await expect(body).toContainText(/profit per item/i);
		await expect(body).toContainText(/minimum order/i);
		await expect(body).toContainText(/what this costs you/i);

		// No jargon should leak into the UI.
		await expect(body).not.toContainText(/COGS/);
		await expect(body).not.toContainText(/Packaging name/i);
		await expect(body).not.toContainText(/Quantity on hand/i);
		await expect(body).not.toContainText(/Net per item/i);
		await expect(body).not.toContainText(/MOQ note/i);
	});

	test("create form exposes the expected field selectors", async ({ page }) => {
		await page.goto("/artisan/products/new");

		// `.first()` throughout: under `next dev --turbo` the create form can
		// transiently double-mount when reached right after other form-heavy tests;
		// a production `next start` renders it once. We target the first (real) copy.
		await expect(page.locator("#product-name").first()).toBeVisible({
			timeout: 15_000,
		});
		// Category is a free text input backed by a datalist.
		const category = page.locator("#product-category").first();
		await expect(category).toBeVisible();
		await expect(category).toHaveAttribute(
			"list",
			"cosmetics-category-suggestions",
		);

		// Variant size/name input placeholder hints at "100 ml" / "bottle".
		await expect(
			page
				.locator(
					'input[placeholder*="100 ml" i], input[placeholder*="bottle" i]',
				)
				.first(),
		).toBeVisible();

		// Price input uses inputmode decimal.
		await expect(
			page.locator('input[inputmode="decimal"]').first(),
		).toBeVisible();

		// Unit field is backed by a datalist of suggestions.
		await expect(
			page.locator("#variant-unit-suggestions").first(),
		).toBeAttached();
	});

	test("can create a product and return to the products list", async ({
		page,
	}) => {
		await page.goto("/artisan/products/new");

		const uniqueName = `E2E Botanical Oil ${Date.now()}`;
		await page.locator("#product-name").first().fill(uniqueName);
		await page.locator("#product-category").first().fill("Botanical oils");

		// First variant: size/name + a price.
		await page
			.locator('input[placeholder*="100 ml" i], input[placeholder*="bottle" i]')
			.first()
			.fill("100 ml bottle");
		await page.locator('input[inputmode="decimal"]').first().fill("120.00");

		await page
			.getByRole("button", { name: /create product/i })
			.first()
			.click();
		await page.waitForURL("**/artisan/products", { timeout: 30_000 });
		await expectNoAppError(page);
		await expect(page.locator("body")).toContainText(uniqueName, {
			timeout: 15_000,
		});
	});

	test("draft autosave can be recovered and discarded", async ({ page }) => {
		await page.goto("/artisan/products/new");

		const uniqueName = `E2E Draft ${Date.now()}`;
		// `.first()`: in dev (Fast Refresh) the form can transiently double-mount when
		// navigated to right after another product test; production renders it once.
		await page.locator("#product-name").first().fill(uniqueName);
		// Debounce is ~600ms; give the autosave time to persist before reload.
		await expect
			.poll(
				async () =>
					page.evaluate(() =>
						window.localStorage.getItem("nevali:product-draft:create"),
					),
				{ timeout: 5_000 },
			)
			.toContain("E2E Draft");

		await page.reload();

		// A recovery notice appears with a discard control.
		await expect(page.locator("body")).toContainText(
			/recovered|unsaved draft|brouillon/i,
			{ timeout: 15_000 },
		);
		const discard = page.getByRole("button", { name: /discard/i }).first();
		await expect(discard).toBeVisible();
		await discard.click();

		// The notice disappears after discarding.
		await expect(page.locator("body")).not.toContainText(
			/recovered|unsaved draft|brouillon/i,
		);
	});

	test("create form validates the required name", async ({ page }) => {
		await page.goto("/artisan/products/new");
		await page
			.getByRole("button", { name: /create product/i })
			.first()
			.click();
		await expect(page.locator("body")).toContainText(/required/i, {
			timeout: 15_000,
		});
	});

	test("editing the argan oil saves and navigates to the detail page", async ({
		page,
	}) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Cold-pressed argan oil");
		await expect(row).toBeVisible({ timeout: 15_000 });

		await row
			.getByRole("link", { name: /^edit$/i })
			.first()
			.click();
		await page.waitForURL(/\/artisan\/products\/[^/]+\/edit/, {
			timeout: 20_000,
		});

		const nameInput = page.locator("#product-name").first();
		await expect(nameInput).toBeVisible();
		const current = await nameInput.inputValue();
		// Append a marker so the value definitely changes (idempotent across runs).
		const updated = current.includes("[e2e]") ? current : `${current} [e2e]`;
		await nameInput.fill(updated);

		await page
			.getByRole("button", { name: /save changes/i })
			.first()
			.click();
		// Save navigates to the producer detail page (no /edit suffix).
		await page.waitForURL(/\/artisan\/products\/[^/]+$/, { timeout: 30_000 });
		await expectNoAppError(page);
	});

	test("producer detail view uses humanized economics wording", async ({
		page,
	}) => {
		await page.goto("/artisan/products");
		const row = desktopRowByName(page, "Cold-pressed argan oil");
		await expect(row).toBeVisible({ timeout: 15_000 });

		await row
			.getByRole("link", { name: /^view$/i })
			.first()
			.click();
		await page.waitForURL(/\/artisan\/products\/[^/]+$/, { timeout: 20_000 });
		await expectNoAppError(page);

		const body = page.locator("body");
		// Humanized economics section + column labels.
		await expect(body).toContainText(/your costs & profit|profit/i, {
			timeout: 15_000,
		});
		await expect(body).toContainText(/cost\/item/i);
		await expect(body).toContainText(/profit\/item/i);

		// No jargon.
		await expect(body).not.toContainText(/COGS/);
		await expect(body).not.toContainText(/Net\/item/i);
	});
});
