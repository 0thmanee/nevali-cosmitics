export type ProducerArticleStatus = "DRAFT" | "PUBLISHED";

export type ProducerArticleRow = {
	id: string;
	organizationId: string;
	title: string;
	tag: string | null;
	excerpt: string | null;
	body: string;
	coverGradient: string;
	coverImageUrl: string | null;
	status: string;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ProducerArticlePublicCard = {
	id: string;
	title: string;
	tag: string | null;
	publishedAt: Date;
	coverGradient: string;
	coverImageUrl: string | null;
	organizationName: string;
};

/** Full published article for public journal detail (marketing site). */
export type ProducerArticlePublicView = {
	id: string;
	title: string;
	tag: string | null;
	excerpt: string | null;
	body: string;
	coverGradient: string;
	coverImageUrl: string | null;
	publishedAt: Date;
	organization: { name: string; slug: string };
};
