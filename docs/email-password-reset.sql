-- Run this in Supabase SQL Editor (requires postgres / superuser access for auth.users updates).
-- Migrates all 7 members to real email addresses and wires up the forgot-password flow.

-- 1. Add email column to profiles (safe to run again if already exists)
alter table public.profiles add column if not exists email text;


-- 2. Backfill real emails into profiles + update auth.users for all 7 members
--    auth.users must match so Supabase can send the password-reset email.

-- Manjunath Banakar
update public.profiles set email = 'manjunathbs.cloud@gmail.com' where phone = '9591382942';
update auth.users
  set email = 'manjunathbs.cloud@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '9591382942' limit 1);

-- Pratap Banakar
update public.profiles set email = 'pratapbanakar@gmail.com' where phone = '7259907409';
update auth.users
  set email = 'pratapbanakar@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '7259907409' limit 1);

-- Praveen Banakar
update public.profiles set email = 'praveenbanakar24@gmail.com' where phone = '9538913204';
update auth.users
  set email = 'praveenbanakar24@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '9538913204' limit 1);

-- Mukkanna Banakar
update public.profiles set email = 'banakarms@gmail.com' where phone = '8618600807';
update auth.users
  set email = 'banakarms@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '8618600807' limit 1);

-- Santosh Banakar
update public.profiles set email = 'santhoshabanakar1990@gmail.com' where phone = '9739678816';
update auth.users
  set email = 'santhoshabanakar1990@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '9739678816' limit 1);

-- Pradeep Banakar
update public.profiles set email = 'pradeepbanakar@gmail.com' where phone = '9663644751';
update auth.users
  set email = 'pradeepbanakar@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '9663644751' limit 1);

-- Appanna Banakar
update public.profiles set email = 'halaswamydb@gmail.com' where phone = '8217526323';
update auth.users
  set email = 'halaswamydb@gmail.com', email_confirmed_at = now()
  where id = (select auth_user_id from public.profiles where phone = '8217526323' limit 1);


-- 3. Public RPC: get_auth_email_for_phone
--    Called by the app BEFORE login/reset (no auth token), so granted to anon.
--    Returns the real email stored in profiles.email, or falls back to the fake
--    phone-based email for any member not yet migrated.

create or replace function public.get_auth_email_for_phone(p_phone text)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    email,
    regexp_replace(p_phone, '\D', '', 'g') || '@banakarfinclub.app'
  )
  from public.profiles
  where phone = regexp_replace(p_phone, '\D', '', 'g')
  limit 1;
$$;

grant execute on function public.get_auth_email_for_phone(text) to anon;


-- 4. Updated register_profile: accepts optional p_email, stores it in profiles.email.
--    Replaces the version from revoke-member-access.sql.

create or replace function public.register_profile(
  p_full_name text,
  p_phone     text,
  p_email     text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone  text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  existing_profile  public.profiles;
  exited_profile    public.profiles;
  saved_profile     public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Login session is required.';
  end if;

  if normalized_phone = '' then
    raise exception 'Phone number is required.';
  end if;

  -- If this auth user previously had access revoked, unlink the exited profile
  -- so a new pending profile can be created with the same auth_user_id.
  select * into exited_profile
  from public.profiles
  where auth_user_id = auth.uid()
    and status = 'exited';

  if found then
    update public.profiles
    set auth_user_id = null
    where id = exited_profile.id;
  end if;

  select * into existing_profile
  from public.profiles
  where phone = normalized_phone;

  if found then
    if existing_profile.auth_user_id is null then
      update public.profiles
      set auth_user_id = auth.uid(),
          full_name    = coalesce(nullif(trim(p_full_name), ''), full_name),
          email        = coalesce(nullif(trim(coalesce(p_email, '')), ''), email)
      where id = existing_profile.id
      returning * into saved_profile;
      return saved_profile;
    end if;

    if existing_profile.auth_user_id = auth.uid() then
      return existing_profile;
    end if;

    raise exception 'Phone number is already registered.';
  end if;

  insert into public.profiles (auth_user_id, full_name, phone, email, role, status)
  values (
    auth.uid(),
    trim(p_full_name),
    normalized_phone,
    nullif(trim(coalesce(p_email, '')), ''),
    'member',
    'pending'
  )
  returning * into saved_profile;

  return saved_profile;
end;
$$;
