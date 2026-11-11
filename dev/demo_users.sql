-- ============================================================================
-- Demo users: can log in, view the app and play games. Nothing else.
-- Safe to run more than once. Existing rules are NOT changed: this only ADDS
--   (a) read access for demo users on the club tables,
--   (b) a "deny" rule that blocks demo users from writing to any table except games.
-- ============================================================================

-- 1. Helpers (SECURITY DEFINER so they can read profiles without permission loops)
CREATE OR REPLACE FUNCTION public.is_demo_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND status = 'demo');
$$;

CREATE OR REPLACE FUNCTION public.is_club_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'president' AND status = 'active');
$$;

REVOKE ALL ON FUNCTION public.is_demo_user()  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_club_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_demo_user()  TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_club_admin() TO authenticated;

-- 2. Real names of demo users: only the admin can read or change this table.
CREATE TABLE IF NOT EXISTS demo_accounts (
  profile_id   UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  real_name    TEXT NOT NULL,
  demo_number  INT  NOT NULL UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE demo_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demo_accounts_admin_all" ON demo_accounts;
CREATE POLICY "demo_accounts_admin_all" ON demo_accounts FOR ALL TO authenticated
  USING (public.is_club_admin()) WITH CHECK (public.is_club_admin());

-- 3. Demo users can READ the club tables members see.
--    Not included (stay private): audit_logs, notifications, messages (chat),
--    loan_requests, partial_repayment_requests, demo_accounts.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'settings','profiles','deposit_summaries','monthly_payments','current_loans','loan_history',
    'rules','loan_extension_requests','statements','loan_emis','meeting_records',
    'meeting_acknowledgements','loan_partial_payments','gallery_photos','loan_interest_payments','ttt_games'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS "demo_read" ON public.%I', t);
      EXECUTE format('CREATE POLICY "demo_read" ON public.%I FOR SELECT TO authenticated USING (public.is_demo_user())', t);
    END IF;
  END LOOP;
END $$;

-- 4. Demo users can start a game challenge (the existing rule only allows active members).
DROP POLICY IF EXISTS "ttt_insert_demo" ON ttt_games;
CREATE POLICY "ttt_insert_demo" ON ttt_games FOR INSERT TO authenticated
  WITH CHECK (challenger_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid() AND status = 'demo'));

-- 5. Block every write by a demo user on every table except games.
--    RESTRICTIVE = applied on top of the existing rules. For everyone else
--    is_demo_user() is false, so nothing changes for members or the admin.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
           WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity AND c.relname <> 'ttt_games'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "demo_no_insert" ON public.%I', r.relname);
    EXECUTE format('DROP POLICY IF EXISTS "demo_no_update" ON public.%I', r.relname);
    EXECUTE format('DROP POLICY IF EXISTS "demo_no_delete" ON public.%I', r.relname);
    EXECUTE format('CREATE POLICY "demo_no_insert" ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (NOT public.is_demo_user())', r.relname);
    EXECUTE format('CREATE POLICY "demo_no_update" ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated USING (NOT public.is_demo_user())', r.relname);
    EXECUTE format('CREATE POLICY "demo_no_delete" ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated USING (NOT public.is_demo_user())', r.relname);
  END LOOP;
END $$;

-- 6. Check: list what was added (should show demo_read / demo_no_* rows).
SELECT tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname = 'public' AND (policyname LIKE 'demo%' OR policyname = 'ttt_insert_demo')
ORDER BY tablename, policyname;
