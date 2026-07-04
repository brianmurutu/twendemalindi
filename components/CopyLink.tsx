"use client";

import { useState } from "react";

export default function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-sail border border-ocean/15 bg-white px-4 py-3">
      <span className="flex-1 truncate font-mono text-sm text-ocean/80">{link}</span>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded-full bg-ocean px-4 py-1.5 text-xs font-medium text-sand transition hover:bg-ocean-light"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
