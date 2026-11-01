-- loan_interest_payments: tracks monthly interest paid per loan
-- Run this in Supabase SQL editor before deploying app changes

CREATE TABLE IF NOT EXISTS loan_interest_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID REFERENCES current_loans(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL,          -- "2026-11"
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid_on DATE NOT NULL,
  source VARCHAR(50) DEFAULT 'monthly_payment',  -- 'monthly_payment' | 'manual'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lip_loan_id   ON loan_interest_payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_lip_profile_id ON loan_interest_payments(profile_id);
CREATE INDEX IF NOT EXISTS idx_lip_month      ON loan_interest_payments(month);

-- Unique: one interest record per loan per month
CREATE UNIQUE INDEX IF NOT EXISTS idx_lip_loan_month ON loan_interest_payments(loan_id, month);

ALTER TABLE loan_interest_payments ENABLE ROW LEVEL SECURITY;

-- profiles.id is NOT the login id; the login id is profiles.auth_user_id.
-- Admin (president): full access. Members: can read their own rows.
CREATE POLICY "lip_admin_all" ON loan_interest_payments FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.auth_user_id = auth.uid() AND profiles.role = 'president' AND profiles.status = 'active'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.auth_user_id = auth.uid() AND profiles.role = 'president' AND profiles.status = 'active'
  ));

CREATE POLICY "lip_member_select_own" ON loan_interest_payments FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE profiles.auth_user_id = auth.uid()));
