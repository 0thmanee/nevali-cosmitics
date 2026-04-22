import { z } from "zod";

/**
 * RFQ and Contract types for producer (organization-scoped) and admin.
 */

export type RfqStatus =
	| "NEW"
	| "QUOTED"
	| "NEGOTIATING"
	| "DECLINED"
	| "CANCELLED";

export type ContractStatus = "ACTIVE" | "COMPLETED";

export type RfqRow = {
	id: string;
	organizationId: string;
	buyerUserId: string | null;
	buyerName: string;
	buyerLocation: string | null;
	product: string;
	quantity: string;
	message: string | null;
	status: RfqStatus;
	estimatedValue: string | null;
	deadlineAt: Date | null;
	/** When status is NEGOTIATING: who should post next in the RFQ thread. */
	negotiationTurn: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type RfqMessageAttachmentRow = {
	id: string;
	url: string;
	fileName: string | null;
	mimeType: string | null;
	sizeBytes: number | null;
};

export type RfqMessageRow = {
	id: string;
	rfqId: string;
	authorUserId: string;
	authorRole: "BUYER" | "PARTNER";
	body: string;
	createdAt: Date;
	attachments: RfqMessageAttachmentRow[];
};

export type ContractRow = {
	id: string;
	organizationId: string;
	rfqId: string | null;
	buyerName: string;
	buyerLocation: string | null;
	product: string;
	quantityLabel: string;
	valueLabel: string;
	valueCents: number | null;
	status: ContractStatus;
	startedAt: Date;
	expiresAt: Date;
	progress: number;
	deliveriesTotal: number;
	deliveriesCompleted: number;
	createdAt: Date;
	updatedAt: Date;
};

/** Admin list row: RFQ with organization name. */
export type RfqAdminRow = RfqRow & { organizationName: string };

/** Admin list row: Contract with organization name. */
export type ContractAdminRow = ContractRow & { organizationName: string };

export const setRfqStatusAdminSchema = z.object({
	rfqId: z.string().cuid(),
	status: z.enum(["NEW", "QUOTED", "NEGOTIATING", "DECLINED", "CANCELLED"]),
});
export type SetRfqStatusAdminInput = z.infer<typeof setRfqStatusAdminSchema>;

export const setContractStatusAdminSchema = z.object({
	contractId: z.string().cuid(),
	status: z.enum(["ACTIVE", "COMPLETED"]),
});
export type SetContractStatusAdminInput = z.infer<
	typeof setContractStatusAdminSchema
>;

/** Producer: first quote on a NEW RFQ (or update quote fields on QUOTED). */
export const submitProducerRfqQuoteSchema = z.object({
	rfqId: z.string().cuid(),
	estimatedValue: z.string().min(1, "Estimate is required").max(200),
	/** HTML date input `YYYY-MM-DD`, or empty for no deadline */
	deadlineAt: z.string().max(32).optional().nullable(),
});
export type SubmitProducerRfqQuoteInput = z.infer<
	typeof submitProducerRfqQuoteSchema
>;

/** Producer: workflow transitions (scoped to org in actions). */
export const producerRfqTransitionSchema = z.object({
	rfqId: z.string().cuid(),
	action: z.enum(["negotiate", "decline", "cancel"]),
});
export type ProducerRfqTransitionInput = z.infer<
	typeof producerRfqTransitionSchema
>;

/** Create an active contract from a quoted/negotiating RFQ (producer or buyer). */
export const createContractFromRfqSchema = z.object({
	rfqId: z.string().cuid(),
});
export type CreateContractFromRfqInput = z.infer<
	typeof createContractFromRfqSchema
>;

export const rfqMessageAttachmentInputSchema = z.object({
	url: z.string().url().max(2048),
	fileName: z.string().max(256).optional().nullable(),
	mimeType: z.string().max(128).optional().nullable(),
	sizeBytes: z
		.number()
		.int()
		.positive()
		.max(10 * 1024 * 1024)
		.optional()
		.nullable(),
});

export const postRfqMessageSchema = z.object({
	rfqId: z.string().cuid(),
	body: z.string().trim().min(1, "Message is required").max(4000),
	attachments: z.array(rfqMessageAttachmentInputSchema).max(5).optional(),
});
export type PostRfqMessageInput = z.infer<typeof postRfqMessageSchema>;
