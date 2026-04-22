"use client";

import React, { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import type { ProductReviewRow, ProductReviewStats } from "~/app/api/products/schemas/reviews.schema";

type Props = {
  productId: string;
};

const ratingLabels: Record<string, string> = {
  ONE: "⭐",
  TWO: "⭐⭐",
  THREE: "⭐⭐⭐",
  FOUR: "⭐⭐⭐⭐",
  FIVE: "⭐⭐⭐⭐⭐",
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function ProductReviewsList({ productId }: Props) {
  const [stats, setStats] = useState<ProductReviewStats | null>(null);
  const [reviews, setReviews] = useState<ProductReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "highest" | "lowest">("recent");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, reviewsRes] = await Promise.all([
          fetch(`/api/products/${productId}/reviews?stats=true`),
          fetch(`/api/products/${productId}/reviews?limit=${limit}&offset=0`),
        ]);

        if (!statsRes.ok || !reviewsRes.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const statsData = await statsRes.json();
        const reviewsData = await reviewsRes.json();

        setStats(statsData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, limit]);

  if (loading) {
    return (
      <div className="bg-white border border-cream-dark rounded-xl p-6">
        <p className="font-sans text-sm text-text-muted">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-cream-dark rounded-xl p-6">
        <p className="font-sans text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpfulCount - a.helpfulCount;
      case "highest":
        return ratingToNumber(b.rating) - ratingToNumber(a.rating);
      case "lowest":
        return ratingToNumber(a.rating) - ratingToNumber(b.rating);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="bg-white border border-cream-dark rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-text-dark">Customer Reviews</h3>
          {stats && stats.totalReviews > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(stats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-sans text-sm text-text-dark font-semibold">
                {stats.averageRating.toFixed(1)} ({stats.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-cream-dark rounded-lg font-sans text-sm focus:outline-none focus:border-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        )}
      </div>

      {/* Rating Distribution */}
      {stats && stats.totalReviews > 0 && (
        <div className="mb-6 pb-6 border-b border-cream-dark space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const ratingKey = ["FIVE", "FOUR", "THREE", "TWO", "ONE"][5 - stars] as keyof typeof stats.ratingDistribution;
            const count = stats.ratingDistribution[ratingKey];
            const percentage = (count / stats.totalReviews) * 100;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="font-sans text-xs text-text-muted w-12">
                  {stars} <Star size={12} className="inline fill-yellow-400 text-yellow-400" />
                </span>
                <div className="flex-1 h-2 bg-cream-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-sans text-xs text-text-muted w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-sans text-text-muted">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="border-t border-cream-dark pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < ratingToNumber(review.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-sans text-xs text-text-muted">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-text-dark text-sm">
                    {review.title}
                  </h4>
                </div>
                {review.isVerifiedPurchase && (
                  <span className="bg-green-50 border border-green-200 text-green-700 font-sans text-xs font-semibold px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>

              {review.body && (
                <p className="font-sans text-sm text-text-muted mb-3 leading-relaxed">
                  {review.body}
                </p>
              )}

              <div className="flex items-center gap-3">
                <span className="font-sans text-xs text-text-muted">
                  By <span className="font-semibold">{review.buyerName}</span>
                </span>
                {review.helpfulCount > 0 && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
                  >
                    <ThumbsUp size={14} />
                    <span className="font-sans text-xs">{review.helpfulCount}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {stats && sortedReviews.length < stats.totalReviews && (
        <button
          onClick={() => setLimit((prev) => prev + 10)}
          className="w-full mt-6 px-4 py-2 border border-cream-dark text-text-dark font-sans font-semibold rounded-lg hover:bg-cream transition-colors"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}

function ratingToNumber(rating: string): number {
  const map: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return map[rating] || 0;
}
