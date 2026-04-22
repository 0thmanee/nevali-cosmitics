-- AlterTable
ALTER TABLE "shop_order" ADD COLUMN "stripeCheckoutSessionId" TEXT;
ALTER TABLE "shop_order" ADD COLUMN "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "shop_order_stripeCheckoutSessionId_key" ON "shop_order"("stripeCheckoutSessionId");
