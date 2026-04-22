import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/db";
import type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";
import type {
  ProductRow,
  ProductImageRow,
  ProductVariantRow,
  ProductRowWithImages,
  ProductAdminRow,
  ProductListRow,
  ProductAdminListRow,
  CertifiedProductListRow,
  PublicProductDetail,
  ProductPaymentOptionValue,
} from "../schemas/products.schema";
import { buildPublicProductListRow } from "~/lib/public-product-mapper";

type VariantDbCore = {
  id: string;
  productId: string;
  name: string;
  unit: string;
  minOrderQuantity: number;
  minOrderNote: string | null;
  price: Prisma.Decimal;
  quantityOnHand: number;
  inStock: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

function toVariantRow(v: VariantDbCore): ProductVariantRow {
  return {
    ...v,
    price: v.price.toFixed(2),
  };
}

function fromPriceFromVariants(variants: { price: Prisma.Decimal }[]): string | null {
  if (variants.length === 0) return null;
  let min = Number(variants[0]!.price);
  for (let i = 1; i < variants.length; i++) {
    const n = Number(variants[i]!.price);
    if (Number.isFinite(n) && n < min) min = n;
  }
  return Number.isFinite(min) ? min.toFixed(2) : null;
}

type VariantUpsertInput = {
  id?: string;
  name: string;
  unit: string;
  minOrderQuantity: number;
  minOrderNote?: string | null;
  price: string;
  quantityOnHand: number;
  inStock: boolean;
  sortOrder?: number;
};

async function syncProductVariantsTx(
  tx: Prisma.TransactionClient,
  productId: string,
  variants: VariantUpsertInput[],
): Promise<void> {
  const existing = await tx.productVariant.findMany({
    where: { productId },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((e) => e.id));
  const incomingWithId = variants.filter((v): v is typeof v & { id: string } => !!v.id);
  const incomingIds = new Set(incomingWithId.map((v) => v.id));

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]!;
    if (v.id && !existingIds.has(v.id)) {
      throw new Error(`Unknown variant id for this product: ${v.id}`);
    }
    const priceNorm = v.price.trim().replace(",", ".");
    const sortOrder = v.sortOrder ?? i;
    if (v.id && existingIds.has(v.id)) {
      await tx.productVariant.update({
        where: { id: v.id },
        data: {
          name: v.name,
          unit: v.unit || "item",
          minOrderQuantity: v.minOrderQuantity,
          minOrderNote: v.minOrderNote ?? null,
          price: new Prisma.Decimal(priceNorm),
          quantityOnHand: v.quantityOnHand,
          inStock: v.inStock,
          sortOrder,
        },
      });
    } else {
      await tx.productVariant.create({
        data: {
          productId,
          name: v.name,
          unit: v.unit || "item",
          minOrderQuantity: v.minOrderQuantity,
          minOrderNote: v.minOrderNote ?? null,
          price: new Prisma.Decimal(priceNorm),
          quantityOnHand: v.quantityOnHand,
          inStock: v.inStock,
          sortOrder,
        },
      });
    }
  }

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length > 0) {
    await tx.productVariant.deleteMany({
      where: { productId, id: { in: toDelete } },
    });
  }
}

/**
 * All product reads/writes for producers are scoped by organizationId.
 * Products are always linked to one Organization; partners get products
 * via their Member.organizationId. See docs/INVESTIGATION-ORGANIZATION-PRODUCTS.md.
 */

const productSelect = {
  id: true,
  name: true,
  category: true,
  status: true,
  rejectionReason: true,
  moq: true,
  capacity: true,
  description: true,
  paymentOption: true,
  createdAt: true,
  updatedAt: true,
} as const;

