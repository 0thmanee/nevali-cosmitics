import { prisma } from "~/lib/db";
import {
  DEFAULT_TRAINING_PROVIDER,
  TRAINING_PROGRAM_STATUSES,
  TRAINING_ENROLLMENT_STATUSES,
} from "../schemas/training.schema";
import type {
  TrainingProgramRow,
  TrainingModuleRow,
  TrainingProgramMediaRow,
  TrainingEnrollmentRow,
  TrainingProgramWithMetaRow,
  TrainingProgramDetailRow,
} from "../schemas/training.schema";

const programSelect = {
  id: true,
  name: true,
  description: true,
  provider: true,
  category: true,
  durationLabel: true,
  level: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

const moduleSelect = {
  id: true,
  programId: true,
  title: true,
  sortOrder: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

const mediaSelect = {
  id: true,
  programId: true,
  moduleId: true,
  fileUrl: true,
  mediaType: true,
  title: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

const enrollmentSelect = {
  id: true,
  organizationId: true,
  programId: true,
  status: true,
  progress: true,
  modulesCompleted: true,
  startedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

// —— Programs (admin) ——

/** List programs for admin. */
export async function listTrainingProgramsForAdminRepo(filters: {
  status?: (typeof TRAINING_PROGRAM_STATUSES)[number];
}): Promise<TrainingProgramRow[]> {
  if (!prisma.trainingProgram) {
    throw new Error(
      "Prisma client missing trainingProgram. Run: pnpm prisma generate"
    );
  }
  const where = filters.status ? { status: filters.status } : {};
  const rows = await prisma.trainingProgram.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: programSelect,
  });
  return rows;
}

export async function getTrainingProgramByIdRepo(
  programId: string
): Promise<TrainingProgramRow | null> {
  return prisma.trainingProgram.findUnique({
    where: { id: programId },
    select: programSelect,
  });
}

/** Admin: program with modules and media (no enrollment). */
export async function getProgramWithModulesAndMediaForAdminRepo(programId: string): Promise<{
  program: TrainingProgramRow;
  modules: TrainingModuleRow[];
  media: TrainingProgramMediaRow[];
} | null> {
  const program = await getTrainingProgramByIdRepo(programId);
  if (!program) return null;
  const [modules, media] = await Promise.all([
    listModulesByProgramIdRepo(programId),
    listMediaByProgramIdRepo(programId),
  ]);
  return { program, modules, media };
}

export async function createTrainingProgramRepo(data: {
  name: string;
  description?: string | null;
  provider?: string;
  category: string;
  durationLabel?: string | null;
  level: string;
  status?: string;
}): Promise<TrainingProgramRow> {
  return prisma.trainingProgram.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      provider: data.provider ?? DEFAULT_TRAINING_PROVIDER,
      category: data.category,
      durationLabel: data.durationLabel ?? null,
      level: data.level,
      status: data.status ?? TRAINING_PROGRAM_STATUSES[0],
    },
    select: programSelect,
  });
}

export async function updateTrainingProgramRepo(
  programId: string,
  data: Partial<{
    name: string;
    description: string | null;
    provider: string;
    category: string;
    durationLabel: string | null;
    level: string;
    status: string;
  }>
): Promise<TrainingProgramRow> {
  return prisma.trainingProgram.update({
    where: { id: programId },
    data,
    select: programSelect,
  });
}

export async function deleteTrainingProgramRepo(programId: string): Promise<void> {
  await prisma.trainingProgram.delete({ where: { id: programId } });
}

// —— Modules ——

export async function listModulesByProgramIdRepo(
  programId: string
): Promise<TrainingModuleRow[]> {
  return prisma.trainingModule.findMany({
    where: { programId },
    orderBy: { sortOrder: "asc" },
    select: moduleSelect,
  });
}

export async function createTrainingModuleRepo(data: {
  programId: string;
  title: string;
  sortOrder?: number;
  description?: string | null;
}): Promise<TrainingModuleRow> {
  const nextOrder =
    data.sortOrder ??
    ((await prisma.trainingModule.findFirst({
      where: { programId: data.programId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    }))?.sortOrder ?? -1) + 1;
  return prisma.trainingModule.create({
    data: {
      programId: data.programId,
      title: data.title,
      sortOrder: nextOrder,
      description: data.description ?? null,
    },
    select: moduleSelect,
  });
}

export async function updateTrainingModuleRepo(
  moduleId: string,
  data: Partial<{ title: string; sortOrder: number; description: string | null }>
): Promise<TrainingModuleRow> {
  return prisma.trainingModule.update({
    where: { id: moduleId },
    data,
    select: moduleSelect,
  });
}

export async function deleteTrainingModuleRepo(moduleId: string): Promise<void> {
  await prisma.trainingModule.delete({ where: { id: moduleId } });
}

// —— Media ——

export async function listMediaByProgramIdRepo(
  programId: string,
  options: { moduleId?: string | null } = {}
): Promise<TrainingProgramMediaRow[]> {
  const where: { programId: string; moduleId?: string | null } = { programId };
  if (options.moduleId !== undefined) where.moduleId = options.moduleId;
  return prisma.trainingProgramMedia.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: mediaSelect,
  });
}

