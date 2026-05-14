-- Banakar FinClub Supabase schema
-- Run this in Supabase SQL Editor after creating a free Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  phone text not null unique,
  role text not null default 'member' check (role in ('president', 'vice_president', 'member', 'onboarding')),
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected', 'disabled')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id)
);

create table if not exists public.settings (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, value)
values (
  'rules',
  '{
    "monthlyDeposit": 2000,
    "dueDay": 15,
    "loanInterestRateMonthly": 1.25,
    "presidentDecemberDeposit": 0,
    "vicePresidentDecemberDeposit": 1250,
    "annualRenewalRule": "Decided in annual meeting"
  }'::jsonb
)
on conflict (id) do nothing;

create table if not exists public.deposit_summaries (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  label text not null,
  principal numeric(12,2) not null default 0,
  interest numeric(12,2) not null default 0,
  expenditure numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.monthly_payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id),
  month text not null,
  expected_amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'waived', 'partial')),
  source text not null default 'manual' check (source in ('manual', 'statement', 'adjustment')),
  bank_transaction_id uuid,
  created_at timestamptz not null default now(),
  unique (profile_id, month)
);

create table if not exists public.loan_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id),
  amount numeric(12,2) not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles(id)
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id),
  request_id uuid references public.loan_requests(id),
  principal numeric(12,2) not null,
  principal_paid numeric(12,2) not null default 0,
  interest_rate_monthly numeric(6,3) not null default 1.25,
  is_interest_free boolean not null default false,
  status text not null default 'active' check (status in ('active', 'closed', 'interest_free')),
  purpose text,
  disbursed_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.repayments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans(id),
  principal_amount numeric(12,2) not null default 0,
  interest_amount numeric(12,2) not null default 0,
  paid_at date not null default current_date,
  source text not null default 'manual' check (source in ('manual', 'statement', 'adjustment')),
  bank_transaction_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  narration text not null,
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  balance numeric(12,2),
  matched_profile_id uuid references public.profiles(id),
  match_type text,
  review_status text not null default 'unreviewed' check (review_status in ('unreviewed', 'posted', 'ignored')),
  imported_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.deposit_summaries enable row level security;
alter table public.monthly_payments enable row level security;
alter table public.loan_requests enable row level security;
alter table public.loans enable row level security;
alter table public.repayments enable row level security;
alter table public.bank_transactions enable row level security;
alter table public.audit_logs enable row level security;

-- Initial broad policies for development.
-- Tighten before production by restricting admin-only writes to president profiles.

create policy "profiles readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "settings readable by authenticated users"
  on public.settings for select
  to authenticated
  using (true);

create policy "financial records readable by authenticated users"
  on public.deposit_summaries for select
  to authenticated
  using (true);

create policy "monthly payments readable by authenticated users"
  on public.monthly_payments for select
  to authenticated
  using (true);

create policy "loan requests readable by authenticated users"
  on public.loan_requests for select
  to authenticated
  using (true);

create policy "loans readable by authenticated users"
  on public.loans for select
  to authenticated
  using (true);

create policy "repayments readable by authenticated users"
  on public.repayments for select
  to authenticated
  using (true);

create policy "bank transactions readable by authenticated users"
  on public.bank_transactions for select
  to authenticated
  using (true);

create policy "audit logs readable by authenticated users"
  on public.audit_logs for select
  to authenticated
  using (true);
