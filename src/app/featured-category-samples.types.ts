/** Approved listing shown on homepage featured craft tabs (subset of public product fields). */
export type FeaturedHomeProductSample = {
	id: string;
	name: string;
	category: string;
	firstImageUrl: string | null;
	/** Lowest variant unit price (decimal string) for display. */
	fromPriceMad: string;
};
