"use server";

import { getProducerContractStatsAction } from "~/app/api/contracts";
import { getOpenSupportTicketsCountForCurrentProducer } from "../support/actions";

/** Shape of producer dashboard stats (RFQs, contracts, revenue, support). */
export type ProducerDashboardStats = {
  openRfqs: number;
  activeContracts: number;
  revenueYtd: string;
  pendingReplyCount: number;
  openSupportTickets: number;
};

/**
 * Returns dashboard stats for the current producer (partner).
 * Uses real RFQ/contract counts, revenue, and open support count from DB.
 */
export async function getProducerDashboardStats(): Promise<ProducerDashboardStats> {
  const [stats, openSupportTickets] = await Promise.all([
    getProducerContractStatsAction(),
    getOpenSupportTicketsCountForCurrentProducer(),
  ]);
  return {
    openRfqs: stats.openRfqs,
    activeContracts: stats.activeContracts,
    revenueYtd: stats.revenueYtd,
    pendingReplyCount: stats.pendingReplyCount,
    openSupportTickets,
  };
}
