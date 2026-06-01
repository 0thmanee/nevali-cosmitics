"use server";

import { redirect } from "next/navigation";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { getProducerOrgId } from "~/app/api/producer-context";
import { prisma } from "~/lib/db";
import {
	createEnrollmentRepo,
	createTrainingModuleRepo,
	createTrainingProgramMediaRepo,
	createTrainingProgramRepo,
	deleteTrainingModuleRepo,
	deleteTrainingProgramMediaRepo,
	deleteTrainingProgramRepo,
	getEnrollmentByOrgAndProgramRepo,
	getProgramWithModulesAndMediaForAdminRepo,
	getProgramWithModulesAndMediaForOrgRepo,
	getTrainingProgramByIdRepo,
	listMediaByProgramIdRepo,
	listModulesByProgramIdRepo,
	listProgramsWithEnrollmentForOrgRepo,
	listTrainingProgramsForAdminRepo,
	updateEnrollmentProgressRepo,
	updateTrainingModuleRepo,
	updateTrainingProgramRepo,
} from "./repo/training.repo";
import type {
	CreateEnrollmentInput,
	CreateTrainingModuleInput,
	CreateTrainingProgramInput,
	CreateTrainingProgramMediaInput,
	UpdateEnrollmentProgressInput,
	UpdateTrainingProgramInput,
} from "./schemas/training.schema";
import {
	createEnrollmentSchema,
	createTrainingModuleSchema,
	createTrainingProgramMediaSchema,
	createTrainingProgramSchema,
	updateEnrollmentProgressSchema,
	updateTrainingProgramSchema,
} from "./schemas/training.schema";

async function requireSuperadmin() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		redirectNonSuperadminHome();
	}
	return session!;
}

// —— Producer ——

/** List published programs with enrollment status for current org. */
export async function listMyTrainingPrograms() {
	const organizationId = await getProducerOrgId();
	if (!organizationId) throw new Error("You must belong to an organization.");
	return listProgramsWithEnrollmentForOrgRepo(organizationId);
}

/** Get a single published program with modules, media, and enrollment for current org. */
export async function getMyTrainingProgram(programId: string) {
	const organizationId = await getProducerOrgId();
	if (!organizationId) throw new Error("You must belong to an organization.");
	return getProgramWithModulesAndMediaForOrgRepo(programId, organizationId);
}

/** Enroll current org in a program (idempotent: returns existing enrollment if already enrolled). */
export async function enrollInProgram(programId: string) {
	const organizationId = await getProducerOrgId();
	if (!organizationId) throw new Error("You must belong to an organization.");
	const existing = await getEnrollmentByOrgAndProgramRepo(
		organizationId,
		programId,
	);
	if (existing) return existing;
	const program = await getTrainingProgramByIdRepo(programId);
	if (!program || program.status !== "PUBLISHED")
		throw new Error("Program not found or not available.");
	return createEnrollmentRepo({ organizationId, programId });
}

/** Update progress for an enrollment (current org only). */
export async function updateMyEnrollmentProgress(
	input: UpdateEnrollmentProgressInput,
) {
	const organizationId = await getProducerOrgId();
	if (!organizationId) throw new Error("You must belong to an organization.");
	const parsed = updateEnrollmentProgressSchema.parse(input);
	const enrollment = await prisma.trainingEnrollment.findFirst({
		where: { id: parsed.enrollmentId, organizationId },
		select: { id: true },
	});
	if (!enrollment) throw new Error("Enrollment not found.");
	return updateEnrollmentProgressRepo(parsed.enrollmentId, {
		modulesCompleted: parsed.modulesCompleted,
		status: parsed.status,
	});
}

// —— Admin ——

export async function listTrainingProgramsForAdmin(
	filters: { status?: "DRAFT" | "PUBLISHED" } = {},
) {
	try {
		await requireSuperadmin();
		const rows = await listTrainingProgramsForAdminRepo(filters);
		return JSON.parse(JSON.stringify(rows)) as Awaited<
			ReturnType<typeof listTrainingProgramsForAdminRepo>
		>;
	} catch (err) {
		console.error("[listTrainingProgramsForAdmin]", err);
		throw err;
	}
}

/** Admin training program counts by status (for tab badges). */
export async function getAdminTrainingCounts(): Promise<{
	ALL: number;
	PUBLISHED: number;
	DRAFT: number;
}> {
	await requireSuperadmin();
	const [ALL, PUBLISHED, DRAFT] = await Promise.all([
		prisma.trainingProgram.count(),
		prisma.trainingProgram.count({ where: { status: "PUBLISHED" } }),
		prisma.trainingProgram.count({ where: { status: "DRAFT" } }),
	]);
	return { ALL, PUBLISHED, DRAFT };
}

