-- Run this in Supabase SQL Editor.
-- Sends loan renewal reminders to members on the 3rd of every month
-- for loans due for renewal in that month.

-- 1. Enable pg_cron extension (safe to run if already enabled)
create extension if not exists pg_cron;


-- 2. Function that finds loans due this month and notifies the member
create or replace function public.notify_members_loan_renewal_due()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  loan_rec   record;
  profile_id uuid;
begin
  for loan_rec in
    select *
    from public.current_loans
    where status = 'active'
      and date_trunc('month', renewal_or_return_date::date) = date_trunc('month', current_date)
  loop
    -- Try profile_id on the loan first, fall back to phone lookup
    profile_id := loan_rec.profile_id;

    if profile_id is null then
      select id into profile_id
      from public.profiles
      where phone = regexp_replace(coalesce(loan_rec.member_phone, ''), '\D', '', 'g')
        and status = 'active'
      limit 1;
    end if;

    if profile_id is null then continue; end if;

    insert into public.notifications (profile_id, type, title, body, related_id)
    values (
      profile_id,
      'loan_renewal_due',
      'Loan renewal due this month',
      'Your loan of ₹' || loan_rec.principal::text || ' is due for renewal this month. Please contact the president.',
      loan_rec.id
    );
  end loop;
end;
$$;


-- 3. Schedule: runs at 9 AM on the 3rd of every month
--    To view scheduled jobs: select * from cron.job;
--    To remove: select cron.unschedule('loan-renewal-reminder');

select cron.schedule(
  'loan-renewal-reminder',
  '0 9 3 * *',
  'select public.notify_members_loan_renewal_due();'
);
