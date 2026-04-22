import { TRAINING_ENROLLMENT_STATUSES } from "~/app/api/training/schemas/training.schema";
import type { TrainingProgramWithMetaRow } from "~/app/api/training/schemas/training.schema";

/** Display status for a program in the producer UI (derived from enrollment). */
export type TrainingProgramDisplayStatus = "IN_PROGRESS" | "AVAILABLE" | "COMPLETED";

export function getTrainingProgramDisplayStatus(
  p: TrainingProgramWithMetaRow
): TrainingProgramDisplayStatus {
  const e = p.enrollment;
  if (!e) return "AVAILABLE";
  if (e.status === TRAINING_ENROLLMENT_STATUSES[2]) return "COMPLETED";
  if (e.modulesCompleted > 0 || e.status === TRAINING_ENROLLMENT_STATUSES[1]) return "IN_PROGRESS";
  return "AVAILABLE";
}
