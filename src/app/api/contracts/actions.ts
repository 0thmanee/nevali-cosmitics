"use server";

import { redirect } from "next/navigation";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { getProducerOrgId } from "~/app/api/producer-context";
import { prisma } from "~/lib/db";
import {
	getOrganizationMemberEmails,
	notifyAfterRfqThreadMessage,
	notifyContractRecordedFromRfq,
	notifyLinkedBuyerOfRfqChange,
} from "~/lib/notifications";
import { isRfqMessageAttachmentUrlForUser } from "~/lib/rfq-message-attachment-url";
import {
	appendRfqMessageAndAdvanceTurn,
	createContractFromRfqRepo,
	getProducerContractStats,
	listContractsByOrganizationId,
	listContractsForAdminRepo,
	listRfqMessagesByRfqId,
	listRfqsByBuyerUserId,
	listRfqsByOrganizationId,
	listRfqsForAdminRepo,
	setContractStatusAdminRepo,
	setRfqStatusAdminRepo,
	submitProducerRfqQuoteRepo,
	transitionProducerRfqRepo,
	updateProducerRfqQuoteRepo,
} from "./repo/contracts.repo";
import type {
	ContractRow,
	CreateContractFromRfqInput,
	PostRfqMessageInput,
	ProducerRfqTransitionInput,
	RfqMessageRow,
	RfqRow,
	SetContractStatusAdminInput,
	SetRfqStatusAdminInput,
	SubmitProducerRfqQuoteInput,
} from "./schemas/contracts.schema";
import {
	createContractFromRfqSchema,
	postRfqMessageSchema,
	producerRfqTransitionSchema,
	setContractStatusAdminSchema,
	setRfqStatusAdminSchema,
	submitProducerRfqQuoteSchema,
} from "./schemas/contracts.schema";

async function requireProducerOrganizationId(): Promise<string> {
	const orgId = await getProducerOrgId();
	if (!orgId)
		redirect("/auth/login?callbackUrl=" + encodeURIComponent("/artisan"));
	return orgId;
}

async function requireSuperadmin() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		redirectNonSuperadminHome();
	}
}

/** List RFQs for the current producer's organization. */
export async function listMyRfqs() {
	const organizationId = await requireProducerOrganizationId();
	return listRfqsByOrganizationId(organizationId);
}

/** List RFQs submitted by the current buyer (logged-in product inquiries). */
export async function listMyBuyerRfqs() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/auth/login?callbackUrl=" + encodeURIComponent("/buyer/rfqs"));
	}
	const role = (session.user as { role?: string })?.role;
	if (role !== "buyer") {
		redirectNonSuperadminHome();
	}
	return listRfqsByBuyerUserId(session.user.id);
}

/** List active contracts for the current producer's organization. */
export async function listMyActiveContracts() {
	const organizationId = await requireProducerOrganizationId();
	return listContractsByOrganizationId(organizationId, "ACTIVE");
}

/** List completed contracts (history) for the current producer's organization. */
export async function listMyCompletedContracts() {
	const organizationId = await requireProducerOrganizationId();
	return listContractsByOrganizationId(organizationId, "COMPLETED");
}

/** Dashboard stats: open RFQs, active contracts, revenue YTD (from contracts repo). */
export async function getProducerContractStatsAction() {
	const orgId = await getProducerOrgId();
	if (!orgId)
		return {
			openRfqs: 0,
			activeContracts: 0,
			completedContracts: 0,
			revenueYtd: "€0",
			pendingReplyCount: 0,
		};
	return getProducerContractStats(orgId);
}

