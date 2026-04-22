-- User notification context + user prefs + RFQ attachments + email throttle + rate-limit index

ALTER TABLE "user_notification" ADD COLUMN "contextRfqId" TEXT;
CREATE INDEX "user_notification_userId_contextRfqId_idx" ON "user_notification"("userId", "contextRfqId");

ALTER TABLE "user" ADD COLUMN "notificationPrefs" JSONB;

CREATE TABLE "rfq_thread_email_throttle" (
    "rfqId" TEXT NOT NULL,
    "recipientKey" TEXT NOT NULL,
    "pendingCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_thread_email_throttle_pkey" PRIMARY KEY ("rfqId","recipientKey")
);

CREATE TABLE "rfq_message_attachment" (
    "id" TEXT NOT NULL,
    "rfqMessageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_message_attachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "rfq_message_attachment_rfqMessageId_idx" ON "rfq_message_attachment"("rfqMessageId");

ALTER TABLE "rfq_message_attachment" ADD CONSTRAINT "rfq_message_attachment_rfqMessageId_fkey" FOREIGN KEY ("rfqMessageId") REFERENCES "rfq_message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "rfq_message_authorUserId_createdAt_idx" ON "rfq_message"("authorUserId", "createdAt");
