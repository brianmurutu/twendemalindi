import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const supabase = createClient();

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      // Create the profile row on first sign-in. Ksh 500 signup fee is charged
      // separately via /api/signup-fee once profile exists — kept out of this
      // redirect handler so a slow Paystack call never blocks login.
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name ?? "Traveler",
          phone: data.user.user_metadata?.phone ?? null,
          role: data.user.user_metadata?.role ?? "traveler",
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(new URL("/groups/new", req.url));
}