function parseRfqDeadlineInput(
	deadlineAt: string | null | undefined,
): Date | null {
	if (deadlineAt == null || String(deadlineAt).trim() === "") return null;
	const d = new Date(`${String(deadlineAt).trim()}T12:00:00`);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** Partner: submit first quote (NEW → QUOTED). */
export async function submitProducerRfqQuote(
	input: SubmitProducerRfqQuoteInput,
): Promise<{ error?: string; rfq?: RfqRow }> {
	const organizationId = await requireProducerOrganizationId();
	const parsed = submitProducerRfqQuoteSchema.parse(input);
	const row = await submitProducerRfqQuoteRepo(organizationId, parsed.rfqId, {
		estimatedValue: parsed.estimatedValue,
		deadlineAt: parseRfqDeadlineInput(parsed.deadlineAt),
	});
	if (!row) return { error: "RFQ not found or is not awaiting a new quote." };
	await notifyLinkedBuyerOfRfqChange(row, "quoted");
	return { rfq: row };
}

/** Partner: update quote fields while status is QUOTED. */
export async function updateProducerRfqQuote(
	input: SubmitProducerRfqQuoteInput,
): Promise<{ error?: string; rfq?: RfqRow }> {
	const organizationId = await requireProducerOrganizationId();
	const parsed = submitProducerRfqQuoteSchema.parse(input);
	const row = await updateProducerRfqQuoteRepo(organizationId, parsed.rfqId, {
		estimatedValue: parsed.estimatedValue,
		deadlineAt: parseRfqDeadlineInput(parsed.deadlineAt),
	});
	if (!row) return { error: "RFQ not found or is not in quoted state." };
	return { rfq: row };
}

/** Partner: open negotiation, decline, or cancel an RFQ (org-scoped). */
export async function transitionProducerRfq(
	input: ProducerRfqTransitionInput,
): Promise<{ error?: string; rfq?: RfqRow }> {
	const organizationId = await requireProducerOrganizationId();
	const parsed = producerRfqTransitionSchema.parse(input);
	const row = await transitionProducerRfqRepo(
		organizationId,
		parsed.rfqId,
		parsed.action,
	);
	if (!row) {
		return {
			error:
				"RFQ not found or this action is not allowed for its current status.",
		};
	}
	const kind =
		parsed.action === "negotiate"
			? "negotiating"
			: parsed.action === "decline"
				? "declined"
				: "cancelled_by_seller";
	await notifyLinkedBuyerOfRfqChange(row, kind);
	return { rfq: row };
}

const rfqRowSelect = {
	id: true,
	organizationId: true,
	buyerUserId: true,
	buyerName: true,
	buyerLocation: true,
	product: true,
	quantity: true,
	message: true,
	status: true,
	estimatedValue: true,
	deadlineAt: true,
	negotiationTurn: true,
	createdAt: true,
	updatedAt: true,
} as const;

async function notifyAfterContractFromRfq(
	organizationId: string,
	snapshot: RfqRow,
	contract: ContractRow,
): Promise<void> {
	const orgMemberEmails = await getOrganizationMemberEmails(organizationId);
	await notifyContractRecordedFromRfq({
		orgMemberEmails: orgMemberEmails,
		productLine: contract.product,
		valueLabel: contract.valueLabel,
		buyerUserId: snapshot.buyerUserId,
		buyerContactEmail: snapshot.buyerLocation,
	});
}

/** Partner: record an active contract from a quoted or negotiating RFQ (closes the RFQ). */
export async function createContractFromRfqProducer(
	input: CreateContractFromRfqInput,
): Promise<{ error?: string; contract?: ContractRow; rfq?: RfqRow }> {
	const organizationId = await requireProducerOrganizationId();
	const parsed = createContractFromRfqSchema.parse(input);
	const rfq = await prisma.rfq.findFirst({
		where: { id: parsed.rfqId, organizationId },
		select: rfqRowSelect,
	});
	if (!rfq) return { error: "RFQ not found." };
	const snapshot = rfq as RfqRow;
	const res = await createContractFromRfqRepo(snapshot);
	if (!res) {
		return {
			error:
				"Cannot create a contract: the inquiry must be Quoted or Negotiating, and must not already have a contract.",
		};
	}
	await notifyAfterContractFromRfq(organizationId, snapshot, res.contract);
	return { contract: res.contract, rfq: res.rfq };
}

/** Buyer: accept and record an active contract (same outcome as artisan “start contract”). */
export async function createContractFromRfqBuyer(
	input: CreateContractFromRfqInput,
): Promise<{ error?: string; contract?: ContractRow; rfq?: RfqRow }> {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/auth/login?callbackUrl=" + encodeURIComponent("/buyer/rfqs"));
	}
	const role = (session.user as { role?: string })?.role;
	if (role !== "buyer") {
		redirectNonSuperadminHome();
	}
	const parsed = createContractFromRfqSchema.parse(input);
	const rfq = await prisma.rfq.findFirst({
		where: { id: parsed.rfqId, buyerUserId: session.user.id },
		select: rfqRowSelect,
	});
	if (!rfq)
		return { error: "Inquiry not found or not linked to your account." };
	const snapshot = rfq as RfqRow;
	const res = await createContractFromRfqRepo(snapshot);
	if (!res) {
		return {
			error:
				"Cannot create a contract yet: wait for a quote, or this inquiry was already converted.",
		};
	}
	await notifyAfterContractFromRfq(
		snapshot.organizationId,
		snapshot,
		res.contract,
	);
	return { contract: res.contract, rfq: res.rfq };
}

