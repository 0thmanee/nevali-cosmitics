-- CreateTable
CREATE TABLE "producer_article" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "coverGradient" TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #000000 0%, #727272 100%)',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producer_article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "producer_article_organizationId_idx" ON "producer_article"("organizationId");

-- CreateIndex
CREATE INDEX "producer_article_status_publishedAt_idx" ON "producer_article"("status", "publishedAt");

-- AddForeignKey
ALTER TABLE "producer_article" ADD CONSTRAINT "producer_article_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
