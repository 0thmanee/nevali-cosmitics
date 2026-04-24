import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prisma } from "~/lib/db";

function toOrigin(raw: string | undefined | null): string | null {
	if (!raw) return null;
	try {
		return new URL(raw).origin;
	} catch {
		return null;
	}
}

function parseTrustedOrigins(): string[] {
	const out = new Set<string>();

	const primary = toOrigin(process.env.BETTER_AUTH_URL);
	if (primary) out.add(primary);

	const vercel = toOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
	if (vercel) out.add(vercel);

	const extra = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	for (const item of extra) {
		const origin = toOrigin(item);
		if (origin) out.add(origin);
	}

	// Local dev fallback
	out.add("http://localhost:3000");
	return [...out];
}

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "partner",
				input: false,
			},
			status: {
				type: "string",
				required: false,
				defaultValue: "disabled",
				input: false,
			},
			profileCompleted: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false,
			},
		},
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== "/sign-up/email") return;
			try {
				const email = (ctx.body as { email?: string } | undefined)?.email;
				if (!email) return;
				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) return;
				const count = await prisma.user.count();
				if (count === 1) {
					// First user: superadmin, enabled, skip onboarding
					await prisma.user.update({
						where: { id: user.id },
						data: {
							role: "superadmin",
							status: "enabled",
							profileCompleted: true,
							emailVerified: true,
						} as Parameters<typeof prisma.user.update>[0]["data"],
					});
				}
			} catch (err) {
				console.error("[auth hook] sign-up after hook error:", err);
			}
		}),
	},
	plugins: [
		organization(),
		nextCookies(), // must be last: required for Server Actions that set cookies
	],
	trustedOrigins: parseTrustedOrigins(),
});
