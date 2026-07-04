# Twende Malindi — Group Vacation Contributions

MVP slice: group admins create a group, get a shareable link, and members
contribute toward the goal via Paystack, no signup required to pay.

## What's built here

- **Admin flow**: sign in via magic link → create a group with a savings goal
  → get an invite link → watch a dashboard of contributions.
- **Member flow**: open the invite link → see the live progress bar → enter
  an amount (+ name/contact if not signed in) → pay via Paystack → redirected
  back with the bar updated.
- **Paystack webhook**: confirms the charge server-to-server before marking a
  contribution as `success` — never trusts the client-side redirect alone.

## Setup

1. **Supabase**
   - Create a project at supabase.com.
   - Open the SQL editor and run `supabase/schema.sql`.
   - Copy your Project URL, anon key, and service role key into `.env.local`
     (copy `.env.example` first).
   - In Auth settings, make sure "Enable email confirmations" allows magic
     links, and add `http://localhost:3000/auth/callback` (and your prod URL)
     to the Redirect URLs allowlist.

2. **Paystack**
   - Get your secret + public key from the Paystack dashboard.
   - Add a webhook pointing to `https://<your-domain>/api/webhooks/paystack`
     for the `charge.success` event.
   - Paystack's test mode works end-to-end with test cards for local dev.

3. **Install and run**
   ```bash
   npm install
   cp .env.example .env.local   # fill in the values above
   npm run dev
   ```

## Database shape

- `profiles` — one row per signed-in user (admins, and later guides/partners).
- `groups` — one row per vacation goal. `invite_code` is the short public slug.
- `group_members` — a member is either a `user_id` (signed in) or a guest
  (`guest_name` + email/phone). This is what keeps contribution friction low.
- `contributions` — one row per Paystack transaction attempt. Starts
  `pending`, flips to `success` only once the webhook verifies it.
- `group_progress` — a view that sums successful contributions per group, so
  the progress bar is always one query away.

## Where to go next

- **Signup fee (Ksh 500)**: wire a `/api/signup-fee` route using the same
  `initializeTransaction` helper in `lib/paystack.ts`, flip
  `profiles.signup_fee_paid` on webhook confirmation, and gate group creation
  on that flag.
- **Tour guide signup + client bookings**: extend `profiles.role` and add a
  `bookings` table following the same pending → webhook-confirmed pattern
  used here for contributions.
- **Partners page**: add a `partners` table (name, type, description,
  commission_rate, status) with its own signup flow mirroring `groups/new`.
- **Weekly/monthly subscriptions**: Paystack Plans + Subscriptions API, same
  secret key, different endpoints.
- **Global mini-site (USD)**: the schema already supports `currency` per
  group — a `/global` route or subdomain that defaults new groups to USD is
  mostly a routing and copy change, not a new data model.
- **App download page**: ship the current build as an installable PWA first
  (add a manifest + service worker) before investing in a native wrapper.

## Design notes

Palette and type choices are in `tailwind.config.ts` — ocean teal, sand,
coral, and gold, deliberately steering away from the generic cream/terracotta
AI-app look. The progress bar (`components/ProgressBar.tsx`) is the one
signature element: a tide-fill animation, because contributions "rising like
the tide" is the whole metaphor for a coastal group fund.
