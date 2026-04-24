"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
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
      setError(err instanceof Error ? err.message : t("productReviewForm.errorSubmitFailed"));
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
    <div className="bg-white border border-cream-dark rounded-sm p-6">
      <h3 className="font-serif font-bold text-lg text-text-dark mb-4">{t("productReviewForm.title")}</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-sm">
          <p className="font-sans text-sm text-green-700">{t("productReviewForm.success")}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
          <p className="font-sans text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block font-sans text-sm font-semibold text-text-dark mb-2">
            {t("productReviewForm.ratingLabel")} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {["ONE", "TWO", "THREE", "FOUR", "FIVE"].map((r) => {
              const ratingValue = r as ReviewRating;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(ratingValue)}
                  disabled={submitting}
                  className={`p-2 rounded-sm transition-all ${
                    rating === ratingValue
                      ? "bg-primary text-white"
                      : "bg-cream border border-cream-dark hover:border-primary"
                  }`}
                  title={ratingLabels[ratingValue]}
                >
                  <Star
                    size={20}
                    className={rating === ratingValue ? "fill-current" : ""}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="review-name" className="block font-sans text-sm font-semibold text-text-dark mb-1">
            {t("productReviewForm.nameLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="review-name"
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder={t("productReviewForm.namePlaceholder")}
            className="w-full px-3 py-2 border border-cream-dark rounded-sm font-sans text-sm focus:outline-none focus:border-primary"
            maxLength={100}
            disabled={submitting}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="review-email" className="block font-sans text-sm font-semibold text-text-dark mb-1">
            {t("productReviewForm.emailLabel")} <span className="text-text-muted">({t("productReviewForm.optional")})</span>
          </label>
          <input
            id="review-email"
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder={t("productReviewForm.emailPlaceholder")}
            className="w-full px-3 py-2 border border-cream-dark rounded-sm font-sans text-sm focus:outline-none focus:border-primary"
            disabled={submitting}
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block font-sans text-sm font-semibold text-text-dark mb-1">
            {t("productReviewForm.reviewTitleLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("productReviewForm.reviewTitlePlaceholder")}
            className="w-full px-3 py-2 border border-cream-dark rounded-sm font-sans text-sm focus:outline-none focus:border-primary"
            maxLength={200}
            disabled={submitting}
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="review-body" className="block font-sans text-sm font-semibold text-text-dark mb-1">
            {t("productReviewForm.reviewBodyLabel")} <span className="text-text-muted">({t("productReviewForm.optional")})</span>
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("productReviewForm.reviewBodyPlaceholder")}
            rows={4}
            className="w-full px-3 py-2 border border-cream-dark rounded-sm font-sans text-sm focus:outline-none focus:border-primary resize-none"
            maxLength={5000}
            disabled={submitting}
          />
          <p className="font-sans text-xs text-text-muted mt-1">
            {body.length}/5000
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-primary text-white font-sans font-semibold rounded-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {submitting ? t("productReviewForm.submitting") : t("productReviewForm.submit")}
        </button>
      </form>
    </div>
  );
}
