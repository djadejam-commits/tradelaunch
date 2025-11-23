import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/generate",
  "/site(.*)",
]);

const rootDomains = ["localhost", "127.0.0.1"];

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Remove port from host for comparison
  const hostname = host.split(":")[0];

  // Check if this is a subdomain request
  const isRootDomain = rootDomains.some(
    (domain) => hostname === domain || hostname === `www.${domain}`
  );

  // 1. Subdomain Logic (Public Renderer)
  if (!isRootDomain) {
    // Extract subdomain: "test.localhost" -> "test"
    const subdomain = hostname.split(".")[0];

    // Skip if the subdomain is "www"
    if (subdomain !== "www") {
      // Rewrite to /site/[subdomain]
      url.pathname = `/site/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. Protect non-public routes (like /dashboard)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Default Next.js behavior
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
