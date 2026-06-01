"use client";

import Link from "next/link";
import React from "react";
import type { CreateTrainingProgramInput } from "~/app/api/training/schemas/training.schema";
import { TrainingProgramForm } from "~/features/admin/components/training/training-program-form";
import { useCreateTrainingProgram } from "~/features/admin/hooks/use-admin-training";

export default function NewTrainingProgramPage() {
	const createMutation = useCreateTrainingProgram();

	return (
		<div className="flex flex-col gap-6 p-4 lg:p-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/admin/training"
				>
					Training
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="font-medium font-sans text-text-dark">
					New program
				</span>
			</nav>
			<TrainingProgramForm
				isPending={createMutation.isPending}
				onSubmit={(data) =>
					createMutation.mutateAsync(data as CreateTrainingProgramInput)
				}
				onSuccessRedirect={(result) =>
					result && typeof result === "object" && "id" in result
						? `/admin/training/${(result as { id: string }).id}`
						: undefined
				}
				program={null}
			/>
		</div>
	);
}
