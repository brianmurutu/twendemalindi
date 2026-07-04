"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewGroupPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [payLoading, setPayLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    destination: "Malindi",
    goal_amount: "",
    currency: "KES",
    travel_start: "",
    travel_end: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(prof);
      setCheckingAuth(false);
    }
    checkUser();
  }, [router]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePayFee() {
    setError(null);
    setPayLoading(true);
    try {
      const res = await fetch("/api/signup-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setPayLoading(false);

      if (!res.ok) {
        setError(data.error ?? "Couldn't initialize Paystack checkout.");
        return;
      }

      if (data.paid) {
        // Already paid
        setProfile((p: any) => ({ ...p, signup_fee_paid: true }));
      } else if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err) {
      setPayLoading(false);
      setError("An error occurred. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.goal_amount) {
      setError("Name the group and set a savings goal.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, goal_amount: Number(form.goal_amount) }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't create the group. Try again.");
      return;
    }

    router.push(`/groups/${data.group.id}`);
  }

  if (checkingAuth) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
        <p className="font-mono text-sm text-ocean/60 animate-pulse">Verifying credentials...</p>
      </main>
    );
  }

  // If the registration fee has not been paid yet, show the premium paywall page
  if (profile && !profile.signup_fee_paid) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-3xl text-coral">
          💳
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-coral font-semibold">Account Activation</p>
        <h1 className="mt-2 font-display text-3xl font-bold italic text-ocean">Activate your profile</h1>
        <p className="mt-4 text-sm text-ocean/70 leading-relaxed">
          Hello {profile.full_name}, thank you for joining! To activate your dashboard and start booking, please complete the one-time signup fee of <span className="font-bold text-coral">Ksh 500</span>.
        </p>

        <div className="mt-8 rounded-sail border border-ocean/10 bg-white p-6 text-left">
          <h3 className="font-display text-sm font-semibold text-ocean">Why is there a fee?</h3>
          <ul className="mt-3 space-y-2 text-xs text-ocean/70">
            <li>🛡️ Filters out fake profiles and spam bots</li>
            <li>📍 Funds background checking/vetting of local guides</li>
            <li>🤝 Supports direct matching commissions for partner beach villas</li>
          </ul>
        </div>

        {error && <p className="mt-4 text-sm text-coral">{error}</p>}

        <button
          onClick={handlePayFee}
          disabled={payLoading}
          className="mt-8 w-full rounded-full bg-coral py-3.5 font-semibold text-white shadow-lg shadow-coral/20 transition hover:bg-coral/95 disabled:opacity-60"
        >
          {payLoading ? "Redirecting to Paystack..." : "Pay Ksh 500 Now"}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">Start a fund</p>
      <h1 className="mt-2 font-display text-3xl italic text-ocean">Create your group's vacation goal</h1>
      <p className="mt-2 text-ocean/70">
        You'll get a link to share. Anyone with it can contribute toward the goal, no account required.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ocean">Group name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Campus Crew Malindi August Trip"
            className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ocean">Destination</label>
          <input
            value={form.destination}
            onChange={(e) => update("destination", e.target.value)}
            className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Goal amount</label>
            <input
              type="number"
              min={1}
              value={form.goal_amount}
              onChange={(e) => update("goal_amount", e.target.value)}
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 font-mono outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Travel start</label>
            <input
              type="date"
              value={form.travel_start}
              onChange={(e) => update("travel_start", e.target.value)}
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Travel end</label>
            <input
              type="date"
              value={form.travel_end}
              onChange={(e) => update("travel_end", e.target.value)}
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coral py-3 font-medium text-white transition hover:bg-coral/90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create group and get the link"}
        </button>
      </form>
    </main>
  );
}
