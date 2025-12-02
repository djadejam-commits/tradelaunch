'use client';

import React from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { fetchGoogleBusiness } from '@/app/actions/fetch-google-business';

const libraries: ("places")[] = ["places"];

// --- PART 1: The Child Component (Only runs when API is ready) ---
function SearchInput({ onBusinessFound }: { onBusinessFound: (data: any) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: true, // It's safe to init now because the parent checked loading
  });

  const handleSelect = async (description: string, placeId: string) => {
    // 1. Update input to user's selection
    setValue(description, false);
    clearSuggestions();

    // 2. Call the Server Action
    try {
      console.log("Fetching data for:", placeId);
      const businessData = await fetchGoogleBusiness(placeId);
      // Pass back the data WITH the placeId
      onBusinessFound({ ...businessData, placeId });
    } catch (error) {
      console.error("Error fetching business:", error);
      alert("Failed to fetch business details. Check console.");
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for your business..."
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all disabled:opacity-50"
      />

      {status === "OK" && (
        <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-lg mt-2 shadow-xl max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description, place_id)}
              className="p-3 hover:bg-slate-700 cursor-pointer text-slate-100 text-sm border-b border-slate-700/50 last:border-b-0 transition-colors"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- PART 2: The Parent Component (Handles the Loading) ---
export default function GoogleBusinessSearch({ onBusinessFound }: { onBusinessFound: (data: any) => void }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  });

  if (loadError) {
    return <div className="text-red-400 text-sm text-center">Error loading Maps API</div>;
  }

  if (!isLoaded) {
    return <div className="text-slate-500 text-sm text-center">Loading Search...</div>;
  }

  // We only render the Input (and run the hook) if isLoaded is TRUE
  return <SearchInput onBusinessFound={onBusinessFound} />;
}