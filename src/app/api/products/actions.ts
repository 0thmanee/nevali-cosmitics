"use server";

/**
 * Product actions for producers are scoped by organization: we resolve the current
 * user → Member → organizationId, then list/create/update only products for that org.
 * See docs/INVESTIGATION-ORGANIZATION-PRODUCTS.md.
 */
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { getProducerOrgId } from "~/app/api/producer-context";
import { prisma } from "~/lib/db";
import {
  getProductsByOrganizationId,
  getProductByIdForOrgRepo,
  getProductWithImagesByOrgRepo,
  getProductWithImagesForAdminRepo,
  listApprovedProductsWithCertificationsByOrgRepo,
  createProductRepo,
  createProductImageRepo,
  updateProductImageVariantRepo,
  deleteProductImageRepo,
  updateProductRepo,
  listProductsForAdminRepo,
  updateProductStatusRepo,
} from "./repo/products.repo";
import { createCertificationRepo } from "~/app/api/certifications/repo/certifications.repo";
import {
  createProductSchema,
  setProductStatusSchema,
  updateProductSchema,
  setProductImageVariantSchema,
} from "./schemas/products.schema";
import type {
  CreateProductInput,
  SetProductStatusInput,
  UpdateProductInput,
  SetProductImageVariantInput,
} from "./schemas/products.schema";
import { getOrganizationMemberEmails, notifyProductReviewResult } from "~/lib/notifications";
import { processUpload } from "~/lib/media-server";
import { renderProductCertificateToBuffer } from "~/lib/product-certificate";

async function requireSuperadmin() {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "superadmin") {
    redirectNonSuperadminHome();
  }
  return session!;
}

/** List products for the current user's organization. Returns [] if user has no organization. */
export async function listMyProducts() {
  const orgId = await getProducerOrgId();
  if (!orgId) return [];
  return getProductsByOrganizationId(orgId);
}

/** List approved (certified) products for the current org with their certifications (auto-generated + uploaded). */
export async function listMyCertifiedProducts() {
  const orgId = await getProducerOrgId();
  if (!orgId) return [];
  return listApprovedProductsWithCertificationsByOrgRepo(orgId);
}

/** Get a single product by id with images (must belong to current user's organization). */
export async function getMyProduct(productId: string) {
  const orgId = await getProducerOrgId();
  if (!orgId) return null;
  return getProductWithImagesByOrgRepo(productId, orgId);
}

/** Add an image URL to a product (must belong to current user's organization). */
export async function addProductImage(
  productId: string,
  url: string,
  variantId?: string | null,
) {
  const orgId = await getProducerOrgId();
  if (!orgId) throw new Error("You must belong to an organization.");
  const product = await getProductWithImagesByOrgRepo(productId, orgId);
  if (!product) throw new Error("Product not found.");
  const sortOrder = product.images.length;
  return createProductImageRepo(productId, orgId, url, sortOrder, variantId);
}

/** Link a gallery image to a variant (or clear to show for all variants). */
export async function setProductImageVariant(input: SetProductImageVariantInput) {
  const orgId = await getProducerOrgId();
  if (!orgId) throw new Error("You must belong to an organization.");
  const parsed = setProductImageVariantSchema.parse(input);
  return updateProductImageVariantRepo(
    parsed.productId,
    parsed.imageId,
    orgId,
    parsed.variantId,
  );
}

/** Remove an image from a product (must belong to current user's organization). */
export async function removeProductImage(productId: string, imageId: string) {
  const orgId = await getProducerOrgId();
  if (!orgId) throw new Error("You must belong to an organization.");
  await deleteProductImageRepo(productId, imageId, orgId);
}

/** Create a product for the current user's organization. Status is set to PENDING. */
export async function createProduct(data: CreateProductInput) {
  const orgId = await getProducerOrgId();
  if (!orgId) throw new Error("You must belong to an organization to create products.");
  const parsed = createProductSchema.parse(data);
  return createProductRepo({
    organizationId: orgId,
    name: parsed.name,
    category: parsed.category,
    moq: parsed.moq ?? null,
    capacity: parsed.capacity ?? null,
    description: parsed.description ?? null,
    variants: parsed.variants?.map((v, i) => ({
      name: v.name,
      unit: v.unit,
      minOrderQuantity: v.minOrderQuantity,
      minOrderNote: v.minOrderNote ?? null,
      price: v.price,
      quantityOnHand: v.quantityOnHand,
      inStock: v.inStock,
      sortOrder: v.sortOrder ?? i,
    })),
  });
}

