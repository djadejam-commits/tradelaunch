import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  const hostname = req.headers.get("host");

  // 1. Define "Main App" (Home Page)
  let isMainApp = false;

  if (hostname && (
    hostname.includes("vercel.app") || 
    hostname.includes("localhost") || 
    hostname === "127.0.0.1" ||
    hostname === "tradelaunch.it.com" ||       // <--- Your Root
    hostname === "www.tradelaunch.it.com"      // <--- Your WWW
  )) {
    isMainApp = true;
  }

  // 2. Rewrite Logic (Customer Sites)
  if (!isMainApp) {
    // We are on a subdomain (e.g. test.tradelaunch.it.com)
    // We need to grab the first part ("test")
    
    const parts = hostname?.split(".");
    let subdomain = "";

    // Logic for .it.com domains (which have 3 parts: name.it.com)
    // test.tradelaunch.it.com -> has 4 parts. Subdomain is parts[0] ("test")
    if (parts && parts.length >= 4) {
      subdomain = parts[0];
    } 
    
    if (subdomain) {
       return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, req.url));
    }
  }

  // 3. Auth Protection
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