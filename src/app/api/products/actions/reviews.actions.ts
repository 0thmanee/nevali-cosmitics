"use server";

import { createProductReviewRepo } from "~/app/api/products/repo/reviews.repo";
import { createProductReviewSchema, type CreateProductReviewInput } from "~/app/api/products/schemas/reviews.schema";

/**
 * Server action to create a product review.
 * No authentication required - guests can submit reviews.
 */
export async function createProductReview(input: CreateProductReviewInput) {
  const validated = createProductReviewSchema.parse(input);
  const review = await createProductReviewRepo(validated);
  return review;
}
