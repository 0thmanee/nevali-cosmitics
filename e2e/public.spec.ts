import { expect, test } from "@playwright/test";

const PUBLIC_PAGES: { path: string; expect: RegExp }[] = [
  { path: "/", expect: /nevali/i },
  { path: "/products", expect: /products|catalog|marketplace/i },
  { path: "/journal", expect: /journal/i },
  { path: "/artisans", expect: /studio|brands|artisan/i },
  { path: "/artisan-process", expect: /process|supply|impact|story/i },
  { path: "/contact", expect: /contact/i },
  { path: "/privacy", expect: /privacy/i },
  { path: "/terms", expect: /terms/i },
];

test.describe("public pages render", () => {
  for (const p of PUBLIC_PAGES) {
    test(`GET ${p.path} renders`, async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status(), `status for ${p.path}`).toBeLessThan(400);
      await expect(page.locator("body")).toContainText(p.expect);
    });
  }
});

test.describe("SEO surfaces", () => {
  test("sitemap.xml lists product + journal URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toMatch(/\/products\//);
  });

  test("robots.txt references the sitemap and disallows private areas", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/sitemap/i);
    expect(body).toMatch(/disallow/i);
    expect(body).toMatch(/\/admin/);
  });

  test("home has Organization JSON-LD", async ({ page }) => {
    await page.goto("/");
    const ld = page.locator('script[type="application/ld+json"]');
    expect(await ld.count()).toBeGreaterThan(0);
    const json = await ld.first().textContent();
    expect(json).toMatch(/schema\.org/);
  });

  test("product detail has canonical + OG + Product JSON-LD", async ({
    page,
  }) => {
    await page.goto("/products");
    await page.locator('a[href^="/products/"]').first().click();
    await page.waitForURL("**/products/**");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(
      page.locator('meta[property="og:title"]'),
    ).toHaveCount(1);
    const ld = page.locator('script[type="application/ld+json"]');
    const texts = await ld.allTextContents();
    expect(texts.some((t) => /"@type"\s*:\s*"Product"/.test(t))).toBe(true);
  });
});

test.describe("security headers", () => {
  test("home responses carry CSP + hardening headers", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toBeTruthy();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBeTruthy();
    expect(h["referrer-policy"]).toBeTruthy();
  });
});

test.describe("i18n + RTL", () => {
  test("Arabic locale sets dir=rtl and translates the home page", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "NEVALI_LOCALE",
        value: "ar",
        url: "http://localhost:3001",
      },
    ]);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });

  test("French locale renders LTR French", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "NEVALI_LOCALE",
        value: "fr",
        url: "http://localhost:3001",
      },
    ]);
    await page.goto("/products");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });
});

test.describe("error handling", () => {
  test("unknown route renders the 404 page", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-real-page-zzz");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).toContainText(
      /not found|introuvable|غير موجودة/i,
    );
  });
});
