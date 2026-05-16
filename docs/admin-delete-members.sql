-- Run this once in Supabase SQL Editor.
-- It allows the president/admin to delete member profiles except their own account.

drop policy if exists "profiles admin delete" on public.profiles;

create policy "profiles admin delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin() and id <> public.current_profile_id());
