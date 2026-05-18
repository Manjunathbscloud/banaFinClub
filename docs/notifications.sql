-- Run this in Supabase SQL Editor.
-- Adds in-app notifications with automatic triggers for key events.

-- 1. Notifications table
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text not null,
  is_read     boolean not null default false,
  related_id  uuid,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications select"
  on public.notifications for select
  to authenticated
  using (profile_id = public.current_profile_id() or public.is_admin());

create policy "notifications update own"
  on public.notifications for update
  to authenticated
  using (profile_id = public.current_profile_id())
  with check (profile_id = public.current_profile_id());

create policy "notifications admin insert"
  on public.notifications for insert
  to authenticated
  with check (public.is_admin());


-- 2. Trigger: notify admin when a new signup request arrives
create or replace function public.notify_admin_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_id uuid;
begin
  if NEW.status != 'pending' then return NEW; end if;

  select id into admin_id
  from public.profiles
  where role = 'president' and status = 'active'
  limit 1;

  if admin_id is null then return NEW; end if;

  insert into public.notifications (profile_id, type, title, body, related_id)
  values (
    admin_id,
    'signup_request',
    'New signup request',
    NEW.full_name || ' has requested access to Banakar FinClub.',
    NEW.id
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_admin_signup on public.profiles;
create trigger trg_notify_admin_signup
  after insert on public.profiles
  for each row execute function public.notify_admin_on_signup();


-- 3. Trigger: notify member when their signup is approved or rejected
create or replace function public.notify_member_on_signup_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.status = NEW.status then return NEW; end if;
  if OLD.status != 'pending' then return NEW; end if;
  if NEW.status not in ('active', 'rejected') then return NEW; end if;

  insert into public.notifications (profile_id, type, title, body, related_id)
  values (
    NEW.id,
    case when NEW.status = 'active' then 'signup_approved' else 'signup_rejected' end,
    case when NEW.status = 'active' then 'Account approved'
         else 'Account not approved' end,
    case when NEW.status = 'active'
         then 'Welcome to Banakar FinClub! Your account is now active. You can login.'
         else 'Your account request was not approved. Contact Manjunath Banakar.' end,
    NEW.id
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_member_signup_decision on public.profiles;
create trigger trg_notify_member_signup_decision
  after update on public.profiles
  for each row execute function public.notify_member_on_signup_decision();


-- 4. Trigger: notify admin when a new loan request arrives
create or replace function public.notify_admin_on_loan_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_id    uuid;
  member_name text;
begin
  select id into admin_id
  from public.profiles
  where role = 'president' and status = 'active'
  limit 1;

  select full_name into member_name
  from public.profiles
  where id = NEW.profile_id;

  if admin_id is null then return NEW; end if;

  insert into public.notifications (profile_id, type, title, body, related_id)
  values (
    admin_id,
    'loan_request',
    'New loan request',
    coalesce(member_name, 'A member') || ' requested a loan of ₹' || NEW.amount::text || '.',
    NEW.id
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_admin_loan_request on public.loan_requests;
create trigger trg_notify_admin_loan_request
  after insert on public.loan_requests
  for each row execute function public.notify_admin_on_loan_request();


-- 5. Trigger: notify member when their loan request is approved or rejected
create or replace function public.notify_member_on_loan_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.status = NEW.status then return NEW; end if;
  if NEW.status not in ('approved', 'rejected') then return NEW; end if;

  insert into public.notifications (profile_id, type, title, body, related_id)
  values (
    NEW.profile_id,
    'loan_' || NEW.status,
    case when NEW.status = 'approved' then 'Loan request approved'
         else 'Loan request not approved' end,
    case when NEW.status = 'approved'
         then 'Your loan request of ₹' || NEW.amount::text || ' has been approved.'
         else 'Your loan request of ₹' || NEW.amount::text || ' was not approved. Contact the president.' end,
    NEW.id
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_member_loan_decision on public.loan_requests;
create trigger trg_notify_member_loan_decision
  after update on public.loan_requests
  for each row execute function public.notify_member_on_loan_decision();
