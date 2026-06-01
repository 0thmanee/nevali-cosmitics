"use server";

import { redirect } from "next/navigation";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { getProducerOrgId } from "~/app/api/producer-context";
import {
	appendProducerReplyRepo,
	countOpenSupportTicketsByOrganizationId,
	createTicketRepo,
	getAdminSupportTicketCountsRepo,
	getSupportTicketForAdminRepo,
	listSupportTicketsForAdminRepo,
	listTicketsByOrganizationId,
	updateSupportTicketAdminNotesRepo,
	updateSupportTicketStatusRepo,
} from "./repo/support.repo";
import type {
	CreateSupportTicketInput,
	UpdateSupportTicketAdminNotesInput,
	UpdateSupportTicketStatusInput,
} from "./schemas/support.schema";
import {
	createSupportTicketSchema,
	updateSupportTicketAdminNotesSchema,
	updateSupportTicketStatusSchema,
} from "./schemas/support.schema";

async function requireSuperadmin() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		redirectNonSuperadminHome();
	}
}

async function requireProducerOrganizationId(): Promise<string> {
	const orgId = await getProducerOrgId();
	if (!orgId)
		redirect(
			"/auth/login?callbackUrl=" + encodeURIComponent("/artisan/support"),
		);
	return orgId;
}

/** List support tickets for the current producer's organization. (adminNotes omitted.) */
export async function listMySupportTickets() {
	const organizationId = await requireProducerOrganizationId();
	const rows = await listTicketsByOrganizationId(organizationId);
	return rows.map(({ adminNotes: _, ...r }) => ({
		...r,
		adminNotes: null,
	})) as Awaited<ReturnType<typeof listTicketsByOrganizationId>>;
}

/** Open support tickets count for current producer (for nav badge). */
export async function getOpenSupportTicketsCountForCurrentProducer(): Promise<number> {
	const organizationId = await requireProducerOrganizationId();
	return countOpenSupportTicketsByOrganizationId(organizationId);
}

/** Create a new support ticket. */
export async function createSupportTicket(data: CreateSupportTicketInput) {
	const organizationId = await requireProducerOrganizationId();
	const parsed = createSupportTicketSchema.parse(data);
	return createTicketRepo({
		organizationId,
		subject: parsed.subject,
		category: parsed.category,
		priority: parsed.priority,
		message: parsed.message,
	});
}

/** Add a follow-up message to a ticket (producer only, scoped to their org). */
export async function addProducerReply(ticketId: string, reply: string) {
	const organizationId = await requireProducerOrganizationId();
	if (!reply.trim()) throw new Error("Reply cannot be empty.");
	return appendProducerReplyRepo(ticketId, organizationId, reply);
}

// —— Admin ——

/** List all support tickets with optional organizationId and status filter. */
export async function listSupportTicketsForAdmin(
	filters: {
		organizationId?: string;
		status?: "OPEN" | "IN_REVIEW" | "RESOLVED";
	} = {},
) {
	await requireSuperadmin();
	return listSupportTicketsForAdminRepo(filters);
}

/** Admin support ticket counts by status (optional organizationId). */
export async function getAdminSupportTicketCounts(
	organizationId?: string | null,
): Promise<{
	ALL: number;
	OPEN: number;
	IN_REVIEW: number;
	RESOLVED: number;
}> {
	await requireSuperadmin();
	return getAdminSupportTicketCountsRepo(organizationId);
}

/** Update a support ticket's status (admin). Records status event with current user id. */
export async function updateSupportTicketStatus(
	input: UpdateSupportTicketStatusInput,
) {
	await requireSuperadmin();
	const session = await getSession();
	const parsed = updateSupportTicketStatusSchema.parse(input);
	const userId = (session?.user as { id?: string })?.id;
	return updateSupportTicketStatusRepo(parsed.ticketId, parsed.status, userId);
}

/** Admin: get one ticket with org name and status history. */
export async function getSupportTicketForAdmin(ticketId: string) {
	await requireSuperadmin();
	return getSupportTicketForAdminRepo(ticketId);
}

/** Admin: update internal notes on a support ticket. */
export async function updateSupportTicketAdminNotes(
	input: UpdateSupportTicketAdminNotesInput,
) {
	await requireSuperadmin();
	const parsed = updateSupportTicketAdminNotesSchema.parse(input);
	return updateSupportTicketAdminNotesRepo(parsed.ticketId, parsed.adminNotes);
}
