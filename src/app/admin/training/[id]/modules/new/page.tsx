import React from "react";
import { AdminTrainingModuleNewView } from "~/features/admin/components/training/admin-training-module-new-view";

type Props = { params: Promise<{ id: string }> };

export default async function NewModulePage({ params }: Props) {
  const { id: programId } = await params;
  return <AdminTrainingModuleNewView programId={programId} />;
}
