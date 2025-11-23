import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

interface LeadRequest {
  siteId: string;
  name: string;
  phone: string;
  message?: string;
}

interface SiteData {
  name: string;
  userId: string | null;
  contact?: {
    email: string;
    phone: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequest = await request.json();
    const { siteId, name, phone, message } = body;

    if (!siteId || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, name, phone' },
        { status: 400 }
      );
    }

    // 1. Save lead to Firestore
    const leadRef = await addDoc(collection(db, 'leads'), {
      siteId,
      name,
      phone,
      message: message || '',
      createdAt: new Date().toISOString(),
    });

    // 2. Fetch site owner's email
    const siteDoc = await getDoc(doc(db, 'sites', siteId));

    if (!siteDoc.exists()) {
      // Lead was saved, but site not found for notification
      console.warn(`Lead saved but site ${siteId} not found for email notification`);
      return NextResponse.json({
        success: true,
        leadId: leadRef.id,
        emailSent: false,
      });
    }

    const siteData = siteDoc.data() as SiteData;
    const ownerEmail = siteData.contact?.email;

    // 3. Send email notification (or log if no email configured)
    if (ownerEmail) {
      // Check if Resend is configured
      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
            from: 'TradeLaunch <leads@tradelaunch.io>',
            to: ownerEmail,
            subject: `New Lead from ${siteData.name}`,
            html: `
              <h2>New Lead Received!</h2>
              <p>You have a new lead from your website <strong>${siteData.name}</strong>.</p>
              <hr />
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
              <hr />
              <p style="color: #666; font-size: 12px;">
                This lead was submitted on ${new Date().toLocaleString()}
              </p>
            `,
          });

          console.log(`Email notification sent to ${ownerEmail} for lead ${leadRef.id}`);

          return NextResponse.json({
            success: true,
            leadId: leadRef.id,
            emailSent: true,
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          return NextResponse.json({
            success: true,
            leadId: leadRef.id,
            emailSent: false,
          });
        }
      } else {
        // Log email notification (no Resend API key configured)
        console.log('=== EMAIL NOTIFICATION (Console Mode) ===');
        console.log(`To: ${ownerEmail}`);
        console.log(`Subject: New Lead from ${siteData.name}`);
        console.log(`Lead Name: ${name}`);
        console.log(`Lead Phone: ${phone}`);
        console.log(`Lead Message: ${message || 'N/A'}`);
        console.log('==========================================');

        return NextResponse.json({
          success: true,
          leadId: leadRef.id,
          emailSent: false,
          emailLogged: true,
        });
      }
    } else {
      console.log(`No email configured for site ${siteId} - lead saved without notification`);
      return NextResponse.json({
        success: true,
        leadId: leadRef.id,
        emailSent: false,
      });
    }
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
