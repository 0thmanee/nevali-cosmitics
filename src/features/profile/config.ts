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
  { label: "Carpets & Rugs", color: "#8B2D1E" },
  { label: "Pottery & Ceramics", color: "#C87040" },
  { label: "Leather Goods", color: "#7A5030" },
  { label: "Metal Lanterns", color: "#B8882A" },
  { label: "Thuya Wood", color: "#7A5030" },
  { label: "Caftans & Clothing", color: "#6A2A80" },
  { label: "Zellige & Tiles", color: "#1A7080" },
  { label: "Jewelry & Silver", color: "#8a8060" },
  { label: "Basketry & Weaving", color: "#9A7050" },
  { label: "Babouches", color: "#C87020" },
  { label: "Embroidery", color: "#a04070" },
  { label: "Cosmetics & Oils", color: "#C8963C" },
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
