import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorSuppressor } from "./error-suppressor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickProSite - Fast Professional Websites",
  description: "Generate professional websites for your business in seconds with AI-powered content and real Google reviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorSuppressor />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
