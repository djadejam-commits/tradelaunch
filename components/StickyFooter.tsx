"use client";

interface StickyFooterProps {
  phone: string;
}

export default function StickyFooter({ phone }: StickyFooterProps) {
  if (!phone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3 block md:hidden z-50">
      <div className="flex gap-3">
        {/* Call Now Button */}
        <a
          href={`tel:${phone}`}
          className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
        >
          Call Now
        </a>

        {/* Get Quote Button */}
        <a
          href="#lead-form"
          className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
          Get Quote
        </a>
      </div>
    </div>
  );
}
