"use server";

import { getProducerOrgId } from "~/app/api/producer-context";
import { listProductOrderAggregatesForProducerRepo } from "./repo/shop-orders.repo";

/** Partner: aggregated product order stats from public catalog checkout. */
export async function listMyProductOrderStats() {
  const orgId = await getProducerOrgId();
  if (!orgId) return [];
  return listProductOrderAggregatesForProducerRepo(orgId);
}
