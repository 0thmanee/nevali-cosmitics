"use server";

import {
	getPublicPartnerByIdRepo,
	listPublicPartnersRepo,
} from "./repo/partners.repo";

/** Public listing of verified partners — no auth required. */
export async function listPublicPartners() {
	return listPublicPartnersRepo();
}

/** Public single partner — no auth required. */
export async function getPublicPartner(userId: string) {
	return getPublicPartnerByIdRepo(userId);
}
