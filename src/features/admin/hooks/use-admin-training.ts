"use client";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	addTrainingProgramMedia,
	assignProgramToOrganization,
	createTrainingModule,
	createTrainingProgram,
	deleteTrainingModule,
	deleteTrainingProgram,
	getAdminTrainingCounts,
	getTrainingProgramWithModulesForAdmin,
	listOrganizationsForAdmin,
	listTrainingProgramsForAdmin,
	removeTrainingProgramMedia,
	updateTrainingModule as updateTrainingModuleAction,
	updateTrainingProgram,
} from "~/app/api/training/actions";
import type {
	CreateEnrollmentInput,
	CreateTrainingModuleInput,
	CreateTrainingProgramInput,
	CreateTrainingProgramMediaInput,
	UpdateTrainingProgramInput,
} from "~/app/api/training/schemas/training.schema";

export const adminTrainingProgramsQueryKey = [
	"admin",
	"training",
	"programs",
] as const;

export function adminTrainingProgramQueryKey(programId: string) {
	return [...adminTrainingProgramsQueryKey, "detail", programId] as const;
}

export function useAdminTrainingPrograms(statusFilter?: "DRAFT" | "PUBLISHED") {
	return useQuery({
		queryKey: [...adminTrainingProgramsQueryKey, statusFilter ?? "all"],
		queryFn: () =>
			listTrainingProgramsForAdmin(
				statusFilter ? { status: statusFilter } : {},
			),
		placeholderData: keepPreviousData,
	});
}

export function useAdminTrainingCounts() {
	return useQuery({
		queryKey: [...adminTrainingProgramsQueryKey, "counts"] as const,
		queryFn: getAdminTrainingCounts,
		placeholderData: keepPreviousData,
	});
}

export function useAdminTrainingProgram(programId: string | null) {
	return useQuery({
		queryKey: adminTrainingProgramQueryKey(programId ?? ""),
		queryFn: () => getTrainingProgramWithModulesForAdmin(programId!),
		enabled: !!programId,
	});
}

export function useAdminOrganizations() {
	return useQuery({
		queryKey: ["admin", "organizations"],
		queryFn: listOrganizationsForAdmin,
	});
}

export function useCreateTrainingProgram() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTrainingProgramInput) =>
			createTrainingProgram(data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramsQueryKey,
			}),
	});
}

export function useUpdateTrainingProgram(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateTrainingProgramInput) =>
			updateTrainingProgram(programId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramsQueryKey,
			});
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			});
		},
	});
}

export function useDeleteTrainingProgram() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (programId: string) => deleteTrainingProgram(programId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramsQueryKey,
			}),
	});
}

export function useCreateTrainingModule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTrainingModuleInput) => createTrainingModule(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramsQueryKey,
			});
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(variables.programId),
			});
		},
	});
}

export function useUpdateTrainingModule(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			moduleId,
			data,
		}: {
			moduleId: string;
			data: Parameters<typeof updateTrainingModuleAction>[1];
		}) => updateTrainingModuleAction(moduleId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			});
		},
	});
}

export function useDeleteTrainingModule(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (moduleId: string) => deleteTrainingModule(moduleId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			}),
	});
}

export function useAddTrainingProgramMedia(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTrainingProgramMediaInput) =>
			addTrainingProgramMedia(data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			}),
	});
}

export function useRemoveTrainingProgramMedia(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (mediaId: string) => removeTrainingProgramMedia(mediaId),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			}),
	});
}

export function useAssignProgramToOrganization(programId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateEnrollmentInput) =>
			assignProgramToOrganization(input),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminTrainingProgramQueryKey(programId),
			}),
	});
}
