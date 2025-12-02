'use client';

import { useState } from 'react';
// import GoogleBusinessSearch from '../../components/GoogleBusinessSearch';
// Update the import path below if the component exists elsewhere:
import GoogleBusinessSearch from '../../components/GoogleBusinessSearch';
// Or create the file at ../../components/GoogleBusinessSearch.tsx if it does not exist.

export default function TestPage() {
  const [data, setData] = useState<any>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-12 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            QuickProSite API Test
          </h1>
          <p className="mt-2 text-gray-600">
            Search for a business to test the API, filtering, and privacy logic.
          </p>
        </div>

        {/* The Search Component */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Find Business
          </label>
          <GoogleBusinessSearch onBusinessFound={(result: unknown) => setData(result)} />
        </div>

        {/* The Results Display (Debug View) */}
        {data && (
          <div className="space-y-4 mt-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900">It Works! (JSON Data)</h2>
            <pre className="text-xs text-green-600 font-mono overflow-auto max-h-[400px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}