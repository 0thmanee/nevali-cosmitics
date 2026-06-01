"use server";

import { getProducerOrgId } from "~/app/api/producer-context";
import type {
	ProducerArticlePublicCard,
	ProducerArticlePublicView,
	ProducerArticleRow,
} from "./articles.types";
import {
	createArticleRepo,
	deleteArticleRepo,
	getArticleByIdForOrgRepo,
	getPublishedArticleByIdRepo,
	listArticlesByOrgRepo,
	listPublishedArticlesForHomeRepo,
	updateArticleRepo,
} from "./repo/articles.repo";
import type {
	CreateProducerArticleInput,
	UpdateProducerArticleInput,
} from "./schemas/article.schema";
import {
	createProducerArticleSchema,
	updateProducerArticleSchema,
} from "./schemas/article.schema";

function publishedAtForStatus(
	prevPublishedAt: Date | null | undefined,
	status: "DRAFT" | "PUBLISHED",
): Date | null {
	if (status === "DRAFT") return null;
	return prevPublishedAt ?? new Date();
}

export async function listMyArticles(): Promise<ProducerArticleRow[]> {
	const orgId = await getProducerOrgId();
	if (!orgId) return [];
	return listArticlesByOrgRepo(orgId);
}

export async function listPublishedArticlesForHome(
	take = 6,
): Promise<ProducerArticlePublicCard[]> {
	return listPublishedArticlesForHomeRepo(take);
}

export async function getMyArticle(
	id: string,
): Promise<ProducerArticleRow | null> {
	const orgId = await getProducerOrgId();
	if (!orgId) return null;
	return getArticleByIdForOrgRepo(id, orgId);
}

export async function getPublishedArticle(
	id: string,
): Promise<ProducerArticlePublicView | null> {
	const row = await getPublishedArticleByIdRepo(id);
	if (!row?.publishedAt) return null;
	return row as ProducerArticlePublicView;
}

export async function createArticle(
	data: CreateProducerArticleInput,
): Promise<ProducerArticleRow> {
	const orgId = await getProducerOrgId();
	if (!orgId) throw new Error("You must belong to an organization.");
	const parsed = createProducerArticleSchema.parse(data);
	const publishedAt = publishedAtForStatus(null, parsed.status);
	return createArticleRepo({
		organizationId: orgId,
		title: parsed.title,
		tag: parsed.tag?.trim() ? parsed.tag.trim() : null,
		excerpt: parsed.excerpt?.trim() ? parsed.excerpt.trim() : null,
		body: parsed.body,
		coverGradient: parsed.coverGradient,
		coverImageUrl: parsed.coverImageUrl,
		status: parsed.status,
		publishedAt,
	});
}

export async function updateArticle(
	data: UpdateProducerArticleInput,
): Promise<ProducerArticleRow> {
	const orgId = await getProducerOrgId();
	if (!orgId) throw new Error("You must belong to an organization.");
	const parsed = updateProducerArticleSchema.parse(data);
	const existing = await getArticleByIdForOrgRepo(parsed.id, orgId);
	if (!existing) throw new Error("Article not found.");
	const publishedAt = publishedAtForStatus(existing.publishedAt, parsed.status);
	return updateArticleRepo({
		id: parsed.id,
		organizationId: orgId,
		title: parsed.title,
		tag: parsed.tag?.trim() ? parsed.tag.trim() : null,
		excerpt: parsed.excerpt?.trim() ? parsed.excerpt.trim() : null,
		body: parsed.body,
		coverGradient: parsed.coverGradient,
		coverImageUrl: parsed.coverImageUrl,
		status: parsed.status,
		publishedAt,
	});
}

export async function deleteArticle(id: string): Promise<void> {
	const orgId = await getProducerOrgId();
	if (!orgId) throw new Error("You must belong to an organization.");
	await deleteArticleRepo(id, orgId);
}
