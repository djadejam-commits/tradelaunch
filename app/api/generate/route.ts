import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  businessName: string;
  city: string;
  trade: string;
  phone?: string;
  email?: string;
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
    const { businessName, city, trade, phone, email } = body;

    if (!businessName || !city || !trade) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, city, trade' },
        { status: 400 }
      );
    }

    const systemPrompt = 'You are a copywriter for trade businesses. Output valid JSON only.';

    const userPrompt = `Generate content for ${businessName} in ${city} doing ${trade}.

Output must follow this exact JSON schema:
{
  "hero": { "headline": "string", "subheadline": "string", "cta": "string" },
  "services": [{ "title": "string", "desc": "string" }],
  "about": { "heading": "string", "body": "string" },
  "theme": "blue" | "red" | "green"
}

Rules:
- services array must have exactly 3 items
- theme must be one of: "blue", "red", or "green"
- All text should be professional and compelling`;

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

    await setDoc(doc(db, 'sites', siteId), {
      name: businessName,
      subdomain,
      city,
      trade,
      contact: {
        phone: phone || '',
        email: email || '',
      },
      content: siteContent,
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
