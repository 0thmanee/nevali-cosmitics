"use server";

import { redirect } from "next/navigation";
import { getSession, redirectNonSuperadminHome } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";

export type SavedListRow = {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SavedListItemRow = {
	id: string;
	productId: string;
	productName: string;
	organizationSlug: string;
	organizationName: string;
	firstImageUrl: string | null;
	createdAt: Date;
};

export type SavedListWithItems = SavedListRow & { items: SavedListItemRow[] };

async function requireBuyerUserId(): Promise<string> {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect(`/auth/login?callbackUrl=${encodeURIComponent("/buyer/saved")}`);
	}
	const role = (session.user as { role?: string }).role;
	if (role !== "buyer") {
		redirectNonSuperadminHome();
	}
	return session.user.id;
}

/** Ensure at least one list exists (default name). */
async function ensureDefaultList(userId: string): Promise<void> {
	const count = await prisma.savedList.count({ where: { userId } });
	if (count === 0) {
		await prisma.savedList.create({
			data: { userId, name: "Saved for later" },
		});
	}
}

export async function listMySavedListsWithItems(): Promise<
	SavedListWithItems[]
> {
	const userId = await requireBuyerUserId();
	await ensureDefaultList(userId);

	const lists = await prisma.savedList.findMany({
		where: { userId },
		orderBy: { updatedAt: "desc" },
		select: {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true,
			items: {
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					createdAt: true,
					product: {
						select: {
							id: true,
							name: true,
							status: true,
							organization: { select: { slug: true, name: true } },
							images: {
								orderBy: { sortOrder: "asc" },
								take: 1,
								select: { url: true },
							},
						},
					},
				},
			},
		},
	});

	return lists.map((l) => ({
		id: l.id,
		name: l.name,
		createdAt: l.createdAt,
		updatedAt: l.updatedAt,
		items: l.items
			.filter((it) => it.product.status === "APPROVED")
			.map((it) => ({
				id: it.id,
				productId: it.product.id,
				productName: it.product.name,
				organizationSlug: it.product.organization.slug,
				organizationName: it.product.organization.name,
				firstImageUrl: it.product.images[0]?.url ?? null,
				createdAt: it.createdAt,
			})),
	}));
}

export async function listMySavedListsForPicker(): Promise<SavedListRow[]> {
	const userId = await requireBuyerUserId();
	await ensureDefaultList(userId);
	return prisma.savedList.findMany({
		where: { userId },
		orderBy: { name: "asc" },
		select: { id: true, name: true, createdAt: true, updatedAt: true },
	});
}

export async function createBuyerSavedList(
	name: string,
): Promise<{ error?: string; list?: SavedListRow }> {
	const userId = await requireBuyerUserId();
	const trimmed = name.trim();
	if (trimmed.length < 1 || trimmed.length > 80) {
		return { error: "List name must be between 1 and 80 characters." };
	}
	const list = await prisma.savedList.create({
		data: { userId, name: trimmed },
		select: { id: true, name: true, createdAt: true, updatedAt: true },
	});
	return { list };
}

export async function renameBuyerSavedList(
	listId: string,
	name: string,
): Promise<{ error?: string; list?: SavedListRow }> {
	const userId = await requireBuyerUserId();
	const trimmed = name.trim();
	if (trimmed.length < 1 || trimmed.length > 80) {
		return { error: "List name must be between 1 and 80 characters." };
	}
	const existing = await prisma.savedList.findFirst({
		where: { id: listId, userId },
		select: { id: true },
	});
	if (!existing) return { error: "List not found." };
	const list = await prisma.savedList.update({
		where: { id: listId },
		data: { name: trimmed },
		select: { id: true, name: true, createdAt: true, updatedAt: true },
	});
	return { list };
}

export async function deleteBuyerSavedList(
	listId: string,
): Promise<{ error?: string }> {
	const userId = await requireBuyerUserId();
	const count = await prisma.savedList.count({ where: { userId } });
	if (count <= 1) {
		return { error: "Keep at least one list. Rename it instead of deleting." };
	}
	const deleted = await prisma.savedList.deleteMany({
		where: { id: listId, userId },
	});
	if (deleted.count === 0) return { error: "List not found." };
	return {};
}

export async function addProductToBuyerSavedList(
	listId: string,
	productId: string,
): Promise<{ error?: string }> {
	const userId = await requireBuyerUserId();
	const list = await prisma.savedList.findFirst({
		where: { id: listId, userId },
		select: { id: true },
	});
	if (!list) return { error: "List not found." };

	const product = await prisma.product.findFirst({
		where: { id: productId, status: "APPROVED" },
		select: { id: true },
	});
	if (!product) return { error: "Product not found or is not published." };

	await prisma.savedListProduct.upsert({
		where: {
			savedListId_productId: { savedListId: listId, productId },
		},
		create: { savedListId: listId, productId },
		update: {},
	});
	await prisma.savedList.update({
		where: { id: listId },
		data: { updatedAt: new Date() },
	});
	return {};
}

export async function removeProductFromBuyerSavedList(
	listId: string,
	productId: string,
): Promise<{ error?: string }> {
	const userId = await requireBuyerUserId();
	const list = await prisma.savedList.findFirst({
		where: { id: listId, userId },
		select: { id: true },
	});
	if (!list) return { error: "List not found." };
	await prisma.savedListProduct.deleteMany({
		where: { savedListId: listId, productId },
	});
	await prisma.savedList.update({
		where: { id: listId },
		data: { updatedAt: new Date() },
	});
	return {};
}

export async function isProductSavedByMe(productId: string): Promise<boolean> {
	const session = await getSession();
	if (!session?.user?.id) return false;
	const role = (session.user as { role?: string }).role;
	if (role !== "buyer") return false;
	const n = await prisma.savedListProduct.count({
		where: {
			productId,
			savedList: { userId: session.user.id },
		},
	});
	return n > 0;
}
