import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { listMyCertifications } from "~/app/api/certifications/actions";
import { CertificationView } from "~/features/artisan/components/certification";

export default async function CertificationPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["producer", "certifications", "all"],
		queryFn: () => listMyCertifications({}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CertificationView />
		</HydrationBoundary>
	);
}
