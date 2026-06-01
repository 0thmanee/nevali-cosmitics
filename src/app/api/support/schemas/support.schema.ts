import { z } from "zod";

export const createSupportTicketSchema = z.object({
	subject: z.string().min(1, "Subject is required").max(200),
	category: z.string().min(1, "Category is required").max(100),
	priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
	message: z.string().min(1, "Message is required").max(5000),
});

export type CreateSupportTicketInput = z.infer<
	typeof createSupportTicketSchema
>;

export type SupportTicketRow = {
	id: string;
	organizationId: string;
	subject: string;
	category: string;
	priority: string;
	status: string;
	message: string;
	adminNotes: string | null;
	createdAt: Date;
	updatedAt: Date;
};

/** Admin list row: ticket with organization name. */
export type SupportTicketAdminRow = SupportTicketRow & {
	organizationName: string;
};

export type SupportTicketStatusEventRow = {
	id: string;
	supportTicketId: string;
	status: string;
	userId: string | null;
	createdAt: Date;
};

/** Admin detail: ticket with org name and status history. */
export type SupportTicketDetailForAdmin = SupportTicketRow & {
	organizationName: string;
	statusEvents: SupportTicketStatusEventRow[];
};

export const updateSupportTicketAdminNotesSchema = z.object({
	ticketId: z.string().min(1, "Ticket ID is required"),
	adminNotes: z.string().max(10000).nullable(),
});
export type UpdateSupportTicketAdminNotesInput = z.infer<
	typeof updateSupportTicketAdminNotesSchema
>;

export const updateSupportTicketStatusSchema = z.object({
	ticketId: z.string().min(1, "Ticket ID is required"),
	status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED"]),
});

export type UpdateSupportTicketStatusInput = z.infer<
	typeof updateSupportTicketStatusSchema
>;
