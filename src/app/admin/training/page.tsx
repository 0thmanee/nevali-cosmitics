import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { listTrainingProgramsForAdmin, getAdminTrainingCounts } from "~/app/api/training/actions";
import { TrainingProgramsList } from "~/features/admin/components/training/training-programs-list";

export default async function AdminTrainingPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin", "training", "programs", "all"],
      queryFn: () => listTrainingProgramsForAdmin({}),
    }),
    queryClient.prefetchQuery({
      queryKey: ["admin", "training", "programs", "counts"],
      queryFn: getAdminTrainingCounts,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrainingProgramsList />
    </HydrationBoundary>
  );
}
