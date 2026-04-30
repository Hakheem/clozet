import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes, static files, and auth routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    // Build base URL that works both locally and on Render (behind a reverse proxy)
    const protocol = request.headers.get("x-forwarded-proto") ?? "http";
    const host =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      "localhost:3000";
    const baseUrl = process.env.BETTER_AUTH_URL ?? `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const sessionData = await response.json();
    const session = sessionData?.session;
    const user = sessionData?.user;
    const role = user?.role;

    // 1. Define protected routes that REQUIRE a login
    const protectedRoutes = ["/profile", "/checkout"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // 2. Handle Unauthenticated Users
    if (!session) {
      if (
        isProtectedRoute ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/seller")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // If not a protected route, let them pass through to public pages
      return NextResponse.next();
    }

    // 3. Handle Authenticated Users (Role-based Access Control)

    // Redirect logged-in users away from login/register pages
    if (pathname === "/login" || pathname === "/register") {
      const destination =
        role === "ADMIN" ? "/admin" : role === "SELLER" ? "/seller" : "/";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // ── SELLER restrictions ─────────────────────────────────────
    if (role === "SELLER") {
      // Allow all /seller/* routes (including onboarding)
      if (pathname.startsWith("/seller")) {
        return NextResponse.next();
      }

      // Block sellers from all other pages — they must stay in /seller/*
      return NextResponse.redirect(new URL("/seller", request.url));
    }

    // ── ADMIN restrictions ──────────────────────────────────────
    if (role === "ADMIN") {
      // Allow all /admin/* routes
      if (pathname.startsWith("/admin")) {
        return NextResponse.next();
      }

      // Block admins from all other pages — they must stay in /admin/*
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // ── USER (regular) restrictions ─────────────────────────────
    // Block regular users from admin routes
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Block regular users from seller routes (except onboarding)
    if (pathname.startsWith("/seller")) {
      if (pathname === "/seller/onboarding") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (e) {
    // On error, only redirect for truly protected routes
    const protectedRoutes = ["/profile", "/checkout", "/admin", "/seller"];
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // For public routes, let them pass through even if session check fails
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

