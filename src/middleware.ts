import { NextResponse, type NextRequest } from "next/server";

const PENDING_APPROVAL_PATH = "/pending-approval";
const ONBOARDING_PATH = "/onboarding";
const AUTH_PAGES = ["/auth/login", "/auth/register", "/auth/register-buyer"];

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  profileCompleted?: boolean;
};

async function getSession(request: NextRequest): Promise<{ user: SessionUser } | null> {
  try {
    const url = request.nextUrl.origin + "/api/auth/get-session";
    const res = await fetch(url, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user ? { user: data.user } : null;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const login = new URL("/auth/login", request.url);
  login.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(login);
}

export async function middleware(request: NextRequest) {
  // Server Actions POST to the page URL with a Next-Action header — skip middleware entirely.
  if (request.headers.get("Next-Action")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const session = await getSession(request);
  const user = session?.user as SessionUser | undefined;
  const role = user?.role ?? "partner";
  const status = user?.status ?? "disabled";
  const isSuperadmin = role === "superadmin";
  const isPartnerEnabled = role === "partner" && status === "enabled";
  const isBuyerEnabled = role === "buyer" && status === "enabled";
  const canAccessArtisan = isPartnerEnabled;
  const canAccessAdmin = isSuperadmin;

  if (pathname.startsWith(PENDING_APPROVAL_PATH)) {
    if (!user) return redirectToLogin(request, pathname);
    if (!user.profileCompleted) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    }
    if (isSuperadmin) return NextResponse.redirect(new URL("/admin", request.url));
    if (isBuyerEnabled) return NextResponse.redirect(new URL("/buyer", request.url));
    if (isPartnerEnabled) return NextResponse.redirect(new URL("/artisan", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith(ONBOARDING_PATH)) {
    if (!user) return redirectToLogin(request, pathname);
    if (user.profileCompleted) {
      const target = isSuperadmin
        ? "/admin"
        : isBuyerEnabled
          ? "/buyer"
          : isPartnerEnabled
            ? "/artisan"
            : PENDING_APPROVAL_PATH;
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/artisan")) {
    if (!user) return redirectToLogin(request, pathname);
    if (!user.profileCompleted) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    }
    if (isSuperadmin) return NextResponse.redirect(new URL("/admin", request.url));
    if (isBuyerEnabled) return NextResponse.redirect(new URL("/buyer", request.url));
    if (!isPartnerEnabled) {
      return NextResponse.redirect(new URL(PENDING_APPROVAL_PATH, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/buyer")) {
    if (!user) return redirectToLogin(request, pathname);
    if (isSuperadmin) return NextResponse.redirect(new URL("/admin", request.url));
    if (!isBuyerEnabled) {
      return NextResponse.redirect(
        new URL(isPartnerEnabled ? "/artisan" : PENDING_APPROVAL_PATH, request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!user) return redirectToLogin(request, pathname);
    if (!user.profileCompleted) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    }
    if (!canAccessAdmin) {
      return NextResponse.redirect(
        new URL(
          isBuyerEnabled ? "/buyer" : isPartnerEnabled ? "/artisan" : PENDING_APPROVAL_PATH,
          request.url
        )
      );
    }
    return NextResponse.next();
  }

  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    if (user) {
      if (!user.profileCompleted && role !== "buyer") {
        return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
      }
      const target = isSuperadmin
        ? "/admin"
        : isBuyerEnabled
          ? "/buyer"
          : isPartnerEnabled
            ? "/artisan"
            : PENDING_APPROVAL_PATH;
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Matcher is intentionally narrow: the public catalog, cart, and checkout live outside it so
 * anyone can browse and complete guest checkout without signing in.
 */
export const config = {
  matcher: [
    "/artisan/:path*",
    "/admin/:path*",
    "/buyer/:path*",
    "/pending-approval",
    "/pending-approval/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/register-buyer",
    "/auth/register-buyer/:path*",
  ],
};