export async function createTrainingProgramMediaRepo(data: {
  programId: string;
  moduleId?: string | null;
  fileUrl: string;
  mediaType: string;
  title?: string | null;
  sortOrder?: number;
}): Promise<TrainingProgramMediaRow> {
  const nextOrder =
    data.sortOrder ??
    ((await prisma.trainingProgramMedia.findFirst({
      where: { programId: data.programId, moduleId: data.moduleId ?? null },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    }))?.sortOrder ?? -1) + 1;
  return prisma.trainingProgramMedia.create({
    data: {
      programId: data.programId,
      moduleId: data.moduleId ?? null,
      fileUrl: data.fileUrl,
      mediaType: data.mediaType,
      title: data.title ?? null,
      sortOrder: nextOrder,
    },
    select: mediaSelect,
  });
}

export async function deleteTrainingProgramMediaRepo(mediaId: string): Promise<void> {
  await prisma.trainingProgramMedia.delete({ where: { id: mediaId } });
}

// —— Producer: single program with modules + media + enrollment ——

export async function getProgramWithModulesAndMediaForOrgRepo(
  programId: string,
  organizationId: string
): Promise<TrainingProgramDetailRow | null> {
  const program = await prisma.trainingProgram.findFirst({
    where: { id: programId, status: TRAINING_PROGRAM_STATUSES[1] },
    select: {
      ...programSelect,
      modules: { orderBy: { sortOrder: "asc" }, select: moduleSelect },
      media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: mediaSelect },
      enrollments: { where: { organizationId }, take: 1, select: enrollmentSelect },
    },
  });
  if (!program) return null;
  const { enrollments, ...rest } = program;
  return { ...rest, enrollment: enrollments[0] ?? null } as TrainingProgramDetailRow;
}

// —— Enrollments ——

export async function listProgramsWithEnrollmentForOrgRepo(
  organizationId: string
): Promise<TrainingProgramWithMetaRow[]> {
  const programs = await prisma.trainingProgram.findMany({
    where: { status: TRAINING_PROGRAM_STATUSES[1] },
    orderBy: { updatedAt: "desc" },
    select: {
      ...programSelect,
      _count: { select: { modules: true } },
      enrollments: {
        where: { organizationId },
        take: 1,
        select: enrollmentSelect,
      },
    },
  });
  return programs.map((p) => {
    const { _count, enrollments, ...program } = p;
    const enrollment = enrollments[0] ?? null;
    return {
      ...program,
      modulesCount: _count.modules,
      enrollment,
    } as TrainingProgramWithMetaRow;
  });
}

export async function getEnrollmentByOrgAndProgramRepo(
  organizationId: string,
  programId: string
): Promise<TrainingEnrollmentRow | null> {
  return prisma.trainingEnrollment.findUnique({
    where: { organizationId_programId: { organizationId, programId } },
    select: enrollmentSelect,
  });
}

export async function createEnrollmentRepo(data: {
  organizationId: string;
  programId: string;
}): Promise<TrainingEnrollmentRow> {
  return prisma.trainingEnrollment.create({
    data: {
      organizationId: data.organizationId,
      programId: data.programId,
      status: TRAINING_ENROLLMENT_STATUSES[0],
      progress: 0,
      modulesCompleted: 0,
    },
    select: enrollmentSelect,
  });
}

export async function updateEnrollmentProgressRepo(
  enrollmentId: string,
  data: { modulesCompleted: number; status?: string }
): Promise<TrainingEnrollmentRow> {
  const enrollment = await prisma.trainingEnrollment.findUnique({
    where: { id: enrollmentId },
    select: { programId: true, startedAt: true },
  });
  if (!enrollment) throw new Error("Enrollment not found.");
  const totalModules = await prisma.trainingModule.count({
    where: { programId: enrollment.programId },
  });
  const progress = totalModules > 0 ? Math.min(100, Math.round((data.modulesCompleted / totalModules) * 100)) : 0;
  const status =
    data.status ??
    (data.modulesCompleted === 0
      ? TRAINING_ENROLLMENT_STATUSES[0]
      : data.modulesCompleted >= totalModules
        ? TRAINING_ENROLLMENT_STATUSES[2]
        : TRAINING_ENROLLMENT_STATUSES[1]);
  const updateData: { modulesCompleted: number; progress: number; status: string; startedAt?: Date; completedAt?: Date } = {
    modulesCompleted: data.modulesCompleted,
    progress,
    status,
  };
  if (data.modulesCompleted > 0 && !enrollment.startedAt) updateData.startedAt = new Date();
  if (status === TRAINING_ENROLLMENT_STATUSES[2]) updateData.completedAt = new Date();
  return prisma.trainingEnrollment.update({
    where: { id: enrollmentId },
    data: updateData,
    select: enrollmentSelect,
  });
}

export async function listEnrollmentsByOrgRepo(
  organizationId: string
): Promise<TrainingEnrollmentRow[]> {
  return prisma.trainingEnrollment.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
    select: enrollmentSelect,
  });
}
