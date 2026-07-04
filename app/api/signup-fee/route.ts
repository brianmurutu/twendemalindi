import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const service = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to pay the signup fee." }, { status: 401 });
  }

  // Get user details
  const { data: profile } = await service
    .from("profiles")
    .select("signup_fee_paid, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.signup_fee_paid) {
    return NextResponse.json({ message: "Signup fee already paid.", paid: true });
  }

  const reference = `SF-${randomUUID().slice(0, 12)}`;

  try {
    const transaction = await initializeTransaction({
      email: user.email!,
      amountInSubunit: 50000, // Ksh 500 (500 * 100)
      currency: "KES",
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/register/complete?ref=${reference}`,
      metadata: { type: "signup_fee", user_id: user.id },
    });

    return NextResponse.json({ authorization_url: transaction.authorization_url, paid: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to initialize payment." }, { status: 502 });
  }
}
