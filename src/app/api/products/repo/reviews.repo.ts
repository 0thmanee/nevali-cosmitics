import type { ProductReview } from "@prisma/client";
import { prisma } from "~/lib/db";
import type {
	CreateProductReviewInput,
	ProductReviewRow,
	ProductReviewStats,
} from "../schemas/reviews.schema";

/** Order statuses that count as a genuine purchase for the verified badge. */
const VERIFIED_PURCHASE_STATUSES = ["CONFIRMED", "SHIPPED", "RETURNED"];

/** True if this email has a real (non-canceled) order containing the product. */
async function hasVerifiedPurchase(
	productId: string,
	buyerEmail: string | null | undefined,
): Promise<boolean> {
	const email = buyerEmail?.trim().toLowerCase();
	if (!email) return false;
	const count = await prisma.shopOrderLine.count({
		where: {
			productId,
			order: { buyerEmail: email, status: { in: VERIFIED_PURCHASE_STATUSES } },
		},
	});
	return count > 0;
}

/**
 * Create a new product review.
 * Guest reviews don't require authentication.
 */
export async function createProductReviewRepo(
	input: CreateProductReviewInput,
): Promise<ProductReviewRow> {
	const isVerifiedPurchase = await hasVerifiedPurchase(
		input.productId,
		input.buyerEmail,
	);
	const review = await prisma.productReview.create({
		data: {
			productId: input.productId,
			buyerName: input.buyerName,
			buyerEmail: input.buyerEmail || null,
			rating: input.rating,
			title: input.title,
			body: input.body || null,
			isVerifiedPurchase,
		},
	});

	return formatProductReviewRow(review);
}

/**
 * List reviews for a product, paginated and sorted by newest first.
 */
export async function listProductReviewsRepo(
	productId: string,
	options?: { limit?: number; offset?: number },
): Promise<ProductReviewRow[]> {
	const limit = options?.limit || 10;
	const offset = options?.offset || 0;

	const reviews = await prisma.productReview.findMany({
		where: { productId },
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: offset,
	});

	return reviews.map(formatProductReviewRow);
}

/**
 * Get review statistics for a product.
 */
export async function getProductReviewStatsRepo(
	productId: string,
): Promise<ProductReviewStats> {
	const reviews = await prisma.productReview.findMany({
		where: { productId },
		select: { rating: true },
	});

	if (reviews.length === 0) {
		return {
			totalReviews: 0,
			averageRating: 0,
			ratingDistribution: { ONE: 0, TWO: 0, THREE: 0, FOUR: 0, FIVE: 0 },
		};
	}

	const ratingValues = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as const;
	const sum = reviews.reduce((acc, r) => acc + ratingValues[r.rating], 0);
	const average = sum / reviews.length;

	const distribution = {
		ONE: reviews.filter((r) => r.rating === "ONE").length,
		TWO: reviews.filter((r) => r.rating === "TWO").length,
		THREE: reviews.filter((r) => r.rating === "THREE").length,
		FOUR: reviews.filter((r) => r.rating === "FOUR").length,
		FIVE: reviews.filter((r) => r.rating === "FIVE").length,
	};

	return {
		totalReviews: reviews.length,
		averageRating: parseFloat(average.toFixed(1)),
		ratingDistribution: distribution,
	};
}

/**
 * Increment helpful count for a review.
 */
export async function incrementReviewHelpfulRepo(
	reviewId: string,
): Promise<void> {
	await prisma.productReview.update({
		where: { id: reviewId },
		data: { helpfulCount: { increment: 1 } },
	});
}

/**
 * Delete a review (admin only, soft delete pattern could be added).
 */
export async function deleteProductReviewRepo(reviewId: string): Promise<void> {
	await prisma.productReview.delete({
		where: { id: reviewId },
	});
}

// ── Formatting ────────────────────────────────────────────────────────────────

function formatProductReviewRow(row: ProductReview): ProductReviewRow {
	return {
		id: row.id,
		productId: row.productId,
		buyerName: row.buyerName,
		buyerEmail: row.buyerEmail,
		rating: row.rating,
		title: row.title,
		body: row.body,
		isVerifiedPurchase: row.isVerifiedPurchase,
		helpfulCount: row.helpfulCount,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
