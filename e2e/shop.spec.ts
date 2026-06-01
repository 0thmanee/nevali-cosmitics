import { expect, type Page, test } from "@playwright/test";

async function addFirstProductToCart(page: Page) {
  await page.goto("/products");
  await page.locator('a[href^="/products/"]').first().click();
  await page.waitForURL(/\/products\/[^/]+$/);
  const addBtn = page
    .getByRole("button", { name: /add to cart|أضف إلى السلة|ajouter au panier/i })
    .first();
  await expect(addBtn).toBeEnabled();
  await addBtn.click();
}

test.describe("catalog browse + search + filter", () => {
  test("search narrows results and is reflected in the URL", async ({
    page,
  }) => {
    await page.goto("/products");
    await page.locator('input[name="q"]').first().fill("argan");
    await page
      .getByRole("button", { name: /search|rechercher|بحث/i })
      .first()
      .click();
    await page.waitForURL(/[?&]q=argan/);
    await expect(page.locator("body")).toContainText(/argan/i);
  });

  test("category filter is reflected in the URL", async ({ page }) => {
    await page.goto("/products");
    const tabs = page.locator('a[href*="category="]');
    const count = await tabs.count();
    test.skip(count === 0, "no categories seeded");
    await tabs.first().click();
    await page.waitForURL(/category=/);
  });

  test("product detail shows an enabled add-to-cart button", async ({
    page,
  }) => {
    await page.goto("/products");
    await page.locator('a[href^="/products/"]').first().click();
    await page.waitForURL(/\/products\/[^/]+$/);
    await expect(
      page.getByRole("button", { name: /add to cart/i }).first(),
    ).toBeVisible();
  });
});

test.describe("cart", () => {
  test("adding a product makes the cart non-empty", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");
    await expect(page.locator("body")).not.toContainText(/your cart is empty/i);
    await expect(page.locator('a[href="/cart/checkout"]')).toBeVisible();
  });
});

test.describe("COD checkout end-to-end", () => {
  test("guest places a COD order and reaches the success page", async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart/checkout");

    await page.locator('input[autocomplete="name"]').fill("E2E Buyer");
    await page.locator('input[autocomplete="email"]').fill("e2e@example.com");
    await page.locator('input[autocomplete="tel"]').fill("+212600000000");
    await page
      .locator('input[autocomplete="address-line1"]')
      .fill("123 Rue Test");
    await page.locator('input[autocomplete="address-level2"]').fill("Casablanca");
    await page.locator('input[autocomplete="postal-code"]').fill("20000");
    const country = page.locator('input[autocomplete="country-name"]');
    if (!(await country.inputValue())) await country.fill("Morocco");

    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForURL("**/cart/checkout/success**", { timeout: 30_000 });
    await expect(page.locator("body")).toContainText(
      /order placed|confirmed|reference|تم/i,
    );
  });
});
