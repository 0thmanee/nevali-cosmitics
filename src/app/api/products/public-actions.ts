"use server";

import { getApprovedProductForPublicByIdRepo } from "./repo/products.repo";

/** Public product detail — approved listings only. */
export async function getPublicProductById(productId: string) {
  return getApprovedProductForPublicByIdRepo(productId);
}
