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
  { label: "Carpets & Rugs", color: "#454545" },
  { label: "Pottery & Ceramics", color: "#727272" },
  { label: "Leather Goods", color: "#3a3a3a" },
  { label: "Metal Lanterns", color: "#5c5c5c" },
  { label: "Thuya Wood", color: "#3a3a3a" },
  { label: "Caftans & Clothing", color: "#000000" },
  { label: "Zellige & Tiles", color: "#4a4a4a" },
  { label: "Jewelry & Silver", color: "#6a6a6a" },
  { label: "Basketry & Weaving", color: "#5a5a5a" },
  { label: "Babouches", color: "#727272" },
  { label: "Embroidery", color: "#8a8a8a" },
  { label: "Cosmetics & Oils", color: "#000000" },
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
