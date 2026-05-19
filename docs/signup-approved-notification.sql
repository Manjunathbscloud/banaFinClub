-- Run this in Supabase SQL Editor.
-- Notifies a member by email + in-app when admin approves their signup.

create or replace function public.notify_member_on_signup_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.status = NEW.status then return NEW; end if;
  if NEW.status != 'active' then return NEW; end if;

  insert into public.notifications (profile_id, type, title, body, related_id)
  values (
    NEW.id,
    'signup_approved',
    'Welcome to Banakar FinClub!',
    'Your account has been approved. You can now login and access the app.',
    NEW.id
  );

  return NEW;
end;
$$;

drop trigger if exists trg_notify_member_signup_approved on public.profiles;
create trigger trg_notify_member_signup_approved
  after update on public.profiles
  for each row execute function public.notify_member_on_signup_approved();
