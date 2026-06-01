import type { MetadataRoute } from "next";
import { listPublishedArticlesForSitemapRepo } from "~/app/api/articles/repo/articles.repo";
import { listPublicPartnersRepo } from "~/app/api/partners/repo/partners.repo";
import { listApprovedProductsForSitemapRepo } from "~/app/api/products/repo/products.repo";
import { siteUrl } from "~/lib/site-url";

export const dynamic = "force-dynamic";

const STATIC_PATHS: {
	path: string;
	priority: number;
	changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
	{ path: "/", priority: 1, changeFrequency: "daily" },
	{ path: "/products", priority: 0.9, changeFrequency: "daily" },
	{ path: "/artisans", priority: 0.7, changeFrequency: "weekly" },
	{ path: "/journal", priority: 0.6, changeFrequency: "weekly" },
	{ path: "/artisan-process", priority: 0.5, changeFrequency: "monthly" },
	{ path: "/contact", priority: 0.4, changeFrequency: "yearly" },
	{ path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
	{ path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = siteUrl();
	const now = new Date();

	const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((s) => ({
		url: `${base}${s.path}`,
		lastModified: now,
		changeFrequency: s.changeFrequency,
		priority: s.priority,
	}));

	// Dynamic entries are best-effort: a DB hiccup must not break the sitemap.
	try {
		const products = await listApprovedProductsForSitemapRepo();
		for (const p of products) {
			entries.push({
				url: `${base}/products/${p.id}`,
				lastModified: p.updatedAt,
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	} catch {
		/* skip products on error */
	}

	try {
		const articles = await listPublishedArticlesForSitemapRepo();
		for (const a of articles) {
			entries.push({
				url: `${base}/journal/${a.id}`,
				lastModified: a.publishedAt,
				changeFrequency: "monthly",
				priority: 0.5,
			});
		}
	} catch {
		/* skip articles on error */
	}

	try {
		const partners = await listPublicPartnersRepo();
		const slugs = new Set<string>();
		for (const partner of partners) {
			for (const m of partner.members) {
				if (m.organization.slug) slugs.add(m.organization.slug);
			}
		}
		for (const slug of slugs) {
			entries.push({
				url: `${base}/artisans/${slug}`,
				lastModified: now,
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}
	} catch {
		/* skip partners on error */
	}

	return entries;
}