/** Update a product (must belong to current user's organization). */
export async function updateProduct(productId: string, data: UpdateProductInput) {
  const orgId = await getProducerOrgId();
  if (!orgId) throw new Error("You must belong to an organization to update products.");
  const parsed = updateProductSchema.parse(data);
  const existing = await getProductByIdForOrgRepo(productId, orgId);
  if (!existing) throw new Error("Product not found.");
  return updateProductRepo(productId, orgId, {
    name: parsed.name,
    category: parsed.category,
    moq: parsed.moq ?? null,
    capacity: parsed.capacity ?? null,
    description: parsed.description ?? null,
    ...(parsed.featuredOnHome !== undefined ? { featuredOnHome: parsed.featuredOnHome } : {}),
    variants: parsed.variants.map((v, i) => ({
      id: v.id,
      name: v.name,
      unit: v.unit,
      minOrderQuantity: v.minOrderQuantity,
      minOrderNote: v.minOrderNote ?? null,
      price: v.price,
      quantityOnHand: v.quantityOnHand,
      inStock: v.inStock,
      sortOrder: v.sortOrder ?? i,
    })),
  });
}

/** List all products for admin (optional organization and status filter). */
export async function listProductsForAdmin(filters: { organizationId?: string; status?: "PENDING" | "APPROVED" | "REJECTED" } = {}) {
  await requireSuperadmin();
  return listProductsForAdminRepo(filters);
}

/** Admin product counts by status (optional organizationId). */
export async function getAdminProductCounts(organizationId?: string | null): Promise<{ ALL: number; PENDING: number; APPROVED: number; REJECTED: number }> {
  await requireSuperadmin();
  const base = organizationId ? { organizationId } : {};
  const [ALL, PENDING, APPROVED, REJECTED] = await Promise.all([
    prisma.product.count({ where: base }),
    prisma.product.count({ where: { ...base, status: "PENDING" } }),
    prisma.product.count({ where: { ...base, status: "APPROVED" } }),
    prisma.product.count({ where: { ...base, status: "REJECTED" } }),
  ]);
  return { ALL, PENDING, APPROVED, REJECTED };
}

/** Get a single product with images for admin (no org scope). */
export async function getProductForAdmin(productId: string) {
  await requireSuperadmin();
  return getProductWithImagesForAdminRepo(productId);
}

function formatCertifiedDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Set product status to APPROVED or REJECTED (admin only). Rejection reason optional. On APPROVED, creates a product certification (PDF) and saves it. */
export async function setProductStatus(input: SetProductStatusInput) {
  await requireSuperadmin();
  const parsed = setProductStatusSchema.parse(input);
  const productMeta = await prisma.product.findUnique({
    where: { id: parsed.productId },
    select: { organizationId: true, name: true },
  });
  const updated = await updateProductStatusRepo(
    parsed.productId,
    parsed.status,
    parsed.status === "REJECTED" ? parsed.rejectionReason : null,
    parsed.status === "APPROVED" ? parsed.paymentOption ?? "BOTH" : undefined,
  );

  if (productMeta) {
    const recipients = await getOrganizationMemberEmails(productMeta.organizationId);
    await notifyProductReviewResult({
      recipients,
      productName: productMeta.name,
      approved: parsed.status === "APPROVED",
      rejectionReason: parsed.rejectionReason,
    });
  }

  if (parsed.status === "APPROVED") {
    const product = await getProductWithImagesForAdminRepo(parsed.productId);
    if (product) {
      const data = {
        productName: product.name,
        category: product.category,
        organizationName: product.organizationName,
        certifiedAt: formatCertifiedDate(new Date()),
      };
      const buffer = await renderProductCertificateToBuffer(data);
      const member = await prisma.member.findFirst({
        where: { organizationId: product.organizationId },
        select: { userId: true },
      });
      const userId = member?.userId ?? product.organizationId;
      const result = await processUpload("certificationDocuments", userId, {
        buffer,
        contentType: "application/pdf",
        size: buffer.length,
        suggestedName: `${parsed.productId}-cert.pdf`,
      });
      if ("url" in result) {
        await createCertificationRepo({
          organizationId: product.organizationId,
          productId: parsed.productId,
          name: "Product certification",
          fileUrl: result.url,
          status: "APPROVED",
        });
      }
    }
  }

  return updated;
}
