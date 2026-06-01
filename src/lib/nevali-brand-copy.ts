/**
 * Public-facing copy when nevali runs as the sole house brand (Nevali).
 * If `SHOW_MULTI_PRODUCER_EXPERIENCE` becomes true again, prefer branching in UI or extend this module.
 */
export const NEVALI_HOUSE_BRAND = {
	legalName: "Nevali",
	/** Under-mark / footer descriptor */
	lineUnderLogo: "Moroccan cosmetics by Nevali",
	/** Footer column blurb */
	footerBlurb:
		"Moroccan beauty formulated and fulfilled by Nevali—transparent labels, calm rituals, and simple checkout.",
	/** Main nav label for the public brand profile */
	navBrandLabel: "Nevali",
	/** PDP trust strip — headline */
	verifiedHeadline: "Verified NEVALI listing",
	/** PDP trust strip — body */
	verifiedBody:
		"This page is part of our public catalog. Details, formats, and checkout rules are set by Nevali.",
	/** PDP wholesale note */
	wholesaleNotify: "Nevali is notified by email.",
	/** PDP gallery caption */
	galleryCredit: "Imagery and pack shots from Nevali.",
	/** PDP ingredients footnote */
	ingredientsNote:
		"INCI-style lists are provided by Nevali. Always patch-test new formulas.",
	/** PDP certificates section intro */
	certsIntro:
		"Approved PDFs—product-specific or studio-wide quality and compliance documents for Nevali.",
	/** Certification card badge when not product-scoped */
	certStudioBadge: "Studio",
	/** PDP story fallback bullet */
	profileBullet: "Nevali profile linked from this page.",
	/** PDP empty long description */
	emptyLongDescription:
		"Extended storytelling will appear here when we publish it. Use imagery, ingredients, certificates, and wholesale inquiry for details.",
	/** PDP producer CTA */
	viewBrandCta: "About Nevali",
	/** Public profile hero badge (replaces “Verified Artisan” in single-brand mode) */
	publicProfileBadge: "Nevali",
} as const;
