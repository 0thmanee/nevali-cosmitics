import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listMyTrainingPrograms } from "~/app/api/training/actions";
import { TrainingView } from "~/features/artisan/components/training";

export default async function TrainingPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "training", "programs"],
		queryFn: listMyTrainingPrograms,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TrainingView />
		</HydrationBoundary>
	);
}
