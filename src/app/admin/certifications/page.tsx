import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import {
	getAdminCertificationCounts,
	listCertificationsForAdmin,
} from "~/app/api/certifications/actions";
import { CertificationsList } from "~/features/admin/components/certifications";

export default async function AdminCertificationsPage() {
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["admin", "certifications", "all", "all", "all"],
			queryFn: () => listCertificationsForAdmin({}),
		}),
		queryClient.prefetchQuery({
			queryKey: ["admin", "certifications", "counts", "all"],
			queryFn: () => getAdminCertificationCounts(undefined),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CertificationsList />
		</HydrationBoundary>
	);
}
