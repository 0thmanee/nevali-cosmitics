import { z } from "zod";

// —— Single source of truth: enums and defaults ——

export const TRAINING_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type TrainingLevel = (typeof TRAINING_LEVELS)[number];

export const TRAINING_PROGRAM_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type TrainingProgramStatus = (typeof TRAINING_PROGRAM_STATUSES)[number];

export const TRAINING_ENROLLMENT_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type TrainingEnrollmentStatus = (typeof TRAINING_ENROLLMENT_STATUSES)[number];

export const TRAINING_MEDIA_TYPES = ["VIDEO", "PDF", "IMAGE"] as const;
export type TrainingMediaType = (typeof TRAINING_MEDIA_TYPES)[number];

/** Default provider name when creating a program. */
export const DEFAULT_TRAINING_PROVIDER = "nevali Academy";

/** Display label for level (UI only). */
export function getTrainingLevelLabel(level: string): string {
  switch (level) {
    case "BEGINNER":
      return "Beginner";
    case "INTERMEDIATE":
      return "Intermediate";
    case "ADVANCED":
      return "Advanced";
    default:
      return level;
  }
}

// —— Input schemas (use constants above) ——

export const createTrainingProgramSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  provider: z.string().max(100).optional(),
  category: z.string().min(1, "Category is required").max(100),
  durationLabel: z.string().max(100).optional().nullable(),
  level: z.enum(TRAINING_LEVELS),
  status: z.enum(TRAINING_PROGRAM_STATUSES).optional(),
});

export type CreateTrainingProgramInput = z.infer<typeof createTrainingProgramSchema>;

export const updateTrainingProgramSchema = createTrainingProgramSchema.partial();

export type UpdateTrainingProgramInput = z.infer<typeof updateTrainingProgramSchema>;

export const createTrainingModuleSchema = z.object({
  programId: z.string().min(1, "Program is required"),
  title: z.string().min(1, "Title is required").max(200),
  sortOrder: z.number().int().min(0).optional(),
  description: z.string().max(2000).optional().nullable(),
});

export type CreateTrainingModuleInput = z.infer<typeof createTrainingModuleSchema>;

export const createTrainingProgramMediaSchema = z.object({
  programId: z.string().min(1, "Program is required"),
  moduleId: z.string().min(1).optional().nullable(),
  fileUrl: z.string().url(),
  mediaType: z.enum(TRAINING_MEDIA_TYPES),
  title: z.string().max(200).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateTrainingProgramMediaInput = z.infer<typeof createTrainingProgramMediaSchema>;

export const createEnrollmentSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  programId: z.string().min(1, "Program is required"),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

export const updateEnrollmentProgressSchema = z.object({
  enrollmentId: z.string().cuid(),
  modulesCompleted: z.number().int().min(0),
  status: z.enum(TRAINING_ENROLLMENT_STATUSES).optional(),
});

export type UpdateEnrollmentProgressInput = z.infer<typeof updateEnrollmentProgressSchema>;

// —— Row types ——

export type TrainingProgramRow = {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  category: string;
  durationLabel: string | null;
  level: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingModuleRow = {
  id: string;
  programId: string;
  title: string;
  sortOrder: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingProgramMediaRow = {
  id: string;
  programId: string;
  moduleId: string | null;
  fileUrl: string;
  mediaType: string;
  title: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingEnrollmentRow = {
  id: string;
  organizationId: string;
  programId: string;
  status: string;
  progress: number;
  modulesCompleted: number;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/** Program with modules count and optional enrollment for producer list. */
export type TrainingProgramWithMetaRow = TrainingProgramRow & {
  modulesCount: number;
  enrollment: TrainingEnrollmentRow | null;
};

/** Program with modules, media, and enrollment for producer detail view. */
export type TrainingProgramDetailRow = TrainingProgramRow & {
  modules: TrainingModuleRow[];
  media: TrainingProgramMediaRow[];
  enrollment: TrainingEnrollmentRow | null;
};
