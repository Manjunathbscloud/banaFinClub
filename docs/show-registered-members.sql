-- Run this once in Supabase SQL Editor.
-- It allows logged-in users to see the registered member directory.
-- The app still hides rejected and disabled users from the Members tab.

drop policy if exists "profiles readable by authenticated users" on public.profiles;

create policy "profiles readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (auth_user_id is not null);
