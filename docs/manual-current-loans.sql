-- Run this once in Supabase SQL Editor.
-- It creates the manual Current loan book used by the Loans tab.

create table if not exists public.current_loans (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  member_phone text,
  principal numeric(12,2) not null,
  principal_paid numeric(12,2) not null default 0,
  interest_rate_monthly numeric(6,3) not null default 1.25,
  is_interest_free boolean not null default false,
  status text not null default 'active' check (status in ('active', 'closed', 'interest_free')),
  purpose text,
  renewal_or_return_date date,
  disbursed_at date not null default current_date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.current_loans enable row level security;

drop policy if exists "current loans readable by authenticated users" on public.current_loans;
drop policy if exists "current loans admin write" on public.current_loans;

create policy "current loans readable by authenticated users"
  on public.current_loans for select
  to authenticated
  using (
    public.is_admin()
    or nullif(member_phone, '') = (
      select phone from public.profiles where id = public.current_profile_id()
    )
    or exists (
      select 1
      from public.profiles
      where id = public.current_profile_id()
      and (
        lower(full_name) = lower(member_name)
        or lower(full_name) like lower(member_name) || '%'
        or lower(member_name) like lower(full_name) || '%'
      )
    )
  );

create policy "current loans admin write"
  on public.current_loans for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
