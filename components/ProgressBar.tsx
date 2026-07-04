import { clampPercent, formatMoney } from "@/lib/utils";

type Props = {
  raised: number;
  goal: number;
  currency?: string;
  memberCount?: number;
};

export default function ProgressBar({ raised, goal, currency = "KES", memberCount }: Props) {
  const percent = clampPercent(raised, goal);
  const isFull = percent >= 100;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-2xl text-ocean">{formatMoney(raised, currency)}</span>
        <span className="font-mono text-sm text-ocean/60">of {formatMoney(goal, currency)}</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-5 w-full overflow-hidden rounded-sail bg-ocean/10"
      >
        <div
          className="tide-fill absolute inset-y-0 left-0 origin-left rounded-sail bg-gradient-to-r from-lagoon to-coral"
          style={{ width: `${percent}%` }}
        >
          <div className="tide-shimmer absolute inset-y-0 right-0 w-6 bg-white/20 blur-[2px]" />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-ocean/60">
        <span>{isFull ? "Goal reached — tuko tayari!" : `${percent}% of the way there`}</span>
        {typeof memberCount === "number" && (
          <span>{memberCount} {memberCount === 1 ? "member" : "members"} contributing</span>
        )}
      </div>
    </div>
  );
}
