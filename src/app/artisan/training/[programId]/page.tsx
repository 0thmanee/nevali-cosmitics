import React from "react";
import { TrainingProgramDetailView } from "~/features/artisan/components/training/training-program-detail-view";

type Props = { params: Promise<{ programId: string }> };

export default async function TrainingProgramPage({ params }: Props) {
	const { programId } = await params;
	return <TrainingProgramDetailView programId={programId} />;
}
