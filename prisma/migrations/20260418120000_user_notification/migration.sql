-- CreateTable
CREATE TABLE "user_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkHref" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_notification_userId_readAt_idx" ON "user_notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
