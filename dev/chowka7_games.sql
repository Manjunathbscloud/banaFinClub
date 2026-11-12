-- ============================================================================
-- Chowka Bhara 7×7 (2–4 players). Same pattern as cb_games. Safe to run twice.
-- Nothing existing is changed; this only adds a new table, its rules and one function.
-- ============================================================================

CREATE TABLE IF NOT EXISTS cb7_games (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,   -- who sent the invites
  invitees         UUID[] NOT NULL DEFAULT '{}',                             -- members invited
  answers          JSONB NOT NULL DEFAULT '{}'::jsonb,                       -- { profile_id: "accepted" | "declined" }
  cpu_count        INT NOT NULL DEFAULT 0,                                   -- computer seats
  level            TEXT NOT NULL DEFAULT 'easy',                             -- computer level
  status           TEXT NOT NULL DEFAULT 'invited',                          -- invited | cancelled | active | finished
  seats            JSONB,                                                    -- [{ seat, profile_id, cpu }]
  state            JSONB,                                                    -- pieces, turn, saved numbers, places
  results          JSONB,                                                    -- [{ seat, place, profile_id, cpu }]
  end_reason       TEXT,                                                     -- all_home | players_out | time_up
  game_started_at  TIMESTAMPTZ,
  turn_started_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cb7_status ON cb7_games(status);

ALTER TABLE cb7_games ENABLE ROW LEVEL SECURITY;

-- Active members and demo users can see games (needed for invites and the leaderboard)
DROP POLICY IF EXISTS "cb7_select_players" ON cb7_games;
CREATE POLICY "cb7_select_players" ON cb7_games FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND status IN ('active', 'demo')));

-- You can only create a game as yourself
DROP POLICY IF EXISTS "cb7_insert_own" ON cb7_games;
CREATE POLICY "cb7_insert_own" ON cb7_games FOR INSERT TO authenticated
  WITH CHECK (host_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid() AND status IN ('active', 'demo')));

-- Only the host and the invited members can change their game
DROP POLICY IF EXISTS "cb7_update_players" ON cb7_games;
CREATE POLICY "cb7_update_players" ON cb7_games FOR UPDATE TO authenticated
  USING (
    host_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.id = ANY (invitees))
  )
  WITH CHECK (
    host_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.id = ANY (invitees))
  );

-- Join / decline an invite. Several people may answer at the same moment, so the answer is
-- added inside the database instead of overwriting the whole list.
CREATE OR REPLACE FUNCTION public.cb7_answer(p_game UUID, p_accept BOOLEAN)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE me UUID;
BEGIN
  SELECT id INTO me FROM profiles WHERE auth_user_id = auth.uid() AND status IN ('active', 'demo');
  IF me IS NULL THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE cb7_games
     SET answers = answers || jsonb_build_object(me::text, CASE WHEN p_accept THEN 'accepted' ELSE 'declined' END),
         updated_at = now()
   WHERE id = p_game AND status = 'invited' AND me = ANY (invitees);
END $$;
REVOKE ALL ON FUNCTION public.cb7_answer(UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cb7_answer(UUID, BOOLEAN) TO authenticated;

-- Live updates so every phone sees each throw and move instantly
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'cb7_games') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE cb7_games;
  END IF;
END $$;

-- Check
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'cb7_games' ORDER BY policyname;
