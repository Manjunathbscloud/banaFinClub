-- Run this once in Supabase SQL Editor.
-- It restricts audit/activity logs so only the president/admin can read them.

drop policy if exists "audit logs readable by authenticated users" on public.audit_logs;

create policy "audit logs readable by authenticated users"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());
