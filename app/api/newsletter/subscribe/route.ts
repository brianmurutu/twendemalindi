import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const service = createServiceClient();

    // Check if the user is already subscribed
    const { data: existing, error: checkError } = await service
      .from("newsletter_subscribers")
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ message: "You are already subscribed to our newsletter!" }, { status: 200 });
      } else {
        // Reactivate subscription
        const { error: updateError } = await service
          .from("newsletter_subscribers")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("email", email);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await service
        .from("newsletter_subscribers")
        .insert({ email, status: "active" });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    // Send a welcome email via Resend
    await sendEmail({
      to: email,
      subject: "Welcome to Twende Malindi Newsletter! 🌊",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0d9488;">Karibu Twende Malindi! ⛵</h2>
          <p>Thank you for subscribing to our newsletter. You're now on the list to receive updates about premium beach getaways, exclusive travel discounts, group discount opportunities, and local guide profiles.</p>
          <p>Whether you're planning a trip with friends or looking to book a quiet beachfront retreat, we've got you covered.</p>
          <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b;">
            <p>You received this email because you subscribed to the Twende Malindi newsletter.</p>
            <p>&copy; ${new Date().getFullYear()} Twende Malindi. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Successfully subscribed! Welcome aboard. ⛵" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Internal server error" }, { status: 500 });
  }
}
