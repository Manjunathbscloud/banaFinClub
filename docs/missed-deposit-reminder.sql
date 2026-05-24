-- Run this in Supabase SQL Editor.
-- Notifies members who have not paid their monthly deposit by the 6th of the month.
-- Runs on the 6th of every month at 9 AM IST (3:30 AM UTC).

create extension if not exists pg_cron;


create or replace function public.notify_members_missed_deposit()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_month text;
  member_rec    record;
  paid_count    int;
begin
  current_month := to_char(current_date, 'YYYY-MM');

  for member_rec in
    select id, full_name
    from public.profiles
    where status = 'active'
      and role != 'president'
  loop
    select count(*) into paid_count
    from public.monthly_payments
    where profile_id = member_rec.id
      and month = current_month
      and status = 'paid';

    if paid_count = 0 then
      insert into public.notifications (profile_id, type, title, body)
      values (
        member_rec.id,
        'missed_deposit',
        'Monthly deposit not received',
        'Your monthly deposit for ' || to_char(current_date, 'Month YYYY') || ' has not been received. Please pay as soon as possible and contact the president.'
      );
    end if;
  end loop;
end;
$$;


-- Schedule: 6th of every month at 9 AM IST (3:30 AM UTC)
select cron.unschedule('missed-deposit-reminder');

select cron.schedule(
  'missed-deposit-reminder',
  '30 3 6 * *',
  'select public.notify_members_missed_deposit();'
);
