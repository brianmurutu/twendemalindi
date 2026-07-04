import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import CopyLink from "@/components/CopyLink";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GroupDashboardPage({ params }: { params: { groupId: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, destination, goal_amount, currency, invite_code, admin_id, status")
    .eq("id", params.groupId)
    .single();

  if (!group) notFound();
  if (group.admin_id !== user.id) {
    return (
      <main className="mx-auto max-w-lg px-6 py-14 text-center text-ocean/70">
        You don't have access to manage this group.
      </main>
    );
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
    .order("created_at", { ascending: false })
    .limit(25);

  const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/g/${group.invite_code}`;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Group dashboard</p>
      <h1 className="mt-2 font-display text-3xl italic text-ocean">{group.name}</h1>
      <p className="mt-1 text-ocean/70">{group.destination}</p>

      <div className="mt-8">
        <ProgressBar
          raised={progress?.raised_amount ?? 0}
          goal={group.goal_amount}
          currency={group.currency}
          memberCount={progress?.member_count ?? 0}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-2 font-display text-lg text-ocean">Share this link with your group</h2>
        <CopyLink link={inviteLink} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-lg text-ocean">Recent contributions</h2>
        {!contributions?.length && <p className="text-sm text-ocean/60">No contributions yet — share the link above.</p>}
        <ul className="divide-y divide-ocean/10 rounded-sail border border-ocean/10 bg-white">
          {contributions?.map((c, i) => {
            const member = Array.isArray(c.group_members) ? c.group_members[0] : c.group_members;
            const label = member?.guest_name || member?.guest_email || member?.guest_phone || "Registered member";
            return (
              <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="text-ocean">{label}</p>
                  <p className="text-xs text-ocean/50">{new Date(c.created_at).toLocaleString("en-KE")}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-ocean">{formatMoney(c.amount, group.currency)}</p>
                  <p
                    className={`text-xs ${
                      c.status === "success" ? "text-lagoon" : c.status === "pending" ? "text-gold" : "text-coral"
                    }`}
                  >
                    {c.status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
