-- ============================================================================
-- Chowka Bhara (5×5) member games. Same pattern as ttt_games. Safe to run twice.
-- Nothing existing is changed; this only adds a new table and its rules.
-- ============================================================================

CREATE TABLE IF NOT EXISTS cb_games (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opponent_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_a         UUID REFERENCES profiles(id),          -- throws first (coin toss)
  player_b         UUID REFERENCES profiles(id),
  status           TEXT NOT NULL DEFAULT 'invited',       -- invited | declined | expired | active | finished
  state            JSONB,                                 -- pieces, turn, throw, last move
  missed_a         INT NOT NULL DEFAULT 0,
  missed_b         INT NOT NULL DEFAULT 0,
  move_count       INT NOT NULL DEFAULT 0,
  winner           TEXT,                                  -- A | B | draw
  end_reason       TEXT,                                  -- all_home | missed_turns | time_up | forfeit
  game_started_at  TIMESTAMPTZ,
  turn_started_at  TIMESTAMPTZ,
  rematch_of       UUID REFERENCES cb_games(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cb_status  ON cb_games(status);
CREATE INDEX IF NOT EXISTS idx_cb_players ON cb_games(challenger_id, opponent_id);

ALTER TABLE cb_games ENABLE ROW LEVEL SECURITY;

-- Active members and demo users can see games (needed for the leaderboard)
DROP POLICY IF EXISTS "cb_select_players" ON cb_games;
CREATE POLICY "cb_select_players" ON cb_games FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND status IN ('active', 'demo')));

-- You can only start a challenge as yourself
DROP POLICY IF EXISTS "cb_insert_own" ON cb_games;
CREATE POLICY "cb_insert_own" ON cb_games FOR INSERT TO authenticated
  WITH CHECK (challenger_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid() AND status IN ('active', 'demo')));

-- Only the two players can change their game
DROP POLICY IF EXISTS "cb_update_players" ON cb_games;
CREATE POLICY "cb_update_players" ON cb_games FOR UPDATE TO authenticated
  USING      (challenger_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
           OR opponent_id   IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
  WITH CHECK (challenger_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
           OR opponent_id   IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Live updates so both phones see each throw and move instantly
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'cb_games') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE cb_games;
  END IF;
END $$;

-- Check
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'cb_games' ORDER BY policyname;
