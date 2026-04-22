-- CreateEnum
CREATE TYPE "ProductPaymentOption" AS ENUM ('CARD', 'COD', 'BOTH');

-- CreateEnum
CREATE TYPE "CheckoutPaymentMethod" AS ENUM ('CARD', 'COD');

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "paymentOption" "ProductPaymentOption";

-- AlterTable
ALTER TABLE "product_image" ADD COLUMN     "variantId" TEXT;

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'item',
    "minOrderQuantity" INTEGER NOT NULL DEFAULT 1,
    "minOrderNote" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_order" (
    "id" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "paymentMethod" "CheckoutPaymentMethod" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_order_line" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "variantName" TEXT,
    "organizationId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "shop_order_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "shop_order_line_orderId_idx" ON "shop_order_line"("orderId");

-- CreateIndex
CREATE INDEX "shop_order_line_organizationId_idx" ON "shop_order_line"("organizationId");

-- CreateIndex
CREATE INDEX "shop_order_line_productId_idx" ON "shop_order_line"("productId");

-- CreateIndex
CREATE INDEX "shop_order_line_productVariantId_idx" ON "shop_order_line"("productVariantId");

-- CreateIndex
CREATE INDEX "product_image_variantId_idx" ON "product_image"("variantId");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_order_line" ADD CONSTRAINT "shop_order_line_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "shop_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_order_line" ADD CONSTRAINT "shop_order_line_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_order_line" ADD CONSTRAINT "shop_order_line_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Data: one default variant per existing product (Origine-style listing SKU)
INSERT INTO "product_variant" (
    "id",
    "productId",
    "name",
    "unit",
    "minOrderQuantity",
    "minOrderNote",
    "price",
    "quantityOnHand",
    "inStock",
    "sortOrder",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    p."id",
    'Standard',
    'item',
    1,
    p."moq",
    0.00,
    0,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "product" p
WHERE NOT EXISTS (SELECT 1 FROM "product_variant" v WHERE v."productId" = p."id");

-- Approved listings can be checked out (payment method set at product level)
UPDATE "product" SET "paymentOption" = 'BOTH' WHERE "status" = 'APPROVED' AND "paymentOption" IS NULL;
