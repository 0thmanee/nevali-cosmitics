"use server";

import { getOpenSupportTicketsCountForCurrentProducer } from "../support/actions";

/** Shape of producer dashboard stats (products, support). */
export type ProducerDashboardStats = {
  openSupportTickets: number;
};

/**
 * Returns dashboard stats for the current producer (cosmetics brand).
 */
export async function getProducerDashboardStats(): Promise<ProducerDashboardStats> {
  const openSupportTickets = await getOpenSupportTicketsCountForCurrentProducer();
  return {
    openSupportTickets,
  };
}
