import { prisma } from "~/lib/db";
import type {
	ContractAdminRow,
	ContractRow,
	RfqAdminRow,
	RfqMessageRow,
	RfqRow,
} from "../schemas/contracts.schema";

const rfqSelect = {
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

const rfqMessageAttachmentSelect = {
	id: true,
	url: true,
	fileName: true,
	mimeType: true,
	sizeBytes: true,
} as const;

const rfqMessageSelect = {
	id: true,
	rfqId: true,
	authorUserId: true,
	authorRole: true,
	body: true,
	createdAt: true,
	attachments: {
		select: rfqMessageAttachmentSelect,
		orderBy: { createdAt: "asc" as const },
	},
} as const;

const contractSelect = {
	id: true,
	organizationId: true,
	rfqId: true,
	buyerName: true,
	buyerLocation: true,
	product: true,
	quantityLabel: true,
	valueLabel: true,
	valueCents: true,
	status: true,
	startedAt: true,
	expiresAt: true,
	progress: true,
	deliveriesTotal: true,
	deliveriesCompleted: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function listRfqsByOrganizationId(
	organizationId: string,
): Promise<RfqRow[]> {
	const rows = await prisma.rfq.findMany({
		where: { organizationId },
		orderBy: { createdAt: "desc" },
		select: rfqSelect,
	});
	return rows as RfqRow[];
}

export async function listRfqsByBuyerUserId(
	buyerUserId: string,
): Promise<RfqRow[]> {
	const rows = await prisma.rfq.findMany({
		where: { buyerUserId },
		orderBy: { createdAt: "desc" },
		select: rfqSelect,
	});
	return rows as RfqRow[];
}

export async function listContractsByOrganizationId(
	organizationId: string,
	status?: "ACTIVE" | "COMPLETED",
): Promise<ContractRow[]> {
	const rows = await prisma.contract.findMany({
		where: { organizationId, ...(status ? { status } : {}) },
		orderBy:
			status === "COMPLETED" ? { expiresAt: "desc" } : { updatedAt: "desc" },
		select: contractSelect,
	});
	return rows as ContractRow[];
}

/** Admin: list all RFQs with optional filters; include organization name. */
export async function listRfqsForAdminRepo(
	filters: { organizationId?: string; status?: RfqRow["status"] } = {},
): Promise<RfqAdminRow[]> {
	const where: { organizationId?: string; status?: RfqRow["status"] } = {};
	if (filters.organizationId) where.organizationId = filters.organizationId;
	if (filters.status) where.status = filters.status;
	const rows = await prisma.rfq.findMany({
		where: Object.keys(where).length ? where : undefined,
		orderBy: { createdAt: "desc" },
		select: {
			...rfqSelect,
			organization: { select: { name: true } },
		},
	});
	return rows.map(({ organization, ...r }) => ({
		...r,
		organizationName: organization.name,
	})) as RfqAdminRow[];
}

/** Admin: list all contracts with optional filters; include organization name. */
export async function listContractsForAdminRepo(
	filters: { organizationId?: string; status?: ContractRow["status"] } = {},
): Promise<ContractAdminRow[]> {
	const where: { organizationId?: string; status?: ContractRow["status"] } = {};
	if (filters.organizationId) where.organizationId = filters.organizationId;
	if (filters.status) where.status = filters.status;
	const rows = await prisma.contract.findMany({
		where: Object.keys(where).length ? where : undefined,
		orderBy: { updatedAt: "desc" },
		select: {
			...contractSelect,
			organization: { select: { name: true } },
		},
	});
	return rows.map(({ organization, ...r }) => ({
		...r,
		organizationName: organization.name,
	})) as ContractAdminRow[];
}

/** Admin: set RFQ status (e.g. CANCELLED). */
export async function setRfqStatusAdminRepo(
	rfqId: string,
	status: RfqRow["status"],
): Promise<RfqRow | null> {
	const row = await prisma.rfq.update({
		where: { id: rfqId },
		data: { status, negotiationTurn: null },
		select: rfqSelect,
	});
	return row as RfqRow;
}

/** Admin: set contract status (e.g. COMPLETED). */
export async function setContractStatusAdminRepo(
	contractId: string,
	status: ContractRow["status"],
): Promise<ContractRow | null> {
	const row = await prisma.contract.update({
		where: { id: contractId },
		data: { status },
		select: contractSelect,
	});
	return row as ContractRow;
}

/** Producer: NEW → QUOTED with estimate + optional deadline. */
export async function submitProducerRfqQuoteRepo(
	organizationId: string,
	rfqId: string,
	input: { estimatedValue: string; deadlineAt: Date | null },
): Promise<RfqRow | null> {
	const existing = await prisma.rfq.findFirst({
		where: { id: rfqId, organizationId, status: "NEW" },
		select: { id: true },
	});
	if (!existing) return null;
	const row = await prisma.rfq.update({
		where: { id: rfqId },
		data: {
			status: "QUOTED",
			estimatedValue: input.estimatedValue.trim(),
			deadlineAt: input.deadlineAt,
			negotiationTurn: null,
		},
		select: rfqSelect,
	});
	return row as RfqRow;
}

/** Producer: update estimate / deadline while QUOTED. */
export async function updateProducerRfqQuoteRepo(
	organizationId: string,
	rfqId: string,
	input: { estimatedValue: string; deadlineAt: Date | null },
): Promise<RfqRow | null> {
	const existing = await prisma.rfq.findFirst({
		where: { id: rfqId, organizationId, status: "QUOTED" },
		select: { id: true },
	});
	if (!existing) return null;
	const row = await prisma.rfq.update({
		where: { id: rfqId },
		data: {
			estimatedValue: input.estimatedValue.trim(),
			deadlineAt: input.deadlineAt,
		},
		select: rfqSelect,
	});
	return row as RfqRow;
}

/** Producer: QUOTED → NEGOTIATING; or end pipeline with DECLINED / CANCELLED. */
export async function transitionProducerRfqRepo(
	organizationId: string,
	rfqId: string,
	action: "negotiate" | "decline" | "cancel",
): Promise<RfqRow | null> {
	const row = await prisma.rfq.findFirst({
		where: { id: rfqId, organizationId },
		select: { id: true, status: true },
	});
	if (!row) return null;

	let newStatus: RfqRow["status"] | null = null;
	if (action === "negotiate" && row.status === "QUOTED")
		newStatus = "NEGOTIATING";
	if (
		action === "decline" &&
		(row.status === "NEW" ||
			row.status === "QUOTED" ||
			row.status === "NEGOTIATING")
	) {
		newStatus = "DECLINED";
	}
	if (
		action === "cancel" &&
		(row.status === "NEW" ||
			row.status === "QUOTED" ||
			row.status === "NEGOTIATING")
	) {
		newStatus = "CANCELLED";
	}
	if (!newStatus) return null;

	const negotiationTurn =
		action === "negotiate" && newStatus === "NEGOTIATING" ? "BUYER" : null;

	const updated = await prisma.rfq.update({
		where: { id: rfqId },
		data: { status: newStatus, negotiationTurn },
		select: rfqSelect,
	});
	return updated as RfqRow;
}

/** Best-effort parse of euro amount from free-text labels (~€12,500 / month → cents). */
export function parseEuroCentsFromLabel(
	value: string | null | undefined,
): number | null {
	if (!value?.trim()) return null;
	const s = value.replace(/\s/g, "").replace(/€/g, "");
	const normalized =
		s.includes(",") && !s.includes(".")
			? s.replace(/\./g, "").replace(",", ".")
			: s.replace(/,/g, "");
	const m = normalized.match(/[\d.]+/);
	if (!m?.[0]) return null;
	const n = Number.parseFloat(m[0]);
	if (Number.isNaN(n)) return null;
	return Math.round(n * 100);
}

/**
 * Create ACTIVE contract from RFQ (QUOTED or NEGOTIATING), link rfqId, close RFQ as CANCELLED with audit note.
 * Idempotent guard: returns null if a contract already exists for this rfqId.
 */
export async function createContractFromRfqRepo(
	rfq: RfqRow,
): Promise<{ contract: ContractRow; rfq: RfqRow } | null> {
	if (rfq.status !== "QUOTED" && rfq.status !== "NEGOTIATING") return null;

	const dup = await prisma.contract.findFirst({
		where: { rfqId: rfq.id },
		select: { id: true },
	});
	if (dup) return null;

	const now = new Date();
	const expiresAt = new Date(now);
	expiresAt.setFullYear(expiresAt.getFullYear() + 1);

	const quantityLabel = rfq.quantity?.trim() || "—";
	const valueLabel = rfq.estimatedValue?.trim() || "TBD";
	const valueCents = parseEuroCentsFromLabel(rfq.estimatedValue);
	const closedNote =
		"[CraftHouse] Inquiry closed — converted to an active contract.";
	const newMessage = rfq.message?.trim()
		? `${rfq.message.trim()}\n\n${closedNote}`
		: closedNote;

	return prisma.$transaction(async (tx) => {
		const contract = await tx.contract.create({
			data: {
				organizationId: rfq.organizationId,
				rfqId: rfq.id,
				buyerName: rfq.buyerName,
				buyerLocation: rfq.buyerLocation,
				product: rfq.product,
				quantityLabel,
				valueLabel,
				valueCents,
				status: "ACTIVE",
				startedAt: now,
				expiresAt,
				progress: 0,
				deliveriesTotal: 0,
				deliveriesCompleted: 0,
			},
			select: contractSelect,
		});
		const updatedRfq = await tx.rfq.update({
			where: { id: rfq.id },
			data: {
				status: "CANCELLED",
				message: newMessage,
			},
			select: rfqSelect,
		});
		return { contract: contract as ContractRow, rfq: updatedRfq as RfqRow };
	});
}

export async function listRfqMessagesByRfqId(
	rfqId: string,
): Promise<RfqMessageRow[]> {
	const rows = await prisma.rfqMessage.findMany({
		where: { rfqId },
		orderBy: { createdAt: "asc" },
		select: rfqMessageSelect,
	});
	return rows.map((r) => ({
		...r,
		authorRole: r.authorRole as "BUYER" | "PARTNER",
		attachments: r.attachments.map((a) => ({ ...a })),
	}));
}

export type RfqMessageAttachmentInput = {
	url: string;
	fileName?: string | null;
	mimeType?: string | null;
	sizeBytes?: number | null;
};

export async function appendRfqMessageAndAdvanceTurn(params: {
	rfqId: string;
	authorUserId: string;
	authorRole: "BUYER" | "PARTNER";
	body: string;
	rfqStatus: RfqRow["status"];
	attachments?: RfqMessageAttachmentInput[];
}): Promise<{ message: RfqMessageRow; rfq: RfqRow }> {
	return prisma.$transaction(async (tx) => {
		const msg = await tx.rfqMessage.create({
			data: {
				rfqId: params.rfqId,
				authorUserId: params.authorUserId,
				authorRole: params.authorRole,
				body: params.body,
			},
			select: { id: true },
		});
		const atts = params.attachments?.filter((a) => a.url?.trim()) ?? [];
		if (atts.length > 0) {
			await tx.rfqMessageAttachment.createMany({
				data: atts.map((a) => ({
					rfqMessageId: msg.id,
					url: a.url.trim(),
					fileName: a.fileName?.trim() || null,
					mimeType: a.mimeType?.trim() || null,
					sizeBytes: a.sizeBytes ?? null,
				})),
			});
		}
		const negotiationTurn =
			params.rfqStatus === "NEGOTIATING"
				? params.authorRole === "BUYER"
					? "PARTNER"
					: "BUYER"
				: undefined;
		const rfq = await tx.rfq.update({
			where: { id: params.rfqId },
			data: negotiationTurn === undefined ? {} : { negotiationTurn },
			select: rfqSelect,
		});
		const full = await tx.rfqMessage.findUniqueOrThrow({
			where: { id: msg.id },
			select: rfqMessageSelect,
		});
		return {
			message: {
				...full,
				authorRole: params.authorRole,
				attachments: full.attachments.map((a) => ({ ...a })),
			},
			rfq: rfq as RfqRow,
		};
	});
}

/** Counts and revenue for producer dashboard. */
export async function getProducerContractStats(organizationId: string) {
	/** Inquiries the producer has not yet acted on (no quote / status change past NEW). */
	const [
		openRfqs,
		pendingReplyCount,
		activeContracts,
		completedContracts,
		revenueResult,
	] = await Promise.all([
		prisma.rfq.count({
			where: { organizationId, status: { notIn: ["DECLINED", "CANCELLED"] } },
		}),
		prisma.rfq.count({
			where: { organizationId, status: "NEW" },
		}),
		prisma.contract.count({
			where: { organizationId, status: "ACTIVE" },
		}),
		prisma.contract.count({
			where: { organizationId, status: "COMPLETED" },
		}),
		prisma.contract.aggregate({
			where: {
				organizationId,
				status: { in: ["ACTIVE", "COMPLETED"] },
				valueCents: { not: null },
			},
			_sum: { valueCents: true },
		}),
	]);

	const totalCents = revenueResult._sum.valueCents ?? 0;
	const revenueYtd =
		totalCents >= 0
			? new Intl.NumberFormat("de-DE", {
					style: "currency",
					currency: "EUR",
					maximumFractionDigits: 0,
				}).format(totalCents / 100)
			: "€0";

	return {
		openRfqs,
		activeContracts,
		completedContracts,
		revenueYtd,
		pendingReplyCount,
	};
}