async function canAccessRfqThread(
	userId: string,
	role: string | undefined,
	rfq: { organizationId: string; buyerUserId: string | null },
): Promise<boolean> {
	if (role === "buyer") return rfq.buyerUserId === userId;
	if (role === "partner") {
		const orgId = await getProducerOrgId();
		return !!orgId && orgId === rfq.organizationId;
	}
	return false;
}

/** Buyer or partner: list messages on an RFQ they can access. */
export async function listRfqMessagesForMyRfq(
	rfqId: string,
): Promise<{ error?: string; messages?: RfqMessageRow[] }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "You must be signed in." };
	const role = (session.user as { role?: string }).role;
	const rfq = await prisma.rfq.findFirst({
		where: { id: rfqId },
		select: { organizationId: true, buyerUserId: true },
	});
	if (!rfq) return { error: "Inquiry not found." };
	const ok = await canAccessRfqThread(session.user.id, role, rfq);
	if (!ok) return { error: "You do not have access to this inquiry." };
	const messages = await listRfqMessagesByRfqId(rfqId);
	return { messages };
}

/** Buyer or partner: post a thread message (quoted or negotiating RFQs). */
export async function postRfqMessageOnMyRfq(
	input: PostRfqMessageInput,
): Promise<{ error?: string; message?: RfqMessageRow; rfq?: RfqRow }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "You must be signed in." };
	const parsed = postRfqMessageSchema.parse(input);
	const role = (session.user as { role?: string }).role;

	const rfq = await prisma.rfq.findFirst({
		where: { id: parsed.rfqId },
		select: {
			organizationId: true,
			buyerUserId: true,
			status: true,
			negotiationTurn: true,
			product: true,
		},
	});
	if (!rfq) return { error: "Inquiry not found." };
	const ok = await canAccessRfqThread(session.user.id, role, {
		organizationId: rfq.organizationId,
		buyerUserId: rfq.buyerUserId,
	});
	if (!ok) return { error: "You do not have access to this inquiry." };

	if (rfq.status !== "QUOTED" && rfq.status !== "NEGOTIATING") {
		return {
			error:
				"Messaging is only available while the inquiry is quoted or under negotiation.",
		};
	}

	let authorRole: "BUYER" | "PARTNER";
	if (role === "buyer") {
		if (!rfq.buyerUserId || rfq.buyerUserId !== session.user.id) {
			return { error: "Only the buyer who opened this inquiry can post here." };
		}
		authorRole = "BUYER";
	} else if (role === "partner") {
		const orgId = await getProducerOrgId();
		if (!orgId || orgId !== rfq.organizationId)
			return { error: "Not allowed." };
		authorRole = "PARTNER";
	} else {
		return { error: "Only buyer or partner roles can use the inquiry thread." };
	}

	if (rfq.status === "NEGOTIATING" && rfq.negotiationTurn) {
		if (rfq.negotiationTurn !== authorRole) {
			return {
				error: "It is the other party’s turn to reply in this negotiation.",
			};
		}
	}

	const attachments = parsed.attachments ?? [];
	for (const a of attachments) {
		if (!isRfqMessageAttachmentUrlForUser(session.user.id, a.url)) {
			return {
				error:
					"One or more attachments are invalid or were not uploaded by you.",
			};
		}
	}

	const lastMinuteThisRfq = await prisma.rfqMessage.count({
		where: {
			rfqId: parsed.rfqId,
			authorUserId: session.user.id,
			createdAt: { gte: new Date(Date.now() - 60_000) },
		},
	});
	if (lastMinuteThisRfq >= 10) {
		return {
			error:
				"You are sending too many messages on this inquiry. Please wait a minute.",
		};
	}
	const lastMinuteAll = await prisma.rfqMessage.count({
		where: {
			authorUserId: session.user.id,
			createdAt: { gte: new Date(Date.now() - 60_000) },
		},
	});
	if (lastMinuteAll >= 30) {
		return {
			error: "You are sending messages too quickly. Please wait a minute.",
		};
	}

	const res = await appendRfqMessageAndAdvanceTurn({
		rfqId: parsed.rfqId,
		authorUserId: session.user.id,
		authorRole,
		body: parsed.body,
		rfqStatus: rfq.status as RfqRow["status"],
		attachments: attachments.map((a) => ({
			url: a.url.trim(),
			fileName: a.fileName,
			mimeType: a.mimeType,
			sizeBytes: a.sizeBytes,
		})),
	});
	try {
		await notifyAfterRfqThreadMessage({
			rfqId: res.rfq.id,
			product: res.rfq.product,
			organizationId: res.rfq.organizationId,
			buyerUserId: res.rfq.buyerUserId,
			authorUserId: session.user.id,
			authorRole,
			body: parsed.body,
			attachmentCount: res.message.attachments.length,
		});
	} catch {
		// Non-fatal: thread message is already persisted.
	}
	return { message: res.message, rfq: res.rfq };
}

