"use server";

import { getSession } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";

export type PostRegisterKind = "artisan" | "buyer";

/**
 * After `signUp.email`, tag the new account as artisan-onboarding vs buyer.
 * First user (superadmin bootstrap) is left unchanged.
 */
export async function postRegisterKind(
	kind: PostRegisterKind,
): Promise<{ error?: string }> {
	const session = await getSession();
	if (!session?.user?.id) {
		return { error: "Not signed in." };
	}
	const user = await prisma.user.findUnique({ where: { id: session.user.id } });
	if (!user) {
		return { error: "User not found." };
	}
	if (user.role === "superadmin") {
		return {};
	}
	if (kind === "buyer") {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				role: "buyer",
				status: "enabled",
				profileCompleted: true,
				signupSource: "buyer",
			},
		});
	} else {
		await prisma.user.update({
			where: { id: user.id },
			data: { signupSource: "artisan" },
		});
	}
	return {};
}
