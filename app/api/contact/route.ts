import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Ensure this path matches your setup
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteId, name, phone, message, ownerEmail } = body;

    // 1. Log what we received (for debugging)
    console.log("📝 Received Lead:", { siteId, name, phone });

    // 2. Save to Firebase
    await addDoc(collection(db, "leads"), {
      siteId,
      name,
      phone,
      message,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Lead saved to Firebase");

    // 3. Send Email (ONLY if Key exists)
    if (process.env.RESEND_API_KEY) {
      console.log("📧 Attempting to send email via Resend...");
      
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // <--- CRITICAL: MUST BE THIS FOR TESTING
        to: "delivered@resend.dev",    // <--- Change this to YOUR email to test
        subject: `New Lead: ${name}`,
        html: `<p>You have a new lead!</p><p><strong>Name:</strong> ${name}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Message:</strong> ${message}</p>`,
      });

      if (error) {
        console.error("❌ Resend Error:", error);
        // We do NOT throw here, because we still want to return success if the DB save worked
      } else {
        console.log("✅ Email sent:", data);
      }
    } else {
      console.warn("⚠️ No RESEND_API_KEY found. Skipping email.");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 API Route Crash:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}