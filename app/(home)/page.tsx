"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import GoogleBusinessSearch from "@/components/GoogleBusinessSearch";
import type { GoogleBusinessData } from "@/app/actions/fetch-google-business";

export default function Home() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [trade, setTrade] = useState("Plumber");

  // Contact fields
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Google Business data
  const [googleData, setGoogleData] = useState<GoogleBusinessData | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  // Handler when user selects a Google Business listing
  const handleGoogleBusinessFound = (data: GoogleBusinessData & { placeId: string }) => {
    setGoogleData(data);
    setPlaceId(data.placeId);

    // Pre-populate form fields from Google data
    setBusinessName(data.displayName);
    if (data.nationalPhoneNumber) {
      setPhone(data.nationalPhoneNumber);
    }
    // Extract city from masked address
    const cityMatch = data.formattedAddress.match(/Serving ([^,]+),/);
    if (cityMatch) {
      setCity(cityMatch[1]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isGenerating) return;

    setIsGenerating(true);

    // Generate default business name if not provided
    const finalBusinessName = businessName || `${city} ${trade}`;

    // Build URL params for loading page
    const params = new URLSearchParams({
      businessName: finalBusinessName,
      city,
      trade,
    });

    if (phone) params.append("phone", phone);
    if (email) params.append("email", email);
    if (placeId) params.append("placeId", placeId);

    // Navigate to loading page
    router.push(`/loading-gen?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Button */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <Link
          href="/sign-in"
          className="text-slate-400 font-medium hover:text-cyan-400 transition-colors cursor-pointer"
        >
          Login →
        </Link>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">AI-Powered Websites</span>
            <br />
            <span className="text-slate-100">Built in Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-4">
            Your trade business deserves a website as professional as your work.
          </p>
          <p className="text-lg text-slate-500">
            No code. No designers. Just magic.
          </p>
        </div>

        {/* Mad Libs Style Interface */}
        <Card variant="glass" className="w-full max-w-3xl mb-12" padding="lg">
          <form onSubmit={handleGenerate} className="space-y-8">

            {/* Mad Libs Hero Input */}
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-4">
                <span className="text-cyan-400">*</span> Required fields
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-2xl md:text-3xl text-slate-300 mb-8">
                <span>I'm a</span>
                <div className="relative inline-block">
                  <select
                    className="inline-block min-w-[180px] bg-slate-800 border-2 border-cyan-500/50 rounded-lg px-4 py-3 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all"
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    required
                  >
                    <option value="Plumber">Plumber</option>
                    <option value="HVAC Technician">HVAC Technician</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Landscaper">Landscaper</option>
                    <option value="Roofer">Roofer</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="General Contractor">General Contractor</option>
                  </select>
                  <span className="absolute -top-2 -right-2 text-cyan-400 text-sm">*</span>
                </div>
                <span>in</span>
                <div className="relative inline-block">
                  <Input
                    placeholder="Austin, TX"
                    className="inline-block min-w-[200px] border-2 border-cyan-500/50"
                    glow
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <span className="absolute -top-2 -right-2 text-cyan-400 text-sm">*</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isGenerating}
                icon={<span>✨</span>}
                className="text-xl px-12 py-6"
              >
                {isGenerating ? "Building Your Site..." : "Generate My Website"}
              </Button>

              <p className="text-slate-500 text-sm mt-4">
                That's all we need! Add more details below if you'd like.
              </p>
            </div>

            {/* Google Business Search - Always Visible */}
            <div className="pt-6 border-t border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-3 text-center">
                Have a Google Business Profile? Find it here (optional)
              </label>
              <div className="max-w-md mx-auto">
                <GoogleBusinessSearch onBusinessFound={handleGoogleBusinessFound} />
                {googleData && (
                  <Card variant="elevated" padding="sm" className="mt-3 border-green-500/30 bg-green-500/5">
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Found: <strong>{googleData.displayName}</strong>
                        {googleData.rating && (
                          <span className="ml-2">
                            ({googleData.rating}★ · {googleData.userRatingTotal} reviews)
                          </span>
                        )}
                      </span>
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Expandable Details Section */}
            <details className="mt-8">
              <summary className="cursor-pointer text-slate-400 hover:text-slate-300 text-center font-medium mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Want to add more details? (optional)</span>
              </summary>

              <div className="space-y-6 mt-6 pt-6 border-t border-slate-700">
                <p className="text-center text-slate-500 text-sm mb-4">
                  All fields below are optional. We'll create a great site with just your trade and city!
                </p>

                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    placeholder="Joe's Plumbing"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    helperText="We'll generate one if you skip this"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    helperText="Add your contact number"
                    leadingIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="hello@joesplumbing.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText="Your business email"
                    leadingIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </details>

          </form>
        </Card>

        {/* Social Proof */}
        <div className="text-center text-slate-500 text-sm mb-12">
          <p className="mb-2">✨ Trusted by 500+ service businesses</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 Average Rating</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Sites Built in &lt;30 Seconds</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <Card variant="glass" hover glow padding="lg" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Lightning Fast</h3>
            <p className="text-slate-400">
              From idea to live website in under 30 seconds. No technical skills required.
            </p>
          </Card>

          <Card variant="glass" hover glow padding="lg" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">AI-Powered</h3>
            <p className="text-slate-400">
              Smart AI understands your trade and creates content tailored to your business.
            </p>
          </Card>

          <Card variant="glass" hover glow padding="lg" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Mobile-First</h3>
            <p className="text-slate-400">
              Your site looks perfect on every device. 60% of your customers are on mobile.
            </p>
          </Card>
        </div>

      </div>
    </main>
  );
}
