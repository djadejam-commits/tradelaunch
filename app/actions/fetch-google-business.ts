'use server';

/**
 * Google Business Profile data structure
 */
export interface GoogleBusinessData {
  displayName: string;
  formattedAddress: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingTotal?: number;
  websiteUri?: string;
  primaryType?: string;
  openingHours?: {
    weekdayDescriptions?: string[];
  };
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    time: string;
  }>;
}

/**
 * Fetches Google Business Profile data using the Google Places API (New)
 *
 * @param placeId - The Google Place ID
 * @returns Formatted business data with privacy-masked address and filtered reviews
 */
export async function fetchGoogleBusiness(
  placeId: string
): Promise<GoogleBusinessData> {
  try {
    // Validation
    if (!placeId) {
      throw new Error('Place ID is required');
    }

    // Use server-side API key (not client-side NEXT_PUBLIC key)
    // This key should have IP restrictions, not HTTP referrer restrictions
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error('Google Places API key is not configured. Please set GOOGLE_PLACES_API_KEY in your environment variables.');
    }

    // Call Google Places API (New) with field mask for cost control
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          // Field mask to control costs - only fetch what we need
          'X-Goog-FieldMask': [
            'displayName',
            'formattedAddress',
            'nationalPhoneNumber',
            'rating',
            'userRatingCount',
            'reviews',
            'websiteUri',
            'primaryTypeDisplayName',
            'regularOpeningHours',
          ].join(','),
        },
        cache: 'no-store', // Always fetch fresh data
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Places API returned ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    // ===== ADDRESS PRIVACY MASKING =====
    let maskedAddress = data.formattedAddress || '';

    // Check if address starts with a number (specific street address)
    if (/^\d/.test(maskedAddress)) {
      // Extract city and state from the full address
      const addressParts = maskedAddress.split(',').map((part: string) => part.trim());

      // Typical format: "123 Main St, Austin, TX 78701, USA"
      // We want: "Serving Austin, TX & Surrounding Areas"
      if (addressParts.length >= 3) {
        const city = addressParts[1]; // "Austin"
        const stateZipPart = addressParts[2]; // "TX 78701"
        const state = stateZipPart.split(' ')[0]; // Extract "TX"
        maskedAddress = `Serving ${city}, ${state} & Surrounding Areas`;
      } else if (addressParts.length >= 2) {
        // Fallback if format is different
        const city = addressParts[1];
        maskedAddress = `Serving ${city} & Surrounding Areas`;
      } else {
        // Last resort fallback
        maskedAddress = 'Serving Local Area';
      }
    }
    // If address doesn't start with a number, keep it as is (already generic)

    // ===== REVIEW FILTERING ("Auto-Best") =====
    const rawReviews = data.reviews || [];

    const filteredReviews = rawReviews
      // Step 1: Filter - Only 5-star reviews with substantial text
      .filter((review: any) => {
        const reviewText = review.text?.text || review.text?.originalText || '';
        return review.rating === 5 && reviewText.length > 20;
      })
      // Step 2: Sort by text length (descending) - longer reviews first
      .sort((a: any, b: any) => {
        const aText = a.text?.text || a.text?.originalText || '';
        const bText = b.text?.text || b.text?.originalText || '';
        return bText.length - aText.length;
      })
      // Step 3: Take only top 3
      .slice(0, 3)
      // Step 4: Map to clean object structure
      .map((review: any) => ({
        author: review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating,
        text: review.text?.text || review.text?.originalText || '',
        time: review.publishTime || new Date().toISOString(),
      }));

    // ===== BUILD RESULT =====
    const result: GoogleBusinessData = {
      displayName: data.displayName?.text || data.displayName || '',
      formattedAddress: maskedAddress,
      nationalPhoneNumber: data.nationalPhoneNumber,
      rating: data.rating,
      userRatingTotal: data.userRatingCount,
      websiteUri: data.websiteUri,
      primaryType: data.primaryTypeDisplayName?.text || data.primaryTypeDisplayName,
      openingHours: data.regularOpeningHours
        ? {
            weekdayDescriptions: data.regularOpeningHours.weekdayDescriptions || [],
          }
        : undefined,
      reviews: filteredReviews,
    };

    return result;
  } catch (error) {
    console.error('❌ Error fetching Google Business data:', error);

    // Provide meaningful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Configuration error: Google Maps API key is missing or invalid.');
      }
      if (error.message.includes('404')) {
        throw new Error(`Place not found: The place ID "${placeId}" does not exist.`);
      }
      if (error.message.includes('403')) {
        throw new Error('API access denied: Please check your API key permissions and billing.');
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded: Too many requests. Please try again later.');
      }

      throw new Error(`Failed to fetch Google Business data: ${error.message}`);
    }

    throw new Error('Failed to fetch Google Business data: An unknown error occurred.');
  }
}
