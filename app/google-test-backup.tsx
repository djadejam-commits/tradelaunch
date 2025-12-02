'use client';

import React, { useState } from 'react';
import GoogleBusinessSearch from '@/components/GoogleBusinessSearch';
import { GoogleBusinessData } from '@/app/actions/fetch-google-business';

export default function Home() {
  const [result, setResult] = useState<GoogleBusinessData | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-black">QuickProSite MVP Test</h1>

      {/* The Search Box */}
      <GoogleBusinessSearch onBusinessFound={(data) => setResult(data)} />

      {/* The Result Display */}
      {result && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md w-full max-w-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-600">Success! Data Ingested:</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              ✓ API Success
            </span>
          </div>

          {/* Quick View Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-bold block text-xs text-gray-500 mb-1">Business Name</span>
              <span className="text-gray-900">{result.displayName}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-bold block text-xs text-gray-500 mb-1">Rating</span>
              <span className="text-gray-900">
                ⭐ {result.rating || 'N/A'} ({result.userRatingTotal || 0} reviews)
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded col-span-2">
              <span className="font-bold block text-xs text-gray-500 mb-1">
                Address (Privacy Masked)
              </span>
              <span className="text-gray-900">{result.formattedAddress}</span>
            </div>
            {result.nationalPhoneNumber && (
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-bold block text-xs text-gray-500 mb-1">Phone</span>
                <span className="text-gray-900">{result.nationalPhoneNumber}</span>
              </div>
            )}
            {result.websiteUri && (
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-bold block text-xs text-gray-500 mb-1">Website</span>
                <a
                  href={result.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit Site →
                </a>
              </div>
            )}
          </div>

          {/* Top Reviews */}
          {result.reviews && result.reviews.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">
                Top Reviews (Filtered - 5-star only):
              </h3>
              <div className="space-y-3">
                {result.reviews.map((review, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      <span className="text-xs text-gray-600">by {review.author}</span>
                    </div>
                    <p className="italic text-gray-700 text-sm">
                      "{review.text.substring(0, 150)}
                      {review.text.length > 150 ? '...' : ''}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Output */}
          <div className="mt-6">
            <div className="bg-slate-900 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">Raw JSON Response</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    alert('JSON copied to clipboard!');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 text-xs text-green-400 font-mono overflow-auto max-h-[400px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
