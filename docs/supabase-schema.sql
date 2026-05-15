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

insert into public.profiles (full_name, phone, role, status)
values
  ('Manjunath Banakar', '9591382942', 'president', 'active'),
  ('Pratap Banakar', '9000000002', 'vice_president', 'active'),
  ('Sarpabhushana Banakar', '9000000003', 'member', 'active'),
  ('Mukkanna Banakar', '9000000004', 'member', 'active'),
  ('Santosh Banakar', '9000000005', 'member', 'active'),
  ('Pradeep Banakar', '9000000006', 'member', 'active'),
  ('Praveen Banakar', '9000000007', 'member', 'active'),
  ('Appanna Banakar', '9000000008', 'onboarding', 'pending')
on conflict (phone) do nothing;

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

insert into public.deposit_summaries (year, label, principal, interest, expenditure, balance)
values
  (2021, 'First Year (2021-2022)', 111000, 8700, 5600, 114100),
  (2022, 'Second Year (2022-2023)', 149000, 33600, 13000, 169600),
  (2023, 'Third Year (2023-2024)', 159500, 45700, 17750, 187450),
  (2024, 'Fourth Year (2024-2025)', 126000, 57300, 33385, 149915),
  (2025, 'Fifth Year (2025)', 149000, 103350, 20580, 231770)
on conflict (year) do nothing;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = auth.uid()
      and role = 'president'
      and status = 'active'
  )
$$;

create or replace function public.register_profile(p_full_name text, p_phone text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  auth_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  existing_profile public.profiles;
  saved_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Login session is required.';
  end if;

  if normalized_phone = '' then
    raise exception 'Phone number is required.';
  end if;

  if not (
    auth_email = (normalized_phone || '@banakarfinclub.app')
    or (normalized_phone = '9591382942' and auth_email = 'manjunathbs.cloud@gmail.com')
  ) then
    raise exception 'Phone number does not match the login account.';
  end if;

  select *
  into existing_profile
  from public.profiles
  where phone = normalized_phone;

  if found then
    if existing_profile.auth_user_id is null then
      update public.profiles
      set auth_user_id = auth.uid(),
          full_name = coalesce(nullif(trim(p_full_name), ''), full_name)
      where id = existing_profile.id
      returning * into saved_profile;
      return saved_profile;
    end if;

    if existing_profile.auth_user_id = auth.uid() then
      return existing_profile;
    end if;

    raise exception 'Phone number is already registered.';
  end if;

  insert into public.profiles (auth_user_id, full_name, phone, role, status)
  values (auth.uid(), trim(p_full_name), normalized_phone, 'member', 'pending')
  returning * into saved_profile;

  return saved_profile;
end;
$$;

grant execute on function public.register_profile(text, text) to authenticated;

drop policy if exists "profiles readable by authenticated users" on public.profiles;
drop policy if exists "settings readable by authenticated users" on public.settings;
drop policy if exists "financial records readable by authenticated users" on public.deposit_summaries;
drop policy if exists "monthly payments readable by authenticated users" on public.monthly_payments;
drop policy if exists "loan requests readable by authenticated users" on public.loan_requests;
drop policy if exists "loans readable by authenticated users" on public.loans;
drop policy if exists "repayments readable by authenticated users" on public.repayments;
drop policy if exists "bank transactions readable by authenticated users" on public.bank_transactions;
drop policy if exists "audit logs readable by authenticated users" on public.audit_logs;
drop policy if exists "profiles admin update" on public.profiles;
drop policy if exists "settings admin write" on public.settings;
drop policy if exists "deposit summaries admin write" on public.deposit_summaries;
drop policy if exists "monthly payments admin write" on public.monthly_payments;
drop policy if exists "loan requests own insert" on public.loan_requests;
drop policy if exists "loan requests admin update" on public.loan_requests;
drop policy if exists "loans admin write" on public.loans;
drop policy if exists "repayments admin write" on public.repayments;
drop policy if exists "bank transactions admin read" on public.bank_transactions;
drop policy if exists "bank transactions admin write" on public.bank_transactions;
drop policy if exists "audit logs authenticated insert" on public.audit_logs;

create policy "profiles readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (public.is_admin() or id = public.current_profile_id());

create policy "profiles admin update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "settings readable by authenticated users"
  on public.settings for select
  to authenticated
  using (true);

create policy "settings admin write"
  on public.settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "financial records readable by authenticated users"
  on public.deposit_summaries for select
  to authenticated
  using (true);

create policy "deposit summaries admin write"
  on public.deposit_summaries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "monthly payments readable by authenticated users"
  on public.monthly_payments for select
  to authenticated
  using (public.is_admin() or profile_id = public.current_profile_id());

create policy "monthly payments admin write"
  on public.monthly_payments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "loan requests readable by authenticated users"
  on public.loan_requests for select
  to authenticated
  using (public.is_admin() or profile_id = public.current_profile_id());

create policy "loan requests own insert"
  on public.loan_requests for insert
  to authenticated
  with check (profile_id = public.current_profile_id());

create policy "loan requests admin update"
  on public.loan_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "loans readable by authenticated users"
  on public.loans for select
  to authenticated
  using (public.is_admin() or profile_id = public.current_profile_id());

create policy "loans admin write"
  on public.loans for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "repayments readable by authenticated users"
  on public.repayments for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.loans
      where loans.id = repayments.loan_id
        and loans.profile_id = public.current_profile_id()
    )
  );

create policy "repayments admin write"
  on public.repayments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "bank transactions admin read"
  on public.bank_transactions for select
  to authenticated
  using (public.is_admin());

create policy "bank transactions admin write"
  on public.bank_transactions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "audit logs readable by authenticated users"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin() or actor_profile_id = public.current_profile_id());

create policy "audit logs authenticated insert"
  on public.audit_logs for insert
  to authenticated
  with check (actor_profile_id = public.current_profile_id());
