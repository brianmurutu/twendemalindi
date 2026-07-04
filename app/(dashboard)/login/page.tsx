"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Group admin sign-in</p>
      <h1 className="mt-2 font-display text-3xl italic text-ocean">Twende Malindi</h1>

      {sent ? (
        <p className="mt-6 text-ocean/70">
          Check <span className="font-medium">{email}</span> for a sign-in link. Open it on this device to continue.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
          {error && <p className="text-sm text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ocean py-3 font-medium text-sand transition hover:bg-ocean-light disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send sign-in link"}
          </button>
        </form>
      )}
    </main>
  );
}
