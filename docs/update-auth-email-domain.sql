-- Run this once in Supabase SQL Editor.
-- It updates the profile-claim function to use a valid internal email format:
-- 9591382942@banakarfinclub.app

create or replace function public.register_profile(p_full_name text, p_phone text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  auth_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  existing_profile public.profiles;
  saved_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Login session is required.';
  end if;

  if normalized_phone = '' then
    raise exception 'Phone number is required.';
  end if;

  if auth_email <> (normalized_phone || '@banakarfinclub.app') then
    raise exception 'Phone number does not match the login account.';
  end if;

  select *
  into existing_profile
  from public.profiles
  where phone = normalized_phone;

  if found then
    if existing_profile.auth_user_id is null then
      update public.profiles
      set auth_user_id = auth.uid(),
          full_name = coalesce(nullif(trim(p_full_name), ''), full_name)
      where id = existing_profile.id
      returning * into saved_profile;
      return saved_profile;
    end if;

    if existing_profile.auth_user_id = auth.uid() then
      return existing_profile;
    end if;

    raise exception 'Phone number is already registered.';
  end if;

  insert into public.profiles (auth_user_id, full_name, phone, role, status)
  values (auth.uid(), trim(p_full_name), normalized_phone, 'member', 'pending')
  returning * into saved_profile;

  return saved_profile;
end;
$$;

grant execute on function public.register_profile(text, text) to authenticated;
