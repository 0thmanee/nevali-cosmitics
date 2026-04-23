-- Homepage hero: at most one product per org should have this true (enforced in app on update).
ALTER TABLE "product" ADD COLUMN "featuredOnHome" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "product_featuredOnHome_status_idx" ON "product" ("featuredOnHome", "status");
