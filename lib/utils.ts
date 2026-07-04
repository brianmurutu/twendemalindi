import { customAlphabet } from "nanoid";

// Avoids ambiguous characters (0/O, 1/I/l) so invite codes are easy to read aloud or type from a poster.
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const generateInviteCode = customAlphabet(alphabet, 7);

export function formatMoney(amount: number, currency: string = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function clampPercent(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}
