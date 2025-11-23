import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Remove port from host for comparison
  const hostname = host.split(":")[0];

  // Define root domains (add production domain here later)
  const rootDomains = ["localhost", "127.0.0.1"];

  // Check if this is a subdomain request
  // e.g., "test.localhost" -> subdomain is "test"
  const isRootDomain = rootDomains.some(
    (domain) => hostname === domain || hostname === `www.${domain}`
  );

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

  // Root domain - allow pass-through to app home
  return NextResponse.next();
}

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
