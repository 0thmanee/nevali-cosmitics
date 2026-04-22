"use server";

import { getSession } from "~/app/api/auth/actions";
import {
  getOrganizationMemberEmails,
  notifyBuyerCartInquiriesConfirmation,
  notifyBuyerInquiryConfirmation,
  notifyOrganizationNewRfq,
} from "~/lib/notifications";
import { prisma } from "~/lib/db";

export type InquiryInput = {
  organizationId: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  quantity: string;
  message?: string;
  type: "cart" | "b2b";
};

/** Public product inquiry — creates an RFQ for the seller org; links buyer account when signed in as buyer. */
export async function submitProductInquiry(input: InquiryInput) {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role;
  const buyerUserId =
    session?.user?.id && role === "buyer" ? session.user.id : undefined;

  const typeLabel = input.type === "b2b" ? "[B2B Quote Request]" : "[Add to Cart]";
  const messageBody = [
    `Contact: ${input.buyerEmail}`,
    input.message ? `\nMessage: ${input.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.rfq.create({
    data: {
      organizationId: input.organizationId,
      ...(buyerUserId ? { buyerUserId } : {}),
      buyerName: input.buyerName,
      buyerLocation: input.buyerEmail,
      product: `${typeLabel} ${input.productName}`,
      quantity: input.quantity,
      message: messageBody || null,
      status: "NEW",
    },
  });

  const recipients = await getOrganizationMemberEmails(input.organizationId);
  const productLine = `${typeLabel} ${input.productName}`.trim();
  if (recipients.length > 0) {
    await notifyOrganizationNewRfq({
      recipients,
      productLine,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
    });
  }
  await notifyBuyerInquiryConfirmation({
    to: input.buyerEmail,
    buyerName: input.buyerName,
    productLine,
    signedInBuyer: !!buyerUserId,
  });
}

export type CartQuoteLineInput = {
  organizationId: string;
  organizationName: string;
  productName: string;
  /** Shown on the RFQ (e.g. requested units). */
  quantityLabel: string;
};

/** Creates one RFQ per cart line and sends a single buyer confirmation listing all lines. */
export async function submitCartQuoteRequests(input: {
  buyerName: string;
  buyerEmail: string;
  message?: string;
  lines: CartQuoteLineInput[];
}) {
  const session = await getSession();
  const role = (session?.user as { role?: string })?.role;
  const buyerUserId =
    session?.user?.id && role === "buyer" ? session.user.id : undefined;

  const lines = input.lines.filter((l) => l.organizationId && l.productName.trim());
  if (lines.length === 0) {
    throw new Error("No valid lines");
  }

  const typeLabel = "[Cart checkout]";
  const messageBody = [
    `Contact: ${input.buyerEmail}`,
    input.message ? `\nMessage: ${input.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  for (const line of lines) {
    await prisma.rfq.create({
      data: {
        organizationId: line.organizationId,
        ...(buyerUserId ? { buyerUserId } : {}),
        buyerName: input.buyerName,
        buyerLocation: input.buyerEmail,
        product: `${typeLabel} ${line.productName.trim()}`,
        quantity: line.quantityLabel.trim(),
        message: messageBody || null,
        status: "NEW",
      },
    });

    const productLine = `${typeLabel} ${line.productName.trim()}`.trim();
    const recipients = await getOrganizationMemberEmails(line.organizationId);
    if (recipients.length > 0) {
      await notifyOrganizationNewRfq({
        recipients,
        productLine,
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
      });
    }
  }

  const linesText = lines
    .map(
      (l) =>
        `- ${l.productName.trim()} · qty ${l.quantityLabel.trim()} (${l.organizationName.trim()})`,
    )
    .join("\n");

  await notifyBuyerCartInquiriesConfirmation({
    to: input.buyerEmail,
    buyerName: input.buyerName,
    linesText,
    signedInBuyer: !!buyerUserId,
  });
}
