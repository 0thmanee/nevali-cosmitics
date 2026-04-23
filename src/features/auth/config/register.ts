/**
 * Register flow: steps, options, and form shape.
 */

export const REGISTER_STEPS = [
  { number: 1, label: "Account" },
  { number: 2, label: "Business" },
  { number: 3, label: "Products" },
  { number: 4, label: "Review" },
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

export const REGISTER_PRODUCT_CATEGORIES = [
  { label: "Argan Oil", color: "var(--color-text-muted)" },
  { label: "Saffron", color: "var(--color-danger-dark)" },
  { label: "Rose Water", color: "var(--color-primary)" },
  { label: "Honey & Bee", color: "var(--color-gold)" },
  { label: "Spices", color: "var(--color-gold)" },
  { label: "Ceramics", color: "var(--color-info)" },
  { label: "Textiles", color: "var(--color-primary-light)" },
  { label: "Cosmetic Oils", color: "var(--color-text-muted)" },
  { label: "Dried Herbs", color: "var(--color-text-muted)" },
  { label: "Black Seed", color: "var(--color-primary-darker)" },
  { label: "Preserved Foods", color: "var(--color-gold)" },
  { label: "Natural Soaps", color: "var(--color-success)" },
] as const;

export const ENTITY_TYPES = [
  "Individual Producer",
  "Cooperative",
  "Company / SARL",
  "Association",
] as const;

export const EXPORT_EXPERIENCE_OPTIONS = [
  "No experience — just starting",
  "1-2 years",
  "3-5 years",
  "5+ years",
] as const;

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
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
  agreeTerms: boolean;
  agreeMarketing: boolean;
};

export const INITIAL_REGISTER_FORM: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
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
  agreeTerms: false,
  agreeMarketing: false,
};
