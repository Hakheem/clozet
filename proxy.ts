import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });
        
        const sessionData = await response.json();
        const session = sessionData?.session;
        const user = sessionData?.user;

        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = user?.role;

        if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (request.nextUrl.pathname.startsWith("/seller") && role !== "SELLER" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }

    } catch (e) {
        // If the session fetch fails, redirect to login for safety
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // We protect admin, seller, and checkout routes. /cart can be left open until they decide, but we'll protect checkout.
    matcher: ["/admin/:path*", "/seller/:path*", "/checkout/:path*"], 
};
