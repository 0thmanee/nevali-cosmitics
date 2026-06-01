import { z } from "zod";

export const reviewRatingEnum = z.enum(["ONE", "TWO", "THREE", "FOUR", "FIVE"]);
export type ReviewRating = z.infer<typeof reviewRatingEnum>;

export const createProductReviewSchema = z.object({
	productId: z.string().cuid(),
	buyerName: z.string().min(2).max(100),
	buyerEmail: z.string().email().optional(),
	rating: reviewRatingEnum,
	title: z.string().min(3).max(200),
	body: z.string().min(10).max(5000).optional(),
});

export type CreateProductReviewInput = z.infer<
	typeof createProductReviewSchema
>;

export const productReviewRow = z.object({
	id: z.string(),
	productId: z.string(),
	buyerName: z.string(),
	buyerEmail: z.string().nullable(),
	rating: reviewRatingEnum,
	title: z.string(),
	body: z.string().nullable(),
	isVerifiedPurchase: z.boolean(),
	helpfulCount: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type ProductReviewRow = z.infer<typeof productReviewRow>;

export const productReviewListSchema = z.array(productReviewRow);

export type ProductReviewList = z.infer<typeof productReviewListSchema>;

// Summary stats for a product's reviews
export const productReviewStatsSchema = z.object({
	totalReviews: z.number().int(),
	averageRating: z.number().min(0).max(5),
	ratingDistribution: z.object({
		ONE: z.number().int(),
		TWO: z.number().int(),
		THREE: z.number().int(),
		FOUR: z.number().int(),
		FIVE: z.number().int(),
	}),
});

export type ProductReviewStats = z.infer<typeof productReviewStatsSchema>;
