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
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    const sessionData = await response.json();
    const session = sessionData?.session;
    const user = sessionData?.user;
    const role = user?.role;

    // 1. Define protected routes that REQUIRE a login
    const protectedRoutes = ["/profile", "/checkout"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // 2. Handle Unauthenticated Users
    if (!session) {
      if (isProtectedRoute || pathname.startsWith("/admin") || pathname.startsWith("/seller")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // If not a protected route, let them pass through to public pages
      return NextResponse.next();
    }

    // 3. Handle Authenticated Users (Role-based Access Control)
    
    // Redirect logged-in users away from login/register pages
    if (pathname === "/login" || pathname === "/register") {
      const destination = role === "ADMIN" ? "/admin" : (role === "SELLER" ? "/seller" : "/");
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // ── SELLER restrictions ─────────────────────────────────────
    if (role === "SELLER") {
      // Allow seller routes
      if (pathname.startsWith("/seller")) {
        // Allow onboarding for sellers
        if (pathname === "/seller/onboarding") {
          return NextResponse.next();
        }
        return NextResponse.next();
      }

      // Block sellers from ALL public /* pages — they must stay in /seller/*
      // (except /api which is already handled above)
      return NextResponse.redirect(new URL("/seller", request.url));
    }

    // ── ADMIN restrictions ──────────────────────────────────────
    if (role === "ADMIN") {
      // Allow admin routes
      if (pathname.startsWith("/admin")) {
        return NextResponse.next();
      }

      // Block admins from ALL public /* pages — they must stay in /admin/*
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // ── USER (regular) restrictions ─────────────────────────────
    // Block regular users from admin and seller routes
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/seller")) {
      // Allow users to access seller onboarding
      if (pathname === "/seller/onboarding") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

  } catch (e) {
    // On error, only redirect for truly protected routes
    const protectedRoutes = ["/profile", "/checkout", "/admin", "/seller"];
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
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
