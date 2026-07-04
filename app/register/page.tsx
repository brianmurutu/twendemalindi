"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"traveler" | "guide" | "partner">("traveler");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">Join Twende Malindi</p>
        <h1 className="mt-2 font-display text-4xl font-bold italic text-ocean">Create Your Account</h1>
        <p className="mt-3 text-sm text-ocean/70">
          Connect with travel groups, list tour packages, or showcase beach accommodations.
        </p>
      </div>

      {sent ? (
        <div className="mt-8 rounded-sail border border-ocean/10 bg-white p-6 text-center">
          <span className="text-4xl">✉️</span>
          <h2 className="mt-4 font-display text-xl font-medium text-ocean">Check your inbox</h2>
          <p className="mt-2 text-sm text-ocean/70">
            We sent a secure login link to <span className="font-semibold">{email}</span>. Click the link to verify your email and complete payment.
          </p>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="mt-8 space-y-5 rounded-sail border border-ocean/15 bg-white p-6 shadow-lg shadow-ocean/5">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Account Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["traveler", "guide", "partner"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-sail border py-2.5 text-xs font-semibold capitalize transition ${
                    role === r
                      ? "border-coral bg-coral/5 text-coral"
                      : "border-ocean/10 text-ocean/70 hover:border-ocean/30"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Mwangi Kamau"
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 text-sm outline-none focus:border-coral"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0712345678"
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 text-sm font-mono outline-none focus:border-coral"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 text-sm outline-none focus:border-coral"
            />
          </div>

          <div className="border-t border-ocean/10 pt-4">
            <div className="flex items-center justify-between text-xs text-ocean/70">
              <span>One-time activation fee</span>
              <span className="font-mono font-bold text-coral">Ksh 500</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ocean/50">
              Every new user pays a small one-time fee to cover vetting cost and filter out spam, keeping Twende Malindi secure for everyone.
            </p>
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ocean py-3 font-semibold text-sand-light transition hover:bg-ocean-light disabled:opacity-60"
          >
            {loading ? "Sending Magic Link..." : "Register & Continue"}
          </button>
        </form>
      )}
    </main>
  );
}
