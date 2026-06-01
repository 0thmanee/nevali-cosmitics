import { type NextRequest, NextResponse } from "next/server";
import {
	getProductReviewStatsRepo,
	listProductReviewsRepo,
} from "../../repo/reviews.repo";
import { productReviewListSchema } from "../../schemas/reviews.schema";

/**
 * GET /api/products/[productId]/reviews
 *
 * Query params:
 * - limit: number (default 10)
 * - offset: number (default 0)
 * - stats: boolean - if true, return stats instead of reviews
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ productId: string }> },
) {
	try {
		const { productId } = await params;
		const searchParams = request.nextUrl.searchParams;
		const getStats = searchParams.get("stats") === "true";
		const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
		const offset = Number(searchParams.get("offset")) || 0;

		if (getStats) {
			const stats = await getProductReviewStatsRepo(productId);
			return NextResponse.json(stats);
		}

		const reviews = await listProductReviewsRepo(productId, { limit, offset });
		return NextResponse.json(productReviewListSchema.parse(reviews));
	} catch (error) {
		console.error("[GET /api/products/:productId/reviews]", error);
		return NextResponse.json(
			{ error: "Failed to fetch reviews" },
			{ status: 500 },
		);
	}
}
