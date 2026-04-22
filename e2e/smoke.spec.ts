import { expect, test } from "@playwright/test";

test.describe("public smoke", () => {
  test("home loads and shows CraftHouse", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CraftHouse/i);
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("cart page shows empty state with cleared storage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("crafthouse-cart-v2");
    });
    await page.goto("/cart");
    // Empty state uses a styled <p>, not a semantic heading
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("checkout redirects to cart when cart is empty", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("crafthouse-cart-v2");
    });
    await page.goto("/cart/checkout");
    await page.waitForURL("**/cart", { timeout: 15_000 });
    expect(page.url()).toMatch(/\/cart$/);
  });

  test("checkout success page renders with order id in query", async ({ page }) => {
    await page.goto("/cart/checkout/success?orderId=test-order-ref");
    await expect(page.getByRole("heading", { name: /order placed successfully/i })).toBeVisible();
    await expect(page.getByText("test-order-ref")).toBeVisible();
  });
});
