"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface Stage {
  id: string;
  label: string;
  duration: number; // ms
}

const STAGES: Stage[] = [
  { id: "analyzing", label: "Analyzing your business", duration: 1000 },
  { id: "content", label: "Writing professional content", duration: 3000 },
  { id: "design", label: "Designing your layout", duration: 2000 },
  { id: "reviews", label: "Fetching Google reviews", duration: 1500 },
  { id: "finalizing", label: "Finalizing your site", duration: 1500 },
];

function LoadingGenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get form data from URL params
    const businessName = searchParams.get("businessName");
    const city = searchParams.get("city");
    const trade = searchParams.get("trade");
    const phone = searchParams.get("phone") || undefined;
    const email = searchParams.get("email") || undefined;
    const placeId = searchParams.get("placeId") || undefined;

    if (!businessName || !city || !trade) {
      setError("Missing required information");
      return;
    }

    // Start the generation process
    generateSite({
      businessName,
      city,
      trade,
      phone,
      email,
      placeId,
    });

    // Animate through stages
    let stageIndex = 0;
    const stageTimers: NodeJS.Timeout[] = [];

    STAGES.forEach((stage, index) => {
      const totalDelay = STAGES.slice(0, index).reduce(
        (sum, s) => sum + s.duration,
        0
      );
      const timer = setTimeout(() => {
        setCurrentStage(index + 1);
      }, totalDelay);
      stageTimers.push(timer);
    });

    return () => {
      stageTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [searchParams]);

  const generateSite = async (data: {
    businessName: string;
    city: string;
    trade: string;
    phone?: string;
    email?: string;
    placeId?: string;
  }) => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.subdomain) {
        // Wait for all stages to complete before redirecting
        const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
        setTimeout(() => {
          const hostname = window.location.hostname;

          // For localhost, use direct route instead of subdomain
          // (subdomains don't work reliably on localhost without hosts file modification)
          if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) {
            window.location.href = `/site/${result.subdomain}`;
          } else {
            // For production, use subdomain
            const rootDomain = hostname.startsWith("www.")
              ? hostname.slice(4)
              : hostname;
            window.location.href = `${window.location.protocol}//${result.subdomain}.${rootDomain}`;
          }
        }, totalDuration);
      } else {
        setError("Failed to generate site");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card variant="elevated" padding="lg" className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            ← Back to Home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full p-4">
        <Card variant="glass" padding="lg" className="text-center">
          {/* Main Spinner */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">✨</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
              Building Your Website
            </h1>
            <p className="text-lg text-slate-400">
              This will only take a moment...
            </p>
          </div>

          {/* Progress Stages */}
          <div className="space-y-4">
            {STAGES.map((stage, index) => {
              const isComplete = index < currentStage;
              const isCurrent = index === currentStage;
              const isPending = index > currentStage;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isCurrent
                      ? "bg-cyan-500/10 border border-cyan-500/30"
                      : isComplete
                      ? "bg-slate-800/50 border border-slate-700/50"
                      : "bg-slate-800/20 border border-slate-700/20"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isComplete
                        ? "bg-green-500"
                        : isCurrent
                        ? "bg-cyan-500 animate-pulse"
                        : "bg-slate-700"
                    }`}
                  >
                    {isComplete ? (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : isCurrent ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                    ) : (
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-left font-medium transition-all duration-500 ${
                      isComplete
                        ? "text-slate-300"
                        : isCurrent
                        ? "text-cyan-400"
                        : "text-slate-500"
                    }`}
                  >
                    {stage.label}
                  </span>

                  {/* Animated Dots for Current Stage */}
                  {isCurrent && (
                    <span className="ml-auto text-cyan-400 animate-pulse">
                      ...
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fun Fact Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              💡 <span className="text-slate-400">Did you know?</span> Most
              businesses get their first customer within 24 hours of launching
              their website.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function LoadingGenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <LoadingGenContent />
    </Suspense>
  );
}
