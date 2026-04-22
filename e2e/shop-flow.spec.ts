import { expect, test } from "@playwright/test";

/**
 * Full add-to-cart → checkout requires seeded products + DB.
 * Skipped by default; enable with RUN_E2E_SHOP_FLOW=1 when DB is available.
 */
test.describe("catalog shop flow (optional)", () => {
  test.skip(
    !process.env.RUN_E2E_SHOP_FLOW,
    "Set RUN_E2E_SHOP_FLOW=1 and ensure DB has approved products with variants",
  );

  test("products catalog page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText(/Certified Marketplace/i)).toBeVisible();
  });
});
