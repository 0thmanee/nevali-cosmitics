"use server";

import { getSession } from "~/app/api/auth/actions";
import { redirect } from "next/navigation";
import { listShopOrdersForBuyerRepo } from "./repo/shop-orders.repo";

export async function listMyShopOrdersForBuyer() {
	const session = await getSession();
	if (!session?.user) {
		redirect("/auth/login?callbackUrl=" + encodeURIComponent("/buyer/orders"));
	}
	const role = (session.user as { role?: string }).role;
	if (role !== "buyer") {
		redirect("/buyer");
	}
	return listShopOrdersForBuyerRepo({
		userId: session.user.id,
		email: session.user.email ?? "",
	});
}
