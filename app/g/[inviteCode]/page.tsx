import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import ContributeForm from "@/components/ContributeForm";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GroupPage({ params }: { params: { inviteCode: string } }) {
  const supabase = createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, destination, goal_amount, currency, travel_start, travel_end, status")
    .eq("invite_code", params.inviteCode)
    .single();

  if (!group || group.status !== "active") {
    notFound();
  }

  const { data: progress } = await supabase
    .from("group_progress")
    .select("raised_amount, member_count")
    .eq("group_id", group.id)
    .single();

  const { data: contributions } = await supabase
    .from("contributions")
    .select("amount, status, created_at, group_members ( guest_name, guest_email, guest_phone, user_id )")
    .eq("group_id", group.id)
    .eq("status", "success") // Only show confirmed payments publicly
    .order("created_at", { ascending: false })
    .limit(10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const travelWindow =
    group.travel_start && group.travel_end
      ? `${new Date(group.travel_start).toLocaleDateString("en-KE", { month: "short", day: "numeric" })} – ${new Date(
          group.travel_end
        ).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}`
      : null;

  return (
    <div className="min-h-screen bg-sand-light text-ink pb-20">
      {/* Header */}
      <header className="border-b border-ocean/10 bg-sand-light/85 backdrop-blur-md py-4">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between">
          <span className="font-display text-xl font-semibold italic text-ocean">
            Twende Malindi
          </span>
          <span className="text-xs font-mono font-medium rounded-full bg-coral/10 text-coral px-3 py-1">
            Group Vacation Fund
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">Tukutane Malindi 🌴</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-ocean leading-tight">{group.name}</h1>
              <p className="mt-2 text-sm text-ocean/70 font-medium">
                Destination: <span className="text-ocean">{group.destination}</span>
                {travelWindow ? ` · Travel Dates: ${travelWindow}` : ""}
              </p>
            </div>

            {/* Progress segment */}
            <div className="rounded-sail border border-ocean/10 bg-white p-6 shadow-sm">
              <ProgressBar
                raised={progress?.raised_amount ?? 0}
                goal={group.goal_amount}
                currency={group.currency}
                memberCount={progress?.member_count ?? 0}
              />
            </div>

            {/* Recent contributors list */}
            <div>
              <h2 className="font-display text-xl font-bold text-ocean mb-4">Confirmed Contributors</h2>
              
              {!contributions?.length ? (
                <div className="rounded-sail border border-ocean/5 bg-white/50 p-6 text-center text-sm text-ocean/50 italic">
                  Be the first one to kickstart the vacation pool below! 🌊
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {contributions.map((c, i) => {
                    const member = Array.isArray(c.group_members) ? c.group_members[0] : c.group_members;
                    const name = member?.guest_name || "Anonymous Friend";
                    return (
                      <div key={i} className="rounded-sail border border-ocean/10 bg-white p-4 flex items-center justify-between shadow-xs">
                        <div>
                          <p className="text-sm font-semibold text-ocean">{name}</p>
                          <p className="text-[10px] text-ocean/50">
                            {new Date(c.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-lagoon bg-lagoon/5 px-2.5 py-1 rounded-full">
                          + {formatMoney(c.amount, group.currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="mb-3 font-display text-lg font-semibold text-ocean">Add Your Contribution</h2>
              <ContributeForm groupId={group.id} currency={group.currency} isSignedIn={!!user} />
              
              <div className="mt-6 rounded-sail border border-ocean/5 bg-ocean/5 p-4 text-[11px] leading-relaxed text-ocean/60">
                🔒 Secured by Paystack. All contributions are held securely and pooled towards the group destination target.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
