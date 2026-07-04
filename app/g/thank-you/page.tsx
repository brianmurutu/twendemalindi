import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({ searchParams }: { searchParams: { ref?: string } }) {
  const service = createServiceClient();

  let status: "success" | "pending" | "unknown" = "unknown";
  let inviteCode: string | null = null;

  if (searchParams.ref) {
    const { data } = await service
      .from("contributions")
      .select("status, group_id, groups ( invite_code )")
      .eq("paystack_reference", searchParams.ref)
      .single();

    if (data) {
      status = data.status === "success" ? "success" : "pending";
      // @ts-expect-error — Supabase types the joined table loosely here
      inviteCode = data.groups?.invite_code ?? null;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">
        {status === "success" ? "Payment confirmed" : "Payment processing"}
      </p>
      <h1 className="mt-2 font-display text-3xl italic text-ocean">
        {status === "success" ? "Asante sana!" : "Almost there"}
      </h1>
      <p className="mt-3 text-ocean/70">
        {status === "success"
          ? "Your contribution has landed. The group's progress bar just moved."
          : "We're confirming this with Paystack — it can take a few seconds. Refresh the group page shortly to see it reflected."}
      </p>
      {inviteCode && (
        <Link
          href={`/g/${inviteCode}`}
          className="mt-6 rounded-full bg-ocean px-6 py-2.5 text-sm font-medium text-sand transition hover:bg-ocean-light"
        >
          Back to the group
        </Link>
      )}
    </main>
  );
}
