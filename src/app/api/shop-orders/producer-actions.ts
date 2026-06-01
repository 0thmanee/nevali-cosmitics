"use server";

import { getProducerOrgId } from "~/app/api/producer-context";
import { prisma } from "~/lib/db";
import { isShopOrderStatus } from "~/lib/shop-order-statuses";
import { notifyShopOrderStatusChangeForOrder } from "./notify-status-change";
import {
	getShopOrderByIdForProducerRepo,
	listProductOrderAggregatesForProducerRepo,
	listShopOrdersForAdminRepo,
	updateShopOrderStatusForAdminRepo,
} from "./repo/shop-orders.repo";

/** Partner: aggregated product order stats from public catalog checkout. */
export async function listMyProductOrderStats() {
	const orgId = await getProducerOrgId();
	if (!orgId) return [];
	return listProductOrderAggregatesForProducerRepo(orgId);
}

/** Partner: full shop orders that include at least one line from this organization. */
export async function listMyShopOrders() {
	const orgId = await getProducerOrgId();
	if (!orgId) return [];
	return listShopOrdersForAdminRepo({ organizationId: orgId });
}

export async function getMyShopOrderById(orderId: string) {
	const orgId = await getProducerOrgId();
	if (!orgId) return null;
	return getShopOrderByIdForProducerRepo(orderId, orgId);
}

/** Partner may set fulfillment status on orders that include their catalog lines. */
export async function updateMyShopOrderStatus(input: {
	orderId: string;
	status: string;
}) {
	const orgId = await getProducerOrgId();
	if (!orgId) throw new Error("Unauthorized");
	const status = input.status?.toUpperCase().trim();
	if (!status || !isShopOrderStatus(status)) {
		throw new Error("Invalid order status.");
	}
	const line = await prisma.shopOrderLine.findFirst({
		where: { orderId: input.orderId, organizationId: orgId },
		select: { id: true },
	});
	if (!line) throw new Error("Order not found.");
	await updateShopOrderStatusForAdminRepo({ orderId: input.orderId, status });
	await notifyShopOrderStatusChangeForOrder(input.orderId, status);
}