const variantSelect = {
  id: true,
  productId: true,
  name: true,
  unit: true,
  minOrderQuantity: true,
  minOrderNote: true,
  price: true,
  quantityOnHand: true,
  inStock: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getProductsByOrganizationId(
  organizationId: string
): Promise<ProductListRow[]> {
  const rows = await prisma.product.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
    select: {
      ...productSelect,
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
      variants: {
        select: { price: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return rows.map(({ images, variants, ...r }) => ({
    ...r,
    firstImageUrl: images[0]?.url ?? null,
    fromPrice: fromPriceFromVariants(variants),
    variantCount: variants.length,
  }));
}

export async function getProductByIdForOrgRepo(
  productId: string,
  organizationId: string
): Promise<ProductRow | null> {
  const row = await prisma.product.findFirst({
    where: { id: productId, organizationId },
    select: productSelect,
  });
  return row;
}

const certificationSelect = {
  id: true,
  organizationId: true,
  productId: true,
  name: true,
  fileUrl: true,
  status: true,
  rejectionReason: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Single product with images and certifications (for detail/edit). */
export async function getProductWithImagesByOrgRepo(
  productId: string,
  organizationId: string
): Promise<ProductRowWithImages | null> {
  const row = await prisma.product.findFirst({
    where: { id: productId, organizationId },
    select: {
      ...productSelect,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, sortOrder: true, variantId: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        select: variantSelect,
      },
      certifications: {
        orderBy: { createdAt: "desc" },
        select: certificationSelect,
      },
    },
  });
  if (!row) return null;
  const { images, certifications, variants, ...rest } = row;
  return {
    ...rest,
    images,
    variants: variants.map((v) => toVariantRow(v as VariantDbCore)),
    certifications,
  };
}

/** Single product with images and certifications for admin (no org scope). */
export async function getProductWithImagesForAdminRepo(
  productId: string
): Promise<(ProductRowWithImages & { organizationId: string; organizationName: string }) | null> {
  const row = await prisma.product.findFirst({
    where: { id: productId },
    select: {
      ...productSelect,
      organizationId: true,
      organization: { select: { name: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, sortOrder: true, variantId: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        select: variantSelect,
      },
      certifications: {
        orderBy: { createdAt: "desc" },
        select: certificationSelect,
      },
    },
  });
  if (!row) return null;
  const { organization, images, certifications, variants, ...rest } = row;
  return {
    ...rest,
    organizationName: organization.name,
    images,
    variants: variants.map((v) => toVariantRow(v as VariantDbCore)),
    certifications,
  };
}

/** Approved products with first image URL and certifications (for producer certified products list). */
export async function listApprovedProductsWithCertificationsByOrgRepo(
  organizationId: string
): Promise<CertifiedProductListRow[]> {
  const rows = await prisma.product.findMany({
    where: { organizationId, status: "APPROVED" },
    orderBy: { updatedAt: "desc" },
    select: {
      ...productSelect,
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        select: variantSelect,
      },
      certifications: {
        orderBy: { createdAt: "desc" },
        select: certificationSelect,
      },
    },
  });
  return rows.map(({ images, certifications, variants, ...r }) => ({
    ...r,
    firstImageUrl: images[0]?.url ?? null,
    variants: variants.map((v) => toVariantRow(v as VariantDbCore)),
    certifications,
  }));
}

export async function createProductImageRepo(
  productId: string,
  organizationId: string,
  url: string,
  sortOrder: number,
  variantId?: string | null,
): Promise<ProductImageRow> {
  const product = await prisma.product.findFirst({
    where: { id: productId, organizationId },
    select: { id: true },
  });
  if (!product) throw new Error("Product not found or does not belong to your organization.");
  if (variantId) {
    const v = await prisma.productVariant.findFirst({
      where: { id: variantId, productId },
      select: { id: true },
    });
    if (!v) throw new Error("Variant not found for this product.");
  }
  const created = await prisma.productImage.create({
    data: {
      productId,
      url,
      sortOrder,
      variantId: variantId ?? null,
    },
    select: { id: true, url: true, sortOrder: true, variantId: true },
  });
  return created;
}

export async function updateProductImageVariantRepo(
  productId: string,
  imageId: string,
  organizationId: string,
  variantId: string | null,
): Promise<ProductImageRow> {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId, product: { organizationId } },
    select: { id: true },
  });
  if (!image) throw new Error("Image not found or does not belong to your product.");
  if (variantId) {
    const v = await prisma.productVariant.findFirst({
      where: { id: variantId, productId },
      select: { id: true },
    });
    if (!v) throw new Error("Variant not found for this product.");
  }
  const updated = await prisma.productImage.update({
    where: { id: imageId },
    data: { variantId },
    select: { id: true, url: true, sortOrder: true, variantId: true },
  });
  return updated;
}

export async function deleteProductImageRepo(
  productId: string,
  imageId: string,
  organizationId: string
): Promise<void> {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId, product: { organizationId } },
    select: { id: true },
  });
  if (!image) throw new Error("Image not found or does not belong to your product.");
  await prisma.productImage.delete({ where: { id: imageId } });
}

/**
 * Update a product. Enforces that the product belongs to the given organization
 * (defense in depth: only update products of that org).
 */
export async function updateProductRepo(
  productId: string,
  organizationId: string,
  data: {
    name: string;
    category: string;
    moq?: string | null;
    capacity?: string | null;
    description?: string | null;
    variants: VariantUpsertInput[];
  },
): Promise<ProductRowWithImages> {
  const existing = await prisma.product.findFirst({
    where: { id: productId, organizationId },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Product not found or does not belong to your organization.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        category: data.category,
        moq: data.moq ?? null,
        capacity: data.capacity ?? null,
        description: data.description ?? null,
      },
    });
    await syncProductVariantsTx(tx, productId, data.variants);
    const first = await tx.productVariant.findFirst({
      where: { productId },
      orderBy: { sortOrder: "asc" },
      select: { minOrderNote: true },
    });
    await tx.product.update({
      where: { id: productId },
      data: { moq: first?.minOrderNote ?? data.moq ?? null },
    });
  });

  const full = await getProductWithImagesByOrgRepo(productId, organizationId);
  if (!full) throw new Error("Product not found after update.");
  return full;
}

