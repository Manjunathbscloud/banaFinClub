-- Run this in Supabase SQL Editor.
-- Adds clean "revoke access" support: member loses access but can signup again later.

-- 1. Function to revoke a member's access.
--    Sets status = 'exited', frees the phone slot (renames it so the number can be re-used).
--    Keeps auth_user_id so the login flow can detect the 'exited' state and show a clear message.
--    On re-signup, register_profile will unlink the exited record automatically.

create or replace function public.revoke_member_access(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admin can revoke member access.';
  end if;

  if p_profile_id = public.current_profile_id() then
    raise exception 'Cannot revoke your own access.';
  end if;

  update public.profiles
  set
    status = 'exited',
    phone  = 'exited-' || p_profile_id::text
  where id = p_profile_id;

  if not found then
    raise exception 'Member not found.';
  end if;
end;
$$;

grant execute on function public.revoke_member_access(uuid) to authenticated;


-- 2. Updated register_profile: handles re-registration after revoke.
--    When a previously revoked user signs up again, the exited profile's auth_user_id
--    is unlinked first so a new pending profile can be created cleanly.

create or replace function public.register_profile(p_full_name text, p_phone text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_phone  text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  auth_email        text := lower(coalesce(auth.jwt() ->> 'email', ''));
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

  if not (
    auth_email = (normalized_phone || '@banakarfinclub.app')
    or (normalized_phone = '9591382942' and auth_email = 'manjunathbs.cloud@gmail.com')
  ) then
    raise exception 'Phone number does not match the login account.';
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
          full_name    = coalesce(nullif(trim(p_full_name), ''), full_name)
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
