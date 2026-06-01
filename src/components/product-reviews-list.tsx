"use client";

import { Star, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import type {
	ProductReviewRow,
	ProductReviewStats,
} from "~/app/api/products/schemas/reviews.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { interpolate } from "~/lib/i18n/interpolate";

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

function formatDate(date: Date | string, t: (key: string) => string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return t("productReviewsList.today");
	if (diffDays === 1) return t("productReviewsList.yesterday");
	if (diffDays < 7)
		return interpolate(t("productReviewsList.daysAgo"), { count: diffDays });
	if (diffDays < 30)
		return interpolate(t("productReviewsList.weeksAgo"), {
			count: Math.floor(diffDays / 7),
		});
	if (diffDays < 365)
		return interpolate(t("productReviewsList.monthsAgo"), {
			count: Math.floor(diffDays / 30),
		});
	return interpolate(t("productReviewsList.yearsAgo"), {
		count: Math.floor(diffDays / 365),
	});
}

export function ProductReviewsList({ productId }: Props) {
	const { t } = useI18n();
	const [stats, setStats] = useState<ProductReviewStats | null>(null);
	const [reviews, setReviews] = useState<ProductReviewRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<
		"recent" | "helpful" | "highest" | "lowest"
	>("recent");
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
					throw new Error(t("productReviewsList.errorFetchFailed"));
				}

				const statsData = await statsRes.json();
				const reviewsData = await reviewsRes.json();

				setStats(statsData);
				setReviews(reviewsData);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: t("productReviewsList.errorLoadFailed"),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [productId, limit]);

	if (loading) {
		return (
			<div className="rounded-sm border border-cream-dark bg-white p-6">
				<p className="font-sans text-sm text-text-muted">
					{t("productReviewsList.loading")}
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-sm border border-cream-dark bg-white p-6">
				<p className="font-sans text-red-600 text-sm">{error}</p>
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
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
		}
	});

	return (
		<div className="rounded-sm border border-cream-dark bg-white p-6">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="font-bold font-serif text-lg text-text-dark">
						{t("productReviewsList.title")}
					</h3>
					{stats && stats.totalReviews > 0 && (
						<div className="mt-2 flex items-center gap-2">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										className={
											i < Math.round(stats.averageRating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}
										key={i}
										size={16}
									/>
								))}
							</div>
							<span className="font-sans font-semibold text-sm text-text-dark">
								{interpolate(t("productReviewsList.ratingSummary"), {
									average: stats.averageRating.toFixed(1),
									count: stats.totalReviews,
								})}
							</span>
						</div>
					)}
				</div>

				{reviews.length > 0 && (
					<select
						className="rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm focus:border-primary focus:outline-none"
						onChange={(e) => setSortBy(e.target.value as any)}
						value={sortBy}
					>
						<option value="recent">{t("productReviewsList.sortRecent")}</option>
						<option value="helpful">
							{t("productReviewsList.sortHelpful")}
						</option>
						<option value="highest">
							{t("productReviewsList.sortHighest")}
						</option>
						<option value="lowest">{t("productReviewsList.sortLowest")}</option>
					</select>
				)}
			</div>

			{/* Rating Distribution */}
			{stats && stats.totalReviews > 0 && (
				<div className="mb-6 space-y-2 border-cream-dark border-b pb-6">
					{[5, 4, 3, 2, 1].map((stars) => {
						const ratingKey = ["FIVE", "FOUR", "THREE", "TWO", "ONE"][
							5 - stars
						] as keyof typeof stats.ratingDistribution;
						const count = stats.ratingDistribution[ratingKey];
						const percentage = (count / stats.totalReviews) * 100;
						return (
							<div className="flex items-center gap-2" key={stars}>
								<span className="w-12 font-sans text-text-muted text-xs">
									{stars}{" "}
									<Star
										className="inline fill-yellow-400 text-yellow-400"
										size={12}
									/>
								</span>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-light">
									<div
										className="h-full bg-primary transition-all"
										style={{ width: `${percentage}%` }}
									/>
								</div>
								<span className="w-8 text-right font-sans text-text-muted text-xs">
									{count}
								</span>
							</div>
						);
					})}
				</div>
			)}

			{/* Reviews List */}
			{sortedReviews.length === 0 ? (
				<div className="py-12 text-center">
					<p className="font-sans text-text-muted">
						{t("productReviewsList.empty")}
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{sortedReviews.map((review) => (
						<div
							className="border-cream-dark border-t pt-4 first:border-t-0 first:pt-0"
							key={review.id}
						>
							<div className="mb-2 flex items-start justify-between gap-3">
								<div className="flex-1">
									<div className="mb-1 flex items-center gap-2">
										<div className="flex gap-0.5">
											{[...Array(5)].map((_, i) => (
												<Star
													className={
														i < ratingToNumber(review.rating)
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}
													key={i}
													size={14}
												/>
											))}
										</div>
										<span className="font-sans text-text-muted text-xs">
											{formatDate(review.createdAt, t)}
										</span>
									</div>
									<h4 className="font-sans font-semibold text-sm text-text-dark">
										{review.title}
									</h4>
								</div>
								{review.isVerifiedPurchase && (
									<span className="rounded border border-green-200 bg-green-50 px-2 py-1 font-sans font-semibold text-green-700 text-xs">
										{t("productReviewsList.verified")}
									</span>
								)}
							</div>

							{review.body && (
								<p className="mb-3 font-sans text-sm text-text-muted leading-relaxed">
									{review.body}
								</p>
							)}

							<div className="flex items-center gap-3">
								<span className="font-sans text-text-muted text-xs">
									{t("productReviewsList.by")}{" "}
									<span className="font-semibold">{review.buyerName}</span>
								</span>
								{review.helpfulCount > 0 && (
									<button
										className="flex items-center gap-1 text-text-muted transition-colors hover:text-primary"
										type="button"
									>
										<ThumbsUp size={14} />
										<span className="font-sans text-xs">
											{review.helpfulCount}
										</span>
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
					className="mt-6 w-full rounded-sm border border-cream-dark px-4 py-2 font-sans font-semibold text-text-dark transition-colors hover:bg-cream"
					onClick={() => setLimit((prev) => prev + 10)}
				>
					{t("productReviewsList.loadMore")}
				</button>
			)}
		</div>
	);
}

function ratingToNumber(rating: string): number {
	const map: Record<string, number> = {
		ONE: 1,
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
	};
	return map[rating] || 0;
}