export async function listProductsForAdminRepo(filters: {
  organizationId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}): Promise<ProductAdminListRow[]> {
  const where: { organizationId?: string; status?: string } = {};
  if (filters.organizationId) where.organizationId = filters.organizationId;
  if (filters.status) where.status = filters.status;
  const rows = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      ...productSelect,
      organizationId: true,
      organization: { select: { name: true } },
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
      variants: {
        select: { price: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { certifications: true } },
    },
  });
  return rows.map(({ organization, images, variants, _count, ...r }) => ({
    ...r,
    organizationName: organization.name,
    firstImageUrl: images[0]?.url ?? null,
    certificationsCount: _count.certifications,
    fromPrice: fromPriceFromVariants(variants),
    variantCount: variants.length,
  }));
}

export async function createProductRepo(data: {
  organizationId: string;
  name: string;
  category: string;
  moq?: string | null;
  capacity?: string | null;
  description?: string | null;
  variants?: Omit<VariantUpsertInput, "id">[];
}): Promise<ProductRow> {
  const variantCreates: Omit<VariantUpsertInput, "id">[] =
    data.variants && data.variants.length > 0
      ? data.variants
      : [
          {
            name: "Standard",
            unit: "item",
            minOrderQuantity: 1,
            minOrderNote: data.moq?.trim() || null,
            price: "0",
            quantityOnHand: 0,
            inStock: true,
            sortOrder: 0,
          },
        ];

  const created = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        category: data.category,
        status: "PENDING",
        moq: data.moq ?? null,
        capacity: data.capacity ?? null,
        description: data.description ?? null,
        variants: {
          create: variantCreates.map((v, i) => {
            const priceNorm = v.price.trim().replace(",", ".");
            return {
              name: v.name,
              unit: v.unit || "item",
              minOrderQuantity: v.minOrderQuantity,
              minOrderNote: v.minOrderNote ?? null,
              price: new Prisma.Decimal(priceNorm),
              quantityOnHand: v.quantityOnHand,
              inStock: v.inStock,
              sortOrder: v.sortOrder ?? i,
            };
          }),
        },
      },
      select: { id: true },
    });
    const first = await tx.productVariant.findFirst({
      where: { productId: product.id },
      orderBy: { sortOrder: "asc" },
      select: { minOrderNote: true },
    });
    await tx.product.update({
      where: { id: product.id },
      data: { moq: first?.minOrderNote ?? data.moq ?? null },
    });
    return tx.product.findUniqueOrThrow({
      where: { id: product.id },
      select: productSelect,
    });
  });
  return created;
}

