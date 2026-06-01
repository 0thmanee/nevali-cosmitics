import { prisma } from "~/lib/db";
import type {
	SupportTicketAdminRow,
	SupportTicketDetailForAdmin,
	SupportTicketRow,
	SupportTicketStatusEventRow,
} from "../schemas/support.schema";

const select = {
	id: true,
	organizationId: true,
	subject: true,
	category: true,
	priority: true,
	status: true,
	message: true,
	adminNotes: true,
	createdAt: true,
	updatedAt: true,
} as const;

const statusEventSelect = {
	id: true,
	supportTicketId: true,
	status: true,
	userId: true,
	createdAt: true,
} as const;

/** Admin: list all tickets with optional organizationId and status filter; include organization name. */
export async function listSupportTicketsForAdminRepo(
	filters: {
		organizationId?: string;
		status?: "OPEN" | "IN_REVIEW" | "RESOLVED";
	} = {},
): Promise<SupportTicketAdminRow[]> {
	const where: { organizationId?: string; status?: string } = {};
	if (filters.organizationId) where.organizationId = filters.organizationId;
	if (filters.status) where.status = filters.status;
	const rows = await prisma.supportTicket.findMany({
		where: Object.keys(where).length ? where : undefined,
		orderBy: { createdAt: "desc" },
		select: {
			...select,
			organization: { select: { name: true } },
		},
	});
	return rows.map(({ organization, ...t }) => ({
		...t,
		organizationName: organization.name,
	})) as SupportTicketAdminRow[];
}

export async function updateSupportTicketStatusRepo(
	ticketId: string,
	status: "OPEN" | "IN_REVIEW" | "RESOLVED",
	userId?: string,
): Promise<SupportTicketRow | null> {
	const [row] = await prisma.$transaction([
		prisma.supportTicket.update({
			where: { id: ticketId },
			data: { status },
			select,
		}),
		prisma.supportTicketStatusEvent.create({
			data: { supportTicketId: ticketId, status, userId: userId ?? null },
			select: statusEventSelect,
		}),
	]);
	return row as SupportTicketRow;
}

/** Admin: get one ticket with org name and status history. */
export async function getSupportTicketForAdminRepo(
	ticketId: string,
): Promise<SupportTicketDetailForAdmin | null> {
	const ticket = await prisma.supportTicket.findUnique({
		where: { id: ticketId },
		select: {
			...select,
			organization: { select: { name: true } },
			statusEvents: {
				orderBy: { createdAt: "desc" },
				select: statusEventSelect,
			},
		},
	});
	if (!ticket) return null;
	let statusEvents = ticket.statusEvents as SupportTicketStatusEventRow[];
	if (statusEvents.length === 0) {
		await backfillStatusEventForTicketRepo(ticketId);
		const again = await prisma.supportTicket.findUnique({
			where: { id: ticketId },
			select: {
				statusEvents: {
					orderBy: { createdAt: "desc" },
					select: statusEventSelect,
				},
			},
		});
		statusEvents = (again?.statusEvents ?? []) as SupportTicketStatusEventRow[];
	}
	const { organization, statusEvents: _, ...t } = ticket;
	return {
		...t,
		organizationName: ticket.organization.name,
		statusEvents,
	} as SupportTicketDetailForAdmin;
}

export async function updateSupportTicketAdminNotesRepo(
	ticketId: string,
	adminNotes: string | null,
): Promise<SupportTicketRow | null> {
	const row = await prisma.supportTicket.update({
		where: { id: ticketId },
		data: { adminNotes: adminNotes || null },
		select,
	});
	return row as SupportTicketRow;
}

export async function listTicketsByOrganizationId(
	organizationId: string,
): Promise<SupportTicketRow[]> {
	const rows = await prisma.supportTicket.findMany({
		where: { organizationId },
		orderBy: { createdAt: "desc" },
		select,
	});
	return rows as SupportTicketRow[];
}

/** Count tickets for a producer org with status OPEN or IN_REVIEW. */
export async function countOpenSupportTicketsByOrganizationId(
	organizationId: string,
): Promise<number> {
	return prisma.supportTicket.count({
		where: {
			organizationId,
			status: { in: ["OPEN", "IN_REVIEW"] },
		},
	});
}

/** Admin: counts by status for tab badges (optional organizationId). */
export async function getAdminSupportTicketCountsRepo(
	organizationId?: string | null,
): Promise<{
	ALL: number;
	OPEN: number;
	IN_REVIEW: number;
	RESOLVED: number;
}> {
	const base = organizationId ? { organizationId } : {};
	const [ALL, OPEN, IN_REVIEW, RESOLVED] = await Promise.all([
		prisma.supportTicket.count({ where: base }),
		prisma.supportTicket.count({ where: { ...base, status: "OPEN" } }),
		prisma.supportTicket.count({ where: { ...base, status: "IN_REVIEW" } }),
		prisma.supportTicket.count({ where: { ...base, status: "RESOLVED" } }),
	]);
	return { ALL, OPEN, IN_REVIEW, RESOLVED };
}

export async function createTicketRepo(data: {
	organizationId: string;
	subject: string;
	category: string;
	priority: string;
	message: string;
}): Promise<SupportTicketRow> {
	const row = await prisma.$transaction(async (tx) => {
		const ticket = await tx.supportTicket.create({
			data: {
				organizationId: data.organizationId,
				subject: data.subject,
				category: data.category,
				priority: data.priority,
				status: "OPEN",
				message: data.message,
			},
			select,
		});
		await tx.supportTicketStatusEvent.create({
			data: { supportTicketId: ticket.id, status: "OPEN" },
		});
		return ticket;
	});
	return row as SupportTicketRow;
}

/** Producer: append a follow-up message to an existing ticket. */
export async function appendProducerReplyRepo(
	ticketId: string,
	organizationId: string,
	reply: string,
): Promise<SupportTicketRow> {
	const ticket = await prisma.supportTicket.findFirst({
		where: { id: ticketId, organizationId },
		select: { id: true, message: true },
	});
	if (!ticket) throw new Error("Ticket not found or access denied.");
	const date = new Date().toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
	const updated =
		ticket.message + `\n\n---\n[Follow-up · ${date}]\n` + reply.trim();
	const row = await prisma.supportTicket.update({
		where: { id: ticketId },
		data: { message: updated },
		select,
	});
	return row as SupportTicketRow;
}

/** Backfill status event for tickets that were updated before we had events (optional). */
export async function backfillStatusEventForTicketRepo(
	ticketId: string,
): Promise<void> {
	const ticket = await prisma.supportTicket.findUnique({
		where: { id: ticketId },
		select: {
			status: true,
			statusEvents: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: { id: true },
			},
		},
	});
	if (!ticket || ticket.statusEvents.length > 0) return;
	await prisma.supportTicketStatusEvent.create({
		data: { supportTicketId: ticketId, status: ticket.status },
	});
}
