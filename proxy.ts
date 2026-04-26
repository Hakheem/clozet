import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
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
    const pathname = request.nextUrl.pathname;

    // 1. Define protected routes that REQUIRE a login
    const protectedRoutes = ["/profile"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // 2. Handle Unauthenticated Users
    if (!session) {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // If not a protected route, let them pass through to public pages
      return NextResponse.next();
    }

    // 3. Handle Authenticated Users (Role-based Access Control)
    
    // Redirect logged-in sellers/admins away from login page
    if (pathname === "/login") {
      const destination = role === "ADMIN" ? "/admin" : (role === "SELLER" ? "/seller" : "/");
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Block sellers from accessing the root/home page if you want them on the dashboard
    if (pathname === "/" && role === "SELLER") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }

    // Admin-specific protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Seller-specific protection (allow onboarding for USERS becoming SELLERS)
    if (pathname.startsWith("/seller")) {
      if (pathname === "/seller/onboarding" && (role === "USER" || role === "SELLER")) {
        return NextResponse.next();
      }
      if (role !== "SELLER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

  } catch (e) {
    // Only redirect to login on error if it's a protected route
    const protectedRoutes = ["/profile"];
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/seller/:path*", "/checkout/:path*", "/profile/:path*"],
};

