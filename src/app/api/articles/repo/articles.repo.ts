import { prisma } from "~/lib/db";
import type {
	ProducerArticlePublicCard,
	ProducerArticleRow,
} from "../articles.types";

const articleSelect = {
	id: true,
	organizationId: true,
	title: true,
	tag: true,
	excerpt: true,
	body: true,
	coverGradient: true,
	coverImageUrl: true,
	status: true,
	publishedAt: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function listArticlesByOrgRepo(
	organizationId: string,
): Promise<ProducerArticleRow[]> {
	const rows = await prisma.producerArticle.findMany({
		where: { organizationId },
		orderBy: [{ updatedAt: "desc" }],
		select: articleSelect,
	});
	return rows as ProducerArticleRow[];
}

export async function listPublishedArticlesForHomeRepo(
	take: number,
): Promise<ProducerArticlePublicCard[]> {
	const rows = await prisma.producerArticle.findMany({
		where: { status: "PUBLISHED", publishedAt: { not: null } },
		orderBy: { publishedAt: "desc" },
		take,
		select: {
			id: true,
			title: true,
			tag: true,
			publishedAt: true,
			coverGradient: true,
			coverImageUrl: true,
			organization: { select: { name: true } },
		},
	});
	return rows.map((r) => ({
		id: r.id,
		title: r.title,
		tag: r.tag,
		publishedAt: r.publishedAt!,
		coverGradient: r.coverGradient,
		coverImageUrl: r.coverImageUrl,
		organizationName: r.organization.name,
	}));
}

export async function getArticleByIdForOrgRepo(
	id: string,
	organizationId: string,
): Promise<ProducerArticleRow | null> {
	const row = await prisma.producerArticle.findFirst({
		where: { id, organizationId },
		select: articleSelect,
	});
	return (row as ProducerArticleRow | null) ?? null;
}

export async function getPublishedArticleByIdRepo(id: string) {
	return prisma.producerArticle.findFirst({
		where: { id, status: "PUBLISHED", publishedAt: { not: null } },
		select: {
			...articleSelect,
			organization: { select: { name: true, slug: true } },
		},
	});
}

export async function createArticleRepo(input: {
	organizationId: string;
	title: string;
	tag: string | null;
	excerpt: string | null;
	body: string;
	coverGradient: string;
	coverImageUrl: string | null;
	status: "DRAFT" | "PUBLISHED";
	publishedAt: Date | null;
}): Promise<ProducerArticleRow> {
	const row = await prisma.producerArticle.create({
		data: {
			organizationId: input.organizationId,
			title: input.title,
			tag: input.tag,
			excerpt: input.excerpt,
			body: input.body,
			coverGradient: input.coverGradient,
			coverImageUrl: input.coverImageUrl,
			status: input.status,
			publishedAt: input.publishedAt,
		},
		select: articleSelect,
	});
	return row as ProducerArticleRow;
}

export async function updateArticleRepo(input: {
	id: string;
	organizationId: string;
	title: string;
	tag: string | null;
	excerpt: string | null;
	body: string;
	coverGradient: string;
	coverImageUrl: string | null;
	status: "DRAFT" | "PUBLISHED";
	publishedAt: Date | null;
}): Promise<ProducerArticleRow> {
	const row = await prisma.producerArticle.update({
		where: { id: input.id, organizationId: input.organizationId },
		data: {
			title: input.title,
			tag: input.tag,
			excerpt: input.excerpt,
			body: input.body,
			coverGradient: input.coverGradient,
			coverImageUrl: input.coverImageUrl,
			status: input.status,
			publishedAt: input.publishedAt,
		},
		select: articleSelect,
	});
	return row as ProducerArticleRow;
}

export async function deleteArticleRepo(
	id: string,
	organizationId: string,
): Promise<void> {
	await prisma.producerArticle.deleteMany({
		where: { id, organizationId },
	});
}

/** Lightweight list of published article ids + publish date for sitemap generation. */
export async function listPublishedArticlesForSitemapRepo(): Promise<
	{ id: string; publishedAt: Date }[]
> {
	const rows = await prisma.producerArticle.findMany({
		where: { status: "PUBLISHED", publishedAt: { not: null } },
		select: { id: true, publishedAt: true },
		orderBy: { publishedAt: "desc" },
		take: 5000,
	});
	return rows.map((r) => ({ id: r.id, publishedAt: r.publishedAt as Date }));
}
