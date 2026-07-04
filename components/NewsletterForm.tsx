"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message ?? "Welcome aboard! ⛵");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please check your connection.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-sail border border-ocean/15 bg-white p-8 shadow-xl shadow-ocean/5 text-center">
      <div className="flex justify-center mb-4 text-3xl">🌊</div>
      <h3 className="font-display text-2xl font-bold text-ocean">
        Subscribe to <span className="italic text-coral font-semibold">Tides & Travel</span>
      </h3>
      <p className="mt-2 text-sm text-ocean/70 max-w-md mx-auto">
        Join our community newsletter. Get updates on local beach getaways, exclusive guide reviews, and partner discounts.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row justify-center max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={status === "loading"}
          required
          className="w-full rounded-full border border-ocean/20 px-5 py-3 text-sm text-ink outline-none transition focus:border-coral focus:ring-1 focus:ring-coral/20 disabled:bg-sand-light/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-auto shrink-0 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white shadow-md shadow-coral/10 transition hover:bg-coral/95 hover:scale-[1.02] active:scale-[0.98] disabled:bg-coral/60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Joining..." : "Join Now"}
        </button>
      </form>

      {status === "success" && (
        <div className="mt-4 rounded-full bg-lagoon/10 px-4 py-2 text-xs font-medium text-lagoon inline-block animate-fade-in">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-full bg-coral/10 px-4 py-2 text-xs font-medium text-coral inline-block animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}
