import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { fetchGoogleBusiness, type GoogleBusinessData } from '@/app/actions/fetch-google-business';
import { buildEnhancedPrompt } from '@/lib/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  businessName: string;
  city: string;
  trade: string;
  phone?: string;
  email?: string;
  placeId?: string;
  googleData?: GoogleBusinessData;
}

interface Review {
  name: string;
  text: string;
  rating: number;
}

interface SiteContent {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  services: Array<{
    title: string;
    desc: string;
  }>;
  about: {
    heading: string;
    body: string;
  };
  reviews?: Review[];
  theme: 'blue' | 'red' | 'green';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body: GenerateRequest = await request.json();
    let { businessName, city, trade, phone, email, placeId, googleData } = body;

    if (!businessName || !city || !trade) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, city, trade' },
        { status: 400 }
      );
    }

    // If placeId provided but no googleData, fetch it server-side
    if (placeId && !googleData) {
      try {
        googleData = await fetchGoogleBusiness(placeId);
      } catch (error) {
        console.error('Failed to fetch Google Business data:', error);
        // Continue without Google data (fallback to AI-only)
      }
    }

    // Use enhanced prompt system with trade and location context
    const { systemPrompt, userPrompt } = buildEnhancedPrompt({
      businessName,
      city,
      trade,
      googleData,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content generated from OpenAI' },
        { status: 500 }
      );
    }

    const siteContent: SiteContent = JSON.parse(content);
    const subdomain = slugify(businessName);
    const siteId = `${subdomain}-${Date.now()}`;

    // If we have Google reviews, map them to the format expected by the site
    let reviews: Review[] = [];
    if (googleData && googleData.reviews && googleData.reviews.length > 0) {
      reviews = googleData.reviews.map((review) => ({
        name: review.author,
        text: review.text,
        rating: review.rating,
      }));
    }

    await setDoc(doc(db, 'sites', siteId), {
      name: businessName,
      subdomain,
      city,
      trade,
      contact: {
        phone: phone || '',
        email: email || '',
      },
      content: {
        ...siteContent,
        reviews, // Include Google reviews
      },
      userId: userId || null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      siteId,
      subdomain,
    });
  } catch (error) {
    console.error('Generate API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON' },
        { status: 500 }
      );
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
