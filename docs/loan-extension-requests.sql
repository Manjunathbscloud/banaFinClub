-- Run this in Supabase SQL Editor.
-- Creates the loan_extension_requests table and RLS policies.

create table if not exists public.loan_extension_requests (
  id              uuid primary key default gen_random_uuid(),
  loan_id         uuid not null references public.current_loans(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  requested_at    timestamptz not null default now(),
  decided_at      timestamptz,
  decided_by      uuid references public.profiles(id)
);

alter table public.loan_extension_requests enable row level security;

-- Members can read all requests (to show awaiting badge for their own)
create policy "members_read_extension_requests"
  on public.loan_extension_requests for select
  using (auth.uid() is not null);

-- Members can insert their own extension request
create policy "members_insert_own_extension_request"
  on public.loan_extension_requests for insert
  with check (profile_id = (
    select id from public.profiles where auth_user_id = auth.uid() limit 1
  ));

-- Admin (president) can update (approve/reject)
create policy "president_update_extension_request"
  on public.loan_extension_requests for update
  using (exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and role = 'president' and status = 'active'
  ));
