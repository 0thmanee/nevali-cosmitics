"use server";

import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { isShopOrderStatus } from "~/lib/shop-order-statuses";
import { notifyShopOrderStatusChangeForOrder } from "./notify-status-change";
import {
	getShopOrderAnalyticsForAdminRepo,
	getShopOrderByIdForAdminRepo,
	listShopOrdersForAdminRepo,
	updateShopOrderStatusForAdminRepo,
} from "./repo/shop-orders.repo";

async function requireSuperadmin() {
	const session = await getSession();
	const role = (session?.user as { role?: string } | undefined)?.role;
	if (role !== "superadmin") {
		redirectNonSuperadminHome();
	}
	return session!;
}

export async function listShopOrdersForAdmin(organizationId?: string | null) {
	await requireSuperadmin();
	return listShopOrdersForAdminRepo({
		organizationId: organizationId ?? undefined,
	});
}

export async function getShopOrderForAdmin(orderId: string) {
	await requireSuperadmin();
	return getShopOrderByIdForAdminRepo(orderId);
}

export async function getAdminShopOrderAnalytics(
	organizationId?: string | null,
) {
	await requireSuperadmin();
	return getShopOrderAnalyticsForAdminRepo({
		organizationId: organizationId ?? undefined,
	});
}

export async function updateShopOrderStatusForAdmin(input: {
	orderId: string;
	status: string;
}) {
	await requireSuperadmin();
	const status = input.status?.toUpperCase().trim();
	if (!status || !isShopOrderStatus(status)) {
		throw new Error("Invalid order status.");
	}
	await updateShopOrderStatusForAdminRepo({
		orderId: input.orderId,
		status,
	});
	await notifyShopOrderStatusChangeForOrder(input.orderId, status);
}
