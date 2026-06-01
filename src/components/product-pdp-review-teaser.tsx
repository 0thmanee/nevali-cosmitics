"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
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
				const res = await fetch(
					`/api/products/${productId}/reviews?stats=true`,
				);
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
		return <div aria-hidden className="h-4 w-32 bg-cream-dark/30" />;
	}

	if (!stats || stats.totalReviews === 0) {
		return (
			<a
				className="font-sans text-text-muted text-xs hover:text-text-dark"
				href="#reviews"
			>
				No reviews yet
			</a>
		);
	}

	const rounded = Math.round(stats.averageRating * 10) / 10;

	return (
		<a
			className="inline-flex flex-wrap items-center gap-2 font-sans text-text-dark text-xs hover:opacity-80"
			href="#reviews"
		>
			<span aria-hidden className="flex items-center gap-px">
				{[0, 1, 2, 3, 4].map((i) => (
					<Star
						className={
							i < Math.round(stats.averageRating)
								? "fill-neutral-700 text-neutral-700"
								: "fill-transparent text-cream-dark"
						}
						key={i}
						size={12}
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
