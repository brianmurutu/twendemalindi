import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { isValidPaystackSignature, verifyTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!isValidPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    // Acknowledge and ignore anything we don't act on.
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference as string;

  // Re-verify server-to-server rather than trusting the webhook payload alone.
  const verified = await verifyTransaction(reference);

  if (verified.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const service = createServiceClient();

  if (verified.metadata?.type === "signup_fee") {
    const userId = verified.metadata.user_id as string;
    const { error: profileError } = await service
      .from("profiles")
      .update({ signup_fee_paid: true })
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
  } else {
    const { error: contribError } = await service
      .from("contributions")
      .update({ status: "success", confirmed_at: new Date().toISOString() })
      .eq("paystack_reference", reference)
      .eq("status", "pending"); // idempotent

    if (contribError) {
      return NextResponse.json({ error: contribError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
