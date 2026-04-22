import { prisma } from "~/lib/db";

/** Coalesce rapid RFQ thread emails per (rfq, recipient bucket). */
const WINDOW_MS = 5 * 60 * 1000;

/**
 * Returns whether an email should be sent now and how many messages it should represent.
 * When suppressed, callers should still create in-app notifications.
 */
export async function consumeRfqThreadEmailThrottle(
	rfqId: string,
	recipientKey: string,
): Promise<{ sendEmail: boolean; bundledCount: number }> {
	const now = new Date();
	return prisma.$transaction(async (tx) => {
		const row = await tx.rfqThreadEmailThrottle.findUnique({
			where: {
				rfqId_recipientKey: { rfqId, recipientKey },
			},
		});
		if (!row) {
			await tx.rfqThreadEmailThrottle.create({
				data: {
					rfqId,
					recipientKey,
					pendingCount: 0,
					lastSentAt: now,
				},
			});
			return { sendEmail: true, bundledCount: 1 };
		}
		const last = row.lastSentAt;
		if (last && now.getTime() - last.getTime() < WINDOW_MS) {
			await tx.rfqThreadEmailThrottle.update({
				where: { rfqId_recipientKey: { rfqId, recipientKey } },
				data: { pendingCount: { increment: 1 } },
			});
			return { sendEmail: false, bundledCount: 0 };
		}
		const bundled = row.pendingCount + 1;
		await tx.rfqThreadEmailThrottle.update({
			where: { rfqId_recipientKey: { rfqId, recipientKey } },
			data: { lastSentAt: now, pendingCount: 0 },
		});
		return { sendEmail: true, bundledCount: bundled };
	});
}
