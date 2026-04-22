-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'buyer';

-- AlterTable
ALTER TABLE "rfq" ADD COLUMN     "buyerUserId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "signupSource" TEXT;

-- CreateIndex
CREATE INDEX "rfq_buyerUserId_idx" ON "rfq"("buyerUserId");

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
