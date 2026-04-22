import { requireSession } from "~/app/api/auth/actions";
import { BuyerLayoutClient } from "~/features/buyer/components/buyer-layout-client";

export default async function BuyerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await requireSession({ callbackUrl: "/buyer" });

	const user = {
		name: session.user.name ?? "",
		email: session.user.email ?? "",
	};

	return <BuyerLayoutClient user={user}>{children}</BuyerLayoutClient>;
}
