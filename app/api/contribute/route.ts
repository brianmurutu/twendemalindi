import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { group_id, amount, guest_name, guest_email, guest_phone } = body;

  if (!group_id || !amount || amount <= 0) {
    return NextResponse.json({ error: "Pick a group and an amount above zero." }, { status: 400 });
  }

  const anon = createClient();
  const service = createServiceClient();

  const {
    data: { user },
  } = await anon.auth.getUser();

  if (!user && (!guest_name || (!guest_email && !guest_phone))) {
    return NextResponse.json(
      { error: "Add your name and an email or phone number so we know who contributed." },
      { status: 400 }
    );
  }

  const { data: group, error: groupError } = await service
    .from("groups")
    .select("id, status, currency")
    .eq("id", group_id)
    .single();

  if (groupError || !group || group.status !== "active") {
    return NextResponse.json({ error: "This group isn't accepting contributions right now." }, { status: 404 });
  }

  // Find or create the member row.
  let memberId: string;

  if (user) {
    const { data: existing } = await service
      .from("group_members")
      .select("id")
      .eq("group_id", group_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      memberId = existing.id;
    } else {
      const { data: created, error: memberError } = await service
        .from("group_members")
        .insert({ group_id, user_id: user.id })
        .select("id")
        .single();
      if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });
      memberId = created.id;
    }
  } else {
    const { data: created, error: memberError } = await service
      .from("group_members")
      .insert({ group_id, guest_name, guest_email, guest_phone })
      .select("id")
      .single();
    if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });
    memberId = created.id;
  }

  const reference = `TM-${randomUUID().slice(0, 12)}`;

  const { error: contributionError } = await service.from("contributions").insert({
    group_id,
    member_id: memberId,
    amount,
    currency: group.currency,
    paystack_reference: reference,
    status: "pending",
  });

  if (contributionError) {
    return NextResponse.json({ error: contributionError.message }, { status: 500 });
  }

  const email = user?.email || guest_email || `${guest_phone}@twendemalindi.guest`;

  try {
    const transaction = await initializeTransaction({
      email,
      amountInSubunit: Math.round(amount * 100),
      currency: group.currency === "USD" ? "USD" : "KES",
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/g/thank-you?ref=${reference}`,
      metadata: { group_id, member_id: memberId },
    });

    return NextResponse.json({ authorization_url: transaction.authorization_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Payment could not be started." }, { status: 502 });
  }
}
