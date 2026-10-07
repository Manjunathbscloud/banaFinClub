-- ============================================================
-- BANAKAR FINCLUB — DEV SCHEMA
-- Run this first in the dev Supabase SQL editor
-- ============================================================

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id    UUID,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  role            TEXT DEFAULT 'member',
  status          TEXT DEFAULT 'active',
  email           TEXT,
  avatar_url      TEXT,
  mpin_hash       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  approved_at     TIMESTAMPTZ,
  approved_by     UUID
);

-- monthly_payments
CREATE TABLE IF NOT EXISTS monthly_payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID REFERENCES profiles(id),
  month               TEXT NOT NULL,
  expected_amount     NUMERIC DEFAULT 0,
  paid_amount         NUMERIC DEFAULT 0,
  status              TEXT DEFAULT 'pending',
  source              TEXT,
  bank_transaction_id TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- current_loans
CREATE TABLE IF NOT EXISTS current_loans (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name             TEXT,
  member_phone            TEXT,
  principal               NUMERIC DEFAULT 0,
  principal_paid          NUMERIC DEFAULT 0,
  interest_rate_monthly   NUMERIC DEFAULT 1.25,
  is_interest_free        BOOLEAN DEFAULT FALSE,
  status                  TEXT DEFAULT 'active',
  purpose                 TEXT,
  renewal_or_return_date  TEXT,
  disbursed_at            TEXT,
  created_by              UUID,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  interest_paid           NUMERIC DEFAULT 0,
  closed_at               TIMESTAMPTZ,
  monthly_interest        NUMERIC DEFAULT 0,
  notes                   TEXT,
  loan_type               TEXT DEFAULT 'full',
  tenure_months           INTEGER,
  emi_amount              NUMERIC,
  emis_paid               INTEGER DEFAULT 0
);

-- loan_history
CREATE TABLE IF NOT EXISTS loan_history (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year                TEXT,
  member_name         TEXT,
  from_date           TEXT,
  principal           NUMERIC DEFAULT 0,
  monthly_interest    NUMERIC DEFAULT 0,
  renewal_or_return   TEXT,
  status              TEXT,
  total_paid          NUMERIC DEFAULT 0,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- deposit_summaries
CREATE TABLE IF NOT EXISTS deposit_summaries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year         INTEGER UNIQUE,
  label        TEXT,
  principal    NUMERIC DEFAULT 0,
  interest     NUMERIC DEFAULT 0,
  expenditure  NUMERIC DEFAULT 0,
  balance      NUMERIC DEFAULT 0,
  exit_payouts NUMERIC DEFAULT 0,
  breakdown    JSONB,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- settings
CREATE TABLE IF NOT EXISTS settings (
  id         TEXT PRIMARY KEY,
  value      JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id  UUID REFERENCES profiles(id),
  action            TEXT,
  details           JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_payments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_loans     ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_summaries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DEV policies — full access for any authenticated user
-- (simpler than prod, safe for dev/testing only)
-- ============================================================
CREATE POLICY "dev_all_profiles"         ON profiles         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_payments"         ON monthly_payments  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_loans"            ON current_loans     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_loan_history"     ON loan_history       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_deposits"         ON deposit_summaries  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_settings"         ON settings           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_audit_logs"       ON audit_logs         FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anon read on settings (app loads before login)
CREATE POLICY "dev_anon_settings_read"   ON settings FOR SELECT TO anon USING (true);
