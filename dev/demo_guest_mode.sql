-- ============================================================================
-- Demo users: guest mode. They see meetings, gallery and games only — no money.
-- Run AFTER demo_users.sql. Safe to run more than once.
-- Nothing changes for members or the admin.
-- ============================================================================

-- 1. Take away demo read access from every money table (and rules, which list amounts).
--    Demo users keep read access only to meeting_records, gallery_photos and the games.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'settings','profiles','deposit_summaries','monthly_payments','current_loans','loan_history',
    'rules','loan_extension_requests','statements','loan_emis','meeting_acknowledgements',
    'loan_partial_payments','loan_interest_payments'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS "demo_read" ON public.%I', t);
    END IF;
  END LOOP;
END $$;

-- 2. Profiles: a demo user can read only their own profile (no phone numbers of members).
--    RESTRICTIVE = on top of the existing rule; for members and the admin nothing changes.
DROP POLICY IF EXISTS "demo_profiles_own_only" ON profiles;
CREATE POLICY "demo_profiles_own_only" ON profiles AS RESTRICTIVE FOR SELECT TO authenticated
  USING (NOT public.is_demo_user() OR auth_user_id = auth.uid());

-- 3. A small, safe overview for the guest home and the game player list:
--    the club year and each player's name, online time and photo. No phone, no money.
CREATE OR REPLACE FUNCTION public.club_overview()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT json_build_object(
    'year_number', (SELECT (value->>'activeYearNumber')::int FROM settings WHERE id = 'active_year_info'),
    'players', COALESCE((
      SELECT json_agg(json_build_object(
        'id', id, 'full_name', full_name, 'status', status, 'role', role,
        'last_seen_at', last_seen_at, 'avatar_url', avatar_url) ORDER BY created_at)
      FROM profiles
      WHERE status IN ('active', 'demo') AND auth_user_id IS NOT NULL
    ), '[]'::json)
  );
$$;
REVOKE ALL ON FUNCTION public.club_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.club_overview() TO authenticated;

-- 4. Check: demo users should now have demo_read only on meeting_records, gallery_photos, ttt_games.
SELECT tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname = 'public' AND policyname IN ('demo_read', 'demo_profiles_own_only')
ORDER BY tablename;
