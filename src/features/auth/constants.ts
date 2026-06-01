/**
 * App roles — used for route protection and redirects.
 */
export const ROLES = {
	PARTNER: "partner",
	SUPERADMIN: "superadmin",
	BUYER: "buyer",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

/** Default redirect after login by role (partner+enabled -> /artisan; partner+disabled -> /pending-approval) */
export const DEFAULT_CALLBACK_URL_BY_ROLE: Record<AppRole, string> = {
	[ROLES.PARTNER]: "/artisan",
	[ROLES.SUPERADMIN]: "/admin",
	[ROLES.BUYER]: "/buyer",
};

/** Paths that require authentication */
export const PROTECTED_PATHS = ["/artisan", "/admin", "/buyer"] as const;

/** Paths that require a specific role (path prefix -> allowed roles) */
export const ROLE_PATHS: Record<string, AppRole[]> = {
	"/artisan": [ROLES.PARTNER, ROLES.SUPERADMIN],
	"/admin": [ROLES.SUPERADMIN],
	"/buyer": [ROLES.BUYER],
};

/** Auth pages: redirect to dashboard if already logged in */
export const AUTH_PAGES = [
	"/auth/login",
	"/auth/register",
	"/auth/register-buyer",
] as const;

/** Get redirect URL after login based on user role (pure helper, no server). */
export function getCallbackUrlForRole(role: string | undefined): string {
	const r = role as AppRole | undefined;
	if (r && r in DEFAULT_CALLBACK_URL_BY_ROLE) {
		return DEFAULT_CALLBACK_URL_BY_ROLE[r as AppRole];
	}
	return "/artisan";
}
