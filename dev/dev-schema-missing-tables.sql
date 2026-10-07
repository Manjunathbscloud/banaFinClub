-- ============================================================
-- BANAKAR FINCLUB — MISSING TABLES FOR DEV
-- Run this in dev Supabase SQL editor (after dev-schema.sql)
-- ============================================================

-- loan_emis
CREATE TABLE IF NOT EXISTS loan_emis (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id        UUID REFERENCES current_loans(id),
  emi_number     INTEGER,
  due_month      TEXT,
  amount         NUMERIC DEFAULT 0,
  principal_part NUMERIC DEFAULT 0,
  interest_part  NUMERIC DEFAULT 0,
  status         TEXT DEFAULT 'pending',
  paid_at        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- loan_requests
CREATE TABLE IF NOT EXISTS loan_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     UUID REFERENCES profiles(id),
  amount         NUMERIC DEFAULT 0,
  reason         TEXT,
  status         TEXT DEFAULT 'pending',
  requested_at   TIMESTAMPTZ DEFAULT NOW(),
  decided_at     TIMESTAMPTZ,
  decided_by     UUID,
  loan_type      TEXT DEFAULT 'full',
  tenure_months  INTEGER
);

-- loan_extension_requests
CREATE TABLE IF NOT EXISTS loan_extension_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id      UUID REFERENCES current_loans(id),
  profile_id   UUID REFERENCES profiles(id),
  status       TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at   TIMESTAMPTZ,
  decided_by   UUID
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  body       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  type       TEXT,
  title      TEXT,
  body       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- statements
CREATE TABLE IF NOT EXISTS statements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date        TEXT,
  type        TEXT,
  amount      NUMERIC DEFAULT 0,
  description TEXT,
  balance     NUMERIC DEFAULT 0,
  related_id  UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Enable RLS + dev policies (full access for authenticated)
-- ============================================================
ALTER TABLE loan_emis              ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_extension_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE statements             ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dev_all_loan_emis"       ON loan_emis               FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_loan_requests"   ON loan_requests            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_loan_ext_reqs"   ON loan_extension_requests  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_messages"        ON messages                 FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_notifications"   ON notifications            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_statements"      ON statements               FOR ALL TO authenticated USING (true) WITH CHECK (true);
