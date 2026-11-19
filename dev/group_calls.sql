-- ============================================================================
-- Group voice calls (whole club). Safe to run twice.
-- Nothing existing is changed; this only adds a new table and its rules.
--
-- One row per group call. Only the group-call Edge Function (service role)
-- writes rows: the President starts a call, and it is ended by the President
-- or when the last person leaves. Active members can read rows so their app
-- can ring and show the "Group call in progress · Join" banner.
-- Demo users cannot see group calls.
-- ============================================================================

CREATE TABLE IF NOT EXISTS group_calls (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room        TEXT NOT NULL UNIQUE,                                   -- LiveKit room name
  started_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at    TIMESTAMPTZ                                             -- null while the call is going
);

CREATE INDEX IF NOT EXISTS idx_group_calls_open ON group_calls(started_at DESC) WHERE ended_at IS NULL;

ALTER TABLE group_calls ENABLE ROW LEVEL SECURITY;

-- Active members can see group calls (no insert/update/delete policies: only the Edge Function writes)
DROP POLICY IF EXISTS "group_calls_select_members" ON group_calls;
CREATE POLICY "group_calls_select_members" ON group_calls FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND status = 'active'));

-- Live updates so phones ring when a call starts and the banner goes when it ends
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'group_calls'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE group_calls;
  END IF;
END $$;
