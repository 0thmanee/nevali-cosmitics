import React from "react";
import { AdminTrainingProgramDetailView } from "~/features/admin/components/training/admin-training-program-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTrainingProgramPage({ params }: Props) {
	const { id } = await params;
	return <AdminTrainingProgramDetailView programId={id} />;
}
