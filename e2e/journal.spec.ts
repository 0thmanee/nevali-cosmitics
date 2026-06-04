import { expect, test } from "@playwright/test";

const PUBLISHED_TITLES = [
	"How we trace argan from cooperative to bottle",
	"INCI lists for EU-conscious shoppers",
] as const;

// Distinctive fragment of the DRAFT article title that must never be public.
const DRAFT_FRAGMENT = /winter barrier/i;

test.describe("public journal", () => {
	test("lists the published articles and hides drafts", async ({ page }) => {
		await page.goto("/journal");

		for (const title of PUBLISHED_TITLES) {
			await expect(page.getByText(title, { exact: false }).first()).toBeVisible(
				{ timeout: 15_000 },
			);
		}

		// The draft article must not leak into the public list.
		await expect(page.locator("body")).not.toContainText(DRAFT_FRAGMENT);
	});

	test("opening a published article shows its title and Article JSON-LD", async ({
		page,
	}) => {
		await page.goto("/journal");

		// Click a published article link by its visible title.
		const articleLink = page
			.locator('a[href^="/journal/"]')
			.filter({ hasText: PUBLISHED_TITLES[0] })
			.first();
		await expect(articleLink).toBeVisible({ timeout: 15_000 });
		await articleLink.click();

		await page.waitForURL(/\/journal\/[^/]+$/, { timeout: 15_000 });

		// The article title is rendered on the detail page (e.g. a heading).
		await expect(page.locator("body")).toContainText(PUBLISHED_TITLES[0], {
			timeout: 15_000,
		});

		// Article JSON-LD structured data should be present in the document.
		const jsonLd = page.locator('script[type="application/ld+json"]');
		await expect(jsonLd.first()).toHaveCount(1, { timeout: 15_000 });
		const blob = (await jsonLd.allTextContents()).join("\n");
		expect(blob).toMatch(/"@type"\s*:\s*"Article"/);
		expect(blob).toMatch(/schema\.org/);
	});

	test("article detail exposes canonical and og:title metadata", async ({
		page,
	}) => {
		// Independently navigate to a published article from the list.
		await page.goto("/journal");
		const articleLink = page
			.locator('a[href^="/journal/"]')
			.filter({ hasText: PUBLISHED_TITLES[1] })
			.first();
		await expect(articleLink).toBeVisible({ timeout: 15_000 });
		await articleLink.click();
		await page.waitForURL(/\/journal\/[^/]+$/, { timeout: 15_000 });

		// Canonical link pointing at the journal article.
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveCount(1);
		await expect(canonical).toHaveAttribute("href", /\/journal\//);

		// Open Graph title meta.
		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveCount(1);
		const ogTitleContent = await ogTitle.getAttribute("content");
		expect((ogTitleContent ?? "").length).toBeGreaterThan(0);
	});
});
