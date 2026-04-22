-- AlterTable
ALTER TABLE "shop_order" ADD COLUMN "buyerUserId" TEXT;

-- CreateIndex
CREATE INDEX "shop_order_buyerUserId_idx" ON "shop_order"("buyerUserId");

-- AddForeignKey
ALTER TABLE "shop_order" ADD CONSTRAINT "shop_order_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
