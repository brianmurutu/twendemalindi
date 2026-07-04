const PAYSTACK_BASE_URL = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

type InitializeParams = {
  email: string;
  amountInSubunit: number; // kobo/cents equivalent — for KES, amount x 100
  currency: "KES" | "USD";
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
};

export async function initializeTransaction(params: InitializeParams) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountInSubunit,
      currency: params.currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Failed to initialize Paystack transaction");
  }
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Failed to verify Paystack transaction");
  }
  return data.data as { status: string; amount: number; currency: string; metadata: Record<string, unknown> };
}

// Verifies the x-paystack-signature header on incoming webhooks.
export function isValidPaystackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const crypto = require("crypto") as typeof import("crypto");
  const hash = crypto.createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  return hash === signature;
}
