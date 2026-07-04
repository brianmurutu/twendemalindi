-- Twende Malindi — core schema for Group Vacation Contributions
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'traveler' check (role in ('traveler', 'guide', 'partner', 'admin')),
  signup_fee_paid boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select using (auth.uid() = id);

create policy "Profiles are editable by owner"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- GROUPS
-- A group is one vacation goal, created by an admin, shared via invite_code.
-- ============================================================
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  destination text not null default 'Malindi',
  invite_code text not null unique,
  goal_amount numeric(12, 2) not null check (goal_amount > 0),
  currency text not null default 'KES',
  travel_start date,
  travel_end date,
  status text not null default 'active' check (status in ('active', 'closed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists groups_invite_code_idx on groups (invite_code);
create index if not exists groups_admin_id_idx on groups (admin_id);

alter table groups enable row level security;

-- Anyone can look up an active group by its invite code (public group page).
create policy "Active groups are publicly viewable"
  on groups for select using (status = 'active' or admin_id = auth.uid());

create policy "Admins can create groups"
  on groups for insert with check (auth.uid() = admin_id);

create policy "Admins can update their own groups"
  on groups for update using (auth.uid() = admin_id);

-- ============================================================
-- GROUP MEMBERS
-- A member can be a registered profile OR a guest (name + phone/email only),
-- so contributing doesn't require a full signup first — lowers friction to pay.
-- ============================================================
create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  guest_name text,
  guest_email text,
  guest_phone text,
  joined_at timestamptz not null default now(),
  constraint member_identity check (
    user_id is not null or (guest_name is not null and (guest_email is not null or guest_phone is not null))
  )
);

create unique index if not exists group_members_user_unique
  on group_members (group_id, user_id) where user_id is not null;

create index if not exists group_members_group_id_idx on group_members (group_id);

alter table group_members enable row level security;

create policy "Members are viewable for groups the member belongs to or admins"
  on group_members for select using (
    exists (select 1 from groups g where g.id = group_id and (g.status = 'active' or g.admin_id = auth.uid()))
  );

create policy "Anyone can join an active group"
  on group_members for insert with check (
    exists (select 1 from groups g where g.id = group_id and g.status = 'active')
  );

-- ============================================================
-- CONTRIBUTIONS
-- One row per Paystack transaction attempt. Status flips to 'success' via webhook.
-- ============================================================
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  member_id uuid not null references group_members(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'KES',
  paystack_reference text not null unique,
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists contributions_group_id_idx on contributions (group_id);
create index if not exists contributions_status_idx on contributions (status);

alter table contributions enable row level security;

create policy "Contributions are viewable for the group's active page or its admin"
  on contributions for select using (
    exists (select 1 from groups g where g.id = group_id and (g.status = 'active' or g.admin_id = auth.uid()))
  );

-- Inserts/updates to contributions happen from the server (service role key) only,
-- via /api/contribute and /api/webhooks/paystack — no public insert policy needed.

-- ============================================================
-- CONVENIENCE VIEW — live progress per group
-- ============================================================
create or replace view group_progress as
select
  g.id as group_id,
  g.name,
  g.goal_amount,
  g.currency,
  coalesce(sum(c.amount) filter (where c.status = 'success'), 0) as raised_amount,
  count(distinct gm.id) as member_count
from groups g
left join contributions c on c.group_id = g.id
left join group_members gm on gm.group_id = g.id
group by g.id;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'unsubscribed'))
);

alter table newsletter_subscribers enable row level security;

create policy "Anyone can insert a subscription"
  on newsletter_subscribers for insert with check (true);

create policy "Subscribers only viewable by admins"
  on newsletter_subscribers for select using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

