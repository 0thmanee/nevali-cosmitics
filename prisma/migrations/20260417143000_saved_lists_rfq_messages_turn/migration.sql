-- CreateTable
CREATE TABLE "saved_list" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_list_product" (
    "id" TEXT NOT NULL,
    "savedListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_list_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_message" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_message_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "rfq" ADD COLUMN "negotiationTurn" TEXT;

-- CreateIndex
CREATE INDEX "saved_list_userId_idx" ON "saved_list"("userId");

-- CreateIndex
CREATE INDEX "saved_list_product_productId_idx" ON "saved_list_product"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_list_product_savedListId_productId_key" ON "saved_list_product"("savedListId", "productId");

-- CreateIndex
CREATE INDEX "rfq_message_rfqId_idx" ON "rfq_message"("rfqId");

-- AddForeignKey
ALTER TABLE "saved_list" ADD CONSTRAINT "saved_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_list_product" ADD CONSTRAINT "saved_list_product_savedListId_fkey" FOREIGN KEY ("savedListId") REFERENCES "saved_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_list_product" ADD CONSTRAINT "saved_list_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_message" ADD CONSTRAINT "rfq_message_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;