export async function getTrainingProgramForAdmin(programId: string) {
	await requireSuperadmin();
	const row = await getTrainingProgramByIdRepo(programId);
	return row ? (JSON.parse(JSON.stringify(row)) as typeof row) : null;
}

export async function getTrainingProgramWithModulesForAdmin(programId: string) {
	await requireSuperadmin();
	const data = await getProgramWithModulesAndMediaForAdminRepo(programId);
	return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
}

export async function createTrainingProgram(data: CreateTrainingProgramInput) {
	await requireSuperadmin();
	const parsed = createTrainingProgramSchema.parse(data);
	const row = await createTrainingProgramRepo({
		name: parsed.name,
		description: parsed.description ?? null,
		provider: parsed.provider,
		category: parsed.category,
		durationLabel: parsed.durationLabel ?? null,
		level: parsed.level,
		status: parsed.status ?? "DRAFT",
	});
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

export async function updateTrainingProgram(
	programId: string,
	data: UpdateTrainingProgramInput,
) {
	await requireSuperadmin();
	const parsed = updateTrainingProgramSchema.partial().parse(data);
	const row = await updateTrainingProgramRepo(programId, parsed);
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

export async function deleteTrainingProgram(programId: string) {
	await requireSuperadmin();
	await deleteTrainingProgramRepo(programId);
}

export async function listModulesForAdmin(programId: string) {
	await requireSuperadmin();
	const rows = await listModulesByProgramIdRepo(programId);
	return JSON.parse(JSON.stringify(rows)) as typeof rows;
}

export async function createTrainingModule(data: CreateTrainingModuleInput) {
	await requireSuperadmin();
	const parsed = createTrainingModuleSchema.parse(data);
	const program = await getTrainingProgramByIdRepo(parsed.programId);
	if (!program) throw new Error("Program not found.");
	const row = await createTrainingModuleRepo(parsed);
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

export async function updateTrainingModule(
	moduleId: string,
	data: Partial<{
		title: string;
		sortOrder: number;
		description: string | null;
	}>,
) {
	await requireSuperadmin();
	const row = await updateTrainingModuleRepo(moduleId, data);
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

export async function deleteTrainingModule(moduleId: string) {
	await requireSuperadmin();
	await deleteTrainingModuleRepo(moduleId);
}

export async function listMediaForAdmin(
	programId: string,
	options: { moduleId?: string | null } = {},
) {
	await requireSuperadmin();
	const rows = await listMediaByProgramIdRepo(programId, options);
	return JSON.parse(JSON.stringify(rows)) as typeof rows;
}

export async function addTrainingProgramMedia(
	data: CreateTrainingProgramMediaInput,
) {
	await requireSuperadmin();
	const parsed = createTrainingProgramMediaSchema.parse(data);
	const program = await getTrainingProgramByIdRepo(parsed.programId);
	if (!program) throw new Error("Program not found.");
	if (parsed.moduleId) {
		const module = await prisma.trainingModule.findFirst({
			where: { id: parsed.moduleId, programId: parsed.programId },
			select: { id: true },
		});
		if (!module) throw new Error("Module not found.");
	}
	const row = await createTrainingProgramMediaRepo(parsed);
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

export async function removeTrainingProgramMedia(mediaId: string) {
	await requireSuperadmin();
	await deleteTrainingProgramMediaRepo(mediaId);
}

export async function assignProgramToOrganization(
	input: CreateEnrollmentInput,
) {
	await requireSuperadmin();
	const parsed = createEnrollmentSchema.parse(input);
	const existing = await getEnrollmentByOrgAndProgramRepo(
		parsed.organizationId,
		parsed.programId,
	);
	if (existing) return existing;
	const program = await getTrainingProgramByIdRepo(parsed.programId);
	if (!program) throw new Error("Program not found.");
	const org = await prisma.organization.findUnique({
		where: { id: parsed.organizationId },
		select: { id: true },
	});
	if (!org) throw new Error("Organization not found.");
	const row = await createEnrollmentRepo(parsed);
	return JSON.parse(JSON.stringify(row)) as typeof row;
}

/** Admin: list organizations (id, name, slug) for org selector and assign dropdown. */
export async function listOrganizationsForAdmin() {
	await requireSuperadmin();
	const rows = await prisma.organization.findMany({
		orderBy: { name: "asc" },
		select: { id: true, name: true, slug: true },
	});
	return JSON.parse(JSON.stringify(rows)) as typeof rows;
}
