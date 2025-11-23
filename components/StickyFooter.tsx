"use client";

interface StickyFooterProps {
  phone: string;
}

export default function StickyFooter({ phone }: StickyFooterProps) {
  if (!phone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/90 border-t border-gray-200/50 shadow-2xl p-4 block md:hidden z-50 safe-area-pb">
      <div className="flex gap-3 max-w-lg mx-auto">
        {/* Call Now Button */}
        <a
          href={`tel:${phone}`}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl text-center hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </a>

        {/* Get Quote Button */}
        <a
          href="#lead-form"
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl text-center hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Get Quote
        </a>
      </div>
    </div>
  );
}