// —— Admin ——

export type ListRfqsForAdminFilters = {
	organizationId?: string;
	status?: string;
};
export type ListContractsForAdminFilters = {
	organizationId?: string;
	status?: string;
};

/** Admin: list all RFQs with optional filters. */
export async function listRfqsForAdmin(filters: ListRfqsForAdminFilters = {}) {
	await requireSuperadmin();
	return listRfqsForAdminRepo({
		organizationId: filters.organizationId,
		status: filters.status as
			| "NEW"
			| "QUOTED"
			| "NEGOTIATING"
			| "DECLINED"
			| "CANCELLED"
			| undefined,
	});
}

/** Admin: list all contracts with optional filters. */
export async function listContractsForAdmin(
	filters: ListContractsForAdminFilters = {},
) {
	await requireSuperadmin();
	return listContractsForAdminRepo({
		organizationId: filters.organizationId,
		status: filters.status as "ACTIVE" | "COMPLETED" | undefined,
	});
}

/** Admin: set RFQ status (e.g. CANCELLED). */
export async function setRfqStatusAdmin(input: SetRfqStatusAdminInput) {
	await requireSuperadmin();
	const parsed = setRfqStatusAdminSchema.parse(input);
	return setRfqStatusAdminRepo(parsed.rfqId, parsed.status);
}

/** Admin: set contract status (e.g. COMPLETED to mark signed/done). */
export async function setContractStatusAdmin(
	input: SetContractStatusAdminInput,
) {
	await requireSuperadmin();
	const parsed = setContractStatusAdminSchema.parse(input);
	return setContractStatusAdminRepo(parsed.contractId, parsed.status);
}
