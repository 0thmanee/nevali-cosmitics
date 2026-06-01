import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [organizationClient()],
});

export const { signIn, signUp, signOut, useSession, sendVerificationEmail } =
	authClient;

// `forgetPassword` / `resetPassword` exist on the runtime client but aren't in the
// base static client type (they're inferred from the server auth instance). Expose
// thin typed wrappers so call sites stay type-safe without importing server code.
type AuthActionResult = { error: { message?: string } | null };

const passwordClient = authClient as unknown as {
	forgetPassword: (args: {
		email: string;
		redirectTo?: string;
	}) => Promise<AuthActionResult>;
	resetPassword: (args: {
		newPassword: string;
		token: string;
	}) => Promise<AuthActionResult>;
};

export function forgetPassword(args: {
	email: string;
	redirectTo?: string;
}): Promise<AuthActionResult> {
	return passwordClient.forgetPassword(args);
}

export function resetPassword(args: {
	newPassword: string;
	token: string;
}): Promise<AuthActionResult> {
	return passwordClient.resetPassword(args);
}
