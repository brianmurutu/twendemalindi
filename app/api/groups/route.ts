import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You need to be signed in to create a group." }, { status: 401 });
  }

  const body = await req.json();
  const { name, destination, goal_amount, currency, travel_start, travel_end } = body;

  if (!name || !goal_amount) {
    return NextResponse.json({ error: "Give the group a name and a savings goal." }, { status: 400 });
  }

  const invite_code = generateInviteCode();

  const { data, error } = await supabase
    .from("groups")
    .insert({
      admin_id: user.id,
      name,
      destination: destination || "Malindi",
      goal_amount,
      currency: currency || "KES",
      travel_start: travel_start || null,
      travel_end: travel_end || null,
      invite_code,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ group: data });
}
