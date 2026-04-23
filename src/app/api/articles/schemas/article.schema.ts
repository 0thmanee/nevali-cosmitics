import { z } from "zod";

export const producerArticleStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const createProducerArticleSchema = z.object({
	title: z.string().trim().min(1, "Title is required").max(200),
	tag: z.string().trim().max(60).optional().nullable(),
	excerpt: z.string().trim().max(800).optional().nullable(),
	body: z.string().trim().min(1, "Body is required").max(50_000),
	coverGradient: z.string().trim().min(1).max(2000),
	coverImageUrl: z.preprocess(
		(v) => (typeof v !== "string" || v.trim() === "" ? null : v.trim()),
		z
			.string()
			.max(2000)
			.nullable()
			.refine((val) => val === null || /^https:\/\//i.test(val), {
				message: "Cover image must be an https URL when set.",
			}),
	),
	status: producerArticleStatusSchema.default("DRAFT"),
});

export const updateProducerArticleSchema = createProducerArticleSchema.extend({
	id: z.string().min(1),
});

export type CreateProducerArticleInput = z.infer<typeof createProducerArticleSchema>;
export type UpdateProducerArticleInput = z.infer<typeof updateProducerArticleSchema>;
