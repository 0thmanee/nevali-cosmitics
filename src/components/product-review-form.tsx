"use client";

import { Star } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { createProductReview } from "~/app/api/products/actions/reviews.actions";
import type { ReviewRating } from "~/app/api/products/schemas/reviews.schema";
import { useI18n } from "~/components/i18n/i18n-provider";

type Props = {
	productId: string;
	onSuccess?: () => void;
};

export function ProductReviewForm({ productId, onSuccess }: Props) {
	const { t } = useI18n();
	const [rating, setRating] = useState<ReviewRating | null>(null);
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [buyerName, setBuyerName] = useState("");
	const [buyerEmail, setBuyerEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!rating) {
			setError(t("productReviewForm.errorRatingRequired"));
			return;
		}
		if (!title.trim()) {
			setError(t("productReviewForm.errorTitleRequired"));
			return;
		}
		if (!buyerName.trim()) {
			setError(t("productReviewForm.errorNameRequired"));
			return;
		}

		setSubmitting(true);
		try {
			await createProductReview({
				productId,
				rating,
				title: title.trim(),
				body: body.trim() || undefined,
				buyerName: buyerName.trim(),
				buyerEmail: buyerEmail.trim() || undefined,
			});

			setSuccess(true);
			setRating(null);
			setTitle("");
			setBody("");
			setBuyerName("");
			setBuyerEmail("");

			// Reset success message after 3 seconds
			setTimeout(() => setSuccess(false), 3000);

			onSuccess?.();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: t("productReviewForm.errorSubmitFailed"),
			);
		} finally {
			setSubmitting(false);
		}
	};

	const ratingLabels: Record<ReviewRating, string> = {
		ONE: t("productReviewForm.ratingPoor"),
		TWO: t("productReviewForm.ratingFair"),
		THREE: t("productReviewForm.ratingGood"),
		FOUR: t("productReviewForm.ratingVeryGood"),
		FIVE: t("productReviewForm.ratingExcellent"),
	};

	return (
		<div className="rounded-sm border border-cream-dark bg-white p-6">
			<h3 className="mb-4 font-bold font-serif text-lg text-text-dark">
				{t("productReviewForm.title")}
			</h3>

			{success && (
				<div className="mb-4 rounded-sm border border-green-200 bg-green-50 p-3">
					<p className="font-sans text-green-700 text-sm">
						{t("productReviewForm.success")}
					</p>
				</div>
			)}

			{error && (
				<div className="mb-4 rounded-sm border border-red-200 bg-red-50 p-3">
					<p className="font-sans text-red-700 text-sm">{error}</p>
				</div>
			)}

			<form className="space-y-4" onSubmit={handleSubmit}>
				{/* Rating */}
				<div>
					<label className="mb-2 block font-sans font-semibold text-sm text-text-dark">
						{t("productReviewForm.ratingLabel")}{" "}
						<span className="text-red-500">*</span>
					</label>
					<div className="flex gap-2">
						{["ONE", "TWO", "THREE", "FOUR", "FIVE"].map((r) => {
							const ratingValue = r as ReviewRating;
							return (
								<button
									className={`rounded-sm p-2 transition-all ${
										rating === ratingValue
											? "bg-primary text-white"
											: "border border-cream-dark bg-cream hover:border-primary"
									}`}
									disabled={submitting}
									key={r}
									onClick={() => setRating(ratingValue)}
									title={ratingLabels[ratingValue]}
									type="button"
								>
									<Star
										className={rating === ratingValue ? "fill-current" : ""}
										size={20}
									/>
								</button>
							);
						})}
					</div>
				</div>

				{/* Name */}
				<div>
					<label
						className="mb-1 block font-sans font-semibold text-sm text-text-dark"
						htmlFor="review-name"
					>
						{t("productReviewForm.nameLabel")}{" "}
						<span className="text-red-500">*</span>
					</label>
					<input
						className="w-full rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm focus:border-primary focus:outline-none"
						disabled={submitting}
						id="review-name"
						maxLength={100}
						onChange={(e) => setBuyerName(e.target.value)}
						placeholder={t("productReviewForm.namePlaceholder")}
						type="text"
						value={buyerName}
					/>
				</div>

				{/* Email */}
				<div>
					<label
						className="mb-1 block font-sans font-semibold text-sm text-text-dark"
						htmlFor="review-email"
					>
						{t("productReviewForm.emailLabel")}{" "}
						<span className="text-text-muted">
							({t("productReviewForm.optional")})
						</span>
					</label>
					<input
						className="w-full rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm focus:border-primary focus:outline-none"
						disabled={submitting}
						id="review-email"
						onChange={(e) => setBuyerEmail(e.target.value)}
						placeholder={t("productReviewForm.emailPlaceholder")}
						type="email"
						value={buyerEmail}
					/>
				</div>

				{/* Title */}
				<div>
					<label
						className="mb-1 block font-sans font-semibold text-sm text-text-dark"
						htmlFor="review-title"
					>
						{t("productReviewForm.reviewTitleLabel")}{" "}
						<span className="text-red-500">*</span>
					</label>
					<input
						className="w-full rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm focus:border-primary focus:outline-none"
						disabled={submitting}
						id="review-title"
						maxLength={200}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("productReviewForm.reviewTitlePlaceholder")}
						type="text"
						value={title}
					/>
				</div>

				{/* Body */}
				<div>
					<label
						className="mb-1 block font-sans font-semibold text-sm text-text-dark"
						htmlFor="review-body"
					>
						{t("productReviewForm.reviewBodyLabel")}{" "}
						<span className="text-text-muted">
							({t("productReviewForm.optional")})
						</span>
					</label>
					<textarea
						className="w-full resize-none rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm focus:border-primary focus:outline-none"
						disabled={submitting}
						id="review-body"
						maxLength={5000}
						onChange={(e) => setBody(e.target.value)}
						placeholder={t("productReviewForm.reviewBodyPlaceholder")}
						rows={4}
						value={body}
					/>
					<p className="mt-1 font-sans text-text-muted text-xs">
						{body.length}/5000
					</p>
				</div>

				<button
					className="w-full rounded-sm bg-primary px-4 py-2 font-sans font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					disabled={submitting}
					type="submit"
				>
					{submitting
						? t("productReviewForm.submitting")
						: t("productReviewForm.submit")}
				</button>
			</form>
		</div>
	);
}
