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

// THE FIX: Add your Vercel domain here so it is treated as the "Main App"
const rootDomains = ["localhost", "127.0.0.1", "tradelaunch.vercel.app"];

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Remove port from host for comparison (e.g. localhost:3000 -> localhost)
  const hostname = host.split(":")[0];

  // Check if this is a root domain (Main App)
  // We also check if it ends with .vercel.app to handle Vercel preview URLs automatically
  const isRootDomain = 
    rootDomains.includes(hostname) || 
    hostname.endsWith(".vercel.app");

  // 1. Subdomain Logic (Public Renderer)
  if (!isRootDomain) {
    // Extract subdomain logic
    // Example: joes-plumbing.tradelaunch.vercel.app -> joes-plumbing
    
    // We need to be careful about how we split based on where we are hosting
    let subdomain = hostname.split(".")[0];
    
    // If we are on a custom domain (e.g. tradelaunch.com), splitting by dot is fine.
    // If we are on Vercel (e.g. joes.tradelaunch.vercel.app), we need to handle that structure if you buy a domain later.
    // For now, simple split works for localhost.
    
    // Rewrite to /site/[subdomain]
    url.pathname = `/site/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};