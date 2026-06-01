"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	enrollInProgram,
	getMyTrainingProgram,
	listMyTrainingPrograms,
	updateMyEnrollmentProgress,
} from "~/app/api/training/actions";
import type { UpdateEnrollmentProgressInput } from "~/app/api/training/schemas/training.schema";

export const producerTrainingProgramsQueryKey = [
	"artisan",
	"training",
	"programs",
] as const;

export function producerTrainingProgramQueryKey(programId: string) {
	return [...producerTrainingProgramsQueryKey, "detail", programId] as const;
}

export function useTrainingPrograms() {
	return useQuery({
		queryKey: producerTrainingProgramsQueryKey,
		queryFn: listMyTrainingPrograms,
		placeholderData: keepPreviousData,
	});
}

export function useTrainingProgram(programId: string | null) {
	return useQuery({
		queryKey: producerTrainingProgramQueryKey(programId ?? ""),
		queryFn: () => getMyTrainingProgram(programId!),
		enabled: !!programId,
	});
}

export function useEnrollInProgram() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (programId: string) => enrollInProgram(programId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: producerTrainingProgramsQueryKey,
			});
		},
	});
}

export function useUpdateEnrollmentProgress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateEnrollmentProgressInput) =>
			updateMyEnrollmentProgress(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: producerTrainingProgramsQueryKey,
			});
			queryClient.invalidateQueries({ queryKey: ["artisan", "training"] });
		},
	});
}
