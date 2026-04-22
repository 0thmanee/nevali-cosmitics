/**
 * nevali seed: minimal setup for cosmetics e-commerce
 * Run: pnpm prisma db seed
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
	log: ["error"],
});

const SEED_PASSWORD = "Password123!";

async function main() {
	const hashedPassword = await hashPassword(SEED_PASSWORD);

	// Admin user
	const admin = await prisma.user.upsert({
		where: { email: "admin@nevali-cosmetics.local" },
		update: {},
		create: {
			name: "nevali Admin",
			email: "admin@nevali-cosmetics.local",
			emailVerified: true,
			role: "superadmin",
			status: "enabled",
		},
	});

	const existingAccount = await prisma.account.findFirst({
		where: {
			userId: admin.id,
			providerId: "credential",
			accountId: admin.email,
		},
	});

	if (!existingAccount) {
		await prisma.account.create({
			data: {
				userId: admin.id,
				providerId: "credential",
				accountId: admin.email,
				password: hashedPassword,
			},
		});
	} else {
		await prisma.account.update({
			where: { id: existingAccount.id },
			data: { password: hashedPassword },
		});
	}

	console.log("✓ Seeded successfully");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
