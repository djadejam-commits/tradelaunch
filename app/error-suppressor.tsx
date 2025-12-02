"use client";

import { useEffect } from "react";

/**
 * Suppresses known harmless console errors in development
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Store original console.error
    const originalError = console.error;

    // Override console.error to filter out known harmless errors
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || "";

      // Suppress Clerk "unable to attribute" errors on public pages
      // This is expected behavior when users visit public pages without authentication
      if (errorMessage.includes("unable to attribute this request to an instance running on Clerk")) {
        return; // Silently ignore
      }

      // Call original console.error for all other errors
      originalError.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  return null; // This component renders nothing
}
