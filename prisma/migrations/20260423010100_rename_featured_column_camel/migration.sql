-- Align with camelCase column naming used elsewhere on `product` (older deploys may have snake_case).
DROP INDEX IF EXISTS "product_featured_on_home_status_idx";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'product' AND column_name = 'featured_on_home'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'product' AND column_name = 'featuredOnHome'
  ) THEN
    ALTER TABLE "product" RENAME COLUMN "featured_on_home" TO "featuredOnHome";
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "product_featuredOnHome_status_idx" ON "product" ("featuredOnHome", "status");
