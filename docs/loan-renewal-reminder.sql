-- Run this in Supabase SQL Editor.
-- Sends loan renewal reminders to members on the 1st of every month at 9 AM IST.

-- 1. Enable pg_cron extension (safe to run if already enabled)
create extension if not exists pg_cron;


-- 2. Function that finds loans due this month and notifies the member + admin
create or replace function public.notify_members_loan_renewal_due()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  loan_rec   record;
  profile_id uuid;
  admin_id   uuid;
begin
  select id into admin_id
  from public.profiles
  where role = 'president' and status = 'active'
  limit 1;

  for loan_rec in
    select *
    from public.current_loans
    where status = 'active'
      and date_trunc('month', renewal_or_return_date::date) = date_trunc('month', current_date)
  loop
    profile_id := loan_rec.profile_id;

    if profile_id is null then
      select id into profile_id
      from public.profiles
      where phone = regexp_replace(coalesce(loan_rec.member_phone, ''), '\D', '', 'g')
        and status = 'active'
      limit 1;
    end if;

    -- Notify the member
    if profile_id is not null then
      insert into public.notifications (profile_id, type, title, body, related_id)
      values (
        profile_id,
        'loan_renewal_due',
        'Loan renewal due this month',
        'Your loan of ₹' || loan_rec.principal::text || ' is due for renewal this month. Please contact the president.',
        loan_rec.id
      );
    end if;

    -- Notify the admin with full details
    if admin_id is not null then
      insert into public.notifications (profile_id, type, title, body, related_id)
      values (
        admin_id,
        'loan_renewal_due_admin',
        'Loan renewal due: ' || coalesce(loan_rec.member_name, 'Unknown'),
        coalesce(loan_rec.member_name, 'A member') || ' (Ph: ' || coalesce(loan_rec.member_phone, '-') || ') has a loan of ₹' || loan_rec.principal::text || ' due for renewal on ' || loan_rec.renewal_or_return_date::text || '.',
        loan_rec.id
      );
    end if;
  end loop;
end;
$$;


-- 3. Reschedule: 1st of every month at 9 AM IST (3:30 AM UTC)
--    To view scheduled jobs: select * from cron.job;
--    To remove: select cron.unschedule('loan-renewal-reminder');

select cron.unschedule('loan-renewal-reminder');

select cron.schedule(
  'loan-renewal-reminder',
  '30 3 1 * *',
  'select public.notify_members_loan_renewal_due();'
);
