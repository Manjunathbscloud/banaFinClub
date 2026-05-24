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
  available_balance numeric;
  balance_msg       text;
begin
  -- Read the value written by the app after every data load (always matches dashboard)
  select coalesce((value->>'amount')::numeric, 0) into available_balance
  from public.settings
  where id = 'available_loan_balance';

  if available_balance is null or available_balance = 0 then
    raise notice 'available_loan_balance not set yet — open the app to sync it';
    return;
  end if;

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