/** All unique categories for APPROVED products (public). */
export async function listApprovedProductCategoriesRepo(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { status: "APPROVED" },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

/** Paginated APPROVED products with optional category filter (public). */
export async function listApprovedProductsForPublicPaginatedRepo(params: {
  page: number;
  pageSize: number;
  category?: string;
}) {
  const where = {
    status: "APPROVED",
    ...(params.category ? { category: params.category } : {}),
  };
  const skip = (params.page - 1) * params.pageSize;
  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: params.pageSize,
      select: {
        id: true,
        name: true,
        category: true,
        moq: true,
        description: true,
        paymentOption: true,
        organizationId: true,
        organization: { select: { name: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, sortOrder: true, variantId: true },
        },
        variants: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            unit: true,
            minOrderQuantity: true,
            minOrderNote: true,
            price: true,
            quantityOnHand: true,
            inStock: true,
            sortOrder: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);
  return {
    products: rows.map(({ organization, images, variants, ...r }) =>
      buildPublicProductListRow({
        ...r,
        organizationName: organization.name,
        firstImageUrl: images[0]?.url ?? null,
        gallery: images.map((i) => ({
          id: i.id,
          url: i.url,
          sortOrder: i.sortOrder,
          variantId: i.variantId,
        })),
        variants,
      }),
    ),
    total,
    totalPages: Math.ceil(total / params.pageSize) || 1,
  };
}

/** Single APPROVED product for public detail page — no auth required. */
export async function getApprovedProductForPublicByIdRepo(
  productId: string,
): Promise<PublicProductDetail | null> {
  const row = await prisma.product.findFirst({
    where: { id: productId, status: "APPROVED" },
    select: {
      id: true,
      name: true,
      category: true,
      moq: true,
      capacity: true,
      description: true,
      paymentOption: true,
      organizationId: true,
      organization: { select: { name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, sortOrder: true, variantId: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          unit: true,
          minOrderQuantity: true,
          minOrderNote: true,
          price: true,
          quantityOnHand: true,
          inStock: true,
          sortOrder: true,
        },
      },
    },
  });
  if (!row) return null;
  const gallery = row.images.map((i) => ({
    id: i.id,
    url: i.url,
    sortOrder: i.sortOrder,
    variantId: i.variantId,
  }));
  const base = buildPublicProductListRow({
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    moq: row.moq,
    organizationId: row.organizationId,
    organizationName: row.organization.name,
    firstImageUrl: gallery[0]?.url ?? null,
    paymentOption: row.paymentOption,
    gallery,
    variants: row.variants,
  });
  return {
    ...base,
    organizationSlug: row.organization.slug,
    capacity: row.capacity,
  };
}

/** All APPROVED products for the public landing page — no auth required. */
export async function listApprovedProductsForPublicRepo(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { status: "APPROVED" },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      category: true,
      moq: true,
      description: true,
      paymentOption: true,
      organizationId: true,
      organization: { select: { name: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, sortOrder: true, variantId: true },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          unit: true,
          minOrderQuantity: true,
          minOrderNote: true,
          price: true,
          quantityOnHand: true,
          inStock: true,
          sortOrder: true,
        },
      },
    },
  });
  return rows.map(({ organization, images, variants, ...r }) =>
    buildPublicProductListRow({
      ...r,
      organizationName: organization.name,
      firstImageUrl: images[0]?.url ?? null,
      gallery: images.map((i) => ({
        id: i.id,
        url: i.url,
        sortOrder: i.sortOrder,
        variantId: i.variantId,
      })),
      variants,
    }),
  );
}

/** Homepage featured craft tabs: first approved listing per slot (keyword match on category + name). */
const FEATURED_HOME_CATEGORY_SPECS = [
  {
    id: "carpets",
    keywords: ["carpet", "zrabd", "tapis", "rug", "berber"],
  },
  {
    id: "pottery",
    keywords: [
      "pottery",
      "ceramic",
      "céramique",
      "ceramique",
      "faience",
      "faïence",
      "tile",
      "zellige",
    ],
  },
  {
    id: "leather",
    keywords: ["leather", "cuir", "babouche", "tannery"],
  },
  {
    id: "lanterns",
    keywords: ["lantern", "lumière", "luminaire", "brass lamp", "metalwork"],
  },
  {
    id: "thuya",
    keywords: ["thuya", "thuja", "marquetry", "essaouira", "wood box"],
  },
  {
    id: "caftans",
    keywords: ["caftan", "kaftan", "broderie", "embroidery", "brocade"],
  },
] as const;

export type { FeaturedHomeProductSample } from "~/app/featured-category-samples.types";

/** Keys align with `FeaturedCategorySectionClient` tab ids. */
export async function listFeaturedHomeProductSamplesByCategoryRepo(): Promise<
  Record<string, FeaturedHomeProductSample | null>
> {
  const rows = await prisma.product.findMany({
    where: { status: "APPROVED" },
    orderBy: { updatedAt: "desc" },
    take: 250,
    select: {
      id: true,
      name: true,
      category: true,
      variants: {
        select: { price: true },
      },
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
    },
  });

  const products: FeaturedHomeProductSample[] = rows.map(({ images, variants, ...r }) => {
    const nums = variants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n));
    const fromPriceMad = nums.length === 0 ? "0.00" : Math.min(...nums).toFixed(2);
    return {
      ...r,
      firstImageUrl: images[0]?.url ?? null,
      fromPriceMad,
    };
  });

  const out: Record<string, FeaturedHomeProductSample | null> = {};
  const assigned = new Set<string>();

  for (const spec of FEATURED_HOME_CATEGORY_SPECS) {
    const hit = products.find(
      (p) =>
        !assigned.has(p.id) &&
        spec.keywords.some((kw) => {
          const blob = `${p.category} ${p.name}`.toLowerCase();
          return blob.includes(kw.toLowerCase());
        }),
    );
    if (hit) assigned.add(hit.id);
    out[spec.id] = hit ?? null;
  }

  return out;
}

export async function updateProductStatusRepo(
  productId: string,
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string | null,
  paymentOption?: ProductPaymentOptionValue | null,
): Promise<ProductRow> {
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? rejectionReason ?? null : null,
      ...(status === "APPROVED"
        ? { paymentOption: paymentOption ?? "BOTH" }
        : {}),
    },
    select: productSelect,
  });
  return updated;
}
