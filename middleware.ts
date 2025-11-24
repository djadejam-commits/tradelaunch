import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require login
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/generate",
  "/api/contact",
  "/site(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  
  // Get the hostname (e.g. "tradelaunch.vercel.app" or "localhost:3000")
  const hostname = req.headers.get("host");

  // ---------------------------------------------------------
  // 1. THE FIX: Force Vercel & Localhost to be "Main App"
  // ---------------------------------------------------------
  let isMainApp = false;

  if (hostname && (
    hostname.includes("vercel.app") || // Any Vercel deployment is the Home Page
    hostname.includes("localhost") ||  // Localhost is the Home Page
    hostname === "127.0.0.1"           // Local IP is the Home Page
  )) {
    isMainApp = true;
  }

  // ---------------------------------------------------------
  // 2. Rewrite Logic (Only for Custom Domains in the future)
  // ---------------------------------------------------------
  if (!isMainApp) {
    // If we are here, it means we are on a custom domain (e.g. "joes-plumbing.com")
    // Rewrite to the site renderer
    // e.g. foo.com -> /site/foo
    
    const subdomain = hostname?.split(".")[0];
    if (subdomain) {
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