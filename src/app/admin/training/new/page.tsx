"use client";

import React from "react";
import Link from "next/link";
import type { CreateTrainingProgramInput } from "~/app/api/training/schemas/training.schema";
import { TrainingProgramForm } from "~/features/admin/components/training/training-program-form";
import { useCreateTrainingProgram } from "~/features/admin/hooks/use-admin-training";

export default function NewTrainingProgramPage() {
  const createMutation = useCreateTrainingProgram();

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin/training" className="font-sans text-[#727272] hover:text-[#000000] transition-colors">
          Training
        </Link>
        <span className="font-sans text-[#727272]/60">/</span>
        <span className="font-sans font-medium text-[#000000]">New program</span>
      </nav>
      <TrainingProgramForm
        program={null}
        onSubmit={(data) => createMutation.mutateAsync(data as CreateTrainingProgramInput)}
        isPending={createMutation.isPending}
        onSuccessRedirect={(result) => result && typeof result === "object" && "id" in result ? `/admin/training/${(result as { id: string }).id}` : undefined}
      />
    </div>
  );
}
