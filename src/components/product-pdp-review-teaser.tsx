"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { ProductReviewStats } from "~/app/api/products/schemas/reviews.schema";

type Props = {
  productId: string;
};

export function ProductPdpReviewTeaser({ productId }: Props) {
  const [stats, setStats] = useState<ProductReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}/reviews?stats=true`);
        if (!res.ok) throw new Error("stats");
        const data = (await res.json()) as ProductReviewStats;
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return <div className="h-4 w-32 bg-cream-dark/30" aria-hidden />;
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <a href="#reviews" className="font-sans text-xs text-text-muted hover:text-text-dark">
        No reviews yet
      </a>
    );
  }

  const rounded = Math.round(stats.averageRating * 10) / 10;

  return (
    <a
      href="#reviews"
      className="inline-flex flex-wrap items-center gap-2 font-sans text-xs text-text-dark hover:opacity-80"
    >
      <span className="flex items-center gap-px" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i < Math.round(stats.averageRating)
                ? "fill-neutral-700 text-neutral-700"
                : "fill-transparent text-cream-dark"
            }
          />
        ))}
      </span>
      <span className="tabular-nums">{rounded}</span>
      <span className="text-text-muted">
        · {stats.totalReviews} review{stats.totalReviews === 1 ? "" : "s"}
      </span>
    </a>
  );
}
