-- Run this in Supabase SQL Editor.
-- Sends available loan balance to all active members on:
--   5th of every month at 5 PM IST (11:30 AM UTC)
--   6th of every month at 9 AM IST (3:30 AM UTC)

create extension if not exists pg_cron;


create or replace function public.notify_all_members_pool_balance()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  member_rec        record;
  pool_5y           numeric;
  sarpa_share       numeric := 121833;
  historical        numeric := 116250;  -- (21000+14000) + 11250 + (7*2000*5)
  extra_interest    numeric := 11171;   -- 8125 + 3046
  emi_paid          numeric := 0;
  pre_june_interest numeric;
  actual_june_plus  numeric;
  total_outstanding numeric;
  available_balance numeric;
  balance_msg       text;
begin
  -- 5-year deposit pool
  select coalesce(sum(balance), 0) into pool_5y
  from public.deposit_summaries;

  -- EMI principal paid (Appanna EMI entry)
  select coalesce(principal_paid, 0) into emi_paid
  from public.current_loans
  where notes = 'emi_entry'
  limit 1;

  -- Interest collected Nov 2025 – May 2026 (paid_amount minus expected deposit)
  select coalesce(sum(greatest(0, coalesce(paid_amount, 0) - coalesce(expected_amount, 2000))), 0)
    into pre_june_interest
  from public.monthly_payments
  where status = 'paid'
    and month >= '2025-11'
    and month <= '2026-05';

  -- Actual payments collected June 2026 onwards
  select coalesce(sum(coalesce(paid_amount, 0)), 0) into actual_june_plus
  from public.monthly_payments
  where status = 'paid'
    and month >= '2026-06';

  -- Outstanding loan principal (excluding EMI entry)
  select coalesce(sum(principal - coalesce(principal_paid, 0)), 0) into total_outstanding
  from public.current_loans
  where status = 'active'
    and coalesce(notes, '') != 'emi_entry';

  available_balance := (pool_5y - sarpa_share)
                     + historical
                     + emi_paid
                     + pre_june_interest
                     + extra_interest
                     + actual_june_plus
                     - total_outstanding;

  balance_msg := 'Available balance for loans this month: ₹' || to_char(round(available_balance), 'FM99,99,99,999') || '.';

  for member_rec in
    select id
    from public.profiles
    where status = 'active'
  loop
    insert into public.notifications (profile_id, type, title, body)
    values (
      member_rec.id,
      'pool_balance',
      'Club loan balance update',
      balance_msg
    );
  end loop;
end;
$$;


-- Schedule 1: 5th of every month at 5 PM IST (11:30 AM UTC)
do $$ begin
  perform cron.unschedule('pool-balance-5th');
exception when others then null;
end $$;

select cron.schedule(
  'pool-balance-5th',
  '30 11 5 * *',
  'select public.notify_all_members_pool_balance();'
);


-- Schedule 2: 6th of every month at 9 AM IST (3:30 AM UTC)
do $$ begin
  perform cron.unschedule('pool-balance-6th');
exception when others then null;
end $$;

select cron.schedule(
  'pool-balance-6th',
  '30 3 6 * *',
  'select public.notify_all_members_pool_balance();'
);
