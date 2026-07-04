import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RegisterCompletePage({ searchParams }: { searchParams: { ref?: string } }) {
  const service = createServiceClient();

  let status: "success" | "pending" | "unknown" = "unknown";

  if (searchParams.ref) {
    const { data: profile } = await service
      .from("profiles")
      .select("signup_fee_paid")
      .eq("id", searchParams.ref) // Reference parsing or verify in db
      .single();

    // Check if user hasPaid by searching database or we can check via verifyTransaction or wait for webhook
    status = "pending"; 
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-lagoon/15 text-lagoon rounded-full flex items-center justify-center text-3xl">
        🎉
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-coral font-semibold">
        Registration Checkout
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold italic text-ocean">
        Welcome to Twende Malindi!
      </h1>
      <p className="mt-4 text-sm text-ocean/70 leading-relaxed">
        We are processing your Ksh 500 payment with Paystack. It should be activated in a few seconds.
      </p>

      <div className="mt-8 space-y-3 w-full">
        <Link
          href="/groups/new"
          className="block w-full text-center rounded-full bg-ocean py-3 text-sm font-semibold text-sand-light transition hover:bg-ocean-light"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="block w-full text-center rounded-full border border-ocean/15 bg-white py-3 text-sm font-semibold text-ocean transition hover:bg-ocean/5"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
