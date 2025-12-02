import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/generate",
  "/api/contact",
  "/site(.*)",
  "/test",  // Component testing page
  "/loading-gen",  // Site generation loading page
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // ---------------------------------------------------------
  // 1. Define "Main App" (Home Page) - STRICT CHECK
  // ---------------------------------------------------------
  let isMainApp = false;

  // We check for exact matches to prevent "test.localhost" from being treated as main app
  if (hostname && (
    hostname === "localhost:3000" ||           // Exact Localhost
    hostname === "127.0.0.1" ||                // Exact IP
    hostname === "quickprosite.com" ||         // Exact Root Domain
    hostname === "www.quickprosite.com" ||     // Exact WWW
    hostname === "quickprosite.vercel.app"     // Exact Vercel App
  )) {
    isMainApp = true;
  }

  // ---------------------------------------------------------
  // 2. Rewrite Logic (Customer Sites)
  // ---------------------------------------------------------
  if (!isMainApp) {
    // We are on a subdomain (e.g. test.tradelaunch.it.com OR test.localhost:3000)
    
    const parts = hostname?.split(".");
    let subdomain = "";

    // Logic for Localhost (e.g. test.localhost:3000)
    // parts = ["test", "localhost:3000"]
    if (hostname?.includes("localhost")) {
      subdomain = parts?.[0] || "";
    }
    // Logic for .it.com domains (test.tradelaunch.it.com)
    // parts = ["test", "tradelaunch", "it", "com"]
    else if (parts && parts.length >= 4) {
      subdomain = parts[0];
    }
    // Logic for standard domains (test.tradelaunch.com)
    else if (parts && parts.length === 3) {
      subdomain = parts[0];
    }

    if (subdomain) {
       // Rewrite the URL to the renderer
       return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, req.url));
    }
  }

  // ---------------------------------------------------------
  // 3. Auth Protection
  // ---------------------------------------------------------
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};