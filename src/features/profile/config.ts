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

export const PRODUCT_CATEGORIES = [
	{
		label: "Carpets & Rugs",
		color: "color-mix(in srgb, var(--color-ink) 72%, var(--color-text-muted))",
	},
	{ label: "Pottery & Ceramics", color: "var(--color-text-muted)" },
	{
		label: "Leather Goods",
		color: "color-mix(in srgb, var(--color-ink) 88%, black)",
	},
	{
		label: "Metal Lanterns",
		color: "color-mix(in srgb, var(--color-ink) 65%, var(--color-text-muted))",
	},
	{
		label: "Thuya Wood",
		color: "color-mix(in srgb, var(--color-ink) 88%, black)",
	},
	{ label: "Caftans & Clothing", color: "var(--color-ink)" },
	{
		label: "Zellige & Tiles",
		color: "color-mix(in srgb, var(--color-ink) 78%, var(--color-text-muted))",
	},
	{
		label: "Jewelry & Silver",
		color: "color-mix(in srgb, var(--color-text-muted) 85%, var(--color-ink))",
	},
	{
		label: "Basketry & Weaving",
		color: "color-mix(in srgb, var(--color-ink) 58%, var(--color-text-muted))",
	},
	{ label: "Babouches", color: "var(--color-text-muted)" },
	{
		label: "Embroidery",
		color:
			"color-mix(in srgb, var(--color-text-muted) 70%, var(--color-paper))",
	},
	{ label: "Cosmetics & Oils", color: "var(--color-ink)" },
] as const;

export const ENTITY_TYPES = [
	"Individual Artisan",
	"Artisan Cooperative",
	"Craft Workshop (Atelier)",
	"Craft Company",
] as const;

export const EXPORT_EXPERIENCE_OPTIONS = [
	"No experience — just starting",
	"1-2 years",
	"3-5 years",
	"5+ years",
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
