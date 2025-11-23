import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RegenerateRequest {
  siteId: string;
  field: 'headline' | 'about';
}

interface SiteData {
  name: string;
  city?: string;
  trade?: string;
  userId: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body: RegenerateRequest = await request.json();
    const { siteId, field } = body;

    if (!siteId || !field) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, field' },
        { status: 400 }
      );
    }

    if (!['headline', 'about'].includes(field)) {
      return NextResponse.json(
        { error: 'Invalid field. Must be "headline" or "about"' },
        { status: 400 }
      );
    }

    // Fetch the site data
    const siteDoc = await getDoc(doc(db, 'sites', siteId));

    if (!siteDoc.exists()) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    const siteData = siteDoc.data() as SiteData;

    // Check ownership
    if (siteData.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { name, city, trade } = siteData;

    let systemPrompt = 'You are a copywriter for trade businesses. Output valid JSON only.';
    let userPrompt = '';
    let responseSchema = '';

    if (field === 'headline') {
      userPrompt = `Generate a new hero section for ${name}, a ${trade || 'trade'} business in ${city || 'the local area'}.

Output must follow this exact JSON schema:
{
  "headline": "string (compelling headline, max 60 characters)",
  "subheadline": "string (supporting text, max 150 characters)",
  "cta": "string (call to action button text, max 25 characters)"
}

Rules:
- Make it compelling and professional
- Focus on the value proposition
- Use action-oriented language`;

      responseSchema = 'hero';
    } else if (field === 'about') {
      userPrompt = `Generate a new about section for ${name}, a ${trade || 'trade'} business in ${city || 'the local area'}.

Output must follow this exact JSON schema:
{
  "heading": "string (about section heading)",
  "body": "string (2-3 paragraphs about the business, approx 150-200 words)"
}

Rules:
- Make it professional and trustworthy
- Highlight experience and expertise
- Include a call to action`;

      responseSchema = 'about';
    }

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

    const generatedContent = JSON.parse(content);

    return NextResponse.json({
      field: responseSchema,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Regenerate API error:', error);

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
