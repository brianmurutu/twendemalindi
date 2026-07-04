"use client";

import { useState } from "react";

type Props = {
  groupId: string;
  currency: string;
  isSignedIn: boolean;
};

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

export default function ContributeForm({ groupId, currency, isSignedIn }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!amount || amount <= 0) {
      setError("Enter how much you're contributing.");
      return;
    }
    if (!isSignedIn && !name) {
      setError("Add your name so the group knows who this is from.");
      return;
    }

    setLoading(true);

    const isEmail = contact.includes("@");

    const res = await fetch("/api/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: groupId,
        amount,
        guest_name: name || undefined,
        guest_email: isEmail ? contact : undefined,
        guest_phone: !isEmail ? contact : undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }

    window.location.href = data.authorization_url;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sail border border-ocean/15 bg-white p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-ocean">Amount ({currency})</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setAmount(v)}
              className={`rounded-full border px-3 py-1 text-xs font-mono transition ${
                amount === v ? "border-coral bg-coral/10 text-coral" : "border-ocean/20 text-ocean/70 hover:border-ocean/40"
              }`}
            >
              {v.toLocaleString()}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
          placeholder="Or enter a custom amount"
          className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 font-mono text-ocean outline-none focus:border-coral"
        />
      </div>

      {!isSignedIn && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jina lako"
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ocean">Email or phone</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="For your payment receipt"
              className="w-full rounded-sail border border-ocean/20 px-4 py-2.5 outline-none focus:border-coral"
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-coral">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-coral py-3 font-medium text-white transition hover:bg-coral/90 disabled:opacity-60"
      >
        {loading ? "Taking you to payment..." : "Contribute now"}
      </button>
    </form>
  );
}
