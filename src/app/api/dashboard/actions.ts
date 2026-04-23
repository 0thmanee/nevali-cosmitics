"use server";

import { getOpenSupportTicketsCountForCurrentProducer } from "../support/actions";
import { getProducerOrgId } from "../producer-context";
import {
  getConfirmedOrderVolumeByDayForOrg,
  getProductStatusCountsForOrg,
  getTopProductsByRevenueForOrg,
} from "./repo/dashboard.repo";
import type { ProducerDashboardStats } from "./dashboard.types";

/**
 * Returns dashboard stats for the current producer (cosmetics brand).
 */
export async function getProducerDashboardStats(): Promise<ProducerDashboardStats> {
  const openSupportTickets = await getOpenSupportTicketsCountForCurrentProducer();
  const orgId = await getProducerOrgId();

  if (!orgId) {
    return {
      openSupportTickets,
      productsByStatus: [],
      orderVolumeByDay: [],
      topProducts: [],
    };
  }

  const [productsByStatus, orderVolumeByDay, topProducts] = await Promise.all([
    getProductStatusCountsForOrg(orgId),
    getConfirmedOrderVolumeByDayForOrg(orgId, 14),
    getTopProductsByRevenueForOrg(orgId, 90, 6),
  ]);

  return {
    openSupportTickets,
    productsByStatus,
    orderVolumeByDay,
    topProducts,
  };
}
