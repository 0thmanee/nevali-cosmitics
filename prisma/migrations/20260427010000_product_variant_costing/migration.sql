-- Add internal producer costing fields to product variants
ALTER TABLE "product_variant"
ADD COLUMN "sourceName" TEXT,
ADD COLUMN "unitCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "packagingCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "handlingCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "otherCost" DECIMAL(12,2) NOT NULL DEFAULT 0;
