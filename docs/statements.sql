-- Run this in Supabase SQL Editor.
-- Creates the statements table for passbook-style transaction history.

create table if not exists public.statements (
  id          uuid primary key default gen_random_uuid(),
  date        date        not null default current_date,
  type        text        not null check (type in ('credit', 'debit')),
  amount      numeric     not null,
  description text        not null,
  balance     numeric     not null,
  related_id  uuid,
  created_at  timestamptz not null default now()
);

alter table public.statements enable row level security;

-- All logged-in members can read the statement
create policy "Authenticated users can read statements"
  on public.statements for select
  to authenticated using (true);

-- App inserts entries on loan approval, payment marking, loan recovery
create policy "Authenticated users can insert statements"
  on public.statements for insert
  to authenticated with check (true);
