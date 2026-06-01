import React from "react";
import { AdminTrainingModuleEditView } from "~/features/admin/components/training/admin-training-module-edit-view";

type Props = { params: Promise<{ id: string; moduleId: string }> };

export default async function EditModulePage({ params }: Props) {
	const { id: programId, moduleId } = await params;
	return (
		<AdminTrainingModuleEditView moduleId={moduleId} programId={programId} />
	);
}
