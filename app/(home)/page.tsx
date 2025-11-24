"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <--- NEW IMPORT

export default function Home() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [trade, setTrade] = useState("Plumbing");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, city, trade }),
      });

      const data = await res.json();
      if (data.subdomain) {
        // Redirect to the new site
        window.location.href = `${window.location.protocol}//${data.subdomain}.${window.location.host}`;
      } else {
        alert("Error generating site");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col relative">
      
      {/* --- NEW HEADER SECTION --- */}
      <div className="absolute top-0 right-0 p-6 z-10">
        <Link 
          href="/dashboard" 
          className="text-slate-600 font-medium hover:text-blue-600 transition-colors"
        >
          Login to Dashboard →
        </Link>
      </div>
      {/* -------------------------- */}

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-6 tracking-tight text-slate-900">
            Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Service Business</span> Website
          </h1>
          <p className="text-xl text-slate-600">
            Zero code. AI-generated. Ready in seconds.
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Joe's Plumbing"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Austin, TX"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trade</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Landscaping">Landscaping</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Building Site...
                </span>
              ) : (
                "Generate My Site"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}