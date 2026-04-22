/** Shared shapes for public partners listing & profile (matches repo selects). */

/** Mirrors Prisma `ProductPaymentOption` for public types without importing client in UI. */
export type PartnerProductPaymentOption = "CARD" | "COD" | "BOTH";

export type PublicPartnerListItem = {
  id: string;
  createdAt: Date;
  /** Organization linked to this partner (public directory). */
  members: {
    organization: {
      slug: string;
      name: string;
      approvedProductCount: number;
    };
  }[];
  profile: {
    entityName: string;
    entityType: string;
    region: string;
    city: string;
    yearEstablished: string | null;
    categories: unknown;
    profileImage: string | null;
    annualCapacity: string | null;
    exportExperience: string | null;
    publicTagline: string | null;
    website: string | null;
  } | null;
};

export type PublicPartnerProduct = {
  id: string;
  name: string;
  category: string;
  status: string;
  moq: string | null;
  capacity: string | null;
  description: string | null;
  paymentOption: PartnerProductPaymentOption | null;
  firstImageUrl: string | null;
  gallery: { id: string; url: string; sortOrder: number; variantId: string | null }[];
  variants: {
    id: string;
    name: string;
    unit: string;
    minOrderQuantity: number;
    minOrderNote: string | null;
    /** Decimal string from API */
    price: string;
    quantityOnHand: number;
    inStock: boolean;
    sortOrder: number;
  }[];
  organizationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PublicPartnerCertification = {
  id: string;
  name: string;
  fileUrl: string;
  productId: string | null;
  createdAt: Date | string;
  product: { name: string } | null;
};

export type PublicPartnerProfileDetail = {
  firstName: string;
  lastName: string;
  phone: string;
  entityType: string;
  entityName: string;
  registrationNumber: string | null;
  region: string;
  city: string;
  yearEstablished: string | null;
  website: string | null;
  categories: unknown;
  annualCapacity: string | null;
  exportExperience: string | null;
  profileImage?: string | null;
  publicTagline: string | null;
  businessDescription: string | null;
  exportMarkets: string | null;
  valuesHighlight: string | null;
};

export type PublicPartnerOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};
