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
  member_rec         record;
  total_deposits     numeric;
  total_outstanding  numeric;
  available_balance  numeric;
  balance_msg        text;
begin
  -- Total pool from 5-year deposit summaries
  select coalesce(sum(balance), 0) into total_deposits
  from public.deposit_summaries;

  -- Total outstanding principal on active loans (excluding EMI entry)
  select coalesce(sum(principal - coalesce(principal_paid, 0)), 0) into total_outstanding
  from public.current_loans
  where status = 'active'
    and coalesce(notes, '') != 'emi_entry';

  available_balance := total_deposits - total_outstanding;

  balance_msg := 'Available balance for loans this month: ₹' || to_char(available_balance, 'FM99,99,99,999') || '.';

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
