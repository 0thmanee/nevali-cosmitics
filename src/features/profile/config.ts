/**
 * Onboarding (profile) flow: steps and options.
 */

export const ONBOARDING_STEPS = [
	{ number: 1, label: "Business" },
	{ number: 2, label: "Products" },
	{ number: 3, label: "Review" },
] as const;

export const MOROCCAN_REGIONS = [
	"Souss-Massa",
	"Marrakech-Safi",
	"Fès-Meknès",
	"Rabat-Salé-Kénitra",
	"Casablanca-Settat",
	"Oriental",
	"Tanger-Tétouan-Al Hoceïma",
	"Béni Mellal-Khénifra",
	"Drâa-Tafilalet",
	"Guelmim-Oued Noun",
	"Laâyoune-Sakia El Hamra",
	"Dakhla-Oued Ed-Dahab",
] as const;


// Suggestions only — every producer field is free-text; producers can type any value.
export const ENTITY_TYPES = [
	"Cosmetics Brand",
	"Cosmetics Laboratory",
	"Manufacturer",
	"Cooperative",
	"Craft Company",
	"Individual Producer",
] as const;

export const EXPORT_EXPERIENCE_OPTIONS = [
	"No experience — just starting",
	"1-2 years",
	"3-5 years",
	"5+ years",
] as const;

/** Free-text category suggestions for cosmetics producers (not an enforced list). */
export const COSMETICS_CATEGORY_SUGGESTIONS = [
	"Skincare",
	"Haircare",
	"Body care",
	"Makeup",
	"Fragrance",
	"Botanical oils",
	"Hammam & body",
	"Tools & accessories",
	"Supplements",
] as const;

export type OnboardingFormData = {
	firstName: string;
	lastName: string;
	phone: string;
	entityType: string;
	entityName: string;
	registrationNumber: string;
	region: string;
	city: string;
	yearEstablished: string;
	website: string;
	categories: string[];
	annualCapacity: string;
	exportExperience: string;
	publicTagline: string;
	businessDescription: string;
	exportMarkets: string;
	valuesHighlight: string;
	agreeTerms: boolean;
	agreeMarketing: boolean;
};

export const INITIAL_ONBOARDING_FORM: OnboardingFormData = {
	firstName: "",
	lastName: "",
	phone: "",
	entityType: "",
	entityName: "",
	registrationNumber: "",
	region: "",
	city: "",
	yearEstablished: "",
	website: "",
	categories: [],
	annualCapacity: "",
	exportExperience: "",
	publicTagline: "",
	businessDescription: "",
	exportMarkets: "",
	valuesHighlight: "",
	agreeTerms: true,
	agreeMarketing: false,
};
